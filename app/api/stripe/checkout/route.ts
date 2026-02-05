import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { stripe, STRIPE_PRICE_IDS, isStripeConfigured } from '@/lib/stripe';
import { checkApiRateLimit } from '@/lib/rate-limit';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Apply strict rate limiting for payment endpoints
    const identifier = (session?.user as any)?.id;
    const rateLimit = await checkApiRateLimit('auth', identifier);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many checkout requests. Please try again later.',
          resetAt: new Date(rateLimit.reset).toISOString()
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.reset.toString(),
          }
        }
      );
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

    // Generate idempotency key from userId + tier + 10-minute time window
    const userId = (session.user as any).id;
    const timeWindow = Math.floor(Date.now() / (10 * 60 * 1000));
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(`${userId}-${tier}-${timeWindow}`)
      .digest('hex');

    // Create Stripe checkout session with idempotency
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
        userId,
        tier,
      },
      subscription_data: {
        metadata: {
          userId,
          tier,
        },
      },
    }, {
      idempotencyKey,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to create checkout session';
    if (error.type === 'StripeAuthenticationError') {
      errorMessage = 'Invalid Stripe API key. Please contact support.';
    } else if (error.type === 'StripeAPIError') {
      errorMessage = 'Stripe service temporarily unavailable. Please try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage, details: error.type || 'unknown' },
      { status: 500 }
    );
  }
}
