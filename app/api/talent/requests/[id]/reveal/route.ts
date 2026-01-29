import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// POST /api/talent/requests/[id]/reveal - Consent to profile reveal
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    // Determine if user is candidate or recruiter
    const talentProfile = await prisma.talentProfile.findUnique({
      where: { userId },
    });
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId },
    });

    const request = await prisma.interviewRequest.findUnique({
      where: { id: params.id },
      include: { reveals: true },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (request.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Request must be accepted before revealing profiles' },
        { status: 400 }
      );
    }

    const reveal = request.reveals[0];
    if (!reveal) {
      return NextResponse.json({ error: 'No reveal record found' }, { status: 404 });
    }

    const isCandidate = talentProfile && request.talentProfileId === talentProfile.id;
    const isRecruiter = recruiter && request.recruiterId === recruiter.id;

    if (!isCandidate && !isRecruiter) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};

    if (isCandidate) {
      updateData.candidateConsent = true;
      updateData.candidateRevealed = true;
      // Reveal candidate info
      updateData.candidateName = user?.name || 'Unknown';
      updateData.candidateEmail = user?.email || '';

      // Check if we have a resume
      const resume = await prisma.resume.findFirst({
        where: { userId, isPrimary: true },
        select: { id: true },
      });
      if (resume) {
        updateData.candidateResume = `/api/resumes/${resume.id}`;
      }
    }

    if (isRecruiter) {
      updateData.recruiterConsent = true;
      updateData.recruiterRevealed = true;
    }

    // Check if both sides have consented
    const bothConsented =
      (isCandidate && reveal.recruiterConsent) ||
      (isRecruiter && reveal.candidateConsent);

    if (bothConsented) {
      updateData.revealedAt = new Date();
    }

    const updatedReveal = await prisma.profileReveal.update({
      where: { id: reveal.id },
      data: updateData,
    });

    // If mutual reveal, return full contact info
    if (updatedReveal.revealedAt) {
      return NextResponse.json({
        reveal: updatedReveal,
        mutualReveal: true,
        message: 'Profiles mutually revealed! You can now contact each other directly.',
        contactInfo: isCandidate
          ? { note: 'The recruiter will contact you via the email you provided.' }
          : {
              candidateName: updatedReveal.candidateName,
              candidateEmail: updatedReveal.candidateEmail,
              candidateResume: updatedReveal.candidateResume,
            },
      });
    }

    return NextResponse.json({
      reveal: updatedReveal,
      mutualReveal: false,
      message: 'Your profile has been revealed. Waiting for the other party to reveal theirs.',
    });
  } catch (error) {
    console.error('Error processing reveal:', error);
    return NextResponse.json({ error: 'Failed to process reveal' }, { status: 500 });
  }
}

// GET /api/talent/requests/[id]/reveal - Get reveal status
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const request = await prisma.interviewRequest.findUnique({
      where: { id: params.id },
      include: {
        reveals: true,
        company: { select: { name: true } },
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Verify access
    const talentProfile = await prisma.talentProfile.findUnique({
      where: { userId },
    });
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId },
    });

    const isCandidate = talentProfile && request.talentProfileId === talentProfile.id;
    const isRecruiter = recruiter && request.recruiterId === recruiter.id;

    if (!isCandidate && !isRecruiter) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const reveal = request.reveals[0];

    return NextResponse.json({
      request: {
        id: request.id,
        roleTitle: request.roleTitle,
        status: request.status,
        companyName: request.company.name,
      },
      reveal: reveal
        ? {
            candidateConsent: reveal.candidateConsent,
            recruiterConsent: reveal.recruiterConsent,
            mutuallyRevealed: !!reveal.revealedAt,
            revealedAt: reveal.revealedAt,
            ...(reveal.revealedAt && isRecruiter
              ? {
                  candidateName: reveal.candidateName,
                  candidateEmail: reveal.candidateEmail,
                  candidateResume: reveal.candidateResume,
                }
              : {}),
          }
        : null,
    });
  } catch (error) {
    console.error('Error fetching reveal status:', error);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
