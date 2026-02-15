import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// GET /api/problems - List all problems with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse query parameters
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const company = searchParams.get('company');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const skip = (page - 1) * limit;

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

    if (company) {
      where.companies = { contains: company };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Check if user has premium access for premium problems
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

    // Fetch problems with pagination
    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
          category: true,
          companies: true,
          tags: true,
          isPremium: true,
          totalAttempts: true,
          successfulAttempts: true,
        },
        orderBy: [
          { difficulty: 'asc' },
          { title: 'asc' },
        ],
        skip,
        take: limit,
      }),
      prisma.problem.count({ where }),
    ]);

    // Parse JSON fields and calculate success rate
    const parsedProblems = problems.map(problem => ({
      ...problem,
      companies: JSON.parse(problem.companies),
      tags: JSON.parse(problem.tags),
      successRate: problem.totalAttempts > 0
        ? Math.round((problem.successfulAttempts / problem.totalAttempts) * 100)
        : null,
    }));

    return NextResponse.json({
      problems: parsedProblems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}

// POST /api/problems - Create a new problem (admin only)
const createProblemSchema = z.object({
  slug: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  category: z.string().min(1),
  companies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
    explanation: z.string().optional(),
  })).optional(),
  hints: z.array(z.string()).optional(),
  testCases: z.array(z.object({
    input: z.string(),
    expectedOutput: z.string(),
    isHidden: z.boolean().optional(),
  })).optional(),
  solution: z.string().optional(),
  solutionExplanation: z.string().optional(),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
  isPremium: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = createProblemSchema.parse(body);

    // Check for duplicate slug
    const existing = await prisma.problem.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A problem with this slug already exists' },
        { status: 409 }
      );
    }

    const problem = await prisma.problem.create({
      data: {
        slug: validated.slug,
        title: validated.title,
        description: validated.description,
        difficulty: validated.difficulty,
        category: validated.category,
        companies: JSON.stringify(validated.companies || []),
        tags: JSON.stringify(validated.tags || []),
        constraints: JSON.stringify(validated.constraints || []),
        examples: JSON.stringify(validated.examples || []),
        hints: JSON.stringify(validated.hints || []),
        testCases: JSON.stringify(validated.testCases || []),
        solution: validated.solution,
        solutionExplanation: validated.solutionExplanation,
        timeComplexity: validated.timeComplexity,
        spaceComplexity: validated.spaceComplexity,
        isPremium: validated.isPremium || false,
      },
    });

    return NextResponse.json({ problem }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creating problem:', error);
    return NextResponse.json(
      { error: 'Failed to create problem' },
      { status: 500 }
    );
  }
}
