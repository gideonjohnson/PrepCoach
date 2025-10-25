import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { forgotPasswordSchema, safeValidateData, formatZodError } from '@/lib/validation';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting to prevent brute force attacks
    const identifier = req.ip || 'anonymous';
    const rateLimitResult = await checkApiRateLimit('auth', identifier);

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.reset);
      return NextResponse.json(
        {
          error: 'Too many attempts',
          message: `Too many password reset attempts. Please try again after ${resetDate.toLocaleTimeString()}.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Validate input with Zod
    const validation = safeValidateData(forgotPasswordSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formatZodError(validation.error),
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Delete any existing password reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate new password reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Create password reset token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send password reset email
    const result = await sendPasswordResetEmail(email, token);

    if (!result.success) {
      console.error('Failed to send password reset email:', result.error);
      // Still return success to user for security
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
