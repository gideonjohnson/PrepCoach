import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { getClientIP } from '@/lib/api-middleware';

/**
 * POST /api/admin/grant-root
 *
 * DISABLED — This endpoint is disabled in production for security.
 * The previous ADMIN_SETUP_SECRET was exposed in git history.
 * To re-enable: rotate the secret, set ADMIN_GRANT_ROOT_ENABLED=true
 * in environment variables, and redeploy.
 */
export async function POST(request: NextRequest) {
  // Hard-disabled: require explicit opt-in via env var
  if (process.env.ADMIN_GRANT_ROOT_ENABLED !== 'true') {
    return NextResponse.json(
      { error: 'This endpoint is disabled' },
      { status: 403 }
    );
  }

  try {
    // Rate limit to prevent brute force
    const identifier = getClientIP(request);
    const rateLimitResult = await checkApiRateLimit('auth', identifier, { failClosed: true });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET;

    if (!SETUP_SECRET || SETUP_SECRET.length < 32) {
      return NextResponse.json(
        { error: 'Admin setup is not configured' },
        { status: 503 }
      );
    }

    const { email, secretKey } = await request.json();

    // Use timing-safe comparison to prevent timing attacks
    const { timingSafeEqual } = await import('crypto');
    const a = Buffer.from(secretKey || '');
    const b = Buffer.from(SETUP_SECRET);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let user;

    if (existingUser) {
      user = await prisma.user.update({
        where: { email },
        data: {
          isAdmin: true,
          subscriptionTier: 'lifetime',
          subscriptionStatus: 'active',
          subscriptionStart: new Date(),
          subscriptionEnd: null,
          emailVerified: existingUser.emailVerified || new Date(),
          interviewsThisMonth: 999999,
          feedbackThisMonth: 999999,
        },
      });
    } else {
      const { randomBytes } = await import('crypto');
      const randomPassword = randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      user = await prisma.user.create({
        data: {
          email,
          name: 'Root Admin',
          password: hashedPassword,
          emailVerified: new Date(),
          isAdmin: true,
          subscriptionTier: 'lifetime',
          subscriptionStatus: 'active',
          subscriptionStart: new Date(),
          subscriptionEnd: null,
          interviewsThisMonth: 999999,
          feedbackThisMonth: 999999,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Root access granted successfully',
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Error granting root access:', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}
