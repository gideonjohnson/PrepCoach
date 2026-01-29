import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/talent/requests - Get interview requests for the current candidate
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // pending, accepted, declined, all

    const talentProfile = await prisma.talentProfile.findUnique({
      where: { userId },
    });

    if (!talentProfile) {
      return NextResponse.json({ error: 'No talent profile found' }, { status: 404 });
    }

    // Expire old requests
    await prisma.interviewRequest.updateMany({
      where: {
        talentProfileId: talentProfile.id,
        status: 'pending',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'expired' },
    });

    const where: Record<string, unknown> = {
      talentProfileId: talentProfile.id,
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    const requests = await prisma.interviewRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: {
            name: true,
            website: true,
            description: true,
            logo: true,
            city: true,
            country: true,
          },
        },
        reveals: {
          select: {
            id: true,
            candidateConsent: true,
            recruiterConsent: true,
            candidateRevealed: true,
            recruiterRevealed: true,
            revealedAt: true,
          },
        },
      },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
