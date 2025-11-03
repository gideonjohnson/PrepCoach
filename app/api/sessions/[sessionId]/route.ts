import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/sessions/[sessionId] - Get a specific session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sessionId } = await params;

    const interviewSession = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id
      },
      include: {
        responses: {
          orderBy: {
            timestamp: 'asc'
          }
        }
      }
    });

    if (!interviewSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const formattedSession = {
      id: interviewSession.id,
      roleTitle: interviewSession.roleTitle,
      roleCategory: interviewSession.roleCategory,
      roleLevel: interviewSession.roleLevel,
      company: interviewSession.company,
      date: interviewSession.date.getTime(),
      completionRate: interviewSession.completionRate,
      totalQuestions: interviewSession.totalQuestions,
      answeredQuestions: interviewSession.answeredQuestions,
      responses: interviewSession.responses.map(r => ({
        question: r.question,
        audioURL: r.audioURL,
        duration: r.duration,
        feedback: r.feedback || undefined,
        timestamp: r.timestamp.getTime()
      }))
    };

    return NextResponse.json({ session: formattedSession });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

// PATCH /api/sessions/[sessionId] - Update a session
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sessionId } = await params;
    const { responses } = await request.json();

    // Verify session belongs to user
    const existingSession = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id
      }
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Calculate new completion metrics
    const answeredQuestions = responses?.filter((r: any) => r.audioURL).length || 0;
    const completionRate = Math.round((answeredQuestions / existingSession.totalQuestions) * 100);

    // Delete existing responses and create new ones
    await prisma.response.deleteMany({
      where: {
        sessionId: sessionId
      }
    });

    const updatedSession = await prisma.interviewSession.update({
      where: {
        id: sessionId
      },
      data: {
        answeredQuestions,
        completionRate,
        responses: {
          create: responses?.map((r: any) => ({
            question: r.question,
            audioURL: r.audioURL,
            duration: r.duration || 0,
            feedback: r.feedback,
            timestamp: new Date(r.timestamp || Date.now())
          })) || []
        }
      },
      include: {
        responses: true
      }
    });

    return NextResponse.json({
      session: {
        id: updatedSession.id,
        roleTitle: updatedSession.roleTitle,
        roleCategory: updatedSession.roleCategory,
        roleLevel: updatedSession.roleLevel,
        company: updatedSession.company,
        date: updatedSession.date.getTime(),
        completionRate: updatedSession.completionRate,
        totalQuestions: updatedSession.totalQuestions,
        answeredQuestions: updatedSession.answeredQuestions,
        responses: updatedSession.responses.map(r => ({
          question: r.question,
          audioURL: r.audioURL,
          duration: r.duration,
          feedback: r.feedback || undefined,
          timestamp: r.timestamp.getTime()
        }))
      }
    });
  } catch (error) {
    console.error('Update session error:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}
