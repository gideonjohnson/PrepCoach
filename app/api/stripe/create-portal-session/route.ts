import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import prisma from '@/lib/prisma';

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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has an active subscription
    if (!user.subscriptionTier || user.subscriptionTier === 'free') {
      return NextResponse.json(
        { error: 'No active subscription' },
        { status: 400 }
      );
    }

    // For now, we'll create a simple checkout session to manage subscription
    // In production, you'd want to store stripeCustomerId in the database
    // and use stripe.billingPortal.sessions.create()
    
    // TODO: Store Stripe Customer ID in database for production
    // For now, redirect to pricing page with a message
    return NextResponse.json({
      message: 'Please contact support to manage your subscription',
      redirectUrl: '/pricing',
    });

  } catch (error: any) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
