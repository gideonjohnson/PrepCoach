import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const registerSchema = z.object({
  displayName: z.string().min(2).max(50),
  bio: z.string().max(1000).optional(),
  currentCompany: z.string().max(100).optional(),
  currentRole: z.string().max(100).optional(),
  previousCompanies: z.array(z.string()).default([]),
  yearsExperience: z.number().min(0).max(50),
  expertise: z.array(z.enum([
    'coding', 'system_design', 'behavioral', 'engineering_management',
    'frontend', 'backend', 'mobile', 'data_engineering', 'ml_ai',
  ])).min(1),
  specializations: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  linkedinUrl: z.string().url().optional(),
  timezone: z.string().default('UTC'),
  ratePerHour: z.number().min(5000).max(100000).default(10000), // $50-$1000 in cents
});

// POST /api/interviewer/register - Register as an interviewer
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as { id: string }).id;

    // Check if already registered
    const existing = await prisma.interviewer.findUnique({
      where: { userId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already registered as an interviewer' },
        { status: 409 }
      );
    }

    const body = await req.json();
    const validated = registerSchema.parse(body);

    // Create interviewer profile
    const interviewer = await prisma.interviewer.create({
      data: {
        userId,
        displayName: validated.displayName,
        bio: validated.bio || null,
        currentCompany: validated.currentCompany || null,
        currentRole: validated.currentRole || null,
        previousCompanies: JSON.stringify(validated.previousCompanies),
        yearsExperience: validated.yearsExperience,
        expertise: JSON.stringify(validated.expertise),
        specializations: JSON.stringify(validated.specializations),
        languages: JSON.stringify(validated.languages),
        linkedinUrl: validated.linkedinUrl || null,
        timezone: validated.timezone,
        ratePerHour: validated.ratePerHour,
        verificationStatus: 'pending',
        isActive: false, // Must be verified first
      },
    });

    // Update user role
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'interviewer' },
    });

    return NextResponse.json({
      interviewer: {
        ...interviewer,
        previousCompanies: validated.previousCompanies,
        expertise: validated.expertise,
        specializations: validated.specializations,
        languages: validated.languages,
      },
      message: 'Registration submitted. Your profile is pending verification.',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error registering interviewer:', error);
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    );
  }
}
