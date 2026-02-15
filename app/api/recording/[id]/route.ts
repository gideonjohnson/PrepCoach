import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { isStorageConfigured, deleteFile, getDownloadUrl } from '@/lib/storage';

// GET /api/recording/[id] - Get a specific recording
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const recording = await prisma.sessionRecording.findUnique({
      where: { id },
      include: {
        interviewSession: {
          include: {
            responses: true,
          },
        },
      },
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

    // Parse JSON fields and resolve media URLs
    const response: Record<string, unknown> = {
      ...recording,
      timestamps: JSON.parse(recording.timestamps),
    };

    // Generate signed download URLs if using S3 storage
    if (isStorageConfigured()) {
      if (recording.audioUrl && !recording.audioUrl.startsWith('http')) {
        response.audioUrl = await getDownloadUrl(recording.audioUrl);
      }
      if (recording.videoUrl && !recording.videoUrl.startsWith('http')) {
        response.videoUrl = await getDownloadUrl(recording.videoUrl);
      }
      if (recording.screenUrl && !recording.screenUrl.startsWith('http')) {
        response.screenUrl = await getDownloadUrl(recording.screenUrl);
      }
    }

    return NextResponse.json({ recording: response });
  } catch (error) {
    console.error('Error fetching recording:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recording' },
      { status: 500 }
    );
  }
}

// PATCH /api/recording/[id] - Update a recording (complete, add URLs, etc.)
const updateRecordingSchema = z.object({
  audioUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  screenUrl: z.string().url().optional(),
  duration: z.number().optional(),
  fileSize: z.number().optional(),
  status: z.enum(['processing', 'ready', 'failed']).optional(),
  transcription: z.string().optional(),
  addTimestamp: z.object({
    time: z.number(),
    event: z.string(),
    data: z.record(z.unknown()).optional(),
  }).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const validated = updateRecordingSchema.parse(body);

    const existingRecording = await prisma.sessionRecording.findUnique({
      where: { id },
    });

    if (!existingRecording) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }

    if (existingRecording.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (validated.audioUrl !== undefined) {
      updateData.audioUrl = validated.audioUrl;
    }

    if (validated.videoUrl !== undefined) {
      updateData.videoUrl = validated.videoUrl;
    }

    if (validated.screenUrl !== undefined) {
      updateData.screenUrl = validated.screenUrl;
    }

    if (validated.duration !== undefined) {
      updateData.duration = validated.duration;
    }

    if (validated.fileSize !== undefined) {
      updateData.fileSize = validated.fileSize;
    }

    if (validated.status !== undefined) {
      updateData.status = validated.status;
    }

    if (validated.transcription !== undefined) {
      updateData.transcription = validated.transcription;
    }

    // Add timestamp event if provided
    if (validated.addTimestamp) {
      const timestamps = JSON.parse(existingRecording.timestamps);
      timestamps.push(validated.addTimestamp);
      updateData.timestamps = JSON.stringify(timestamps);
    }

    const updatedRecording = await prisma.sessionRecording.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      recording: {
        ...updatedRecording,
        timestamps: JSON.parse(updatedRecording.timestamps),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating recording:', error);
    return NextResponse.json(
      { error: 'Failed to update recording' },
      { status: 500 }
    );
  }
}

// DELETE /api/recording/[id] - Delete a recording
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingRecording = await prisma.sessionRecording.findUnique({
      where: { id },
    });

    if (!existingRecording) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }

    if (existingRecording.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Delete media files from storage
    if (isStorageConfigured()) {
      const filesToDelete = [
        existingRecording.audioUrl,
        existingRecording.videoUrl,
        existingRecording.screenUrl,
      ].filter((url): url is string => Boolean(url) && !url!.startsWith('http'));

      await Promise.allSettled(
        filesToDelete.map(key => deleteFile(key))
      );
    }

    await prisma.sessionRecording.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recording:', error);
    return NextResponse.json(
      { error: 'Failed to delete recording' },
      { status: 500 }
    );
  }
}
