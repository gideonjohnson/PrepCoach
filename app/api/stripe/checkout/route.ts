import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { stripe, STRIPE_PRICE_IDS, isStripeConfigured } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if Stripe is configured
    if (!isStripeConfigured()) {
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

    // Get the correct price ID
    const priceId = tier === 'pro' ? STRIPE_PRICE_IDS.pro : STRIPE_PRICE_IDS.enterprise;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this tier' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel`,
      customer_email: session.user.email,
      metadata: {
        userId: (session.user as any).id,
        tier,
      },
      subscription_data: {
        metadata: {
          userId: (session.user as any).id,
          tier,
        },
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
