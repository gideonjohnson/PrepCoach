import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

// POST /api/payments/session - Create a Stripe checkout session for an expert session
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Get the expert session
    const expertSession = await prisma.expertSession.findUnique({
      where: { id: sessionId },
      include: {
        interviewer: {
          select: {
            displayName: true,
            currentCompany: true,
          },
        },
      },
    });

    if (!expertSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Verify the session belongs to this user
    if (expertSession.candidateId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if already paid
    if (expertSession.status !== 'pending_payment') {
      return NextResponse.json({ error: 'Session is not pending payment' }, { status: 400 });
    }

    // Get session type label
    const sessionTypeLabels: Record<string, string> = {
      coding: 'Coding Interview',
      system_design: 'System Design',
      behavioral: 'Behavioral Interview',
      mock_full: 'Full Mock Interview',
    };

    // Create Stripe checkout session
    const checkoutSession = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${sessionTypeLabels[expertSession.sessionType]} with ${expertSession.interviewer.displayName}`,
              description: `${expertSession.duration}-minute session${expertSession.interviewer.currentCompany ? ` (${expertSession.interviewer.currentCompany})` : ''}`,
            },
            unit_amount: expertSession.priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sessions/${expertSession.id}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/session/${expertSession.id}?payment=cancelled`,
      metadata: {
        sessionId: expertSession.id,
        candidateId: userId,
        interviewerId: expertSession.interviewerId,
        type: 'expert_session',
      },
    });

    // Update session with Stripe checkout ID
    await prisma.expertSession.update({
      where: { id: sessionId },
      data: {
        paymentIntentId: checkoutSession.id,
      },
    });

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
