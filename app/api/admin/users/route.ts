import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin status
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });

    if (!adminUser?.isAdmin) {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // Parse pagination params
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '50')), 100);
    const skip = (page - 1) * limit;

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          subscriptionTier: true,
          subscriptionStatus: true,
          subscriptionStart: true,
          subscriptionEnd: true,
          interviewsThisMonth: true,
          feedbackThisMonth: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to get users' },
      { status: 500 }
    );
  }
}
