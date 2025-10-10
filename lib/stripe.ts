import Stripe from 'stripe';

// Check if Stripe secret key is configured
if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key_here') {
  console.warn('⚠️  STRIPE_SECRET_KEY is not configured. Payment features will not work.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

export const STRIPE_PRICE_IDS = {
  pro: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
  enterprise: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || '',
};

// Helper to check if Stripe is configured
export function isStripeConfigured(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key_here');
}

// Get subscription tier from Stripe price ID
export function getSubscriptionTier(priceId: string): 'pro' | 'enterprise' {
  if (priceId === STRIPE_PRICE_IDS.pro) return 'pro';
  if (priceId === STRIPE_PRICE_IDS.enterprise) return 'enterprise';
  return 'pro'; // Default to pro
}
