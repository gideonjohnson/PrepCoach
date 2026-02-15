import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { batchScoreProfiles } from '@/lib/ai-talent-scoring';

// POST /api/talent/match - AI-powered talent matching based on job requirements
export async function POST(req: NextRequest) {
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
        { error: 'Only verified recruiters can use AI talent matching' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      requiredSkills = [],
      preferredSkills = [],
      experienceLevel,
      minYearsExperience,
      limit = 20,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      );
    }

    // Build base filter for talent profiles
    const where: Record<string, unknown> = {
      isOptedIn: true,
      isPublic: true,
    };

    // If experience level is specified, filter by seniority
    if (experienceLevel) {
      where.seniorityLevel = experienceLevel;
    }

    // If min years specified, add filter
    if (minYearsExperience) {
      where.yearsExperience = { gte: minYearsExperience };
    }

    // Fetch candidate profiles (get more than limit to allow for better matching)
    const profiles = await prisma.talentProfile.findMany({
      where,
      orderBy: { overallScore: 'desc' },
      take: Math.min(limit * 3, 100), // Get 3x to have candidates for scoring
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
      },
    });

    // Parse JSON fields
    const parsedProfiles = profiles.map((p) => ({
      ...p,
      verifiedSkills: JSON.parse(p.verifiedSkills) as string[],
    }));

    // Score profiles using AI
    const scoredProfiles = await batchScoreProfiles(parsedProfiles, {
      title,
      description,
      requiredSkills,
      preferredSkills,
      experienceLevel,
      minYearsExperience,
    });

    // Return top matches up to the limit
    const topMatches = scoredProfiles.slice(0, limit);

    // Track views for matched profiles
    const profileIds = topMatches.map((p) => p.id);

    if (profileIds.length > 0) {
      await prisma.recruiterView.createMany({
        data: profileIds.map((id) => ({
          recruiterId: recruiter.id,
          talentProfileId: id,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      matches: topMatches.map((p) => ({
        id: p.id,
        anonymousId: p.anonymousId,
        displayTitle: p.displayTitle,
        scores: {
          coding: p.codingScore,
          systemDesign: p.systemDesignScore,
          behavioral: p.behavioralScore,
          overall: p.overallScore,
        },
        verifiedSkills: p.verifiedSkills,
        seniorityLevel: p.seniorityLevel,
        yearsExperience: p.yearsExperience,
        availability: p.availability,
        practiceStats: {
          sessions: p.totalSessions,
          hours: p.totalPracticeHours,
        },
        matching: {
          relevanceScore: p.relevanceScore,
          matchReasons: p.matchReasons,
          skillMatches: p.skillMatches,
          gaps: p.gaps,
        },
      })),
      totalCandidates: profiles.length,
      query: {
        title,
        requiredSkills,
        preferredSkills,
        experienceLevel,
        minYearsExperience,
      },
    });
  } catch (error) {
    console.error('Error in AI talent matching:', error);
    return NextResponse.json(
      { error: 'Failed to match talent' },
      { status: 500 }
    );
  }
}
