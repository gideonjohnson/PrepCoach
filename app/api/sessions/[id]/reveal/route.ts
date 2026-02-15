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

    // Check if session was anonymous
    if (!expertSession.isAnonymous) {
      return NextResponse.json(
        { error: 'Session was not anonymous' },
        { status: 400 }
      );
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

    // Update reveal consent
    const updateField = isCandidate ? 'candidateRevealConsent' : 'interviewerRevealConsent';

    await prisma.expertSession.update({
      where: { id },
      data: { [updateField]: true },
    });

    // Refresh session to check if both consented
    const updatedSession = await prisma.expertSession.findUnique({
      where: { id },
      include: {
        interviewer: {
          include: { user: true },
        },
        candidate: true,
      },
    });

    if (!updatedSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check if both parties consented
    const bothConsented =
      updatedSession.candidateRevealConsent && updatedSession.interviewerRevealConsent;

    if (bothConsented) {
      // Update session to mark identity as revealed
      await prisma.expertSession.update({
        where: { id },
        data: { identityRevealed: true },
      });

      return NextResponse.json({
        revealed: true,
        message: 'Both parties consented. Identities revealed!',
        candidate: {
          name: updatedSession.candidate.name,
          email: updatedSession.candidate.email,
          image: updatedSession.candidate.image,
        },
        interviewer: {
          name: updatedSession.interviewer.displayName,
          email: updatedSession.interviewer.user.email,
          company: updatedSession.interviewer.currentCompany,
          linkedinUrl: updatedSession.interviewer.linkedinUrl,
        },
      });
    }

    return NextResponse.json({
      revealed: false,
      yourConsent: true,
      otherPartyConsent: isCandidate
        ? updatedSession.interviewerRevealConsent
        : updatedSession.candidateRevealConsent,
      message: 'Your consent recorded. Waiting for the other party.',
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

    // If not anonymous, always reveal
    if (!expertSession.isAnonymous) {
      return NextResponse.json({
        isAnonymous: false,
        revealed: true,
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

    // Anonymous session
    if (expertSession.identityRevealed) {
      return NextResponse.json({
        isAnonymous: true,
        revealed: true,
        candidateRevealConsent: expertSession.candidateRevealConsent,
        interviewerRevealConsent: expertSession.interviewerRevealConsent,
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
      isAnonymous: true,
      revealed: false,
      yourConsent: isCandidate
        ? expertSession.candidateRevealConsent
        : expertSession.interviewerRevealConsent,
      otherPartyConsent: isCandidate
        ? expertSession.interviewerRevealConsent
        : expertSession.candidateRevealConsent,
      candidateAnonymousName: expertSession.candidateAnonymousName,
      interviewerAnonymousName: expertSession.interviewerAnonymousName,
    });
  } catch (error) {
    console.error('Error getting reveal status:', error);
    return NextResponse.json(
      { error: 'Failed to get reveal status' },
      { status: 500 }
    );
  }
}
