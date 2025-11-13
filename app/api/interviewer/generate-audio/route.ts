import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * ElevenLabs API Integration for neural voice synthesis
 * Generates high-quality voice audio for interview questions
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export async function POST(req: NextRequest) {
  try {
    // Optional: Log if user is authenticated (but don't block)
    const session = await getServerSession(authOptions);
    console.log('🔊 Generate audio request - User authenticated:', !!session?.user?.email);

    const { text, voiceId, tone } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_elevenlabs_api_key_here') {
      console.warn('⚠️ ElevenLabs API key not configured');
      // Fallback to browser TTS if ElevenLabs is not configured
      return NextResponse.json({
        mode: 'browser-tts',
        message: 'ElevenLabs not configured, using browser text-to-speech'
      }, { status: 200 });
    }

    console.log('✅ ElevenLabs API key configured, generating audio...');
    console.log('Voice ID:', voiceId || 'EXAVITQu4vr4xnSDxMaL');
    console.log('Text length:', text.length, 'characters');

    // Get voice settings based on tone
    const voiceSettings = getVoiceSettings(tone);

    // Call ElevenLabs API
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId || 'EXAVITQu4vr4xnSDxMaL'}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: voiceSettings,
        }),
      }
    );

    console.log('📡 ElevenLabs API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ElevenLabs API Error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to generate audio', details: errorText, status: response.status },
        { status: response.status }
      );
    }

    // Get audio data as buffer
    const audioBuffer = await response.arrayBuffer();
    console.log('✅ ElevenLabs audio generated successfully! Size:', audioBuffer.byteLength, 'bytes');

    // Convert to base64 for easy transmission
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      audioData: base64Audio,
      mimeType: 'audio/mpeg',
    });

  } catch (error) {
    console.error('Audio generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}

function getVoiceSettings(tone?: string) {
  // Adjust voice parameters based on tone
  const baseSettings = {
    stability: 0.5,
    similarity_boost: 0.75,
  };

  switch (tone) {
    case 'friendly':
      return {
        ...baseSettings,
        stability: 0.4, // More variation for friendliness
        similarity_boost: 0.8,
      };
    case 'strict':
      return {
        ...baseSettings,
        stability: 0.7, // More stable/formal
        similarity_boost: 0.7,
      };
    case 'encouraging':
      return {
        ...baseSettings,
        stability: 0.3, // More expressive
        similarity_boost: 0.85,
      };
    case 'professional':
    default:
      return baseSettings;
  }
}
