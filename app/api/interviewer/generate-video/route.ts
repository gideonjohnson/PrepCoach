import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Video generation endpoint (currently disabled)
 * Returns audio-only mode - realistic video coming as premium feature
 */

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Video generation removed - D-ID had too many account restrictions
    // Return audio-only mode for all requests
    return NextResponse.json({
      mode: 'audio-only',
      message: 'Using animated avatar with audio. Realistic video coming soon as premium feature.'
    }, { status: 200 });

  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}
