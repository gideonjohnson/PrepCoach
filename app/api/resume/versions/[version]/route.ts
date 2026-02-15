import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/resume/versions/[version] - Get a specific version
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ version: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { version } = await params;
    const versionNum = parseInt(version);

    if (isNaN(versionNum) || versionNum < 1) {
      return NextResponse.json(
        { error: 'Invalid version number' },
        { status: 400 }
      );
    }

    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    const metadata = resume.metadata ? JSON.parse(resume.metadata) : {};
    const versions = metadata.versions || [];

    if (versionNum > versions.length) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    const versionData = versions[versionNum - 1];

    return NextResponse.json({
      version: versionNum,
      timestamp: versionData.timestamp,
      label: versionData.label,
      snapshot: versionData.snapshot,
    });
  } catch (error) {
    console.error('Error fetching resume version:', error);
    return NextResponse.json(
      { error: 'Failed to fetch version' },
      { status: 500 }
    );
  }
}

// POST /api/resume/versions/[version] - Restore a specific version
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ version: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { version } = await params;
    const versionNum = parseInt(version);

    if (isNaN(versionNum) || versionNum < 1) {
      return NextResponse.json(
        { error: 'Invalid version number' },
        { status: 400 }
      );
    }

    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    const metadata = resume.metadata ? JSON.parse(resume.metadata) : {};
    const versions = metadata.versions || [];

    if (versionNum > versions.length) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    const versionData = versions[versionNum - 1];
    const snapshot = versionData.snapshot;

    // Restore the resume to this version
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
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
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Restored to version ${versionNum}`,
      snapshot,
    });
  } catch (error) {
    console.error('Error restoring resume version:', error);
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    );
  }
}

// DELETE /api/resume/versions/[version] - Delete a specific version
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ version: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { version } = await params;
    const versionNum = parseInt(version);

    if (isNaN(versionNum) || versionNum < 1) {
      return NextResponse.json(
        { error: 'Invalid version number' },
        { status: 400 }
      );
    }

    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    const metadata = resume.metadata ? JSON.parse(resume.metadata) : {};
    const versions = metadata.versions || [];

    if (versionNum > versions.length) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    // Remove the version
    versions.splice(versionNum - 1, 1);

    // Update resume metadata
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        metadata: JSON.stringify({ ...metadata, versions }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Version ${versionNum} deleted`,
      remainingVersions: versions.length,
    });
  } catch (error) {
    console.error('Error deleting resume version:', error);
    return NextResponse.json(
      { error: 'Failed to delete version' },
      { status: 500 }
    );
  }
}
