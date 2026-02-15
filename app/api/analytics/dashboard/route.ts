import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/analytics/dashboard - Get comprehensive analytics for user dashboard
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, all

    // Calculate date range
    let startDate: Date;
    const now = new Date();

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date(0);
        break;
      case '30d':
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Fetch all analytics data in parallel
    const [
      user,
      codingSessions,
      systemDesignSessions,
      expertSessions,
      problems,
      resume,
    ] = await Promise.all([
      // User data
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          createdAt: true,
          subscriptionTier: true,
          subscriptionStatus: true,
        },
      }),

      // Coding sessions
      prisma.codingSession.findMany({
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        select: {
          id: true,
          status: true,
          score: true,
          duration: true,
          language: true,
          createdAt: true,
          completedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),

      // System design sessions
      prisma.systemDesignSession.findMany({
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        select: {
          id: true,
          status: true,
          score: true,
          duration: true,
          createdAt: true,
          completedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),

      // Expert mock sessions
      prisma.expertSession.findMany({
        where: {
          candidateId: userId,
          createdAt: { gte: startDate },
        },
        select: {
          id: true,
          status: true,
          sessionType: true,
          candidateFeedback: true,
          duration: true,
          createdAt: true,
          completedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),

      // Problems attempted (via coding sessions)
      prisma.problem.findMany({
        where: {
          codingSessions: {
            some: {
              userId,
              createdAt: { gte: startDate },
            },
          },
        },
        select: {
          id: true,
          difficulty: true,
          category: true,
        },
      }),

      // Resume data
      prisma.resume.findFirst({
        where: { userId },
        select: {
          id: true,
          updatedAt: true,
        },
      }),
    ]);

    // Calculate coding statistics
    const completedCodingSessions = codingSessions.filter(s => s.status === 'completed');
    const codingScores = completedCodingSessions.map(s => s.score).filter(Boolean) as number[];
    const totalCodingTime = codingSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    // Calculate system design statistics
    const completedSDSessions = systemDesignSessions.filter(s => s.status === 'completed');
    const sdScores = completedSDSessions.map(s => s.score).filter(Boolean) as number[];
    const totalSDTime = systemDesignSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    // Calculate expert session statistics
    const completedExpertSessions = expertSessions.filter(s => s.status === 'completed');
    const expertRatings = completedExpertSessions.map(s => {
      try {
        const feedback = s.candidateFeedback ? JSON.parse(s.candidateFeedback) : null;
        return feedback?.rating ?? null;
      } catch { return null; }
    }).filter(Boolean) as number[];

    // Problem difficulty breakdown
    const problemsByDifficulty = problems.reduce((acc, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Language usage breakdown
    const languageUsage = codingSessions.reduce((acc, s) => {
      if (s.language) {
        acc[s.language] = (acc[s.language] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Weekly activity (last 4 weeks)
    const weeklyActivity = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);

      const weekCoding = codingSessions.filter(
        s => new Date(s.createdAt) >= weekStart && new Date(s.createdAt) < weekEnd
      ).length;

      const weekSD = systemDesignSessions.filter(
        s => new Date(s.createdAt) >= weekStart && new Date(s.createdAt) < weekEnd
      ).length;

      weeklyActivity.push({
        week: `Week ${4 - i}`,
        coding: weekCoding,
        systemDesign: weekSD,
        total: weekCoding + weekSD,
      });
    }

    // Score progression (last 10 sessions)
    const recentScores = [
      ...completedCodingSessions.slice(0, 5).map(s => ({
        type: 'coding',
        score: s.score,
        date: s.completedAt || s.createdAt,
      })),
      ...completedSDSessions.slice(0, 5).map(s => ({
        type: 'systemDesign',
        score: s.score,
        date: s.completedAt || s.createdAt,
      })),
    ]
      .filter(s => s.score)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10);

    return NextResponse.json({
      period,
      overview: {
        totalSessions: codingSessions.length + systemDesignSessions.length + expertSessions.length,
        totalPracticeTime: Math.round((totalCodingTime + totalSDTime) / 60), // minutes
        averageScore: codingScores.length > 0
          ? Math.round((codingScores.reduce((a, b) => a + b, 0) / codingScores.length))
          : null,
        problemsSolved: problems.length,
        memberSince: user?.createdAt,
        subscriptionTier: user?.subscriptionTier,
      },
      coding: {
        totalSessions: codingSessions.length,
        completed: completedCodingSessions.length,
        averageScore: codingScores.length > 0
          ? Math.round(codingScores.reduce((a, b) => a + b, 0) / codingScores.length)
          : null,
        highScore: codingScores.length > 0 ? Math.max(...codingScores) : null,
        totalTime: Math.round(totalCodingTime / 60),
        languageBreakdown: languageUsage,
        recentSessions: codingSessions.slice(0, 5).map(s => ({
          id: s.id,
          status: s.status,
          score: s.score,
          language: s.language,
          date: s.createdAt,
        })),
      },
      systemDesign: {
        totalSessions: systemDesignSessions.length,
        completed: completedSDSessions.length,
        averageScore: sdScores.length > 0
          ? Math.round(sdScores.reduce((a, b) => a + b, 0) / sdScores.length)
          : null,
        highScore: sdScores.length > 0 ? Math.max(...sdScores) : null,
        totalTime: Math.round(totalSDTime / 60),
        recentSessions: systemDesignSessions.slice(0, 5).map(s => ({
          id: s.id,
          status: s.status,
          score: s.score,
          date: s.createdAt,
        })),
      },
      mockInterviews: {
        totalSessions: expertSessions.length,
        completed: completedExpertSessions.length,
        averageRating: expertRatings.length > 0
          ? (expertRatings.reduce((a, b) => a + b, 0) / expertRatings.length).toFixed(1)
          : null,
        byType: expertSessions.reduce((acc, s) => {
          acc[s.sessionType] = (acc[s.sessionType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
      problems: {
        total: problems.length,
        byDifficulty: problemsByDifficulty,
      },
      trends: {
        weeklyActivity,
        scoreProgression: recentScores,
      },
      resume: {
        hasResume: !!resume,
        lastUpdated: resume?.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
