import axios from 'axios';

// Check if Paystack secret key is configured
if (!process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY === 'your_paystack_secret_key_here') {
  console.warn('⚠️  PAYSTACK_SECRET_KEY is not configured. Payment features will not work.');
}

// Paystack API configuration
export const paystackConfig = {
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  baseURL: 'https://api.paystack.co',
};

// Paystack plan codes (you'll create these in Paystack Dashboard)
export const PAYSTACK_PLAN_CODES = {
  pro: process.env.PAYSTACK_PRO_PLAN_CODE || 'PLN_pro_monthly',
  enterprise: process.env.PAYSTACK_ENTERPRISE_PLAN_CODE || 'PLN_enterprise_monthly',
};

// Paystack API client
export const paystackAPI = axios.create({
  baseURL: paystackConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth header dynamically for each request
paystackAPI.interceptors.request.use((config) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (secretKey && secretKey !== 'your_paystack_secret_key_here') {
    config.headers.Authorization = `Bearer ${secretKey}`;
  }
  return config;
});

// Helper to check if Paystack is configured
export function isPaystackConfigured(): boolean {
  return !!(process.env.PAYSTACK_SECRET_KEY && process.env.PAYSTACK_SECRET_KEY !== 'your_paystack_secret_key_here');
}

// Get subscription tier from Paystack plan code
export function getSubscriptionTier(planCode: string): 'pro' | 'enterprise' {
  if (planCode === PAYSTACK_PLAN_CODES.pro || planCode.includes('pro')) return 'pro';
  if (planCode === PAYSTACK_PLAN_CODES.enterprise || planCode.includes('enterprise')) return 'enterprise';
  return 'pro'; // Default to pro
}

// Initialize Paystack transaction
export async function initializeTransaction(
  email: string,
  amount: number,
  planCode: string,
  metadata: Record<string, any>
) {
  try {
    const response = await paystackAPI.post('/transaction/initialize', {
      email,
      amount: amount * 100, // Paystack uses kobo (cents)
      plan: planCode,
      callback_url: `${process.env.NEXTAUTH_URL}/payment/success`,
      metadata,
    });

    return response.data;
  } catch (error: any) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    throw error;
  }
}

// Verify Paystack transaction
export async function verifyTransaction(reference: string) {
  try {
    const response = await paystackAPI.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (error: any) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    throw error;
  }
}

// Verify Paystack webhook signature
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha512', paystackConfig.secretKey)
    .update(payload)
    .digest('hex');

  return hash === signature;
}

// Get pricing for tiers (in USD)
export const PAYSTACK_PRICING = {
  pro: {
    amount: 19, // $19/month
    currency: 'USD',
  },
  enterprise: {
    amount: 49, // $49/month
    currency: 'USD',
  },
};
