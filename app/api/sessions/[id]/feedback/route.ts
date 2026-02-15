import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(2000).optional(),
  isPublic: z.boolean().default(true),
  // Interviewer-specific fields
  technicalSkillsRating: z.number().min(1).max(5).optional(),
  communicationRating: z.number().min(1).max(5).optional(),
  problemSolvingRating: z.number().min(1).max(5).optional(),
  strengths: z.array(z.string()).optional(),
  areasForImprovement: z.array(z.string()).optional(),
});

// POST /api/sessions/[id]/feedback - Submit feedback for a session
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
    const body = await req.json();
    const validated = feedbackSchema.parse(body);

    // Get the expert session
    const expertSession = await prisma.expertSession.findUnique({
      where: { id },
      include: {
        interviewer: true,
      },
    });

    if (!expertSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (expertSession.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only provide feedback for completed sessions' },
        { status: 400 }
      );
    }

    // Determine if user is candidate or interviewer
    const isCandidate = expertSession.candidateId === userId;
    const isInterviewer = expertSession.interviewer.userId === userId;

    if (!isCandidate && !isInterviewer) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    if (isCandidate) {
      // Check if candidate already submitted feedback
      if (expertSession.candidateFeedback) {
        return NextResponse.json(
          { error: 'Feedback already submitted' },
          { status: 400 }
        );
      }

      // Create review for interviewer
      const review = await prisma.interviewerReview.create({
        data: {
          sessionId: id,
          interviewerId: expertSession.interviewerId,
          reviewerId: userId,
          overallRating: validated.rating,
          communicationRating: validated.communicationRating || null,
          review: validated.comment || null,
          isPublic: validated.isPublic,
        },
      });

      // Update session with feedback
      await prisma.expertSession.update({
        where: { id },
        data: {
          candidateFeedback: JSON.stringify({
            rating: validated.rating,
            comment: validated.comment,
          }),
        },
      });

      // Update interviewer's average rating
      const allReviews = await prisma.interviewerReview.findMany({
        where: { interviewerId: expertSession.interviewerId },
        select: { overallRating: true },
      });

      const avgRating = allReviews.reduce((sum, r) => sum + r.overallRating, 0) / allReviews.length;

      await prisma.interviewer.update({
        where: { id: expertSession.interviewerId },
        data: { averageRating: avgRating },
      });

      return NextResponse.json({
        review,
        message: 'Thank you for your feedback!',
      });
    } else {
      // Interviewer providing feedback to candidate
      if (expertSession.interviewerFeedback) {
        return NextResponse.json(
          { error: 'Feedback already submitted' },
          { status: 400 }
        );
      }

      // Build detailed feedback
      const detailedFeedback = {
        rating: validated.rating,
        technicalSkillsRating: validated.technicalSkillsRating,
        communicationRating: validated.communicationRating,
        problemSolvingRating: validated.problemSolvingRating,
        strengths: validated.strengths || [],
        areasForImprovement: validated.areasForImprovement || [],
        comment: validated.comment,
      };

      // Update session with interviewer feedback
      await prisma.expertSession.update({
        where: { id },
        data: {
          interviewerFeedback: JSON.stringify(detailedFeedback),
        },
      });

      return NextResponse.json({
        feedback: detailedFeedback,
        message: 'Feedback submitted successfully!',
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}

// GET /api/sessions/[id]/feedback - Get feedback for a session
export async function GET(
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
      include: {
        interviewer: true,
      },
    });

    if (!expertSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check authorization
    const isCandidate = expertSession.candidateId === userId;
    const isInterviewer = expertSession.interviewer.userId === userId;

    if (!isCandidate && !isInterviewer) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Get review if exists
    const review = await prisma.interviewerReview.findFirst({
      where: { sessionId: id },
    });

    return NextResponse.json({
      candidateFeedback: expertSession.candidateFeedback
        ? JSON.parse(expertSession.candidateFeedback)
        : null,
      interviewerFeedback: expertSession.interviewerFeedback
        ? JSON.parse(expertSession.interviewerFeedback)
        : null,
      review,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}
