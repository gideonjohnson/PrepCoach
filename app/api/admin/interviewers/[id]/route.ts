import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  verificationStatus: z.enum(['pending', 'verified', 'rejected']).optional(),
  verificationNotes: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/admin/interviewers/[id] - Get single interviewer details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const interviewer = await prisma.interviewer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
        expertSessions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!interviewer) {
      return NextResponse.json({ error: 'Interviewer not found' }, { status: 404 });
    }

    const parsed = {
      ...interviewer,
      previousCompanies: JSON.parse(interviewer.previousCompanies),
      expertise: JSON.parse(interviewer.expertise),
      specializations: JSON.parse(interviewer.specializations),
      languages: JSON.parse(interviewer.languages),
      availability: JSON.parse(interviewer.availability),
      customRates: JSON.parse(interviewer.customRates),
    };

    return NextResponse.json({ interviewer: parsed });
  } catch (error) {
    console.error('Error fetching interviewer:', error);
    return NextResponse.json({ error: 'Failed to fetch interviewer' }, { status: 500 });
  }
}

// PATCH /api/admin/interviewers/[id] - Update interviewer (verify/reject)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const validated = updateSchema.parse(body);

    const interviewer = await prisma.interviewer.findUnique({
      where: { id },
    });

    if (!interviewer) {
      return NextResponse.json({ error: 'Interviewer not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (validated.verificationStatus !== undefined) {
      updateData.verificationStatus = validated.verificationStatus;

      // If verified, allow activation
      if (validated.verificationStatus === 'verified') {
        updateData.isActive = true;
      }

      // If rejected, deactivate
      if (validated.verificationStatus === 'rejected') {
        updateData.isActive = false;
      }
    }

    if (validated.verificationNotes !== undefined) {
      updateData.verificationNotes = validated.verificationNotes;
    }

    if (validated.isActive !== undefined) {
      // Can only activate if verified
      if (validated.isActive && interviewer.verificationStatus !== 'verified') {
        return NextResponse.json(
          { error: 'Cannot activate unverified interviewer' },
          { status: 400 }
        );
      }
      updateData.isActive = validated.isActive;
    }

    const updated = await prisma.interviewer.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // TODO: Send email notification to interviewer about verification status

    return NextResponse.json({
      interviewer: {
        ...updated,
        previousCompanies: JSON.parse(updated.previousCompanies),
        expertise: JSON.parse(updated.expertise),
        specializations: JSON.parse(updated.specializations),
        languages: JSON.parse(updated.languages),
        availability: JSON.parse(updated.availability),
        customRates: JSON.parse(updated.customRates),
      },
      message: `Interviewer ${validated.verificationStatus === 'verified' ? 'verified' : validated.verificationStatus === 'rejected' ? 'rejected' : 'updated'} successfully`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error updating interviewer:', error);
    return NextResponse.json({ error: 'Failed to update interviewer' }, { status: 500 });
  }
}
