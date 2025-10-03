export const PRICING_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    interval: 'forever',
    features: [
      '5 interview sessions per month',
      '10 AI feedback requests per month',
      'Access to all 350+ roles',
      'Audio recording & transcription',
      'Basic analytics dashboard',
      'Export results to CSV'
    ],
    limits: {
      interviewsPerMonth: 5,
      feedbackPerMonth: 10,
    }
  },
  pro: {
    name: 'Pro',
    price: 19,
    interval: 'month',
    features: [
      'Unlimited interview sessions',
      'Unlimited AI feedback',
      'Access to all 350+ roles',
      'Audio recording & transcription',
      'Advanced analytics & insights',
      'Export to PDF & CSV',
      'Priority support',
      'Custom role creation (coming soon)'
    ],
    limits: {
      interviewsPerMonth: -1, // unlimited
      feedbackPerMonth: -1, // unlimited
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Team management (up to 10 users)',
      'Company-specific interview prep',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced reporting & analytics',
      'SLA & 24/7 support',
      'Custom branding'
    ],
    limits: {
      interviewsPerMonth: -1, // unlimited
      feedbackPerMonth: -1, // unlimited
      teamMembers: 10
    }
  }
} as const;

export type SubscriptionTier = keyof typeof PRICING_TIERS;

export function canUseFeature(
  tier: SubscriptionTier,
  interviewsThisMonth: number,
  feedbackThisMonth: number,
  feature: 'interview' | 'feedback'
): { allowed: boolean; reason?: string } {
  const limits = PRICING_TIERS[tier].limits;

  if (feature === 'interview') {
    if (limits.interviewsPerMonth === -1) {
      return { allowed: true };
    }
    if (interviewsThisMonth >= limits.interviewsPerMonth) {
      return {
        allowed: false,
        reason: `You've reached your monthly limit of ${limits.interviewsPerMonth} interviews. Upgrade to Pro for unlimited access.`
      };
    }
    return { allowed: true };
  }

  if (feature === 'feedback') {
    if (limits.feedbackPerMonth === -1) {
      return { allowed: true };
    }
    if (feedbackThisMonth >= limits.feedbackPerMonth) {
      return {
        allowed: false,
        reason: `You've reached your monthly limit of ${limits.feedbackPerMonth} AI feedback requests. Upgrade to Pro for unlimited access.`
      };
    }
    return { allowed: true };
  }

  return { allowed: true };
}
