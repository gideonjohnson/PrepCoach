import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    // Test Stripe connection with explicit configuration
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json({
        error: 'STRIPE_SECRET_KEY not found in environment',
        env_vars: {
          hasSecretKey: false,
          hasProPrice: !!process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
          hasEnterprisePrice: !!process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
        }
      }, { status: 500 });
    }

    // Initialize Stripe with the exact key
    const stripe = new Stripe(secretKey, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    });

    // Test 1: List prices to verify connection
    const prices = await stripe.prices.list({ limit: 1 });

    // Test 2: Verify the specific price IDs exist
    const proPrice = process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
    const enterprisePrice = process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID;

    let proPriceDetails = null;
    let enterprisePriceDetails = null;

    if (proPrice) {
      try {
        proPriceDetails = await stripe.prices.retrieve(proPrice);
      } catch (e: any) {
        proPriceDetails = { error: e.message };
      }
    }

    if (enterprisePrice) {
      try {
        enterprisePriceDetails = await stripe.prices.retrieve(enterprisePrice);
      } catch (e: any) {
        enterprisePriceDetails = { error: e.message };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Stripe connection successful',
      keyPrefix: secretKey.substring(0, 12) + '...',
      pricesCount: prices.data.length,
      environment: {
        hasSecretKey: !!secretKey,
        hasProPrice: !!proPrice,
        hasEnterprisePrice: !!enterprisePrice,
        proPriceId: proPrice?.substring(0, 15) + '...',
        enterprisePriceId: enterprisePrice?.substring(0, 15) + '...',
      },
      priceDetails: {
        pro: proPriceDetails,
        enterprise: enterprisePriceDetails,
      }
    });
  } catch (error: any) {
    console.error('Stripe test error:', error);
    return NextResponse.json({
      error: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      requestId: error.requestId,
    }, { status: 500 });
  }
}
