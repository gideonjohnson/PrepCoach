import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * D-ID API Integration for realistic AI video generation
 * Generates lip-synced video of AI interviewer asking questions
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

    // Prepare tone-specific SSML adjustments
    const ssmlText = applyToneToText(text, tone);

    // Create D-ID talk stream
    const createTalkResponse = await fetch(`${D_ID_API_URL}/talks`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${D_ID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: ssmlText,
          provider: {
            type: 'elevenlabs',
            voice_id: voiceId || 'EXAVITQu4vr4xnSDxMaL', // Default to Bella
          },
        },
        config: {
          fluent: true,
          pad_audio: 0,
          stitch: true,
        },
        source_url: getAvatarUrl(avatarId),
      }),
    });

    if (!createTalkResponse.ok) {
      const error = await createTalkResponse.json();
      console.error('D-ID API Error:', error);
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
          'Authorization': `Basic ${D_ID_API_KEY}`,
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
  // D-ID avatar URLs - Celebrity-style business leader avatars
  const avatarMap: Record<string, string> = {
    // Male Celebrity-Style Avatars
    'elon-musk-tech-ceo': 'https://create-images-results.d-id.com/DefaultPresenters/Tyler_f/image.jpeg',
    'steve-jobs-visionary': 'https://create-images-results.d-id.com/DefaultPresenters/Eric_f/image.jpeg',
    'mark-zuckerberg-founder': 'https://create-images-results.d-id.com/DefaultPresenters/Alex_f/image.jpeg',
    'jeff-bezos-ceo': 'https://create-images-results.d-id.com/DefaultPresenters/Matt_f/image.jpeg',
    'bill-gates-tech': 'https://create-images-results.d-id.com/DefaultPresenters/Dylan_f/image.jpeg',
    'professional-male-1': 'https://create-images-results.d-id.com/DefaultPresenters/James_f/image.jpeg',

    // Female Celebrity-Style Avatars
    'sheryl-sandberg-coo': 'https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg',
    'marissa-mayer-ceo': 'https://create-images-results.d-id.com/DefaultPresenters/Amy_f/image.jpeg',
    'ginni-rometty-ibm': 'https://create-images-results.d-id.com/DefaultPresenters/Jess_f/image.jpeg',
    'susan-wojcicki-youtube': 'https://create-images-results.d-id.com/DefaultPresenters/Anna_f/image.jpeg',
    'professional-female-1': 'https://create-images-results.d-id.com/DefaultPresenters/Sara_f/image.jpeg',

    // Neutral
    'professional-neutral': 'https://create-images-results.d-id.com/DefaultPresenters/Jordan_f/image.jpeg',
  };

  // Return selected avatar or default to professional female
  return avatarMap[avatarId || 'professional-female-1'] || avatarMap['professional-female-1'];
}
