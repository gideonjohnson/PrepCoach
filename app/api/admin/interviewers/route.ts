import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/interviewers - List all interviewers for admin
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userId = (session.user as { id: string }).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};
    if (status !== 'all') {
      where.verificationStatus = status;
    }

    const total = await prisma.interviewer.count({ where });

    const interviewers = await prisma.interviewer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
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
      },
    });

    const parsed = interviewers.map((i) => ({
      ...i,
      previousCompanies: JSON.parse(i.previousCompanies),
      expertise: JSON.parse(i.expertise),
      specializations: JSON.parse(i.specializations),
      languages: JSON.parse(i.languages),
      availability: JSON.parse(i.availability),
      customRates: JSON.parse(i.customRates),
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
    console.error('Error fetching interviewers for admin:', error);
    return NextResponse.json({ error: 'Failed to fetch interviewers' }, { status: 500 });
  }
}
