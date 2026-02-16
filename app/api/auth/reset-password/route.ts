import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { resetPasswordSchema, safeValidateData, formatZodError } from '@/lib/validation';
import bcrypt from 'bcryptjs';
import { getClientIP } from '@/lib/api-middleware';

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting to prevent brute force attacks
    const identifier = getClientIP(req);
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

    if (!resetToken || new Date() > resetToken.expiresAt) {
      // Delete expired token if it exists
      if (resetToken) {
        await prisma.passwordResetToken.delete({
          where: { id: resetToken.id },
        });
      }

      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please request a new one.' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

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
