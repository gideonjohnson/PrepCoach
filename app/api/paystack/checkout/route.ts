import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { initializeTransaction, isPaystackConfigured, PAYSTACK_PLAN_CODES, PAYSTACK_PRICING } from '@/lib/paystack';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if Paystack is configured
    if (!isPaystackConfigured()) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 503 }
      );
    }

    const { tier } = await req.json();

    // Validate tier
    if (!['pro', 'enterprise'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    // Get the correct plan code and amount
    const planCode = tier === 'pro' ? PAYSTACK_PLAN_CODES.pro : PAYSTACK_PLAN_CODES.enterprise;
    const amount = tier === 'pro' ? PAYSTACK_PRICING.pro.amount : PAYSTACK_PRICING.enterprise.amount;

    if (!planCode) {
      return NextResponse.json(
        { error: 'Plan code not configured for this tier' },
        { status: 400 }
      );
    }

    // Initialize Paystack transaction
    const result = await initializeTransaction(
      session.user.email,
      amount,
      planCode,
      {
        userId: (session.user as { id: string }).id,
        tier,
        cancel_action: `${process.env.NEXTAUTH_URL}/payment/cancel`,
      }
    );

    if (result.status && result.data) {
      return NextResponse.json({
        authorization_url: result.data.authorization_url,
        access_code: result.data.access_code,
        reference: result.data.reference,
      });
    } else {
      throw new Error('Failed to initialize transaction');
    }
  } catch (error) {
    console.error('Paystack checkout error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
