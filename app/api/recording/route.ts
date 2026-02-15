import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// GET /api/recording - List user's recordings
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
    const sessionType = searchParams.get('sessionType');
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (sessionType) {
      where.sessionType = sessionType;
    }

    if (status) {
      where.status = status;
    }

    const recordings = await prisma.sessionRecording.findMany({
      where,
      include: {
        interviewSession: {
          select: {
            id: true,
            roleTitle: true,
            roleCategory: true,
            company: true,
            date: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Parse timestamps JSON
    const parsedRecordings = recordings.map(r => ({
      ...r,
      timestamps: JSON.parse(r.timestamps),
    }));

    return NextResponse.json({ recordings: parsedRecordings });
  } catch (error) {
    console.error('Error fetching recordings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recordings' },
      { status: 500 }
    );
  }
}

// POST /api/recording - Start a new recording
const createRecordingSchema = z.object({
  sessionId: z.string(),
  sessionType: z.enum(['interview', 'coding', 'system_design']),
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
    const validated = createRecordingSchema.parse(body);

    // Verify session exists and belongs to user
    let sessionOwnerId: string | null = null;

    if (validated.sessionType === 'coding') {
      const codingSess = await prisma.codingSession.findUnique({
        where: { id: validated.sessionId },
        select: { userId: true },
      });
      sessionOwnerId = codingSess?.userId || null;
    } else if (validated.sessionType === 'system_design') {
      const designSess = await prisma.systemDesignSession.findUnique({
        where: { id: validated.sessionId },
        select: { userId: true },
      });
      sessionOwnerId = designSess?.userId || null;
    } else {
      const interviewSession = await prisma.interviewSession.findUnique({
        where: { id: validated.sessionId },
        select: { userId: true },
      });
      sessionOwnerId = interviewSession?.userId || null;
    }

    if (!sessionOwnerId) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (sessionOwnerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if recording already exists for this session
    const existingRecording = await prisma.sessionRecording.findUnique({
      where: { sessionId: validated.sessionId },
    });

    if (existingRecording) {
      return NextResponse.json(
        { error: 'Recording already exists for this session' },
        { status: 409 }
      );
    }

    const recording = await prisma.sessionRecording.create({
      data: {
        userId: session.user.id,
        sessionId: validated.sessionId,
        sessionType: validated.sessionType,
        status: 'processing',
      },
    });

    return NextResponse.json({ recording }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creating recording:', error);
    return NextResponse.json(
      { error: 'Failed to create recording' },
      { status: 500 }
    );
  }
}
