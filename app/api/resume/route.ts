import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/resume - Get all resumes for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    return NextResponse.json(
      { error: 'Failed to get resumes' },
      { status: 500 }
    );
  }
}

// POST /api/resume - Create a new resume
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        location: data.location || null,
        linkedin: data.linkedin || null,
        github: data.github || null,
        website: data.website || null,
        summary: data.summary || null,
        experience: data.experience || '[]',
        education: data.education || '[]',
        skills: data.skills || '[]',
        projects: data.projects || '[]',
        certifications: data.certifications || '[]',
        template: data.template || 'modern'
      }
    });

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Create resume error:', error);
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}
