import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
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
        email,
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
      const emailResult = await sendVerificationEmail(email, token);

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
