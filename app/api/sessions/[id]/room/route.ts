import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// Daily.co API integration (or any WebRTC provider)
const DAILY_API_KEY = process.env.DAILY_API_KEY || '';
const DAILY_API_URL = 'https://api.daily.co/v1';

async function createDailyRoom(sessionId: string, expiresAt: Date) {
  if (!DAILY_API_KEY) {
    // Return mock room for development
    return {
      name: `session-${sessionId}`,
      url: `https://prepcoach.daily.co/session-${sessionId}`,
      privacy: 'private',
    };
  }

  const response = await fetch(`${DAILY_API_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      name: `session-${sessionId}`,
      privacy: 'private',
      properties: {
        exp: Math.floor(expiresAt.getTime() / 1000),
        max_participants: 2,
        enable_chat: true,
        enable_screenshare: true,
        enable_recording: 'cloud',
        start_video_off: false,
        start_audio_off: false,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create video room');
  }

  return response.json();
}

async function createMeetingToken(roomName: string, participantName: string, isOwner: boolean) {
  if (!DAILY_API_KEY) {
    // Return mock token for development
    return {
      token: `mock-token-${roomName}-${Date.now()}`,
    };
  }

  const response = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_name: participantName,
        is_owner: isOwner,
        enable_screenshare: true,
        start_video_off: false,
        start_audio_off: false,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create meeting token');
  }

  return response.json();
}

// POST /api/sessions/[id]/room - Create or get video room for session
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id } = await params;

    // Get the expert session
    const expertSession = await prisma.expertSession.findUnique({
      where: { id },
      include: {
        interviewer: true,
        candidate: true,
      },
    });

    if (!expertSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Verify user is participant
    const isCandidate = expertSession.candidateId === userId;
    const isInterviewer = expertSession.interviewer.userId === userId;

    if (!isCandidate && !isInterviewer) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Check session status
    if (expertSession.status !== 'scheduled' && expertSession.status !== 'in_progress') {
      return NextResponse.json(
        { error: 'Session is not active' },
        { status: 400 }
      );
    }

    // Check if within time window (15 min before to session end)
    const scheduledTime = new Date(expertSession.scheduledAt);
    const sessionEnd = new Date(scheduledTime.getTime() + expertSession.duration * 60 * 1000);
    const windowStart = new Date(scheduledTime.getTime() - 15 * 60 * 1000);
    const now = new Date();

    if (now < windowStart) {
      const minutesUntil = Math.ceil((windowStart.getTime() - now.getTime()) / 60000);
      return NextResponse.json(
        { error: `Room opens ${minutesUntil} minutes before the session` },
        { status: 400 }
      );
    }

    if (now > sessionEnd) {
      return NextResponse.json(
        { error: 'Session has ended' },
        { status: 400 }
      );
    }

    // Create or get room
    let roomUrl = expertSession.meetingUrl;
    let roomName = `session-${id}`;

    if (!roomUrl) {
      // Create new room
      const room = await createDailyRoom(id, sessionEnd);
      roomUrl = room.url;
      roomName = room.name;

      // Save room URL to session
      await prisma.expertSession.update({
        where: { id },
        data: {
          meetingUrl: roomUrl,
          status: 'in_progress',
        },
      });
    }

    // Determine participant name (anonymous or real)
    let participantName: string;
    if (expertSession.isAnonymous) {
      participantName = isCandidate
        ? expertSession.candidateAnonymousName || 'Candidate'
        : expertSession.interviewerAnonymousName || 'Interviewer';
    } else {
      participantName = isCandidate
        ? expertSession.candidate.name || 'Candidate'
        : expertSession.interviewer.displayName;
    }

    // Create meeting token
    const tokenResponse = await createMeetingToken(roomName, participantName, isInterviewer);

    return NextResponse.json({
      roomUrl,
      token: tokenResponse.token,
      participantName,
      isInterviewer,
      sessionType: expertSession.sessionType,
      duration: expertSession.duration,
      endsAt: sessionEnd.toISOString(),
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create video room' },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[id]/room - End the video room
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id } = await params;

    const expertSession = await prisma.expertSession.findUnique({
      where: { id },
      include: { interviewer: true },
    });

    if (!expertSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Only interviewer can end the room
    if (expertSession.interviewer.userId !== userId) {
      return NextResponse.json({ error: 'Only interviewer can end session' }, { status: 403 });
    }

    // Update session status
    await prisma.expertSession.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });

    // Update interviewer stats
    await prisma.interviewer.update({
      where: { id: expertSession.interviewerId },
      data: {
        totalSessions: { increment: 1 },
      },
    });

    return NextResponse.json({
      message: 'Session ended successfully',
    });
  } catch (error) {
    console.error('Error ending room:', error);
    return NextResponse.json(
      { error: 'Failed to end session' },
      { status: 500 }
    );
  }
}
