import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/sessions/[id]/reveal - Request or accept identity reveal
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

    const expertSession = await prisma.expertSession.findUnique({
      where: { id },
      include: {
        interviewer: {
          include: { user: true },
        },
        candidate: true,
      },
    });

    if (!expertSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Session must be completed
    if (expertSession.status !== 'completed') {
      return NextResponse.json(
        { error: 'Session must be completed before revealing identity' },
        { status: 400 }
      );
    }

    // Determine who is making the request
    const isCandidate = expertSession.candidateId === userId;
    const isInterviewer = expertSession.interviewer.userId === userId;

    if (!isCandidate && !isInterviewer) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // If reveal not yet requested, mark as requested
    if (!expertSession.revealRequested) {
      await prisma.expertSession.update({
        where: { id },
        data: { revealRequested: true },
      });

      return NextResponse.json({
        revealed: false,
        yourConsent: true,
        otherPartyConsent: false,
        message: 'Your reveal request recorded. Waiting for the other party.',
      });
    }

    // If already requested, this is the acceptance
    if (!expertSession.revealAccepted) {
      await prisma.expertSession.update({
        where: { id },
        data: {
          revealAccepted: true,
          revealedAt: new Date(),
        },
      });

      return NextResponse.json({
        revealed: true,
        message: 'Both parties consented. Identities revealed!',
        candidate: {
          name: expertSession.candidate.name,
          email: expertSession.candidate.email,
          image: expertSession.candidate.image,
        },
        interviewer: {
          name: expertSession.interviewer.displayName,
          email: expertSession.interviewer.user.email,
          company: expertSession.interviewer.currentCompany,
          linkedinUrl: expertSession.interviewer.linkedinUrl,
        },
      });
    }

    // Already fully revealed
    return NextResponse.json({
      revealed: true,
      message: 'Identities already revealed.',
    });
  } catch (error) {
    console.error('Error processing reveal:', error);
    return NextResponse.json(
      { error: 'Failed to process reveal request' },
      { status: 500 }
    );
  }
}

// GET /api/sessions/[id]/reveal - Get reveal status
export async function GET(
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

    const expertSession = await prisma.expertSession.findUnique({
      where: { id },
      include: {
        interviewer: {
          include: { user: true },
        },
        candidate: true,
      },
    });

    if (!expertSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check authorization
    const isCandidate = expertSession.candidateId === userId;
    const isInterviewer = expertSession.interviewer.userId === userId;

    if (!isCandidate && !isInterviewer) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // If revealed, return full info
    if (expertSession.revealedAt) {
      return NextResponse.json({
        revealed: true,
        revealRequested: expertSession.revealRequested,
        revealAccepted: expertSession.revealAccepted,
        candidate: {
          name: expertSession.candidate.name,
          email: expertSession.candidate.email,
          image: expertSession.candidate.image,
        },
        interviewer: {
          name: expertSession.interviewer.displayName,
          email: expertSession.interviewer.user.email,
          company: expertSession.interviewer.currentCompany,
          linkedinUrl: expertSession.interviewer.linkedinUrl,
        },
      });
    }

    // Not yet revealed
    return NextResponse.json({
      revealed: false,
      revealRequested: expertSession.revealRequested,
      revealAccepted: expertSession.revealAccepted,
      candidateAlias: expertSession.candidateAlias,
      interviewerAlias: expertSession.interviewerAlias,
    });
  } catch (error) {
    console.error('Error getting reveal status:', error);
    return NextResponse.json(
      { error: 'Failed to get reveal status' },
      { status: 500 }
    );
  }
}
