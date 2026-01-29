import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/recruiter/dashboard - Get recruiter dashboard data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId },
      include: {
        company: true,
      },
    });

    if (!recruiter) {
      return NextResponse.json({ error: 'Not a recruiter' }, { status: 403 });
    }

    // Get recent views
    const recentViews = await prisma.recruiterView.findMany({
      where: { recruiterId: recruiter.id },
      orderBy: { viewedAt: 'desc' },
      take: 10,
      include: {
        talentProfile: {
          select: {
            anonymousId: true,
            displayTitle: true,
            overallScore: true,
            seniorityLevel: true,
            availability: true,
          },
        },
      },
    });

    // Get active interview requests
    const activeRequests = await prisma.interviewRequest.findMany({
      where: {
        recruiterId: recruiter.id,
        status: { in: ['pending', 'accepted'] },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        talentProfile: {
          select: {
            anonymousId: true,
            displayTitle: true,
            overallScore: true,
          },
        },
      },
    });

    // Get stats
    const [totalViews, totalRequests, acceptedRequests] = await Promise.all([
      prisma.recruiterView.count({ where: { recruiterId: recruiter.id } }),
      prisma.interviewRequest.count({ where: { recruiterId: recruiter.id } }),
      prisma.interviewRequest.count({
        where: { recruiterId: recruiter.id, status: 'accepted' },
      }),
    ]);

    return NextResponse.json({
      recruiter,
      company: recruiter.company,
      stats: {
        creditBalance: recruiter.company.creditBalance,
        totalViews,
        totalRequests,
        acceptedRequests,
        responseRate: totalRequests > 0
          ? Math.round((acceptedRequests / totalRequests) * 100)
          : 0,
      },
      recentViews,
      activeRequests,
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
  }
}
