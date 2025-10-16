import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
        email
      });
    }

    if (!user.password) {
      return NextResponse.json({
        success: false,
        message: 'User has no password'
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    return NextResponse.json({
      success: isCorrectPassword,
      message: isCorrectPassword ? 'Password matches!' : 'Password does not match',
      userFound: true,
      hasPassword: !!user.password,
      hashPrefix: user.password.substring(0, 10),
      emailVerified: !!user.emailVerified,
      isAdmin: user.isAdmin,
      dbUrl: process.env.DATABASE_URL?.substring(0, 50) + '...'
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
