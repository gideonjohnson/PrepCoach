import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/sessions - Get all sessions for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sessions = await prisma.interviewSession.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        responses: {
          orderBy: {
            timestamp: 'asc'
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Transform to match frontend format
    const formattedSessions = sessions.map(s => ({
      id: s.id,
      roleTitle: s.roleTitle,
      roleCategory: s.roleCategory,
      roleLevel: s.roleLevel,
      company: s.company,
      date: s.date.getTime(),
      completionRate: s.completionRate,
      totalQuestions: s.totalQuestions,
      answeredQuestions: s.answeredQuestions,
      responses: s.responses.map(r => ({
        question: r.question,
        audioURL: r.audioURL,
        duration: r.duration,
        feedback: r.feedback || undefined,
        timestamp: r.timestamp.getTime()
      }))
    }));

    return NextResponse.json({ sessions: formattedSessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to get sessions' },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create a new interview session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      roleTitle,
      roleCategory,
      roleLevel,
      company,
      totalQuestions,
      responses
    } = await request.json();

    if (!roleTitle || !roleCategory || !roleLevel || !company || !totalQuestions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const answeredQuestions = responses?.filter((r: any) => r && r.audioURL).length || 0;
    const completionRate = Math.round((answeredQuestions / totalQuestions) * 100);

    const interviewSession = await prisma.interviewSession.create({
      data: {
        userId: session.user.id,
        roleTitle,
        roleCategory,
        roleLevel,
        company,
        totalQuestions,
        answeredQuestions,
        completionRate,
        responses: {
          create: responses?.filter((r: any) => r && r.question).map((r: any) => ({
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
      }
    });
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
