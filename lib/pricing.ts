// ============================================
// SUBSCRIPTION TIERS
// ============================================

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

export type FeatureType =
  | 'interview'
  | 'feedback'
  | 'coding_session'
  | 'system_design'
  | 'job_description'
  | 'recording';

// Phase 1 feature limits per tier
const PHASE1_LIMITS: Record<string, Record<string, number>> = {
  free: {
    coding_session: 3,     // 3 coding sessions per month
    system_design: 2,      // 2 system design sessions per month
    job_description: 2,    // 2 JD analyses per month
    recording: 1,          // 1 recording per month
  },
  pro: {
    coding_session: -1,    // unlimited
    system_design: -1,
    job_description: -1,
    recording: -1,
  },
  enterprise: {
    coding_session: -1,
    system_design: -1,
    job_description: -1,
    recording: -1,
  },
  lifetime: {
    coding_session: -1,
    system_design: -1,
    job_description: -1,
    recording: -1,
  },
};

export function canUseFeature(
  tier: SubscriptionTier,
  interviewsThisPeriod: number,
  feedbackThisMonth: number,
  feature: FeatureType,
  featureUsageThisMonth?: number
): { allowed: boolean; reason?: string } {
  // Default to pro if tier is undefined or invalid
  const validTier = PRICING_TIERS[tier as keyof typeof PRICING_TIERS] ? tier : 'pro';
  const limits = PRICING_TIERS[validTier].limits as Record<string, number>;

  if (feature === 'interview') {
    if (limits.interviewsPerMonth === -1) {
      return { allowed: true };
    }
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

  // Phase 1 features
  const phase1Features: FeatureType[] = ['coding_session', 'system_design', 'job_description', 'recording'];
  if (phase1Features.includes(feature)) {
    const tierLimits = PHASE1_LIMITS[validTier] || PHASE1_LIMITS.free;
    const limit = tierLimits[feature];

    if (limit === -1) {
      return { allowed: true };
    }

    const usage = featureUsageThisMonth ?? 0;
    if (usage >= limit) {
      const featureNames: Record<string, string> = {
        coding_session: 'coding sessions',
        system_design: 'system design sessions',
        job_description: 'job description analyses',
        recording: 'session recordings',
      };
      return {
        allowed: false,
        reason: `You've reached your monthly limit of ${limit} ${featureNames[feature]}. Upgrade to Pro for unlimited access.`
      };
    }
    return { allowed: true };
  }

  return { allowed: true };
}

// ============================================
// PHASE 2: EXPERT SESSION PRICING
// ============================================

export const EXPERT_SESSION_PRICING = {
  coding_30min: {
    name: '30-min Coding Interview',
    duration: 30,
    price: 7500, // $75
    interviewerPayout: 6000, // $60 (80% to interviewer)
    description: 'Live coding interview with a FAANG engineer',
  },
  coding_60min: {
    name: '60-min Coding Interview',
    duration: 60,
    price: 12500, // $125
    interviewerPayout: 10000, // $100
    description: 'Full-length coding interview with comprehensive feedback',
  },
  system_design_60min: {
    name: '60-min System Design',
    duration: 60,
    price: 15000, // $150
    interviewerPayout: 12000, // $120
    description: 'System design interview with a senior/staff engineer',
  },
  behavioral_30min: {
    name: '30-min Behavioral Interview',
    duration: 30,
    price: 5000, // $50
    interviewerPayout: 4000, // $40
    description: 'Behavioral interview with structured feedback',
  },
  behavioral_60min: {
    name: '60-min Behavioral Interview',
    duration: 60,
    price: 8500, // $85
    interviewerPayout: 7000, // $70
    description: 'Comprehensive behavioral interview with in-depth feedback',
  },
  em_60min: {
    name: '60-min Engineering Manager',
    duration: 60,
    price: 17500, // $175
    interviewerPayout: 14000, // $140
    description: 'EM interview with a current engineering manager',
  },
  staff_plus_60min: {
    name: '60-min Staff+ Interview',
    duration: 60,
    price: 25000, // $250
    interviewerPayout: 20000, // $200
    description: 'Staff/Principal level interview with deep technical discussion',
  },
} as const;

export type ExpertSessionType = keyof typeof EXPERT_SESSION_PRICING;

// ============================================
// PHASE 2: COACHING PACKAGES
// ============================================

export const COACHING_PACKAGES = {
  '3_session': {
    name: 'Starter Package',
    sessions: 3,
    price: 19900, // $199
    savings: '15%',
    description: 'Perfect for targeted practice on specific areas',
    validityDays: 180, // 6 months
  },
  '5_session': {
    name: 'Growth Package',
    sessions: 5,
    price: 29900, // $299
    savings: '20%',
    description: 'Comprehensive prep covering multiple interview types',
    validityDays: 180,
  },
  '10_session': {
    name: 'Premium Package',
    sessions: 10,
    price: 49900, // $499
    savings: '30%',
    description: 'Full interview prep with extensive practice',
    validityDays: 180,
  },
} as const;

export type CoachingPackageType = keyof typeof COACHING_PACKAGES;

// ============================================
// PHASE 3: MARKETPLACE CREDITS
// ============================================

export const MARKETPLACE_CREDITS = {
  // Cost per action
  interview_request: 1, // 1 credit per interview request
  profile_unlock: 0, // Viewing profiles is free, requesting interview costs credit

  // Credit packs
  credit_packs: {
    starter: {
      name: 'Starter Pack',
      credits: 5,
      price: 250000, // $2,500
      pricePerCredit: 50000, // $500/credit
      description: 'For small teams starting to hire',
    },
    growth: {
      name: 'Growth Pack',
      credits: 12,
      price: 500000, // $5,000
      pricePerCredit: 41667, // ~$417/credit
      savings: '17%',
      description: 'For growing teams with active hiring',
    },
    enterprise: {
      name: 'Enterprise Pack',
      credits: 30,
      price: 1000000, // $10,000
      pricePerCredit: 33333, // ~$333/credit
      savings: '33%',
      description: 'For large-scale hiring initiatives',
    },
  },
} as const;

export type CreditPackType = keyof typeof MARKETPLACE_CREDITS['credit_packs'];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getExpertSessionPrice(sessionType: ExpertSessionType): {
  price: number;
  interviewerPayout: number;
  platformFee: number;
} {
  const session = EXPERT_SESSION_PRICING[sessionType];
  return {
    price: session.price,
    interviewerPayout: session.interviewerPayout,
    platformFee: session.price - session.interviewerPayout,
  };
}

export function getCoachingPackagePrice(packageType: CoachingPackageType): {
  totalPrice: number;
  pricePerSession: number;
  sessions: number;
} {
  const pkg = COACHING_PACKAGES[packageType];
  return {
    totalPrice: pkg.price,
    pricePerSession: Math.round(pkg.price / pkg.sessions),
    sessions: pkg.sessions,
  };
}

export function getCreditPackPrice(packType: CreditPackType): {
  totalPrice: number;
  credits: number;
  pricePerCredit: number;
} {
  const pack = MARKETPLACE_CREDITS.credit_packs[packType];
  return {
    totalPrice: pack.price,
    credits: pack.credits,
    pricePerCredit: pack.pricePerCredit,
  };
}

export function calculateMarketplaceCreditCost(action: 'interview_request'): number {
  return MARKETPLACE_CREDITS[action];
}
