// ============================================
// JOB SEEKER SUBSCRIPTION TIERS
// ============================================

export const PRICING_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '3 questions total',
      '1 role only',
      'Basic question practice',
    ],
    limits: {
      questionsTotal: 3,
      rolesAllowed: 1,
      aiFeedback: false,
      coding: false,
      systemDesign: false,
      resume: false,
      linkedin: false,
      jdAnalysis: false,
      recording: false,
      export: false,
    }
  },
  pro: {
    name: 'Pro',
    price: 19,
    interval: 'month',
    currency: 'USD',
    features: [
      'Unlimited interview sessions',
      'Unlimited AI feedback',
      'Access to all 500+ roles',
      'Coding interview practice',
      'System design practice',
      'Audio recording & transcription',
      'AI Resume Builder',
      'LinkedIn Optimizer',
      'JD Analysis',
      'Export to PDF & CSV',
      'Advanced analytics & insights',
      'Priority support',
    ],
    limits: {
      questionsTotal: -1, // unlimited
      rolesAllowed: -1, // unlimited
      aiFeedback: true,
      coding: true,
      systemDesign: true,
      resume: true,
      linkedin: true,
      jdAnalysis: true,
      recording: true,
      export: true,
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 59,
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
      'Custom branding',
    ],
    limits: {
      questionsTotal: -1, // unlimited
      rolesAllowed: -1, // unlimited
      aiFeedback: true,
      coding: true,
      systemDesign: true,
      resume: true,
      linkedin: true,
      jdAnalysis: true,
      recording: true,
      export: true,
      teamMembers: 4,
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
      'Access to all 500+ roles',
      'Audio recording & transcription',
      'Advanced analytics & insights',
      'Export to PDF & CSV',
      'Priority support',
      'All future features included',
    ],
    limits: {
      questionsTotal: -1,
      rolesAllowed: -1,
      aiFeedback: true,
      coding: true,
      systemDesign: true,
      resume: true,
      linkedin: true,
      jdAnalysis: true,
      recording: true,
      export: true,
    }
  }
} as const;

export type SubscriptionTier = keyof typeof PRICING_TIERS;

// ============================================
// INTERVIEWER LISTING TIERS
// ============================================

export const INTERVIEWER_TIERS = {
  interviewer_basic: {
    name: 'Basic',
    price: 19,
    interval: 'month',
    currency: 'USD',
    features: [
      'Listed in interviewer directory',
      'Up to 5 active listings',
      'Basic profile badge',
      'Standard search ranking',
    ],
    limits: {
      activeListings: 5,
      featuredPlacement: false,
      prioritySupport: false,
      analyticsDashboard: false,
    },
  },
  interviewer_featured: {
    name: 'Featured',
    price: 39,
    interval: 'month',
    currency: 'USD',
    popular: true,
    features: [
      'Everything in Basic',
      'Up to 15 active listings',
      'Featured badge & highlight',
      'Boosted search ranking',
      'Analytics dashboard',
    ],
    limits: {
      activeListings: 15,
      featuredPlacement: true,
      prioritySupport: false,
      analyticsDashboard: true,
    },
  },
  interviewer_premium: {
    name: 'Premium',
    price: 79,
    interval: 'month',
    currency: 'USD',
    features: [
      'Everything in Featured',
      'Unlimited active listings',
      'Premium badge & top placement',
      'Priority support',
      'Advanced analytics dashboard',
      'Custom profile URL',
    ],
    limits: {
      activeListings: -1, // unlimited
      featuredPlacement: true,
      prioritySupport: true,
      analyticsDashboard: true,
    },
  },
} as const;

export type InterviewerTier = keyof typeof INTERVIEWER_TIERS;

// ============================================
// RECRUITER SUBSCRIPTION TIERS
// ============================================

export const RECRUITER_TIERS = {
  recruiter_starter: {
    name: 'Starter',
    price: 50,
    interval: 'month',
    currency: 'USD',
    credits: 3,
    extraCreditPrice: 20, // $20 per extra credit
    features: [
      '3 candidate credits/month',
      'Browse candidate profiles',
      'Basic search filters',
      'Email support',
    ],
  },
  recruiter_growth: {
    name: 'Growth',
    price: 75,
    interval: 'month',
    currency: 'USD',
    credits: 8,
    extraCreditPrice: 15,
    popular: true,
    features: [
      '8 candidate credits/month',
      'Advanced search & filters',
      'Candidate shortlists',
      'Priority support',
      'Team collaboration (2 seats)',
    ],
  },
  recruiter_scale: {
    name: 'Scale',
    price: 150,
    interval: 'month',
    currency: 'USD',
    credits: 20,
    extraCreditPrice: 10,
    features: [
      '20 candidate credits/month',
      'Unlimited search & filters',
      'ATS integration',
      'Dedicated account manager',
      'Team collaboration (5 seats)',
      'Custom reporting',
    ],
  },
} as const;

export type RecruiterTier = keyof typeof RECRUITER_TIERS;

// ============================================
// ALL TIER TYPES (for checkout)
// ============================================

export type AllTierTypes = SubscriptionTier | InterviewerTier | RecruiterTier;

export type FeatureType =
  | 'interview'
  | 'feedback'
  | 'coding_session'
  | 'system_design'
  | 'job_description'
  | 'recording'
  | 'resume'
  | 'linkedin'
  | 'export';

