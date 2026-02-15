import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { COACHING_PACKAGES } from '@/lib/pricing';
import { getStripe } from '@/lib/stripe';

// GET /api/coaching/packages - List available coaching packages
export async function GET() {
  try {
    return NextResponse.json({ packages: COACHING_PACKAGES });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

// POST /api/coaching/packages - Purchase a coaching package
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { packageType, interviewerId } = await req.json();

    // Find the package
    const pkg = COACHING_PACKAGES[packageType as keyof typeof COACHING_PACKAGES];
    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package type' }, { status: 400 });
    }

    // Verify interviewer if specified
    if (interviewerId) {
      const interviewer = await prisma.interviewer.findUnique({
        where: { id: interviewerId },
      });
      if (!interviewer || !interviewer.isActive) {
        return NextResponse.json({ error: 'Interviewer not available' }, { status: 400 });
      }
    }

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + pkg.validityDays);

    // Create the coaching package record
    const coachingPackage = await prisma.coachingPackage.create({
      data: {
        userId,
        packageType,
        totalSessions: pkg.sessions,
        remainingSessions: pkg.sessions,
        priceInCents: pkg.price,
        status: 'pending',
        expiresAt,
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
              name: pkg.name,
              description: pkg.description,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/coaching/success?package=${coachingPackage.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/coaching?cancelled=true`,
      metadata: {
        sessionId: coachingPackage.id,
        userId,
        type: 'coaching_package',
      },
    });

    return NextResponse.json({
      package: coachingPackage,
      checkoutUrl: checkoutSession.url,
    });
  } catch (error) {
    console.error('Error purchasing package:', error);
    return NextResponse.json({ error: 'Failed to purchase package' }, { status: 500 });
  }
}
