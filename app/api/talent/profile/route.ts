import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { safeJsonParse } from '@/lib/utils';

const profileUpdateSchema = z.object({
  displayTitle: z.string().max(100).optional(),
  jobPreferences: z.object({
    roles: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional(),
    remote: z.boolean().optional(),
    salaryMin: z.number().optional(),
    salaryCurrency: z.string().optional(),
  }).optional(),
  availability: z.enum(['immediately', '2_weeks', '1_month', 'exploring']).optional(),
  workAuthorization: z.array(z.string()).optional(),
  requiresSponsorship: z.boolean().optional(),
  yearsExperience: z.number().min(0).max(50).optional(),
  seniorityLevel: z.enum(['junior', 'mid', 'senior', 'staff', 'principal']).optional(),
  isPublic: z.boolean().optional(),
});

// GET /api/talent/profile - Get current user's talent profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const profile = await prisma.talentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ profile: null, isOptedIn: false });
    }

    return NextResponse.json({
      profile: {
        ...profile,
        verifiedSkills: safeJsonParse(profile.verifiedSkills, []),
        skillLevels: safeJsonParse(profile.skillLevels, {}),
        jobPreferences: safeJsonParse(profile.jobPreferences, {}),
        workAuthorization: safeJsonParse(profile.workAuthorization, []),
      },
      isOptedIn: profile.isOptedIn,
    });
  } catch (error) {
    console.error('Error fetching talent profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// POST /api/talent/profile - Opt in and create talent profile
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const validated = profileUpdateSchema.parse(body);

    // Check if profile already exists
    const existing = await prisma.talentProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Profile already exists. Use PATCH to update.' },
        { status: 400 }
      );
    }

    // Aggregate scores from AI sessions
    const scores = await aggregateUserScores(userId);

    const profile = await prisma.talentProfile.create({
      data: {
        userId,
        isOptedIn: true,
        optedInAt: new Date(),
        displayTitle: validated.displayTitle || null,
        codingScore: scores.coding,
        systemDesignScore: scores.systemDesign,
        behavioralScore: scores.behavioral,
        overallScore: scores.overall,
        verifiedSkills: JSON.stringify(scores.verifiedSkills),
        skillLevels: JSON.stringify(scores.skillLevels),
        jobPreferences: JSON.stringify(validated.jobPreferences || {}),
        availability: validated.availability || 'exploring',
        workAuthorization: JSON.stringify(validated.workAuthorization || []),
        requiresSponsorship: validated.requiresSponsorship || false,
        yearsExperience: validated.yearsExperience || null,
        seniorityLevel: validated.seniorityLevel || null,
        totalSessions: scores.totalSessions,
        totalPracticeHours: scores.totalPracticeHours,
      },
    });

    return NextResponse.json({
      profile: {
        ...profile,
        verifiedSkills: safeJsonParse(profile.verifiedSkills, []),
        skillLevels: safeJsonParse(profile.skillLevels, {}),
        jobPreferences: safeJsonParse(profile.jobPreferences, {}),
        workAuthorization: safeJsonParse(profile.workAuthorization, []),
      },
      message: 'Talent profile created successfully!',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creating talent profile:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}

// PATCH /api/talent/profile - Update talent profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const validated = profileUpdateSchema.parse(body);

    const existing = await prisma.talentProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Profile not found. Create one first.' }, { status: 404 });
    }

    // Re-aggregate scores
    const scores = await aggregateUserScores(userId);

    const updateData: Record<string, unknown> = {
      codingScore: scores.coding,
      systemDesignScore: scores.systemDesign,
      behavioralScore: scores.behavioral,
      overallScore: scores.overall,
      verifiedSkills: JSON.stringify(scores.verifiedSkills),
      skillLevels: JSON.stringify(scores.skillLevels),
      totalSessions: scores.totalSessions,
      totalPracticeHours: scores.totalPracticeHours,
      lastActiveAt: new Date(),
    };

    if (validated.displayTitle !== undefined) updateData.displayTitle = validated.displayTitle;
    if (validated.jobPreferences !== undefined) updateData.jobPreferences = JSON.stringify(validated.jobPreferences);
    if (validated.availability !== undefined) updateData.availability = validated.availability;
    if (validated.workAuthorization !== undefined) updateData.workAuthorization = JSON.stringify(validated.workAuthorization);
    if (validated.requiresSponsorship !== undefined) updateData.requiresSponsorship = validated.requiresSponsorship;
    if (validated.yearsExperience !== undefined) updateData.yearsExperience = validated.yearsExperience;
    if (validated.seniorityLevel !== undefined) updateData.seniorityLevel = validated.seniorityLevel;
    if (validated.isPublic !== undefined) updateData.isPublic = validated.isPublic;

    const profile = await prisma.talentProfile.update({
      where: { userId },
      data: updateData,
    });

    return NextResponse.json({
      profile: {
        ...profile,
        verifiedSkills: safeJsonParse(profile.verifiedSkills, []),
        skillLevels: safeJsonParse(profile.skillLevels, {}),
        jobPreferences: safeJsonParse(profile.jobPreferences, {}),
        workAuthorization: safeJsonParse(profile.workAuthorization, []),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error updating talent profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

// DELETE /api/talent/profile - Opt out / delete talent profile
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    await prisma.talentProfile.update({
      where: { userId },
      data: {
        isOptedIn: false,
        isPublic: false,
      },
    });

    return NextResponse.json({ message: 'Talent profile deactivated' });
  } catch (error) {
    console.error('Error deactivating talent profile:', error);
    return NextResponse.json({ error: 'Failed to deactivate profile' }, { status: 500 });
  }
}

// Helper: Aggregate user scores from all AI sessions
async function aggregateUserScores(userId: string) {
  const [codingSessions, systemDesignSessions, interviewSessions] = await Promise.all([
    prisma.codingSession.findMany({
      where: { userId, status: 'completed', score: { not: null } },
      select: { score: true, duration: true, language: true },
    }),
    prisma.systemDesignSession.findMany({
      where: { userId, status: 'completed', score: { not: null } },
      select: { score: true, duration: true },
    }),
    prisma.interviewSession.findMany({
      where: { userId },
      select: { completionRate: true, roleCategory: true },
    }),
  ]);

  // Calculate average scores
  const codingScores = codingSessions.map((s) => s.score!);
  const designScores = systemDesignSessions.map((s) => s.score!);
  const behavioralScores = interviewSessions.map((s) => s.completionRate);

  const avgCoding = codingScores.length > 0
    ? Math.round(codingScores.reduce((a, b) => a + b, 0) / codingScores.length)
    : null;
  const avgDesign = designScores.length > 0
    ? Math.round(designScores.reduce((a, b) => a + b, 0) / designScores.length)
    : null;
  const avgBehavioral = behavioralScores.length > 0
    ? Math.round(behavioralScores.reduce((a, b) => a + b, 0) / behavioralScores.length)
    : null;

  // Overall weighted average
  const scores = [avgCoding, avgDesign, avgBehavioral].filter((s) => s !== null) as number[];
  const overall = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  // Extract verified skills from coding sessions
  const languageCounts: Record<string, number> = {};
  codingSessions.forEach((s) => {
    languageCounts[s.language] = (languageCounts[s.language] || 0) + 1;
  });

  const verifiedSkills = Object.keys(languageCounts).filter((lang) => languageCounts[lang] >= 2);
  const skillLevels: Record<string, string> = {};
  verifiedSkills.forEach((skill) => {
    const count = languageCounts[skill];
    if (count >= 10) skillLevels[skill] = 'expert';
    else if (count >= 5) skillLevels[skill] = 'advanced';
    else skillLevels[skill] = 'intermediate';
  });

  // Total practice time
  const codingHours = codingSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 3600;
  const designHours = systemDesignSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 3600;
  const totalPracticeHours = Math.round(codingHours + designHours);
  const totalSessions = codingSessions.length + systemDesignSessions.length + interviewSessions.length;

  return {
    coding: avgCoding,
    systemDesign: avgDesign,
    behavioral: avgBehavioral,
    overall,
    verifiedSkills,
    skillLevels,
    totalSessions,
    totalPracticeHours,
  };
}
