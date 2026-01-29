import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/talent/search - Search/browse anonymous talent profiles (for recruiters)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Verify user is a recruiter
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (!recruiter || !recruiter.company.verificationStatus) {
      return NextResponse.json(
        { error: 'Only verified recruiters can browse talent' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const minScore = parseInt(searchParams.get('minScore') || '0');
    const seniority = searchParams.get('seniority');
    const availability = searchParams.get('availability');
    const skill = searchParams.get('skill');
    const sortBy = searchParams.get('sortBy') || 'overallScore';

    // Build filter
    const where: Record<string, unknown> = {
      isOptedIn: true,
      isPublic: true,
    };

    if (minScore > 0) {
      where.overallScore = { gte: minScore };
    }

    if (seniority) {
      where.seniorityLevel = seniority;
    }

    if (availability) {
      where.availability = availability;
    }

    if (skill) {
      where.verifiedSkills = { contains: skill };
    }

    const [profiles, total] = await Promise.all([
      prisma.talentProfile.findMany({
        where,
        orderBy: sortBy === 'recent'
          ? { lastActiveAt: 'desc' }
          : { overallScore: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          anonymousId: true,
          displayTitle: true,
          codingScore: true,
          systemDesignScore: true,
          behavioralScore: true,
          overallScore: true,
          verifiedSkills: true,
          seniorityLevel: true,
          yearsExperience: true,
          availability: true,
          totalSessions: true,
          totalPracticeHours: true,
          requiresSponsorship: true,
          lastActiveAt: true,
        },
      }),
      prisma.talentProfile.count({ where }),
    ]);

    // Parse JSON fields
    const parsed = profiles.map((p) => ({
      ...p,
      verifiedSkills: JSON.parse(p.verifiedSkills),
    }));

    // Track views
    for (const profile of profiles) {
      await prisma.recruiterView.upsert({
        where: {
          recruiterId_talentProfileId: {
            recruiterId: recruiter.id,
            talentProfileId: profile.id,
          },
        },
        update: { viewedAt: new Date() },
        create: {
          recruiterId: recruiter.id,
          talentProfileId: profile.id,
        },
      });

      // Increment profile view count
      await prisma.talentProfile.update({
        where: { id: profile.id },
        data: { profileViews: { increment: 1 } },
      });
    }

    return NextResponse.json({
      profiles: parsed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error searching talent:', error);
    return NextResponse.json({ error: 'Failed to search talent' }, { status: 500 });
  }
}
