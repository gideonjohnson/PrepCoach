import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature, getSubscriptionTier } from '@/lib/paystack';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get('x-paystack-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  // Verify webhook signature
  if (!verifyWebhookSignature(body, signature)) {
    console.error('Paystack webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    const event = JSON.parse(body);

    switch (event.event) {
      case 'charge.success': {
        await handleChargeSuccess(event.data);
        break;
      }

      case 'subscription.create': {
        await handleSubscriptionCreate(event.data);
        break;
      }

      case 'subscription.disable': {
        await handleSubscriptionDisable(event.data);
        break;
      }

      case 'subscription.not_renew': {
        await handleSubscriptionNotRenew(event.data);
        break;
      }

      case 'invoice.payment_failed': {
        await handleInvoicePaymentFailed(event.data);
        break;
      }

      default:
        console.log(`Unhandled Paystack event type: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Paystack webhook handler error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleChargeSuccess(data: any) {
  const userId = data.metadata?.userId;
  const tier = data.metadata?.tier;

  if (!userId || !tier) {
    console.error('Missing userId or tier in charge metadata');
    return;
  }

  // Update user subscription
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: tier,
      subscriptionStatus: 'active',
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  console.log(`✅ Payment successful for user ${userId}: ${tier}`);
}

async function handleSubscriptionCreate(data: any) {
  const userId = data.customer?.metadata?.userId;
  const planCode = data.plan?.plan_code;

  if (!userId || !planCode) {
    console.error('Missing userId or plan code in subscription metadata');
    return;
  }

  const tier = getSubscriptionTier(planCode);

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: tier,
      subscriptionStatus: 'active',
      subscriptionStart: new Date(data.createdAt),
      subscriptionEnd: new Date(data.next_payment_date),
    },
  });

  console.log(`✅ Subscription created for user ${userId}: ${tier}`);
}

async function handleSubscriptionDisable(data: any) {
  const userId = data.customer?.metadata?.userId;

  if (!userId) {
    console.error('Missing userId in subscription metadata');
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: 'cancelled',
      subscriptionEnd: new Date(),
    },
  });

  console.log(`✅ Subscription disabled for user ${userId}`);
}

async function handleSubscriptionNotRenew(data: any) {
  const userId = data.customer?.metadata?.userId;

  if (!userId) {
    console.error('Missing userId in subscription metadata');
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: 'expired',
    },
  });

  console.log(`✅ Subscription not renewed for user ${userId}`);
}

async function handleInvoicePaymentFailed(data: any) {
  const userId = data.customer?.metadata?.userId;

  if (!userId) {
    console.error('Missing userId in invoice metadata');
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: 'past_due',
    },
  });

  console.log(`⚠️  Payment failed for user ${userId}`);
}
