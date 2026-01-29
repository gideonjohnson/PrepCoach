import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// GET /api/system-design - List system design problems or sessions
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'problems'; // problems or sessions

    if (type === 'sessions') {
      // List user's sessions - requires auth
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const sessions = await prisma.systemDesignSession.findMany({
        where: { userId: session.user.id },
        include: {
          problem: {
            select: {
              id: true,
              slug: true,
              title: true,
              difficulty: true,
              category: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      return NextResponse.json({ sessions });
    }

    // List problems
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');

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

    const problems = await prisma.systemDesignProblem.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        difficulty: true,
        category: true,
        companies: true,
        tags: true,
        isPremium: true,
        totalAttempts: true,
      },
      orderBy: [
        { difficulty: 'asc' },
        { title: 'asc' },
      ],
    });

    const parsedProblems = problems.map(p => ({
      ...p,
      companies: JSON.parse(p.companies),
      tags: JSON.parse(p.tags),
    }));

    return NextResponse.json({ problems: parsedProblems });
  } catch (error) {
    console.error('Error fetching system design data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST /api/system-design - Create a new session or problem
const createSessionSchema = z.object({
  problemId: z.string().optional(),
});

const createProblemSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  category: z.string(),
  companies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  functionalReqs: z.array(z.string()).optional(),
  nonFunctionalReqs: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
  keyComponents: z.array(z.string()).optional(),
  rubric: z.array(z.object({
    criterion: z.string(),
    maxPoints: z.number(),
    description: z.string(),
  })).optional(),
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

    const body = await req.json();

    // Check if creating a problem (admin) or session (user)
    if (body.slug) {
      // Creating a problem - admin only
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

      const validated = createProblemSchema.parse(body);

      const problem = await prisma.systemDesignProblem.create({
        data: {
          slug: validated.slug,
          title: validated.title,
          description: validated.description,
          difficulty: validated.difficulty,
          category: validated.category,
          companies: JSON.stringify(validated.companies || []),
          tags: JSON.stringify(validated.tags || []),
          functionalReqs: JSON.stringify(validated.functionalReqs || []),
          nonFunctionalReqs: JSON.stringify(validated.nonFunctionalReqs || []),
          constraints: JSON.stringify(validated.constraints || []),
          keyComponents: JSON.stringify(validated.keyComponents || []),
          rubric: JSON.stringify(validated.rubric || []),
          isPremium: validated.isPremium || false,
        },
      });

      return NextResponse.json({ problem }, { status: 201 });
    }

    // Creating a session
    const validated = createSessionSchema.parse(body);

    // Verify problem exists if provided
    if (validated.problemId) {
      const problem = await prisma.systemDesignProblem.findUnique({
        where: { id: validated.problemId },
      });

      if (!problem) {
        return NextResponse.json(
          { error: 'Problem not found' },
          { status: 404 }
        );
      }
    }

    const designSession = await prisma.systemDesignSession.create({
      data: {
        userId: session.user.id,
        problemId: validated.problemId,
        status: 'active',
      },
      include: {
        problem: true,
      },
    });

    // Parse problem JSON if present
    const response = {
      ...designSession,
      problem: designSession.problem ? {
        ...designSession.problem,
        companies: JSON.parse(designSession.problem.companies),
        tags: JSON.parse(designSession.problem.tags),
        functionalReqs: JSON.parse(designSession.problem.functionalReqs),
        nonFunctionalReqs: JSON.parse(designSession.problem.nonFunctionalReqs),
        constraints: JSON.parse(designSession.problem.constraints),
        keyComponents: JSON.parse(designSession.problem.keyComponents),
        rubric: JSON.parse(designSession.problem.rubric),
      } : null,
    };

    return NextResponse.json({ session: response }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating system design resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
