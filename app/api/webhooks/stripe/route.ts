import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
}

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
              paidAt: new Date(),
            },
          });

          // TODO: Send confirmation emails to both candidate and interviewer
          console.log(`Expert session ${sessionId} payment completed`);
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

          console.log(`Coaching package ${sessionId} purchased`);
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
            console.log(`Credit purchase ${purchaseId}: ${credits} credits added to company ${companyId}`);
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
        console.log(`Payment failed for intent ${paymentIntent.id}`);
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
        console.log(`Refund processed for charge ${charge.id}`);
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
          console.log(`Connect account ${account.id} updated, payouts_enabled: ${account.payouts_enabled}`);
        }
        break;
      }

      case 'transfer.created': {
        const transfer = event.data.object as Stripe.Transfer;
        console.log(`Transfer ${transfer.id} created for ${transfer.amount / 100} USD`);
        break;
      }

      case 'transfer.paid': {
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
          console.log(`Transfer ${transfer.id} paid successfully`);
        }
        break;
      }

      case 'transfer.failed': {
        const transfer = event.data.object as Stripe.Transfer;
        // Update payout status to failed
        await prisma.interviewerPayout.updateMany({
          where: { stripeTransferId: transfer.id },
          data: {
            status: 'failed',
          },
        });
        console.log(`Transfer ${transfer.id} failed`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
