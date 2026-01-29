import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// GET /api/coding/session - List user's coding sessions
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    const sessions = await prisma.codingSession.findMany({
      where,
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
      take: limit,
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching coding sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// POST /api/coding/session - Create a new coding session
const createSessionSchema = z.object({
  problemId: z.string().optional(),
  language: z.string().default('javascript'),
  code: z.string().optional(),
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
    const validated = createSessionSchema.parse(body);

    // If problemId provided, verify it exists
    if (validated.problemId) {
      const problem = await prisma.problem.findUnique({
        where: { id: validated.problemId },
      });

      if (!problem) {
        return NextResponse.json(
          { error: 'Problem not found' },
          { status: 404 }
        );
      }
    }

    const codingSession = await prisma.codingSession.create({
      data: {
        userId: session.user.id,
        problemId: validated.problemId,
        language: validated.language,
        code: validated.code || '',
        status: 'active',
      },
      include: {
        problem: {
          select: {
            id: true,
            slug: true,
            title: true,
            difficulty: true,
            description: true,
            examples: true,
            constraints: true,
          },
        },
      },
    });

    // Parse problem JSON fields if present
    const response = {
      ...codingSession,
      problem: codingSession.problem ? {
        ...codingSession.problem,
        examples: JSON.parse(codingSession.problem.examples),
        constraints: JSON.parse(codingSession.problem.constraints),
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
    console.error('Error creating coding session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
