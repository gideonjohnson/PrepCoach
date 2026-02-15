import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/interviewers/[id]/availability - Get public availability for booking
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const interviewer = await prisma.interviewer.findUnique({
      where: { id },
      select: {
        id: true,
        timezone: true,
        availability: true,
        isActive: true,
        verificationStatus: true,
      },
    });

    if (!interviewer || !interviewer.isActive || interviewer.verificationStatus !== 'verified') {
      return NextResponse.json({ error: 'Interviewer not available' }, { status: 404 });
    }

    const slots = JSON.parse(interviewer.availability || '[]');

    // Get already booked sessions for the next 30 days
    const now = new Date();
    const thirtyDaysOut = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const bookedSessions = await prisma.expertSession.findMany({
      where: {
        interviewerId: id,
        status: { in: ['scheduled', 'in_progress'] },
        scheduledAt: {
          gte: now,
          lte: thirtyDaysOut,
        },
      },
      select: {
        scheduledAt: true,
        duration: true,
      },
    });

    // Convert booked sessions to blocked time ranges
    const blockedSlots = bookedSessions.map((s) => ({
      start: s.scheduledAt.toISOString(),
      end: new Date(s.scheduledAt.getTime() + s.duration * 60 * 1000).toISOString(),
    }));

    return NextResponse.json({
      timezone: interviewer.timezone,
      slots,
      blockedSlots,
    });
  } catch (error) {
    console.error('Error fetching interviewer availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
