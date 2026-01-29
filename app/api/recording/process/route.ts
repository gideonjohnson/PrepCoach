import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { isStorageConfigured, getDownloadUrl } from '@/lib/storage';
import OpenAI from 'openai';

const openai = new OpenAI();

const processSchema = z.object({
  recordingId: z.string(),
  actions: z.array(z.enum(['transcribe', 'finalize'])).default(['transcribe', 'finalize']),
});

// POST /api/recording/process - Process a recording (transcribe + finalize)
// Can be called by the client after upload, or by a webhook/cron job.
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
    const validated = processSchema.parse(body);

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

    const results: Record<string, unknown> = {};

    // Step 1: Transcribe audio if requested and audio exists
    if (validated.actions.includes('transcribe') && recording.audioUrl && !recording.transcription) {
      await prisma.sessionRecording.update({
        where: { id: validated.recordingId },
        data: { status: 'processing' },
      });

      try {
        let audioUrl = recording.audioUrl;

        // Resolve S3 key to URL
        if (!audioUrl.startsWith('http') && isStorageConfigured()) {
          audioUrl = await getDownloadUrl(audioUrl);
        }

        if (audioUrl.startsWith('http')) {
          const audioResponse = await fetch(audioUrl);
          if (!audioResponse.ok) {
            throw new Error(`Failed to fetch audio: ${audioResponse.status}`);
          }

          const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
          const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });

          const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
            response_format: 'text',
          });

          await prisma.sessionRecording.update({
            where: { id: validated.recordingId },
            data: { transcription },
          });

          results.transcription = transcription;
          results.transcribed = true;
        } else {
          results.transcribed = false;
          results.transcribeError = 'Cannot resolve audio URL';
        }
      } catch (error) {
        console.error('Transcription failed:', error);
        results.transcribed = false;
        results.transcribeError = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    // Step 2: Finalize — mark as ready
    if (validated.actions.includes('finalize')) {
      const hasTranscription = results.transcribed || recording.transcription;
      const hasMedia = recording.audioUrl || recording.videoUrl || recording.screenUrl;

      await prisma.sessionRecording.update({
        where: { id: validated.recordingId },
        data: {
          status: hasMedia ? 'ready' : 'failed',
        },
      });

      results.status = hasMedia ? 'ready' : 'failed';
      results.hasTranscription = Boolean(hasTranscription);
    }

    return NextResponse.json({ results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error processing recording:', error);
    return NextResponse.json(
      { error: 'Failed to process recording' },
      { status: 500 }
    );
  }
}
