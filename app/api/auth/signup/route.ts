import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { signupSchema, safeValidateData, formatZodError } from '@/lib/validation';
import { getClientIP } from '@/lib/api-middleware';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting to prevent brute force attacks
    const identifier = getClientIP(request);
    const rateLimitResult = await checkApiRateLimit('auth', identifier);

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.reset);
      return NextResponse.json(
        {
          error: 'Too many attempts',
          message: `Too many signup attempts. Please try again after ${resetDate.toLocaleTimeString()}.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input with Zod
    const validation = safeValidateData(signupSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formatZodError(validation.error),
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Normalize email to lowercase to prevent duplicates
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if email service is configured
    const emailServiceConfigured = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here';

    // Create user - auto-verify if email service not configured
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        emailVerified: emailServiceConfigured ? null : new Date(), // Auto-verify if no email service
      }
    });

    // Only send verification email if email service is configured
    if (emailServiceConfigured) {
      // Generate verification token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create verification token
      await prisma.verificationToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      // Send verification email
      const emailResult = await sendVerificationEmail(normalizedEmail, token);

      if (!emailResult.success) {
        console.error('Failed to send verification email:', emailResult.error);
        // Don't fail signup if email fails - user can resend later
      }

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        message: 'Account created! Please check your email to verify your account.',
      });
    } else {
      // No email service - account is automatically verified
      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        message: 'Account created successfully! You can now sign in.',
        autoVerified: true,
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
