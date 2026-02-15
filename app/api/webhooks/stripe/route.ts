import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { getStripe, getSubscriptionTier } from '@/lib/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
      event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};

        // Handle subscription-based tiers (job seeker, interviewer, recruiter)
        // All subscription data is stored on the User model
        if (metadata.tier && metadata.userId) {
          const { userId, tier } = metadata;

          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionTier: tier,
              subscriptionStatus: 'active',
              subscriptionStart: new Date(),
              stripeCustomerId: session.customer as string || undefined,
            },
          });
        }

        // Handle expert session payment
        if (metadata.type === 'expert_session' && metadata.sessionId) {
          await prisma.expertSession.update({
            where: { id: metadata.sessionId },
            data: {
              status: 'scheduled',
              paymentIntentId: session.payment_intent as string,
              paymentStatus: 'paid',
            },
          });
        }

        // Handle coaching package purchase
        if (metadata.type === 'coaching_package' && metadata.sessionId) {
          await prisma.coachingPackage.update({
            where: { id: metadata.sessionId },
            data: {
              status: 'active',
              purchasedAt: new Date(),
              paymentIntentId: session.payment_intent as string,
            },
          });
        }

        // Handle credit purchase (legacy)
        if (metadata.type === 'credit_purchase') {
          const { purchaseId, companyId, credits } = metadata;
          if (purchaseId && companyId && credits) {
            await prisma.$transaction([
              prisma.creditPurchase.update({
                where: { id: purchaseId },
                data: {
                  paymentStatus: 'completed',
                  purchasedAt: new Date(),
                  paymentIntentId: session.payment_intent as string,
                },
              }),
              prisma.recruiterCompany.update({
                where: { id: companyId },
                data: {
                  creditBalance: { increment: parseInt(credits) },
                },
              }),
            ]);
          }
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const { userId } = subscription.metadata || {};

        if (userId) {
          const newTier = getSubscriptionTier(
            subscription.items.data[0]?.price?.id || ''
          );
          const status = subscription.status === 'active' ? 'active' : 'cancelled';

          await prisma.user.update({
            where: { id: userId },
            data: { subscriptionTier: newTier, subscriptionStatus: status },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const { userId } = subscription.metadata || {};

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { subscriptionTier: 'free', subscriptionStatus: 'cancelled' },
          });
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { sessionId, type } = session.metadata || {};

        if (type === 'expert_session' && sessionId) {
          await prisma.expertSession.update({
            where: { id: sessionId },
            data: {
              status: 'cancelled',
              cancellationReason: 'Payment expired',
            },
          });
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.warn(`Payment failed for intent ${paymentIntent.id}`);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        if (charge.payment_intent) {
          await prisma.expertSession.updateMany({
            where: { paymentIntentId: charge.payment_intent as string },
            data: { paymentStatus: 'refunded' },
          });
        }
        break;
      }

      // Stripe Connect events
      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        if (account.metadata?.interviewerId) {
          await prisma.interviewer.update({
            where: { id: account.metadata.interviewerId },
            data: {
              payoutsEnabled: account.payouts_enabled,
            },
          });
        }
        break;
      }

      case 'transfer.created': {
        const transfer = event.data.object as Stripe.Transfer;
        if (transfer.metadata?.interviewerId) {
          await prisma.interviewerPayout.updateMany({
            where: { stripeTransferId: transfer.id },
            data: {
              status: 'completed',
              paidAt: new Date(),
            },
          });
        }
        break;
      }

      case 'transfer.reversed': {
        const transfer = event.data.object as Stripe.Transfer;
        await prisma.interviewerPayout.updateMany({
          where: { stripeTransferId: transfer.id },
          data: {
            status: 'failed',
          },
        });
        console.warn(`Transfer ${transfer.id} failed`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
