export const PRICING_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '3 questions per 2 weeks',
      '3 AI feedback requests per month',
      'Access to all 500+ roles',
      'Audio recording & transcription',
      'Basic analytics',
    ],
    limits: {
      interviewsPerTwoWeeks: 3,
      feedbackPerMonth: 3,
    }
  },
  pro: {
    name: 'Pro',
    price: 25,
    interval: 'month',
    currency: 'USD',
    features: [
      'Unlimited interview sessions',
      'Unlimited AI feedback',
      'Access to all 500+ roles',
      'Audio recording & transcription',
      'Advanced analytics & insights',
      'Export to PDF & CSV',
      'Priority support',
      'AI Resume Builder',
      'Custom role creation (coming soon)'
    ],
    limits: {
      interviewsPerMonth: -1, // unlimited
      feedbackPerMonth: -1, // unlimited,
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 65,
    interval: 'month',
    currency: 'USD',
    features: [
      'Everything in Pro',
      'Team management (up to 4 users)',
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
      teamMembers: 4
    }
  },
  lifetime: {
    name: 'Lifetime Pro',
    price: 0,
    interval: 'lifetime',
    features: [
      'LIFETIME ACCESS - No expiration!',
      'Unlimited interview sessions forever',
      'Unlimited AI feedback forever',
      'Access to all 350+ roles',
      'Audio recording & transcription',
      'Advanced analytics & insights',
      'Export to PDF & CSV',
      'Priority support',
      'All future features included',
      'Celebrity AI interviewers',
      'ATS resume optimization',
      'Resume builder with AI'
    ],
    limits: {
      interviewsPerMonth: -1, // unlimited
      feedbackPerMonth: -1, // unlimited
    }
  }
} as const;

export type SubscriptionTier = keyof typeof PRICING_TIERS;

export function canUseFeature(
  tier: SubscriptionTier,
  interviewsThisPeriod: number,
  feedbackThisMonth: number,
  feature: 'interview' | 'feedback'
): { allowed: boolean; reason?: string } {
  // Default to pro if tier is undefined or invalid
  const validTier = PRICING_TIERS[tier as keyof typeof PRICING_TIERS] ? tier : 'pro';
  const limits = PRICING_TIERS[validTier].limits as Record<string, number>;

  if (feature === 'interview') {
    // Check for unlimited (pro/enterprise)
    if (limits.interviewsPerMonth === -1) {
      return { allowed: true };
    }
    // Check for 2-week limit (free tier)
    if (limits.interviewsPerTwoWeeks !== undefined) {
      if (interviewsThisPeriod >= limits.interviewsPerTwoWeeks) {
        return {
          allowed: false,
          reason: `You've reached your limit of ${limits.interviewsPerTwoWeeks} questions per 2 weeks. Upgrade to Pro for unlimited access.`
        };
      }
      return { allowed: true };
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
