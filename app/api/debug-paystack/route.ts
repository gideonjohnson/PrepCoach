import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasSecretKey: !!process.env.PAYSTACK_SECRET_KEY,
    hasPublicKey: !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    hasProPlanCode: !!process.env.PAYSTACK_PRO_PLAN_CODE,
    hasEnterprisePlanCode: !!process.env.PAYSTACK_ENTERPRISE_PLAN_CODE,
    secretKeyPrefix: process.env.PAYSTACK_SECRET_KEY?.substring(0, 10) || 'NOT_SET',
    publicKeyPrefix: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.substring(0, 10) || 'NOT_SET',
    proPlanCodePrefix: process.env.PAYSTACK_PRO_PLAN_CODE?.substring(0, 10) || 'NOT_SET',
    enterprisePlanCodePrefix: process.env.PAYSTACK_ENTERPRISE_PLAN_CODE?.substring(0, 10) || 'NOT_SET',
  });
}
