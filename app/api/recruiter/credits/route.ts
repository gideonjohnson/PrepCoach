import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { MARKETPLACE_CREDITS, type CreditPackType } from '@/lib/pricing';
import Stripe from 'stripe';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
}

// GET /api/recruiter/credits - Get credit balance and purchase history
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (!recruiter) {
      return NextResponse.json({ error: 'Not a recruiter' }, { status: 403 });
    }

    const purchases = await prisma.creditPurchase.findMany({
      where: { companyId: recruiter.companyId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      creditBalance: recruiter.company.creditBalance,
      purchases,
      packs: MARKETPLACE_CREDITS.credit_packs,
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}

// POST /api/recruiter/credits - Purchase credits
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { packType } = await req.json();

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (!recruiter) {
      return NextResponse.json({ error: 'Not a recruiter' }, { status: 403 });
    }

    if (!recruiter.canPurchaseCredits) {
      return NextResponse.json(
        { error: 'You do not have permission to purchase credits' },
        { status: 403 }
      );
    }

    const pack = MARKETPLACE_CREDITS.credit_packs[packType as CreditPackType];
    if (!pack) {
      return NextResponse.json({ error: 'Invalid pack type' }, { status: 400 });
    }

    // Create credit purchase record
    const purchase = await prisma.creditPurchase.create({
      data: {
        companyId: recruiter.companyId,
        packageType: packType,
        creditsAmount: pack.credits,
        priceInCents: pack.price,
        paymentStatus: 'pending',
      },
    });

    // Create Stripe checkout session
    const checkoutSession = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pack.name,
              description: `${pack.credits} interview credits`,
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/recruiter/credits?success=true&purchase=${purchase.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/recruiter/credits?cancelled=true`,
      metadata: {
        purchaseId: purchase.id,
        companyId: recruiter.companyId,
        type: 'credit_purchase',
        credits: String(pack.credits),
      },
    });

    return NextResponse.json({
      purchase,
      checkoutUrl: checkoutSession.url,
    });
  } catch (error) {
    console.error('Error purchasing credits:', error);
    return NextResponse.json({ error: 'Failed to purchase credits' }, { status: 500 });
  }
}
