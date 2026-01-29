import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { isStorageConfigured, getUploadUrl, uploadFile, recordingKey } from '@/lib/storage';

const presignSchema = z.object({
  recordingId: z.string(),
  mediaType: z.enum(['audio', 'video', 'screen']),
  contentType: z.string().default('video/webm'),
});

// POST /api/recording/upload - Get a presigned upload URL or upload directly
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check content type — if multipart, handle direct upload
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      return handleDirectUpload(req, session.user.id);
    }

    // JSON request — return presigned URL
    const body = await req.json();
    const validated = presignSchema.parse(body);

    // Verify recording belongs to user
    const recording = await prisma.sessionRecording.findUnique({
      where: { id: validated.recordingId },
    });

    if (!recording) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }

    if (recording.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    if (!isStorageConfigured()) {
      return NextResponse.json(
        { error: 'Storage not configured. Set STORAGE_ACCESS_KEY and STORAGE_SECRET_KEY env vars.' },
        { status: 503 }
      );
    }

    const key = recordingKey(session.user.id, validated.recordingId, validated.mediaType);
    const uploadUrl = await getUploadUrl(key, validated.contentType);

    // Update recording with the storage key
    const updateData: Record<string, string> = {};
    if (validated.mediaType === 'audio') updateData.audioUrl = key;
    if (validated.mediaType === 'video') updateData.videoUrl = key;
    if (validated.mediaType === 'screen') updateData.screenUrl = key;

    await prisma.sessionRecording.update({
      where: { id: validated.recordingId },
      data: updateData,
    });

    return NextResponse.json({
      uploadUrl,
      key,
      method: 'PUT',
      headers: {
        'Content-Type': validated.contentType,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}

async function handleDirectUpload(req: NextRequest, userId: string) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const recordingId = formData.get('recordingId') as string | null;
    const mediaType = formData.get('mediaType') as string | null;

    if (!file || !recordingId || !mediaType) {
      return NextResponse.json(
        { error: 'Missing file, recordingId, or mediaType' },
        { status: 400 }
      );
    }

    if (!['audio', 'video', 'screen'].includes(mediaType)) {
      return NextResponse.json(
        { error: 'Invalid mediaType' },
        { status: 400 }
      );
    }

    // Verify recording belongs to user
    const recording = await prisma.sessionRecording.findUnique({
      where: { id: recordingId },
    });

    if (!recording || recording.userId !== userId) {
      return NextResponse.json(
        { error: 'Recording not found or access denied' },
        { status: 404 }
      );
    }

    if (!isStorageConfigured()) {
      return NextResponse.json(
        { error: 'Storage not configured' },
        { status: 503 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = recordingKey(userId, recordingId, mediaType as 'audio' | 'video' | 'screen');
    const url = await uploadFile(key, buffer, file.type || 'application/octet-stream');

    // Update recording
    const updateData: Record<string, unknown> = {};
    if (mediaType === 'audio') updateData.audioUrl = url;
    if (mediaType === 'video') updateData.videoUrl = url;
    if (mediaType === 'screen') updateData.screenUrl = url;
    updateData.fileSize = (recording.fileSize || 0) + buffer.length;

    await prisma.sessionRecording.update({
      where: { id: recordingId },
      data: updateData,
    });

    return NextResponse.json({ url, key, size: buffer.length });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
