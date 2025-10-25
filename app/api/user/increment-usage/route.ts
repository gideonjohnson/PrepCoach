import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { incrementUsageSchema, safeValidateData, formatZodError } from '@/lib/validation';

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

    const body = await request.json();

    // Validate input with Zod
    const validation = safeValidateData(incrementUsageSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formatZodError(validation.error),
        },
        { status: 400 }
      );
    }

    const { feature, amount } = validation.data;

    // Map feature names to database fields
    const featureFieldMap: Record<string, string> = {
      'ai_feedback': 'feedbackThisMonth',
      'transcription': 'feedbackThisMonth',
      'resume_transform': 'interviewsThisMonth', // Using interviews as general usage counter
      'interview_session': 'interviewsThisMonth',
      'linkedin_optimization': 'interviewsThisMonth',
      'career_roadmap': 'interviewsThisMonth',
    };

    const fieldToIncrement = featureFieldMap[feature] || 'interviewsThisMonth';

    const updateField = {
      [fieldToIncrement]: { increment: amount },
    };

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
