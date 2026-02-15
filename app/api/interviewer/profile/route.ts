import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// GET /api/interviewer/profile - Get own interviewer profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as { id: string }).id;

    const interviewer = await prisma.interviewer.findUnique({
      where: { userId },
      include: {
        expertSessions: {
          orderBy: { scheduledAt: 'desc' },
          take: 10,
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        payouts: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!interviewer) {
      return NextResponse.json(
        { error: 'Not registered as an interviewer' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      interviewer: {
        ...interviewer,
        previousCompanies: JSON.parse(interviewer.previousCompanies),
        expertise: JSON.parse(interviewer.expertise),
        specializations: JSON.parse(interviewer.specializations),
        languages: JSON.parse(interviewer.languages),
        availability: JSON.parse(interviewer.availability),
        customRates: JSON.parse(interviewer.customRates),
      },
    });
  } catch (error) {
    console.error('Error fetching interviewer profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

const updateSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  bio: z.string().max(1000).optional(),
  currentCompany: z.string().max(100).optional(),
  currentRole: z.string().max(100).optional(),
  previousCompanies: z.array(z.string()).optional(),
  yearsExperience: z.number().min(0).max(50).optional(),
  expertise: z.array(z.string()).optional(),
  specializations: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  timezone: z.string().optional(),
  ratePerHour: z.number().min(5000).max(100000).optional(),
  isActive: z.boolean().optional(),
  availability: z.array(z.object({
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    startTime: z.string(), // "09:00"
    endTime: z.string(),   // "17:00"
  })).optional(),
  customRates: z.record(z.number()).optional(),
});

// PATCH /api/interviewer/profile - Update own interviewer profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as { id: string }).id;

    const existing = await prisma.interviewer.findUnique({
      where: { userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Not registered as an interviewer' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validated = updateSchema.parse(body);

    // Can only activate if verified
    if (validated.isActive === true && existing.verificationStatus !== 'verified') {
      return NextResponse.json(
        { error: 'Cannot activate profile before verification is complete' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (validated.displayName !== undefined) updateData.displayName = validated.displayName;
    if (validated.bio !== undefined) updateData.bio = validated.bio;
    if (validated.currentCompany !== undefined) updateData.currentCompany = validated.currentCompany;
    if (validated.currentRole !== undefined) updateData.currentRole = validated.currentRole;
    if (validated.previousCompanies !== undefined) updateData.previousCompanies = JSON.stringify(validated.previousCompanies);
    if (validated.yearsExperience !== undefined) updateData.yearsExperience = validated.yearsExperience;
    if (validated.expertise !== undefined) updateData.expertise = JSON.stringify(validated.expertise);
    if (validated.specializations !== undefined) updateData.specializations = JSON.stringify(validated.specializations);
    if (validated.languages !== undefined) updateData.languages = JSON.stringify(validated.languages);
    if (validated.timezone !== undefined) updateData.timezone = validated.timezone;
    if (validated.ratePerHour !== undefined) updateData.ratePerHour = validated.ratePerHour;
    if (validated.isActive !== undefined) updateData.isActive = validated.isActive;
    if (validated.availability !== undefined) updateData.availability = JSON.stringify(validated.availability);
    if (validated.customRates !== undefined) updateData.customRates = JSON.stringify(validated.customRates);

    const updated = await prisma.interviewer.update({
      where: { userId },
      data: updateData,
    });

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
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error updating interviewer profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
