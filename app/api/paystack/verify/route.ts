import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { verifyTransaction } from '@/lib/paystack';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    // Verify transaction with Paystack
    const result = await verifyTransaction(reference);

    if (result.status && result.data.status === 'success') {
      const { metadata } = result.data;
      const userId = metadata.userId;
      const tier = metadata.tier;

      if (userId && tier) {
        // Update user subscription
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: tier,
            subscriptionStatus: 'active',
            subscriptionStart: new Date(),
            subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Payment verified successfully',
          tier,
        });
      }
    }

    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Paystack verification error:', error);
    const message = error instanceof Error ? error.message : 'Failed to verify payment';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
