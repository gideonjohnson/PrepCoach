import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const availabilitySlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6), // 0=Sunday, 6=Saturday
  startTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM format
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  isRecurring: z.boolean().default(true),
});

const availabilityUpdateSchema = z.object({
  timezone: z.string().optional(),
  slots: z.array(availabilitySlotSchema),
});

// GET /api/interviewer/availability - Get interviewer's availability
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const interviewer = await prisma.interviewer.findUnique({
      where: { userId },
      select: {
        id: true,
        timezone: true,
        availability: true,
        isActive: true,
      },
    });

    if (!interviewer) {
      return NextResponse.json({ error: 'Not an interviewer' }, { status: 403 });
    }

    const slots = JSON.parse(interviewer.availability || '[]');

    return NextResponse.json({
      timezone: interviewer.timezone,
      slots,
      isActive: interviewer.isActive,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

// PUT /api/interviewer/availability - Update availability
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const validated = availabilityUpdateSchema.parse(body);

    // Validate that end times are after start times
    for (const slot of validated.slots) {
      if (slot.startTime >= slot.endTime) {
        return NextResponse.json(
          { error: `Invalid slot: ${slot.startTime} must be before ${slot.endTime}` },
          { status: 400 }
        );
      }
    }

    const interviewer = await prisma.interviewer.findUnique({
      where: { userId },
    });

    if (!interviewer) {
      return NextResponse.json({ error: 'Not an interviewer' }, { status: 403 });
    }

    const updated = await prisma.interviewer.update({
      where: { userId },
      data: {
        availability: JSON.stringify(validated.slots),
        ...(validated.timezone && { timezone: validated.timezone }),
      },
    });

    return NextResponse.json({
      timezone: updated.timezone,
      slots: JSON.parse(updated.availability),
      message: 'Availability updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error updating availability:', error);
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
  }
}
