import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import OpenAI from 'openai';
import { isStorageConfigured, getDownloadUrl } from '@/lib/storage';

const openai = new OpenAI();

const transcribeSchema = z.object({
  recordingId: z.string(),
});

// POST /api/recording/transcribe - Transcribe a recording's audio
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = transcribeSchema.parse(body);

    // Fetch recording
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

    if (!recording.audioUrl) {
      return NextResponse.json(
        { error: 'No audio file found for this recording' },
        { status: 400 }
      );
    }

    if (recording.transcription) {
      return NextResponse.json({
        transcription: recording.transcription,
        status: 'already_transcribed',
      });
    }

    // Update status to processing
    await prisma.sessionRecording.update({
      where: { id: validated.recordingId },
      data: { status: 'processing' },
    });

    try {
      // Get the audio file
      let audioResponse: Response;

      if (recording.audioUrl.startsWith('http')) {
        // Direct URL
        audioResponse = await fetch(recording.audioUrl);
      } else if (isStorageConfigured()) {
        // S3 key — get signed URL
        const downloadUrl = await getDownloadUrl(recording.audioUrl);
        audioResponse = await fetch(downloadUrl);
      } else {
        await prisma.sessionRecording.update({
          where: { id: validated.recordingId },
          data: { status: 'failed' },
        });
        return NextResponse.json(
          { error: 'Cannot access audio file — storage not configured' },
          { status: 503 }
        );
      }

      if (!audioResponse.ok) {
        throw new Error(`Failed to fetch audio: ${audioResponse.status}`);
      }

      const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

      // Create a File object for the OpenAI API
      const audioFile = new File([audioBuffer], 'audio.webm', {
        type: 'audio/webm',
      });

      // Call Whisper API
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        response_format: 'verbose_json',
        timestamp_granularities: ['segment'],
      });

      const transcriptionText = transcription.text;

      // Save transcription
      await prisma.sessionRecording.update({
        where: { id: validated.recordingId },
        data: {
          transcription: transcriptionText,
          status: 'ready',
        },
      });

      return NextResponse.json({
        transcription: transcriptionText,
        status: 'completed',
      });
    } catch (transcribeError) {
      console.error('Transcription failed:', transcribeError);

      await prisma.sessionRecording.update({
        where: { id: validated.recordingId },
        data: { status: 'failed' },
      });

      return NextResponse.json(
        { error: 'Transcription failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error in transcription endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process transcription request' },
      { status: 500 }
    );
  }
}
