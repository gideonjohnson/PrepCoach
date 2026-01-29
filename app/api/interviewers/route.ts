import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/interviewers - List active, verified interviewers
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const expertise = searchParams.get('expertise');
    const minRate = searchParams.get('minRate');
    const maxRate = searchParams.get('maxRate');
    const language = searchParams.get('language');
    const company = searchParams.get('company');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') || 'rating'; // rating, rate, sessions

    const where: Record<string, unknown> = {
      isActive: true,
      verificationStatus: 'verified',
    };

    // Filter by expertise (stored as JSON string)
    if (expertise) {
      where.expertise = { contains: expertise };
    }

    // Filter by rate
    if (minRate) {
      where.ratePerHour = { ...((where.ratePerHour as object) || {}), gte: parseInt(minRate) };
    }
    if (maxRate) {
      where.ratePerHour = { ...((where.ratePerHour as object) || {}), lte: parseInt(maxRate) };
    }

    // Filter by language
    if (language) {
      where.languages = { contains: language };
    }

    // Filter by previous company
    if (company) {
      where.previousCompanies = { contains: company };
    }

    // Get total count for pagination
    const total = await prisma.interviewer.count({ where });

    // Build order by
    let orderBy: Record<string, string> = { averageRating: 'desc' };
    if (sortBy === 'rate') {
      orderBy = { ratePerHour: 'asc' };
    } else if (sortBy === 'sessions') {
      orderBy = { totalSessions: 'desc' };
    } else if (sortBy === 'experience') {
      orderBy = { yearsExperience: 'desc' };
    }

    const interviewers = await prisma.interviewer.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
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
      },
    });

    // Parse JSON fields
    const parsed = interviewers.map((i) => ({
      ...i,
      previousCompanies: JSON.parse(i.previousCompanies),
      expertise: JSON.parse(i.expertise),
      specializations: JSON.parse(i.specializations),
      languages: JSON.parse(i.languages),
      availability: JSON.parse(i.availability),
    }));

    return NextResponse.json({
      interviewers: parsed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching interviewers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviewers' },
      { status: 500 }
    );
  }
}
