import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { resetPasswordSchema, safeValidateData, formatZodError } from '@/lib/validation';
import bcrypt from 'bcryptjs';

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
    const validation = safeValidateData(resetPasswordSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formatZodError(validation.error),
        },
        { status: 400 }
      );
    }

    const { token, password } = validation.data;

    // Find the password reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > resetToken.expiresAt) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Delete the used reset token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
