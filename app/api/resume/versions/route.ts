import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Maximum number of versions to keep per resume
const MAX_VERSIONS = 10;

interface ResumeSnapshot {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  template: string;
}

// GET /api/resume/versions - Get version history for user's resume
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Get the user's resume with versions
    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    if (!resume) {
      return NextResponse.json({ versions: [] });
    }

    // Parse versions from metadata or return empty array
    const versions = resume.metadata
      ? JSON.parse(resume.metadata).versions || []
      : [];

    return NextResponse.json({
      resumeId: resume.id,
      currentVersion: versions.length,
      versions: versions.map((v: { timestamp: string; label?: string; snapshot: ResumeSnapshot }, idx: number) => ({
        version: idx + 1,
        timestamp: v.timestamp,
        label: v.label || `Version ${idx + 1}`,
        preview: {
          fullName: v.snapshot.fullName,
          summary: v.snapshot.summary?.substring(0, 100) + (v.snapshot.summary && v.snapshot.summary.length > 100 ? '...' : ''),
          experienceCount: JSON.parse(v.snapshot.experience || '[]').length,
          skillsCount: JSON.parse(v.snapshot.skills || '[]').filter(Boolean).length,
        },
      })),
    });
  } catch (error) {
    console.error('Error fetching resume versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}

// POST /api/resume/versions - Save a new version snapshot
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const { label, snapshot } = body;

    if (!snapshot) {
      return NextResponse.json(
        { error: 'Snapshot data is required' },
        { status: 400 }
      );
    }

    // Get or create the user's resume
    let resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    if (!resume) {
      // Create a new resume if one doesn't exist
      resume = await prisma.resume.create({
        data: {
          userId,
          fullName: snapshot.fullName || '',
          email: snapshot.email || '',
          phone: snapshot.phone,
          location: snapshot.location,
          linkedin: snapshot.linkedin,
          github: snapshot.github,
          website: snapshot.website,
          summary: snapshot.summary,
          experience: snapshot.experience || '[]',
          education: snapshot.education || '[]',
          skills: snapshot.skills || '[]',
          projects: snapshot.projects || '[]',
          template: snapshot.template || 'modern',
          metadata: JSON.stringify({ versions: [] }),
        },
      });
    }

    // Parse existing metadata
    const metadata = resume.metadata ? JSON.parse(resume.metadata) : {};
    const versions = metadata.versions || [];

    // Create new version entry
    const newVersion = {
      timestamp: new Date().toISOString(),
      label: label || `Version ${versions.length + 1}`,
      snapshot: {
        fullName: snapshot.fullName,
        email: snapshot.email,
        phone: snapshot.phone,
        location: snapshot.location,
        linkedin: snapshot.linkedin,
        github: snapshot.github,
        website: snapshot.website,
        summary: snapshot.summary,
        experience: snapshot.experience,
        education: snapshot.education,
        skills: snapshot.skills,
        projects: snapshot.projects,
        template: snapshot.template,
      },
    };

    // Add new version and trim to max
    versions.push(newVersion);
    if (versions.length > MAX_VERSIONS) {
      versions.shift(); // Remove oldest version
    }

    // Update resume with new versions
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        metadata: JSON.stringify({ ...metadata, versions }),
      },
    });

    return NextResponse.json({
      success: true,
      version: versions.length,
      message: `Version ${versions.length} saved successfully`,
    });
  } catch (error) {
    console.error('Error saving resume version:', error);
    return NextResponse.json(
      { error: 'Failed to save version' },
      { status: 500 }
    );
  }
}
