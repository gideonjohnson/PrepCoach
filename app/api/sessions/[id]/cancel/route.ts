import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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

// Cancellation policy:
// - 24+ hours before: full refund
// - 12-24 hours before: 50% refund
// - <12 hours before: no refund
// - Coaching package sessions: session returned to package if 24+ hours before
function calculateRefundPolicy(scheduledAt: Date): {
  refundPercentage: number;
  reason: string;
} {
  const now = new Date();
  const hoursUntilSession = (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilSession >= 24) {
    return { refundPercentage: 100, reason: 'Full refund (24+ hours notice)' };
  } else if (hoursUntilSession >= 12) {
    return { refundPercentage: 50, reason: 'Partial refund (12-24 hours notice)' };
  } else if (hoursUntilSession > 0) {
    return { refundPercentage: 0, reason: 'No refund (less than 12 hours notice)' };
  } else {
    return { refundPercentage: 0, reason: 'Session has already started or passed' };
  }
}

// POST /api/sessions/[id]/cancel - Cancel a session
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id } = await params;
    const { reason } = await req.json().catch(() => ({ reason: '' }));

    const expertSession = await prisma.expertSession.findUnique({
      where: { id },
      include: {
        interviewer: { select: { userId: true } },
      },
    });

    if (!expertSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Only candidate or interviewer can cancel
    const isCandidate = expertSession.candidateId === userId;
    const isInterviewer = expertSession.interviewer.userId === userId;

    if (!isCandidate && !isInterviewer) {
      return NextResponse.json({ error: 'Not authorized to cancel this session' }, { status: 403 });
    }

    if (['completed', 'cancelled'].includes(expertSession.status)) {
      return NextResponse.json(
        { error: `Session is already ${expertSession.status}` },
        { status: 400 }
      );
    }

    const refundPolicy = calculateRefundPolicy(expertSession.scheduledAt);
    let refundId: string | null = null;
    let refundAmount = 0;

    // Handle refund for paid sessions
    const cancelledBy = isCandidate ? 'candidate' : 'interviewer';

    if (expertSession.paymentStatus === 'paid' && expertSession.paymentIntentId) {
      if (expertSession.coachingPackageId) {
        // Return session to coaching package if 24+ hours notice
        if (refundPolicy.refundPercentage === 100) {
          await prisma.coachingPackage.update({
            where: { id: expertSession.coachingPackageId },
            data: {
              remainingSessions: { increment: 1 },
              usedSessions: { decrement: 1 },
              status: 'active',
            },
          });
        }
      } else if (refundPolicy.refundPercentage > 0) {
        // Process Stripe refund
        refundAmount = Math.round(
          expertSession.priceInCents * (refundPolicy.refundPercentage / 100)
        );

        try {
          const refund = await getStripe().refunds.create({
            payment_intent: expertSession.paymentIntentId,
            amount: refundAmount,
            reason: 'requested_by_customer',
          });
          refundId = refund.id;
        } catch (stripeError) {
          console.error('Stripe refund failed:', stripeError);
          return NextResponse.json(
            { error: 'Failed to process refund. Please contact support.' },
            { status: 500 }
          );
        }

        // Atomically update DB after successful Stripe refund
        try {
          const updatedSession = await prisma.expertSession.update({
            where: { id },
            data: {
              status: 'cancelled',
              cancellationReason: reason || `Cancelled by ${cancelledBy}: ${refundPolicy.reason}`,
              cancelledAt: new Date(),
              paymentStatus: 'refunded',
              refundId,
              refundAmount,
            },
          });

          return NextResponse.json({
            session: updatedSession,
            refund: {
              percentage: refundPolicy.refundPercentage,
              amount: refundAmount,
              reason: refundPolicy.reason,
              refundId,
              packageSessionReturned: false,
            },
            message: `Session cancelled. ${refundPolicy.reason}`,
          });
        } catch (dbError) {
          // CRITICAL: Stripe refund succeeded but DB update failed
          // Log for manual reconciliation
          console.error('CRITICAL: Stripe refund succeeded but DB update failed', {
            sessionId: id,
            refundId,
            refundAmount,
            error: dbError,
          });
          return NextResponse.json(
            { error: 'Refund processed but session update failed. Please contact support.' },
            { status: 500 }
          );
        }
      }
    }

    // Update session status (no-refund path or unpaid sessions)
    const updatedSession = await prisma.expertSession.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancellationReason: reason || `Cancelled by ${cancelledBy}: ${refundPolicy.reason}`,
        cancelledAt: new Date(),
        paymentStatus: expertSession.paymentStatus,
        refundId: null,
        refundAmount: null,
      },
    });

    return NextResponse.json({
      session: updatedSession,
      refund: {
        percentage: refundPolicy.refundPercentage,
        amount: refundAmount,
        reason: refundPolicy.reason,
        refundId,
        packageSessionReturned: !!(
          expertSession.coachingPackageId && refundPolicy.refundPercentage === 100
        ),
      },
      message: `Session cancelled. ${refundPolicy.reason}`,
    });
  } catch (error) {
    console.error('Error cancelling session:', error);
    return NextResponse.json({ error: 'Failed to cancel session' }, { status: 500 });
  }
}

// GET /api/sessions/[id]/cancel - Get cancellation policy for a session
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id } = await params;

    const expertSession = await prisma.expertSession.findUnique({
      where: { id },
      include: {
        interviewer: { select: { userId: true } },
      },
    });

    if (!expertSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const isCandidate = expertSession.candidateId === userId;
    const isInterviewer = expertSession.interviewer.userId === userId;

    if (!isCandidate && !isInterviewer) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const policy = calculateRefundPolicy(expertSession.scheduledAt);

    return NextResponse.json({
      canCancel: !['completed', 'cancelled'].includes(expertSession.status),
      refundPercentage: policy.refundPercentage,
      refundAmount: Math.round(
        expertSession.priceInCents * (policy.refundPercentage / 100)
      ),
      reason: policy.reason,
      isCoachingPackage: !!expertSession.coachingPackageId,
      packageSessionReturned: !!(
        expertSession.coachingPackageId && policy.refundPercentage === 100
      ),
    });
  } catch (error) {
    console.error('Error fetching cancellation policy:', error);
    return NextResponse.json({ error: 'Failed to fetch policy' }, { status: 500 });
  }
}
