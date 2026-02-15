import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { MARKETPLACE_CREDITS } from '@/lib/pricing';

const requestSchema = z.object({
  roleTitle: z.string().min(2).max(100),
  roleDescription: z.string().max(500).optional(),
  salaryRange: z.string().optional(),
  location: z.string().optional(),
  message: z.string().max(1000).optional(),
});

// POST /api/talent/[id]/request - Send interview request to a talent profile
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
    const body = await req.json();
    const validated = requestSchema.parse(body);

    // Verify recruiter
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (!recruiter || recruiter.company.verificationStatus !== 'verified') {
      return NextResponse.json(
        { error: 'Only verified recruiters can send interview requests' },
        { status: 403 }
      );
    }

    // Check credit balance
    const creditCost = MARKETPLACE_CREDITS.interview_request;
    if (recruiter.company.creditBalance < creditCost) {
      return NextResponse.json(
        { error: 'Insufficient credits. Purchase more credits to send requests.' },
        { status: 400 }
      );
    }

    // Verify talent profile exists and is public
    const talentProfile = await prisma.talentProfile.findUnique({
      where: { id: params.id },
    });

    if (!talentProfile || !talentProfile.isOptedIn || !talentProfile.isPublic) {
      return NextResponse.json({ error: 'Talent profile not found' }, { status: 404 });
    }

    // Check for existing pending request
    const existingRequest = await prisma.interviewRequest.findFirst({
      where: {
        recruiterId: recruiter.id,
        talentProfileId: params.id,
        status: 'pending',
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending request for this candidate' },
        { status: 400 }
      );
    }

    // Create interview request and deduct credit in a transaction
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const [request] = await prisma.$transaction([
      prisma.interviewRequest.create({
        data: {
          recruiterId: recruiter.id,
          companyId: recruiter.companyId,
          talentProfileId: params.id,
          roleTitle: validated.roleTitle,
          roleDescription: validated.roleDescription || null,
          salaryRange: validated.salaryRange || null,
          location: validated.location || null,
          message: validated.message || null,
          expiresAt,
          creditUsed: true,
        },
      }),
      prisma.recruiterCompany.update({
        where: { id: recruiter.companyId },
        data: { creditBalance: { decrement: creditCost } },
      }),
      prisma.recruiter.update({
        where: { id: recruiter.id },
        data: { requestsSent: { increment: 1 } },
      }),
      prisma.talentProfile.update({
        where: { id: params.id },
        data: { interviewRequestCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({
      request,
      remainingCredits: recruiter.company.creditBalance - creditCost,
      message: 'Interview request sent! The candidate has 7 days to respond.',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error sending interview request:', error);
    return NextResponse.json({ error: 'Failed to send request' }, { status: 500 });
  }
}
