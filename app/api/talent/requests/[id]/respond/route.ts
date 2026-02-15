import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/talent/requests/[id]/respond - Accept or decline an interview request
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { action } = await req.json(); // 'accept' or 'decline'

    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Verify talent profile ownership
    const talentProfile = await prisma.talentProfile.findUnique({
      where: { userId },
    });

    if (!talentProfile) {
      return NextResponse.json({ error: 'No talent profile found' }, { status: 404 });
    }

    const request = await prisma.interviewRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.talentProfileId !== talentProfile.id) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (request.status !== 'pending') {
      return NextResponse.json(
        { error: `Request has already been ${request.status}` },
        { status: 400 }
      );
    }

    if (action === 'accept') {
      // Accept the request and create a profile reveal record
      const [updatedRequest, reveal] = await prisma.$transaction([
        prisma.interviewRequest.update({
          where: { id: requestId },
          data: {
            status: 'accepted',
            respondedAt: new Date(),
          },
        }),
        prisma.profileReveal.create({
          data: {
            interviewRequestId: requestId,
            talentProfileId: talentProfile.id,
            recruiterConsent: true,
            candidateConsent: false, // Candidate needs to explicitly consent to reveal
          },
        }),
      ]);

      return NextResponse.json({
        request: updatedRequest,
        reveal,
        message: 'Request accepted! You can now choose to reveal your profile to the recruiter.',
      });
    } else {
      // Decline the request
      const updatedRequest = await prisma.interviewRequest.update({
        where: { id: requestId },
        data: {
          status: 'declined',
          respondedAt: new Date(),
        },
      });

      return NextResponse.json({
        request: updatedRequest,
        message: 'Request declined.',
      });
    }
  } catch (error) {
    console.error('Error responding to request:', error);
    return NextResponse.json({ error: 'Failed to respond' }, { status: 500 });
  }
}
