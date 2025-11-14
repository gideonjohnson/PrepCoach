export const PRICING_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '3 interview sessions per month',
      '5 AI feedback requests per month',
      'Access to all 500+ roles',
      'Audio recording & transcription',
      'Basic analytics',
    ],
    limits: {
      interviewsPerMonth: 3,
      feedbackPerMonth: 5,
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
  },
  lifetime: {
    name: 'Lifetime Pro',
    price: 0,
    interval: 'lifetime',
    features: [
      '🎉 LIFETIME ACCESS - No expiration!',
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
  interviewsThisMonth: number,
  feedbackThisMonth: number,
  feature: 'interview' | 'feedback'
): { allowed: boolean; reason?: string } {
  // Default to pro if tier is undefined or invalid
  const validTier = PRICING_TIERS[tier as keyof typeof PRICING_TIERS] ? tier : 'pro';
  const limits = PRICING_TIERS[validTier].limits;

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
