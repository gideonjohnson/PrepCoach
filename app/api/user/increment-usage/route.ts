import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST /api/user/increment-usage - Increment usage counter
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { feature } = await request.json();

    if (!feature || !['interview', 'feedback'].includes(feature)) {
      return NextResponse.json(
        { error: 'Invalid feature parameter' },
        { status: 400 }
      );
    }

    const updateField = feature === 'interview'
      ? { interviewsThisMonth: { increment: 1 } }
      : { feedbackThisMonth: { increment: 1 } };

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateField,
      select: {
        interviewsThisMonth: true,
        feedbackThisMonth: true,
        subscriptionTier: true,
      }
    });

    return NextResponse.json({
      success: true,
      usage: {
        interviews: user.interviewsThisMonth,
        feedback: user.feedbackThisMonth,
      }
    });
  } catch (error) {
    console.error('Increment usage error:', error);
    return NextResponse.json(
      { error: 'Failed to increment usage' },
      { status: 500 }
    );
  }
}
