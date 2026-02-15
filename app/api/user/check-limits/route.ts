import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canUseFeature, PRICING_TIERS, SubscriptionTier, FeatureType } from '@/lib/pricing';

const VALID_FEATURES: FeatureType[] = [
  'interview', 'feedback', 'coding_session', 'system_design',
  'job_description', 'recording', 'resume', 'linkedin', 'export',
];

// GET /api/user/check-limits - Check if user can use a feature
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const feature = searchParams.get('feature') as FeatureType;

    if (!feature || !VALID_FEATURES.includes(feature)) {
      return NextResponse.json(
        { error: 'Invalid feature parameter. Valid: ' + VALID_FEATURES.join(', ') },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionTier: true,
        interviewsThisMonth: true,
        feedbackThisMonth: true,
        lastResetDate: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const tier = (user.subscriptionTier || 'free') as SubscriptionTier;
    const tierConfig = PRICING_TIERS[tier as keyof typeof PRICING_TIERS];

    // For free tier, questions don't reset (total lifetime limit)
    // For paid tiers, no limits apply
    const questionsUsed = user.interviewsThisMonth;
    const feedbackThisMonth = user.feedbackThisMonth;

    // Count distinct roles used (for free tier role lock)
    let currentRoleCount = 0;
    if (tier === 'free') {
      const distinctRoles = await prisma.interviewSession.groupBy({
        by: ['roleTitle'],
        where: { userId: session.user.id },
      });
      currentRoleCount = distinctRoles.length;
    }

    const result = canUseFeature(
      tier,
      questionsUsed,
      feedbackThisMonth,
      feature,
      undefined,
      currentRoleCount
    );

    return NextResponse.json({
      allowed: result.allowed,
      reason: result.reason,
      usage: {
        questions: {
          used: questionsUsed,
          limit: tierConfig ? (tierConfig.limits.questionsTotal as number) : 3,
          unlimited: tierConfig ? (tierConfig.limits.questionsTotal as number) === -1 : false,
        },
        feedback: {
          available: tierConfig ? !!tierConfig.limits.aiFeedback : false,
        },
        rolesUsed: currentRoleCount,
      },
      tier,
    });
  } catch (error) {
    console.error('Check limits error:', error);
    return NextResponse.json(
      { error: 'Failed to check limits' },
      { status: 500 }
    );
  }
}