// Phase 1 feature limits per tier (for gated features)
const PHASE1_LIMITS: Record<string, Record<string, number>> = {
  free: {
    coding_session: 0,     // blocked
    system_design: 0,      // blocked
    job_description: 0,    // blocked
    recording: 0,          // blocked
    resume: 0,             // blocked
    linkedin: 0,           // blocked
    export: 0,             // blocked
  },
  pro: {
    coding_session: -1,    // unlimited
    system_design: -1,
    job_description: -1,
    recording: -1,
    resume: -1,
    linkedin: -1,
    export: -1,
  },
  enterprise: {
    coding_session: -1,
    system_design: -1,
    job_description: -1,
    recording: -1,
    resume: -1,
    linkedin: -1,
    export: -1,
  },
  lifetime: {
    coding_session: -1,
    system_design: -1,
    job_description: -1,
    recording: -1,
    resume: -1,
    linkedin: -1,
    export: -1,
  },
};

export function canUseFeature(
  tier: SubscriptionTier,
  questionsUsed: number,
  feedbackThisMonth: number,
  feature: FeatureType,
  featureUsageThisMonth?: number,
  currentRoleCount?: number
): { allowed: boolean; reason?: string } {
  // Default to pro if tier is undefined or invalid
  const validTier = PRICING_TIERS[tier as keyof typeof PRICING_TIERS] ? tier : 'pro';
  const limits = PRICING_TIERS[validTier].limits as Record<string, number | boolean>;

  if (feature === 'interview') {
    const questionsTotal = limits.questionsTotal as number;
    if (questionsTotal === -1) {
      return { allowed: true };
    }
    if (questionsUsed >= questionsTotal) {
      return {
        allowed: false,
        reason: `You've used all ${questionsTotal} free questions. Upgrade to Pro for unlimited access.`
      };
    }
    // Check role lock for free tier
    if (validTier === 'free' && currentRoleCount !== undefined) {
      const rolesAllowed = limits.rolesAllowed as number;
      if (rolesAllowed !== -1 && currentRoleCount >= rolesAllowed) {
        return {
          allowed: false,
          reason: `Free tier is limited to ${rolesAllowed} role. Upgrade to Pro to access all 500+ roles.`
        };
      }
    }
    return { allowed: true };
  }

  if (feature === 'feedback') {
    const aiFeedback = limits.aiFeedback as boolean;
    if (!aiFeedback) {
      return {
        allowed: false,
        reason: 'AI feedback is a Pro feature. Upgrade to Pro for unlimited AI feedback.'
      };
    }
    return { allowed: true };
  }

  // Phase 1 features (all gated behind Pro for free users)
  const phase1Features: FeatureType[] = ['coding_session', 'system_design', 'job_description', 'recording', 'resume', 'linkedin', 'export'];
  if (phase1Features.includes(feature)) {
    const tierLimits = PHASE1_LIMITS[validTier] || PHASE1_LIMITS.free;
    const limit = tierLimits[feature];

    if (limit === -1) {
      return { allowed: true };
    }

    if (limit === 0) {
      const featureNames: Record<string, string> = {
        coding_session: 'Coding interview practice',
        system_design: 'System design practice',
        job_description: 'JD analysis',
        recording: 'Session recording',
        resume: 'AI Resume Builder',
        linkedin: 'LinkedIn Optimizer',
        export: 'Export to PDF/CSV',
      };
      return {
        allowed: false,
        reason: `${featureNames[feature]} is a Pro feature. Upgrade to Pro to unlock it.`
      };
    }

    const usage = featureUsageThisMonth ?? 0;
    if (usage >= limit) {
      const featureNames: Record<string, string> = {
        coding_session: 'coding sessions',
        system_design: 'system design sessions',
        job_description: 'job description analyses',
        recording: 'session recordings',
        resume: 'resume builds',
        linkedin: 'LinkedIn optimizations',
        export: 'exports',
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

export function getInterviewerTier(tier: InterviewerTier) {
  return INTERVIEWER_TIERS[tier];
}

export function getRecruiterTier(tier: RecruiterTier) {
  return RECRUITER_TIERS[tier];
}

export function getRoleForTier(tier: AllTierTypes): 'seeker' | 'interviewer' | 'recruiter' {
  if (tier.startsWith('interviewer_')) return 'interviewer';
  if (tier.startsWith('recruiter_')) return 'recruiter';
  return 'seeker';
}

// ============================================
// BACKWARD COMPATIBILITY: MARKETPLACE_CREDITS
// (Used by recruiter credits and talent request APIs)
// ============================================

export const MARKETPLACE_CREDITS = {
  interview_request: 1,
  profile_unlock: 0,
  credit_packs: {
    starter: {
      name: 'Starter Pack',
      credits: RECRUITER_TIERS.recruiter_starter.credits,
      price: RECRUITER_TIERS.recruiter_starter.price * 100, // cents
      pricePerCredit: Math.round((RECRUITER_TIERS.recruiter_starter.price * 100) / RECRUITER_TIERS.recruiter_starter.credits),
      description: 'For small teams starting to hire',
    },
    growth: {
      name: 'Growth Pack',
      credits: RECRUITER_TIERS.recruiter_growth.credits,
      price: RECRUITER_TIERS.recruiter_growth.price * 100,
      pricePerCredit: Math.round((RECRUITER_TIERS.recruiter_growth.price * 100) / RECRUITER_TIERS.recruiter_growth.credits),
      savings: '17%',
      description: 'For growing teams with active hiring',
    },
    enterprise: {
      name: 'Enterprise Pack',
      credits: RECRUITER_TIERS.recruiter_scale.credits,
      price: RECRUITER_TIERS.recruiter_scale.price * 100,
      pricePerCredit: Math.round((RECRUITER_TIERS.recruiter_scale.price * 100) / RECRUITER_TIERS.recruiter_scale.credits),
      savings: '33%',
      description: 'For large-scale hiring initiatives',
    },
  },
} as const;

export type CreditPackType = keyof typeof MARKETPLACE_CREDITS['credit_packs'];
