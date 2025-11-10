import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Check if webhook secret is configured
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 503 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'subscription') {
          const userId = session.metadata?.userId;
          const tier = session.metadata?.tier;
          const customerId = session.customer as string;

          if (!userId) {
            console.error('No userId in session metadata');
            return NextResponse.json({ received: true });
          }

          // Update user with subscription details and customer ID
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionTier: tier || 'pro',
              subscriptionStatus: 'active',
              subscriptionStart: new Date(),
              stripeCustomerId: customerId, // Store customer ID
            },
          });

          console.log(`✅ Subscription activated for user ${userId}, customer ${customerId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          const status = subscription.status === 'active' ? 'active' :
                        subscription.status === 'canceled' ? 'cancelled' :
                        subscription.status === 'past_due' ? 'expired' : 'inactive';

          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: status,
              subscriptionEnd: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
            },
          });

          console.log(`✅ Subscription updated for user ${user.id}: ${status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: 'cancelled',
              subscriptionEnd: new Date(),
            },
          });

          console.log(`✅ Subscription cancelled for user ${user.id}`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Find user by customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (user && user.subscriptionStatus !== 'active') {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: 'active',
            },
          });

          console.log(`✅ Payment succeeded for user ${user.id}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Find user by customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: 'expired',
            },
          });

          console.log(`⚠️ Payment failed for user ${user.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
