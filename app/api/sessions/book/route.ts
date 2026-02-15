import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { generateSessionAliases } from '@/lib/anonymous';

const bookingSchema = z.object({
  interviewerId: z.string(),
  sessionType: z.enum(['coding', 'system_design', 'behavioral', 'mock_full']),
  scheduledAt: z.string().datetime(),
  duration: z.number().min(30).max(120).default(60), // minutes
  isAnonymous: z.boolean().default(true),
  notes: z.string().max(500).optional(),
});

// POST /api/sessions/book - Book a session with an interviewer
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const validated = bookingSchema.parse(body);

    // Get interviewer
    const interviewer = await prisma.interviewer.findUnique({
      where: { id: validated.interviewerId },
    });

    if (!interviewer) {
      return NextResponse.json({ error: 'Interviewer not found' }, { status: 404 });
    }

    if (!interviewer.isActive || interviewer.verificationStatus !== 'verified') {
      return NextResponse.json(
        { error: 'Interviewer is not available' },
        { status: 400 }
      );
    }

    // Check if user is trying to book themselves
    if (interviewer.userId === userId) {
      return NextResponse.json(
        { error: 'You cannot book a session with yourself' },
        { status: 400 }
      );
    }

    const scheduledAt = new Date(validated.scheduledAt);

    // Check if scheduled time is in the future
    if (scheduledAt <= new Date()) {
      return NextResponse.json(
        { error: 'Scheduled time must be in the future' },
        { status: 400 }
      );
    }

    // Calculate price
    const pricePerHour = interviewer.ratePerHour;
    const totalAmount = Math.round(pricePerHour * (validated.duration / 60));
    const platformFee = Math.round(totalAmount * 0.15);
    const interviewerPayout = totalAmount - platformFee;

    // Generate anonymous names if needed
    const aliases = validated.isAnonymous ? generateSessionAliases() : null;
    const candidateAlias = aliases?.candidateAlias || 'Candidate';
    const interviewerAlias = aliases?.interviewerAlias || 'Interviewer';

    // Use serializable transaction to prevent race conditions on double-booking
    const endTime = new Date(scheduledAt.getTime() + validated.duration * 60 * 1000);

    const expertSession = await prisma.$transaction(async (tx) => {
      const conflictingSession = await tx.expertSession.findFirst({
        where: {
          interviewerId: validated.interviewerId,
          status: { in: ['scheduled', 'in_progress'] },
          OR: [
            {
              scheduledAt: {
                gte: scheduledAt,
                lt: endTime,
              },
            },
            {
              AND: [
                { scheduledAt: { lte: scheduledAt } },
                {
                  scheduledAt: {
                    gt: new Date(scheduledAt.getTime() - 120 * 60 * 1000), // 2 hour buffer
                  },
                },
              ],
            },
          ],
        },
      });

      if (conflictingSession) {
        throw new Error('SLOT_CONFLICT');
      }

      return tx.expertSession.create({
        data: {
          candidateId: userId,
          interviewerId: validated.interviewerId,
          sessionType: validated.sessionType,
          scheduledAt,
          duration: validated.duration,
          status: 'pending_payment',
          candidateAlias,
          interviewerAlias,
          priceInCents: totalAmount,
          payoutInCents: interviewerPayout,
        },
      });
    }, { isolationLevel: 'Serializable' });

    return NextResponse.json({
      session: expertSession,
      message: 'Session booked successfully. Please complete payment.',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message === 'SLOT_CONFLICT') {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 409 }
      );
    }
    console.error('Error booking session:', error);
    return NextResponse.json({ error: 'Failed to book session' }, { status: 500 });
  }
}

// GET /api/sessions/book - Get user's booked sessions
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') || 'candidate'; // candidate or interviewer
    const status = searchParams.get('status'); // upcoming, past, all

    const where: Record<string, unknown> = {};

    if (role === 'candidate') {
      where.candidateId = userId;
    } else {
      // Check if user is an interviewer
      const interviewer = await prisma.interviewer.findUnique({
        where: { userId },
      });
      if (!interviewer) {
        return NextResponse.json({ error: 'Not an interviewer' }, { status: 403 });
      }
      where.interviewerId = interviewer.id;
    }

    if (status === 'upcoming') {
      where.scheduledAt = { gte: new Date() };
      where.status = { in: ['scheduled', 'pending_payment'] };
    } else if (status === 'past') {
      where.OR = [
        { scheduledAt: { lt: new Date() } },
        { status: { in: ['completed', 'cancelled', 'no_show'] } },
      ];
    }

    const sessions = await prisma.expertSession.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: {
        interviewer: {
          select: {
            id: true,
            displayName: true,
            currentCompany: true,
            expertise: true,
            averageRating: true,
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Parse interviewer expertise
    const parsed = sessions.map((s) => ({
      ...s,
      interviewer: s.interviewer ? {
        ...s.interviewer,
        expertise: JSON.parse(s.interviewer.expertise),
      } : null,
    }));

    return NextResponse.json({ sessions: parsed });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
