import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

// POST /api/stripe/webhook - Handle Stripe webhook events
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Update user subscription in database
        if (session.metadata?.userId && session.metadata?.tier) {
          await prisma.user.update({
            where: { id: session.metadata.userId },
            data: {
              subscriptionTier: session.metadata.tier,
              subscriptionStatus: 'active',
              subscriptionStart: new Date(),
              subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            }
          });

          console.log(`✅ User ${session.metadata.userId} upgraded to ${session.metadata.tier}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        // Update subscription status
        const checkoutSession = await stripe.checkout.sessions.list({
          subscription: subscription.id,
          limit: 1,
        });

        if (checkoutSession.data.length > 0 && checkoutSession.data[0].metadata?.userId) {
          await prisma.user.update({
            where: { id: checkoutSession.data[0].metadata.userId },
            data: {
              subscriptionStatus: subscription.status === 'active' ? 'active' : 'cancelled',
              subscriptionEnd: new Date(subscription.current_period_end * 1000),
            }
          });

          console.log(`✅ Subscription updated for user ${checkoutSession.data[0].metadata.userId}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        // Downgrade user to free tier
        const checkoutSession = await stripe.checkout.sessions.list({
          subscription: subscription.id,
          limit: 1,
        });

        if (checkoutSession.data.length > 0 && checkoutSession.data[0].metadata?.userId) {
          await prisma.user.update({
            where: { id: checkoutSession.data[0].metadata.userId },
            data: {
              subscriptionTier: 'free',
              subscriptionStatus: 'cancelled',
              subscriptionEnd: new Date(),
            }
          });

          console.log(`✅ User ${checkoutSession.data[0].metadata.userId} downgraded to free`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
