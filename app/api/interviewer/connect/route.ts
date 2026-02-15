import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

// POST /api/interviewer/connect - Create Stripe Connect account and onboarding link
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Get interviewer profile
    const interviewer = await prisma.interviewer.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!interviewer) {
      return NextResponse.json(
        { error: 'Not registered as an interviewer' },
        { status: 404 }
      );
    }

    if (interviewer.verificationStatus !== 'verified') {
      return NextResponse.json(
        { error: 'Must be verified to set up payouts' },
        { status: 400 }
      );
    }

    let stripeAccountId = interviewer.stripeConnectId;

    // Create Stripe Connect account if doesn't exist
    if (!stripeAccountId) {
      const account = await getStripe().accounts.create({
        type: 'express',
        country: 'US', // Default, can be changed based on interviewer location
        email: interviewer.user.email || undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          interviewerId: interviewer.id,
          userId: userId,
        },
      });

      stripeAccountId = account.id;

      // Save account ID to database
      await prisma.interviewer.update({
        where: { id: interviewer.id },
        data: { stripeConnectId: stripeAccountId },
      });
    }

    // Create account link for onboarding
    const accountLink = await getStripe().accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/interviewer/payouts?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/interviewer/payouts?success=true`,
      type: 'account_onboarding',
    });

    return NextResponse.json({
      url: accountLink.url,
      accountId: stripeAccountId,
    });
  } catch (error) {
    console.error('Error creating Connect account:', error);
    return NextResponse.json(
      { error: 'Failed to create Connect account' },
      { status: 500 }
    );
  }
}

// GET /api/interviewer/connect - Get Connect account status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const interviewer = await prisma.interviewer.findUnique({
      where: { userId },
    });

    if (!interviewer) {
      return NextResponse.json(
        { error: 'Not registered as an interviewer' },
        { status: 404 }
      );
    }

    if (!interviewer.stripeConnectId) {
      return NextResponse.json({
        connected: false,
        payoutsEnabled: false,
        detailsSubmitted: false,
      });
    }

    // Get account details from Stripe
    const account = await getStripe().accounts.retrieve(interviewer.stripeConnectId);

    return NextResponse.json({
      connected: true,
      accountId: interviewer.stripeConnectId,
      payoutsEnabled: account.payouts_enabled,
      chargesEnabled: account.charges_enabled,
      detailsSubmitted: account.details_submitted,
      requirements: account.requirements,
    });
  } catch (error) {
    console.error('Error getting Connect status:', error);
    return NextResponse.json(
      { error: 'Failed to get Connect status' },
      { status: 500 }
    );
  }
}
