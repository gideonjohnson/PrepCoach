import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/interviewers/[id] - Get single interviewer profile
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
        displayName: true,
        bio: true,
        currentCompany: true,
        currentRole: true,
        previousCompanies: true,
        yearsExperience: true,
        expertise: true,
        specializations: true,
        languages: true,
        timezone: true,
        ratePerHour: true,
        averageRating: true,
        totalSessions: true,
        availability: true,
        verificationStatus: true,
        isActive: true,
        reviews: {
          where: { isPublic: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            overallRating: true,
            review: true,
            createdAt: true,
          },
        },
      },
    });

    if (!interviewer) {
      return NextResponse.json(
        { error: 'Interviewer not found' },
        { status: 404 }
      );
    }

    // Only show active, verified interviewers publicly
    if (interviewer.verificationStatus !== 'verified' || !interviewer.isActive) {
      return NextResponse.json(
        { error: 'Interviewer not available' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const parsed = {
      ...interviewer,
      previousCompanies: JSON.parse(interviewer.previousCompanies),
      expertise: JSON.parse(interviewer.expertise),
      specializations: JSON.parse(interviewer.specializations),
      languages: JSON.parse(interviewer.languages),
      availability: JSON.parse(interviewer.availability),
    };

    return NextResponse.json({ interviewer: parsed });
  } catch (error) {
    console.error('Error fetching interviewer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviewer' },
      { status: 500 }
    );
  }
}
