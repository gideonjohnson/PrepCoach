import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { safeJsonParse } from '@/lib/utils';

// GET /api/problems/[slug] - Get a single problem by slug
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const problem = await prisma.problem.findUnique({
      where: { slug },
    });

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Check premium access
    if (problem.isPremium) {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        return NextResponse.json(
          { error: 'Premium subscription required', isPremium: true },
          { status: 403 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { subscriptionTier: true, subscriptionStatus: true },
      });

      const hasPremium = user &&
        ['pro', 'enterprise', 'lifetime'].includes(user.subscriptionTier) &&
        user.subscriptionStatus === 'active';

      if (!hasPremium) {
        return NextResponse.json(
          { error: 'Premium subscription required', isPremium: true },
          { status: 403 }
        );
      }
    }

    // Parse JSON fields
    const parsedProblem = {
      ...problem,
      companies: safeJsonParse(problem.companies, []),
      tags: safeJsonParse(problem.tags, []),
      constraints: safeJsonParse(problem.constraints, []),
      examples: safeJsonParse(problem.examples, []),
      hints: safeJsonParse(problem.hints, []),
      testCases: safeJsonParse(problem.testCases, []).filter(
        (tc: { isHidden?: boolean }) => !tc.isHidden
      ), // Only return visible test cases
      successRate: problem.totalAttempts > 0
        ? Math.round((problem.successfulAttempts / problem.totalAttempts) * 100)
        : null,
    };

    return NextResponse.json({ problem: parsedProblem });
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem' },
      { status: 500 }
    );
  }
}

// GET /api/problems/random - Get a random problem
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { difficulty, category } = body;

    // Build where clause
    const where: Record<string, unknown> = {
      isPublic: true,
    };

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (category) {
      where.category = category;
    }

    // Check premium access
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      where.isPremium = false;
    } else {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { subscriptionTier: true, subscriptionStatus: true },
      });

      const hasPremium = user &&
        ['pro', 'enterprise', 'lifetime'].includes(user.subscriptionTier) &&
        user.subscriptionStatus === 'active';

      if (!hasPremium) {
        where.isPremium = false;
      }
    }

    // Get count and random offset
    const count = await prisma.problem.count({ where });

    if (count === 0) {
      return NextResponse.json(
        { error: 'No problems found matching criteria' },
        { status: 404 }
      );
    }

    const randomOffset = Math.floor(Math.random() * count);

    const problem = await prisma.problem.findFirst({
      where,
      skip: randomOffset,
    });

    if (!problem) {
      return NextResponse.json(
        { error: 'Failed to get random problem' },
        { status: 500 }
      );
    }

    // Parse JSON fields
    const parsedProblem = {
      ...problem,
      companies: safeJsonParse(problem.companies, []),
      tags: safeJsonParse(problem.tags, []),
      constraints: safeJsonParse(problem.constraints, []),
      examples: safeJsonParse(problem.examples, []),
      hints: safeJsonParse(problem.hints, []),
      testCases: safeJsonParse(problem.testCases, []).filter(
        (tc: { isHidden?: boolean }) => !tc.isHidden
      ),
    };

    return NextResponse.json({ problem: parsedProblem });
  } catch (error) {
    console.error('Error getting random problem:', error);
    return NextResponse.json(
      { error: 'Failed to get random problem' },
      { status: 500 }
    );
  }
}
