import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

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
        const { sessionId, type } = session.metadata || {};

        if (type === 'expert_session' && sessionId) {
          // Update expert session status
          await prisma.expertSession.update({
            where: { id: sessionId },
            data: {
              status: 'scheduled',
              paymentIntentId: session.payment_intent as string,
              paymentStatus: 'paid',
            },
          });

          // TODO: Send confirmation emails to both candidate and interviewer
          // Expert session payment completed
        }

        if (type === 'coaching_package' && sessionId) {
          // Handle coaching package purchase
          await prisma.coachingPackage.update({
            where: { id: sessionId },
            data: {
              status: 'active',
              purchasedAt: new Date(),
              paymentIntentId: session.payment_intent as string,
            },
          });

          // Coaching package purchased
        }

        if (type === 'credit_purchase') {
          const { purchaseId, companyId, credits } = session.metadata || {};
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
            // Credit purchase completed
          }
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { sessionId, type } = session.metadata || {};

        if (type === 'expert_session' && sessionId) {
          // Cancel the session if payment wasn't completed
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
        // Update any expert sessions with this payment intent to refunded status
        if (charge.payment_intent) {
          await prisma.expertSession.updateMany({
            where: { paymentIntentId: charge.payment_intent as string },
            data: { paymentStatus: 'refunded' },
          });
        }
        // Refund processed
        break;
      }

      // Stripe Connect events
      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        // Update interviewer's Connect account status
        if (account.metadata?.interviewerId) {
          await prisma.interviewer.update({
            where: { id: account.metadata.interviewerId },
            data: {
              payoutsEnabled: account.payouts_enabled,
            },
          });
          // Connect account updated
        }
        break;
      }

      case 'transfer.created': {
        const transfer = event.data.object as Stripe.Transfer;
        // Transfer created
        break;
      }

      case 'transfer.created': {
        const transfer = event.data.object as Stripe.Transfer;
        // Update payout status to completed
        if (transfer.metadata?.interviewerId) {
          await prisma.interviewerPayout.updateMany({
            where: { stripeTransferId: transfer.id },
            data: {
              status: 'completed',
              paidAt: new Date(),
            },
          });
          // Transfer paid
        }
        break;
      }

      case 'transfer.reversed': {
        const transfer = event.data.object as Stripe.Transfer;
        // Update payout status to failed
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
