import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import prisma from '@/lib/prisma';

export async function POST() {
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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, stripeCustomerId: true, subscriptionStatus: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has a Stripe customer ID
    if (!user.stripeCustomerId) {
      return NextResponse.json(
        {
          error: 'No active subscription found',
          message: 'You need to create a subscription first before accessing the customer portal.',
        },
        { status: 400 }
      );
    }

    // Create Stripe billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error('Create portal session error:', error);

    if (error instanceof Error && error.message.includes('No such customer')) {
      return NextResponse.json(
        {
          error: 'Customer not found in Stripe',
          message: 'There was an issue with your subscription. Please contact support.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
