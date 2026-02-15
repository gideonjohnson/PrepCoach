import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/coaching/usage - Get user's active coaching packages with usage
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Expire any packages past their expiration date
    await prisma.coachingPackage.updateMany({
      where: {
        userId,
        status: 'active',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'expired' },
    });

    // Fetch all packages for the user
    const packages = await prisma.coachingPackage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Error fetching coaching usage:', error);
    return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 });
  }
}

// POST /api/coaching/usage - Consume a session from a coaching package
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { packageId, expertSessionId } = await req.json();

    if (!packageId || !expertSessionId) {
      return NextResponse.json(
        { error: 'packageId and expertSessionId are required' },
        { status: 400 }
      );
    }

    // Expire stale packages first
    await prisma.coachingPackage.updateMany({
      where: {
        userId,
        status: 'active',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'expired' },
    });

    // Find the package and verify ownership
    const pkg = await prisma.coachingPackage.findUnique({
      where: { id: packageId },
    });

    if (!pkg || pkg.userId !== userId) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    if (pkg.status !== 'active') {
      return NextResponse.json(
        { error: `Package is ${pkg.status}. Cannot use sessions from this package.` },
        { status: 400 }
      );
    }

    if (pkg.remainingSessions <= 0) {
      return NextResponse.json(
        { error: 'No remaining sessions in this package' },
        { status: 400 }
      );
    }

    // Verify the expert session belongs to this user and is pending payment
    const expertSession = await prisma.expertSession.findUnique({
      where: { id: expertSessionId },
    });

    if (!expertSession || expertSession.candidateId !== userId) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (expertSession.status !== 'pending_payment') {
      return NextResponse.json(
        { error: 'Session is not pending payment' },
        { status: 400 }
      );
    }

    // Consume a session from the package (transaction)
    const newRemaining = pkg.remainingSessions - 1;
    const newUsed = pkg.usedSessions + 1;
    const newStatus = newRemaining <= 0 ? 'exhausted' : 'active';

    const [updatedPackage, updatedSession] = await prisma.$transaction([
      prisma.coachingPackage.update({
        where: { id: packageId },
        data: {
          remainingSessions: newRemaining,
          usedSessions: newUsed,
          status: newStatus,
        },
      }),
      prisma.expertSession.update({
        where: { id: expertSessionId },
        data: {
          status: 'scheduled',
          paymentStatus: 'paid',
          coachingPackageId: packageId,
        },
      }),
    ]);

    return NextResponse.json({
      package: updatedPackage,
      session: updatedSession,
      message: `Session booked using coaching package. ${newRemaining} sessions remaining.`,
    });
  } catch (error) {
    console.error('Error consuming coaching session:', error);
    return NextResponse.json({ error: 'Failed to consume session' }, { status: 500 });
  }
}
