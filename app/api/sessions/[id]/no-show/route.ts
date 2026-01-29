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

// POST /api/sessions/[id]/no-show - Report a no-show
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
    const { reportedParty } = await req.json(); // 'candidate' or 'interviewer'

    const expertSession = await prisma.expertSession.findUnique({
      where: { id },
      include: {
        interviewer: { select: { id: true, userId: true } },
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

    if (expertSession.status !== 'scheduled') {
      return NextResponse.json(
        { error: 'Can only report no-show for scheduled sessions' },
        { status: 400 }
      );
    }

    // Verify session time has passed (allow reporting 15 minutes after scheduled start)
    const gracePeriodMs = 15 * 60 * 1000;
    if (new Date().getTime() < expertSession.scheduledAt.getTime() + gracePeriodMs) {
      return NextResponse.json(
        { error: 'Please wait at least 15 minutes past the scheduled time before reporting a no-show' },
        { status: 400 }
      );
    }

    let refundId: string | null = null;
    let refundAmount = 0;

    if (reportedParty === 'interviewer') {
      // Interviewer no-show: full refund to candidate
      if (expertSession.paymentStatus === 'paid' && expertSession.paymentIntentId) {
        if (expertSession.coachingPackageId) {
          // Return session to coaching package
          await prisma.coachingPackage.update({
            where: { id: expertSession.coachingPackageId },
            data: {
              remainingSessions: { increment: 1 },
              usedSessions: { decrement: 1 },
              status: 'active',
            },
          });
        } else {
          // Full Stripe refund
          refundAmount = expertSession.priceInCents;
          try {
            const refund = await getStripe().refunds.create({
              payment_intent: expertSession.paymentIntentId,
              amount: refundAmount,
              reason: 'requested_by_customer',
            });
            refundId = refund.id;
          } catch (stripeError) {
            console.error('Stripe refund failed:', stripeError);
          }
        }
      }
    }
    // Candidate no-show: interviewer still gets paid, no refund

    const updatedSession = await prisma.expertSession.update({
      where: { id: id },
      data: {
        status: 'no_show',
        cancellationReason: `No-show by ${reportedParty}`,
        paymentStatus: refundId ? 'refunded' : expertSession.paymentStatus,
        refundId,
        refundAmount: refundAmount || null,
      },
    });

    return NextResponse.json({
      session: updatedSession,
      noShowParty: reportedParty,
      refunded: !!refundId || !!(expertSession.coachingPackageId && reportedParty === 'interviewer'),
      refundAmount,
      message: reportedParty === 'interviewer'
        ? 'Interviewer no-show reported. A full refund has been initiated.'
        : 'Candidate no-show reported. The interviewer will still be compensated.',
    });
  } catch (error) {
    console.error('Error reporting no-show:', error);
    return NextResponse.json({ error: 'Failed to report no-show' }, { status: 500 });
  }
}
