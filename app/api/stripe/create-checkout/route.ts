import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { stripe, STRIPE_PRICE_IDS } from '@/lib/stripe';

// POST /api/stripe/create-checkout - Create a Stripe Checkout session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { tier } = await request.json();

    if (!tier || !['pro', 'enterprise'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier parameter' },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !STRIPE_PRICE_IDS[tier as keyof typeof STRIPE_PRICE_IDS]) {
      return NextResponse.json(
        {
          error: 'Stripe not configured',
          message: 'Payment processing is not configured. Please contact support.'
        },
        { status: 500 }
      );
    }

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICE_IDS[tier as keyof typeof STRIPE_PRICE_IDS],
          quantity: 1,
        },
      ],
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        tier: tier,
      },
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/profile?upgrade=success`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/pricing?upgrade=cancelled`,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error('Create checkout error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message: error?.message || 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}
