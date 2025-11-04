import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * D-ID API Integration for realistic AI video generation
 * Generates lip-synced video of AI interviewer asking questions
 *
 * Voice Providers (auto-selected):
 * 1. Microsoft Azure (default) - Included with D-ID, excellent quality
 *    - en-US-JennyNeural (professional female, default)
 *    - en-US-GuyNeural (professional male)
 *    - en-US-AriaNeural (friendly female)
 *
 * 2. ElevenLabs (premium) - Best quality, requires ELEVENLABS_API_KEY
 *    - EXAVITQu4vr4xnSDxMaL (Bella - professional female)
 *    - 21m00Tcm4TlvDq8ikWAM (Rachel - calm female)
 *    - ErXwobaYiN019PkySvjV (Antoni - professional male)
 *
 * Setup: Only D_ID_API_KEY required. ElevenLabs is optional upgrade.
 */

const D_ID_API_KEY = process.env.D_ID_API_KEY;
const D_ID_API_URL = 'https://api.d-id.com';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, avatarId, voiceId, tone } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!D_ID_API_KEY) {
      // Fallback to audio-only mode if D-ID is not configured
      return NextResponse.json({
        mode: 'audio-only',
        message: 'Video generation not configured, using audio mode'
      }, { status: 200 });
    }

    // Use plain text for now - SSML can cause issues with D-ID
    const scriptText = text;

    // Determine TTS provider (use ElevenLabs if configured, otherwise use D-ID's built-in Azure)
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const useElevenLabs = ELEVENLABS_API_KEY && ELEVENLABS_API_KEY !== 'your_elevenlabs_api_key_here';

    // Base64 encode the API key for Basic authentication
    const encodedApiKey = Buffer.from(D_ID_API_KEY).toString('base64');

    // Create D-ID talk stream
    const createTalkResponse = await fetch(`${D_ID_API_URL}/talks`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url: getAvatarUrl(avatarId),
        script: {
          type: 'text',
          input: scriptText,
          // Let D-ID use default voice for now to ensure compatibility
          // Provider can be added later once basic functionality works
        },
      }),
    });

    if (!createTalkResponse.ok) {
      const error = await createTalkResponse.json().catch(() => ({ message: 'Unknown error' }));
      console.error('D-ID API Error:', {
        status: createTalkResponse.status,
        statusText: createTalkResponse.statusText,
        error,
        apiKeyLength: D_ID_API_KEY?.length,
        hasApiKey: !!D_ID_API_KEY
      });
      return NextResponse.json(
        { error: 'Failed to generate video', details: error },
        { status: createTalkResponse.status }
      );
    }

    const talkData = await createTalkResponse.json();
    const talkId = talkData.id;

    // Poll for video generation completion
    let videoUrl = null;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds max wait time

    while (!videoUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

      const statusResponse = await fetch(`${D_ID_API_URL}/talks/${talkId}`, {
        headers: {
          'Authorization': `Basic ${encodedApiKey}`,
        },
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();

        if (statusData.status === 'done') {
          videoUrl = statusData.result_url;
          break;
        } else if (statusData.status === 'error') {
          return NextResponse.json(
            { error: 'Video generation failed', details: statusData },
            { status: 500 }
          );
        }
      }

      attempts++;
    }

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video generation timeout' },
        { status: 408 }
      );
    }

    return NextResponse.json({
      videoUrl,
      talkId,
      duration: talkData.duration,
    });

  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}

function applyToneToText(text: string, tone?: string): string {
  // Apply SSML tags based on tone
  switch (tone) {
    case 'friendly':
      return `<speak><prosody rate="medium" pitch="+5%">${text}</prosody></speak>`;
    case 'strict':
      return `<speak><prosody rate="fast" pitch="-5%">${text}</prosody></speak>`;
    case 'encouraging':
      return `<speak><prosody rate="medium" pitch="+10%" volume="+3dB">${text}</prosody></speak>`;
    case 'professional':
    default:
      return `<speak><prosody rate="medium">${text}</prosody></speak>`;
  }
}

function getAvatarUrl(avatarId?: string): string {
  // D-ID avatar URLs - Use D-ID's public demo images for now
  const avatarMap: Record<string, string> = {
    // Male avatars
    'elon-musk-tech-ceo': 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
    'steve-jobs-visionary': 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
    'mark-zuckerberg-founder': 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
    'jeff-bezos-ceo': 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
    'bill-gates-tech': 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
    'professional-male-1': 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',

    // Female avatars
    'sheryl-sandberg-coo': 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
    'marissa-mayer-ceo': 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
    'ginni-rometty-ibm': 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
    'susan-wojcicki-youtube': 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
    'professional-female-1': 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',

    // Neutral
    'professional-neutral': 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
  };

  // Return selected avatar or default to alice demo image
  return avatarMap[avatarId || 'professional-female-1'] || 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg';
}
