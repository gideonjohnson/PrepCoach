import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { safeJsonParse } from '@/lib/utils';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// GET /api/system-design/[id] - Get a specific session or problem
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'session';

    if (type === 'problem') {
      // Get problem by slug or id
      const problem = await prisma.systemDesignProblem.findFirst({
        where: {
          OR: [
            { id },
            { slug: id },
          ],
        },
      });

      if (!problem) {
        return NextResponse.json(
          { error: 'Problem not found' },
          { status: 404 }
        );
      }

      // Check premium access
      if (problem.isPremium) {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
          return NextResponse.json(
            { error: 'Premium subscription required' },
            { status: 403 }
          );
        }

        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { subscriptionTier: true, subscriptionStatus: true },
        });

        const hasPremium = user &&
          ['pro', 'enterprise', 'lifetime'].includes(user.subscriptionTier) &&
          user.subscriptionStatus === 'active';

        if (!hasPremium) {
          return NextResponse.json(
            { error: 'Premium subscription required' },
            { status: 403 }
          );
        }
      }

      // Parse JSON fields
      const parsedProblem = {
        ...problem,
        companies: safeJsonParse(problem.companies, []),
        tags: safeJsonParse(problem.tags, []),
        functionalReqs: safeJsonParse(problem.functionalReqs, []),
        nonFunctionalReqs: safeJsonParse(problem.nonFunctionalReqs, []),
        constraints: safeJsonParse(problem.constraints, []),
        keyComponents: safeJsonParse(problem.keyComponents, []),
        rubric: safeJsonParse(problem.rubric, []),
      };

      return NextResponse.json({ problem: parsedProblem });
    }

    // Get session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const designSession = await prisma.systemDesignSession.findUnique({
      where: { id },
      include: { problem: true },
    });

    if (!designSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (designSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Parse JSON fields
    const response = {
      ...designSession,
      diagramData: safeJsonParse(designSession.diagramData, {}),
      diagramSnapshots: safeJsonParse(designSession.diagramSnapshots, []),
      requirements: safeJsonParse(designSession.requirements, []),
      strengthsWeaknesses: designSession.strengthsWeaknesses
        ? safeJsonParse(designSession.strengthsWeaknesses, null)
        : null,
      problem: designSession.problem ? {
        ...designSession.problem,
        companies: safeJsonParse(designSession.problem.companies, []),
        tags: safeJsonParse(designSession.problem.tags, []),
        functionalReqs: safeJsonParse(designSession.problem.functionalReqs, []),
        nonFunctionalReqs: safeJsonParse(designSession.problem.nonFunctionalReqs, []),
        constraints: safeJsonParse(designSession.problem.constraints, []),
        keyComponents: safeJsonParse(designSession.problem.keyComponents, []),
        rubric: safeJsonParse(designSession.problem.rubric, []),
      } : null,
    };

    return NextResponse.json({ session: response });
  } catch (error) {
    console.error('Error fetching system design resource:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

// PATCH /api/system-design/[id] - Update a session
const updateSessionSchema = z.object({
  diagramData: z.record(z.unknown()).optional(),
  notes: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  status: z.enum(['active', 'completed', 'abandoned']).optional(),
  addSnapshot: z.boolean().optional(),
  requestAnalysis: z.boolean().optional(), // Request AI analysis
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const validated = updateSessionSchema.parse(body);

    const existingSession = await prisma.systemDesignSession.findUnique({
      where: { id },
      include: { problem: true },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (existingSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (validated.diagramData !== undefined) {
      updateData.diagramData = JSON.stringify(validated.diagramData);
    }

    if (validated.notes !== undefined) {
      updateData.notes = validated.notes;
    }

    if (validated.requirements !== undefined) {
      updateData.requirements = JSON.stringify(validated.requirements);
    }

    if (validated.status !== undefined) {
      updateData.status = validated.status;

      if (validated.status === 'completed') {
        updateData.completedAt = new Date();
        updateData.duration = Math.round(
          (Date.now() - existingSession.startedAt.getTime()) / 1000
        );
      }
    }

    // Add diagram snapshot if requested
    if (validated.addSnapshot && validated.diagramData) {
      const snapshots = safeJsonParse(existingSession.diagramSnapshots, []);
      snapshots.push({
        timestamp: Date.now(),
        data: validated.diagramData,
      });
      updateData.diagramSnapshots = JSON.stringify(snapshots);
    }

    // Request AI analysis if requested
    if (validated.requestAnalysis && validated.diagramData) {
      try {
        const rubric = existingSession.problem
          ? safeJsonParse(existingSession.problem.rubric, [])
          : [];

        const rubricText = rubric.length > 0
          ? `\nScoring Rubric (score each criterion):\n${rubric.map((r: { criterion: string; maxPoints: number; description: string }) =>
              `- ${r.criterion} (max ${r.maxPoints} pts): ${r.description}`
            ).join('\n')}\n`
          : '';

        const problemContext = existingSession.problem
          ? `
Problem: ${existingSession.problem.title}
Description: ${existingSession.problem.description}
Functional Requirements: ${existingSession.problem.functionalReqs}
Non-Functional Requirements: ${existingSession.problem.nonFunctionalReqs}
Constraints: ${existingSession.problem.constraints}
Key Components Expected: ${existingSession.problem.keyComponents}
${rubricText}`
          : 'Free-form system design practice';

        const analysisPrompt = `Analyze this system design diagram and provide feedback.

${problemContext}

Notes from candidate: ${existingSession.notes || 'None'}
Requirements tracked: ${existingSession.requirements || '[]'}

Diagram data (JSON representation of the design):
${JSON.stringify(validated.diagramData, null, 2)}

Provide analysis in the following JSON format:
{
  "overallScore": <0-100>,${rubric.length > 0 ? `
  "rubricScores": [${rubric.map((r: { criterion: string; maxPoints: number }) => `{"criterion": "${r.criterion}", "score": <0-${r.maxPoints}>, "feedback": "..."}`).join(', ')}],` : ''}
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "missingComponents": ["component 1", ...],
  "scalabilityNotes": "notes about scalability",
  "reliabilityNotes": "notes about reliability and fault tolerance"
}`;

        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [
            {
              role: 'user',
              content: analysisPrompt,
            },
          ],
        });

        const analysisText = response.content[0].type === 'text'
          ? response.content[0].text
          : '';

        // Extract JSON from response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          updateData.aiAnalysis = analysisText;
          updateData.strengthsWeaknesses = JSON.stringify({
            strengths: analysis.strengths || [],
            weaknesses: analysis.weaknesses || [],
          });
          updateData.score = analysis.overallScore;
        }
      } catch (aiError) {
        console.error('AI analysis failed:', aiError);
        // Continue without AI analysis
      }
    }

    const updatedSession = await prisma.systemDesignSession.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      session: {
        ...updatedSession,
        diagramData: safeJsonParse(updatedSession.diagramData, {}),
        diagramSnapshots: safeJsonParse(updatedSession.diagramSnapshots, []),
        requirements: safeJsonParse(updatedSession.requirements, []),
        strengthsWeaknesses: updatedSession.strengthsWeaknesses
          ? safeJsonParse(updatedSession.strengthsWeaknesses, null)
          : null,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating system design session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

// DELETE /api/system-design/[id] - Delete a session
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingSession = await prisma.systemDesignSession.findUnique({
      where: { id },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (existingSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    await prisma.systemDesignSession.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting system design session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
