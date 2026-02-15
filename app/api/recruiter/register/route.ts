import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const registerSchema = z.object({
  companyName: z.string().min(2).max(100),
  companyWebsite: z.string().url().optional(),
  companyDescription: z.string().max(500).optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  recruiterName: z.string().min(2).max(100),
  recruiterTitle: z.string().max(100).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

// POST /api/recruiter/register - Register as a recruiter with company
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const validated = registerSchema.parse(body);

    // Check if user is already a recruiter
    const existingRecruiter = await prisma.recruiter.findUnique({
      where: { userId },
    });

    if (existingRecruiter) {
      return NextResponse.json(
        { error: 'You are already registered as a recruiter' },
        { status: 400 }
      );
    }

    // Check if company already exists by name
    let company = await prisma.recruiterCompany.findFirst({
      where: { name: validated.companyName },
    });

    if (!company) {
      // Create new company
      company = await prisma.recruiterCompany.create({
        data: {
          name: validated.companyName,
          website: validated.companyWebsite || null,
          description: validated.companyDescription || null,
          contactEmail: validated.contactEmail,
          contactPhone: validated.contactPhone || null,
          address: validated.address || null,
          city: validated.city || null,
          country: validated.country || null,
        },
      });
    }

    // Create recruiter profile
    const recruiter = await prisma.recruiter.create({
      data: {
        userId,
        companyId: company.id,
        name: validated.recruiterName,
        email: validated.contactEmail,
        phone: validated.contactPhone || null,
        title: validated.recruiterTitle || null,
        role: 'admin', // First recruiter for a company is admin
        canPurchaseCredits: true,
        canInviteTeam: true,
      },
    });

    // Update user role
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'recruiter' },
    });

    return NextResponse.json({
      recruiter,
      company,
      message: 'Registration successful! Your company is pending verification.',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error registering recruiter:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
