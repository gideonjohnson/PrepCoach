import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, STRIPE_PRICE_IDS, isStripeConfigured } from '@/lib/stripe';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { getRoleForTier, type AllTierTypes } from '@/lib/pricing';
import crypto from 'crypto';

const VALID_TIERS: AllTierTypes[] = [
  'pro', 'enterprise',
  'interviewer_basic', 'interviewer_featured', 'interviewer_premium',
  'recruiter_starter', 'recruiter_growth', 'recruiter_scale',
];

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Apply strict rate limiting for payment endpoints
    const identifier = (session?.user as { id: string })?.id;
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
    if (!VALID_TIERS.includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    // Get the correct price ID
    const priceId = STRIPE_PRICE_IDS[tier];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this tier' },
        { status: 400 }
      );
    }

    // Generate idempotency key from userId + tier + 10-minute time window
    const userId = (session.user as { id: string }).id;
    const timeWindow = Math.floor(Date.now() / (10 * 60 * 1000));
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(`${userId}-${tier}-${timeWindow}`)
      .digest('hex');

    const role = getRoleForTier(tier as AllTierTypes);

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
        role,
      },
      subscription_data: {
        metadata: {
          userId,
          tier,
          role,
        },
      },
    }, {
      idempotencyKey,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to create checkout session';
    let errorType = 'unknown';

    if (error instanceof Error) {
      errorMessage = error.message;
      const stripeError = error as Error & { type?: string };
      if (stripeError.type === 'StripeAuthenticationError') {
        errorMessage = 'Invalid Stripe API key. Please contact support.';
      } else if (stripeError.type === 'StripeAPIError') {
        errorMessage = 'Stripe service temporarily unavailable. Please try again.';
      }
      errorType = stripeError.type || 'unknown';
    }

    return NextResponse.json(
      { error: errorMessage, details: errorType },
      { status: 500 }
    );
  }
}
