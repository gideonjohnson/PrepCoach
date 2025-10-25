import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * POST /api/admin/grant-root
 *
 * Grants root admin access with lifetime subscription to a user
 *
 * SECURITY: This endpoint should only be called once during setup
 * and then removed or properly secured.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, secretKey } = await request.json();

    // Basic security check - require a secret key
    // In production, you should remove this endpoint after setup
    const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET || 'setup-prepcoach-admin-2025';

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

    console.log(`🔐 Granting root access to: ${email}`);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let user;

    if (existingUser) {
      // Update existing user
      console.log('✓ User found, updating permissions...');

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

      console.log('✅ Existing user updated with root access');

    } else {
      // Create new user with root access
      console.log('✓ User not found, creating new account with root access...');

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

      console.log('✅ New user created with root access');
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
