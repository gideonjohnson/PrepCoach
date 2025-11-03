import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// PATCH /api/admin/users/[userId]/subscription - Update user subscription (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId } = await params;

    // Verify admin status
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });

    if (!adminUser?.isAdmin) {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    const { tier } = await request.json();

    if (!['free', 'pro', 'enterprise'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      );
    }

    // Update user subscription
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: 'active',
        subscriptionStart: new Date(),
        subscriptionEnd: tier === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Update subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
