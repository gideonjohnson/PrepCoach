import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canUseFeature, PRICING_TIERS, SubscriptionTier } from '@/lib/pricing';

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
    const feature = searchParams.get('feature') as 'interview' | 'feedback';

    if (!feature || !['interview', 'feedback'].includes(feature)) {
      return NextResponse.json(
        { error: 'Invalid feature parameter' },
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

    // Check if usage needs to be reset (new month)
    const now = new Date();
    const lastReset = new Date(user.lastResetDate);
    const shouldReset = now.getMonth() !== lastReset.getMonth() ||
                        now.getFullYear() !== lastReset.getFullYear();

    let interviewsThisMonth = user.interviewsThisMonth;
    let feedbackThisMonth = user.feedbackThisMonth;

    if (shouldReset) {
      // Reset usage counters
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          interviewsThisMonth: 0,
          feedbackThisMonth: 0,
          lastResetDate: now,
        }
      });
      interviewsThisMonth = 0;
      feedbackThisMonth = 0;
    }

    const result = canUseFeature(
      user.subscriptionTier as SubscriptionTier,
      interviewsThisMonth,
      feedbackThisMonth,
      feature
    );

    const tier = PRICING_TIERS[user.subscriptionTier as keyof typeof PRICING_TIERS];

    return NextResponse.json({
      allowed: result.allowed,
      reason: result.reason,
      usage: {
        interviews: {
          used: interviewsThisMonth,
          limit: 'interviewsPerMonth' in tier.limits ? tier.limits.interviewsPerMonth : ('interviewsPerTwoWeeks' in tier.limits ? tier.limits.interviewsPerTwoWeeks : 0),
          unlimited: 'interviewsPerMonth' in tier.limits && tier.limits.interviewsPerMonth === -1
        },
        feedback: {
          used: feedbackThisMonth,
          limit: tier.limits.feedbackPerMonth,
          unlimited: tier.limits.feedbackPerMonth === -1
        }
      },
      tier: user.subscriptionTier
    });
  } catch (error) {
    console.error('Check limits error:', error);
    return NextResponse.json(
      { error: 'Failed to check limits' },
      { status: 500 }
    );
  }
}
