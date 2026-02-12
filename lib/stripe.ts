import Stripe from 'stripe';

// Lazy-initialize Stripe to avoid build-time errors when key is not set
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
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
export const STRIPE_PRICE_IDS = {
  pro: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
  enterprise: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || '',
};

// Check if Stripe is configured
export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_PRO_MONTHLY_PRICE_ID &&
    process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID
  );
}

// Get subscription tier from Stripe price ID
export function getSubscriptionTier(priceId: string): 'pro' | 'enterprise' {
  if (priceId === STRIPE_PRICE_IDS.pro) return 'pro';
  if (priceId === STRIPE_PRICE_IDS.enterprise) return 'enterprise';
  return 'pro'; // Default to pro
}
