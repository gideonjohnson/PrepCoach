import Stripe from 'stripe';

// Lazy-initialize Stripe to avoid build-time errors when key is not set
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
      maxNetworkRetries: 3,
      timeout: 60000,
    });
  }
  return _stripe;
}

// Backwards-compatible export
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Stripe price IDs from environment
export const STRIPE_PRICE_IDS: Record<string, string> = {
  // Job Seeker tiers
  pro: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
  enterprise: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || '',
  // Interviewer tiers
  interviewer_basic: process.env.STRIPE_PRICE_ID_INTERVIEWER_BASIC || '',
  interviewer_featured: process.env.STRIPE_PRICE_ID_INTERVIEWER_FEATURED || '',
  interviewer_premium: process.env.STRIPE_PRICE_ID_INTERVIEWER_PREMIUM || '',
  // Recruiter tiers
  recruiter_starter: process.env.STRIPE_PRICE_ID_RECRUITER_STARTER || '',
  recruiter_growth: process.env.STRIPE_PRICE_ID_RECRUITER_GROWTH || '',
  recruiter_scale: process.env.STRIPE_PRICE_ID_RECRUITER_SCALE || '',
};

// Check if Stripe is configured (at minimum, the secret key and seeker tiers)
export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_PRO_MONTHLY_PRICE_ID &&
    process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID
  );
}

// Get subscription tier from Stripe price ID
export function getSubscriptionTier(priceId: string): string {
  for (const [tier, id] of Object.entries(STRIPE_PRICE_IDS)) {
    if (id && id === priceId) return tier;
  }
  return 'pro'; // Default to pro
}
