import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { getClientIP } from '@/lib/api-middleware';

/**
 * POST /api/admin/grant-root
 *
 * Grants root admin access with lifetime subscription to a user
 *
 * SECURITY: Requires ADMIN_SETUP_SECRET env var to be set.
 */
export async function POST(request: NextRequest) {
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

    if (!SETUP_SECRET) {
      return NextResponse.json(
        { error: 'Admin setup is not configured' },
        { status: 503 }
      );
    }

    const { email, secretKey } = await request.json();

    if (secretKey !== SETUP_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid secret key' },
        { status: 403 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
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
          subscriptionEnd: null, // Lifetime = no end date
          emailVerified: existingUser.emailVerified || new Date(),
          interviewsThisMonth: 999999, // Unlimited
          feedbackThisMonth: 999999, // Unlimited
        },
      });

    } else {
      // Generate a random secure password (they'll use Google OAuth anyway)
      const randomPassword = Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16);
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
          subscriptionEnd: null, // Lifetime = no end date
          interviewsThisMonth: 999999, // Unlimited
          feedbackThisMonth: 999999, // Unlimited
        },
      });

    }

    return NextResponse.json({
      success: true,
      message: 'Root access granted successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus,
        emailVerified: !!user.emailVerified,
      },
    });

  } catch (error) {
    console.error('Error granting root access:', error);
    return NextResponse.json(
      { error: 'Failed to grant root access' },
      { status: 500 }
    );
  }
}
