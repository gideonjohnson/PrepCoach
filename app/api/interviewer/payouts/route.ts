import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
}

// GET /api/interviewer/payouts - Get payout history and stats
export async function GET(req: NextRequest) {
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

    // Get payouts from database
    const payouts = await prisma.interviewerPayout.findMany({
      where: { interviewerId: interviewer.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Get completed sessions awaiting payout
    const pendingSessions = await prisma.expertSession.findMany({
      where: {
        interviewerId: interviewer.id,
        status: 'completed',
        payoutId: null,
      },
      orderBy: { completedAt: 'desc' },
    });

    // Calculate stats
    const totalEarnings = await prisma.interviewerPayout.aggregate({
      where: {
        interviewerId: interviewer.id,
        status: 'completed',
      },
      _sum: { amount: true },
    });

    const pendingAmount = pendingSessions.reduce(
      (sum, s) => sum + s.payoutInCents,
      0
    );

    const thisMonthEarnings = await prisma.interviewerPayout.aggregate({
      where: {
        interviewerId: interviewer.id,
        status: 'completed',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { amount: true },
    });

    return NextResponse.json({
      payouts,
      pendingSessions,
      stats: {
        totalEarnings: totalEarnings._sum.amount || 0,
        pendingAmount,
        thisMonthEarnings: thisMonthEarnings._sum.amount || 0,
        completedSessions: interviewer.totalSessions,
      },
    });
  } catch (error) {
    console.error('Error fetching payouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}

// POST /api/interviewer/payouts - Request payout for completed sessions
export async function POST(req: NextRequest) {
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

    if (!interviewer.stripeAccountId) {
      return NextResponse.json(
        { error: 'Stripe Connect account not set up' },
        { status: 400 }
      );
    }

    // Verify Connect account is ready for payouts
    const account = await getStripe().accounts.retrieve(interviewer.stripeAccountId);
    if (!account.payouts_enabled) {
      return NextResponse.json(
        { error: 'Stripe account not ready for payouts. Complete onboarding first.' },
        { status: 400 }
      );
    }

    // Get completed sessions awaiting payout
    const pendingSessions = await prisma.expertSession.findMany({
      where: {
        interviewerId: interviewer.id,
        status: 'completed',
        payoutId: null,
      },
    });

    if (pendingSessions.length === 0) {
      return NextResponse.json(
        { error: 'No sessions pending payout' },
        { status: 400 }
      );
    }

    const totalAmount = pendingSessions.reduce(
      (sum, s) => sum + s.payoutInCents,
      0
    );

    // Minimum payout threshold ($10)
    if (totalAmount < 1000) {
      return NextResponse.json(
        { error: 'Minimum payout is $10. Current balance: $' + (totalAmount / 100).toFixed(2) },
        { status: 400 }
      );
    }

    // Create transfer to Connect account
    const transfer = await getStripe().transfers.create({
      amount: totalAmount,
      currency: 'usd',
      destination: interviewer.stripeAccountId,
      metadata: {
        interviewerId: interviewer.id,
        sessionCount: pendingSessions.length.toString(),
        sessionIds: pendingSessions.map((s) => s.id).join(','),
      },
    });

    // Create payout record
    const payout = await prisma.interviewerPayout.create({
      data: {
        interviewerId: interviewer.id,
        amount: totalAmount,
        currency: 'usd',
        status: 'pending',
        stripeTransferId: transfer.id,
        sessionsIncluded: pendingSessions.length,
      },
    });

    // Update sessions with payout ID
    await prisma.expertSession.updateMany({
      where: {
        id: { in: pendingSessions.map((s) => s.id) },
      },
      data: { payoutId: payout.id },
    });

    return NextResponse.json({
      payout,
      transfer: {
        id: transfer.id,
        amount: transfer.amount,
      },
      message: `Payout of $${(totalAmount / 100).toFixed(2)} initiated for ${pendingSessions.length} sessions`,
    });
  } catch (error) {
    console.error('Error creating payout:', error);
    return NextResponse.json(
      { error: 'Failed to create payout' },
      { status: 500 }
    );
  }
}
