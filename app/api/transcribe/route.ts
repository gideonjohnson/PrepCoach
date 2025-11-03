import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { getClientIP } from '@/lib/api-middleware';
import { transcriptionSchema, safeValidateData, formatZodError } from '@/lib/validation';

// Check if API key is configured
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
  console.warn('⚠️  OPENAI_API_KEY is not configured. Audio transcription will not work.');
  console.warn('📝 Get your API key from: https://platform.openai.com/api-keys');
  console.warn('💡 See SETUP.md for detailed instructions');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    // Apply rate limiting
    const identifier = session?.user?.email || getClientIP(request);
    const rateLimitResult = await checkApiRateLimit('transcription', identifier);

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.reset);
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many transcription requests. Please try again after ${resetDate.toLocaleTimeString()}.`,
          limit: rateLimitResult.limit,
          remaining: 0,
          reset: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          },
        }
      );
    }

    // Check API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return NextResponse.json(
        {
          error: 'OpenAI API key not configured',
          message: 'Please add your OPENAI_API_KEY to the .env file. See SETUP.md for instructions.',
          setupUrl: 'https://platform.openai.com/api-keys'
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate audio file with Zod
    const validation = safeValidateData(transcriptionSchema, { audio: audioFile });

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formatZodError(validation.error),
        },
        { status: 400 }
      );
    }

    // Convert webm to a format Whisper accepts
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
    });

    return NextResponse.json({ transcript: transcription.text });
  } catch (error: any) {
    console.error('Transcription error:', error);

    // Handle quota exceeded error
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      return NextResponse.json(
        {
          error: 'OpenAI quota exceeded',
          message: 'You have exceeded your OpenAI API quota. Please check your plan and billing details at https://platform.openai.com/account/billing',
          code: 'quota_exceeded'
        },
        { status: 429 }
      );
    }

    // Handle rate limit errors
    if (error?.status === 429) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please wait a moment and try again.',
          code: 'rate_limit'
        },
        { status: 429 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: 'Failed to transcribe audio',
        message: error?.message || 'An unexpected error occurred during transcription',
        code: 'transcription_failed'
      },
      { status: 500 }
    );
  }
}
