import Stripe from 'stripe';

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
  maxNetworkRetries: 2,
  timeout: 30000, // 30 seconds
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
