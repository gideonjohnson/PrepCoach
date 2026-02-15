import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { safeJsonParse } from '@/lib/utils';

const anthropic = new Anthropic();

// GET /api/coding/session/[id] - Get a specific coding session
export async function GET(
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

    const codingSession = await prisma.codingSession.findUnique({
      where: { id },
      include: {
        problem: true,
      },
    });

    if (!codingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (codingSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Parse JSON fields
    const response = {
      ...codingSession,
      codeSnapshots: safeJsonParse(codingSession.codeSnapshots, []),
      testResults: safeJsonParse(codingSession.testResults, []),
      aiHints: safeJsonParse(codingSession.aiHints, []),
      problem: codingSession.problem ? {
        ...codingSession.problem,
        companies: safeJsonParse(codingSession.problem.companies, []),
        tags: safeJsonParse(codingSession.problem.tags, []),
        constraints: safeJsonParse(codingSession.problem.constraints, []),
        examples: safeJsonParse(codingSession.problem.examples, []),
        hints: safeJsonParse(codingSession.problem.hints, []),
        testCases: safeJsonParse(codingSession.problem.testCases, []),
      } : null,
    };

    return NextResponse.json({ session: response });
  } catch (error) {
    console.error('Error fetching coding session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

// PATCH /api/coding/session/[id] - Update a coding session
const updateSessionSchema = z.object({
  code: z.string().optional(),
  language: z.string().optional(),
  status: z.enum(['active', 'completed', 'abandoned']).optional(),
  addSnapshot: z.boolean().optional(), // If true, add current code as snapshot
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

    // Find existing session
    const existingSession = await prisma.codingSession.findUnique({
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

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (validated.code !== undefined) {
      updateData.code = validated.code;
    }

    if (validated.language !== undefined) {
      updateData.language = validated.language;
    }

    if (validated.status !== undefined) {
      updateData.status = validated.status;

      if (validated.status === 'completed') {
        updateData.completedAt = new Date();
        updateData.duration = Math.round(
          (Date.now() - existingSession.startedAt.getTime()) / 1000
        );

        // Score the session
        const codeToScore = validated.code || existingSession.code;
        const testResults = safeJsonParse(existingSession.testResults || '[]', []);
        const totalTests = testResults.length;
        const passedTests = testResults.filter((t: { passed: boolean }) => t.passed).length;

        // Fetch problem for context
        const problem = existingSession.problemId
          ? await prisma.problem.findUnique({ where: { id: existingSession.problemId } })
          : null;

        // Calculate base score from test cases (0-60 points)
        const testScore = totalTests > 0
          ? Math.round((passedTests / totalTests) * 60)
          : 0;

        // AI analysis for code quality (0-40 points)
        try {
          const analysisPrompt = `Analyze this coding solution and score it.

${problem ? `Problem: ${problem.title}\nDescription: ${problem.description}\nExpected Time Complexity: ${problem.timeComplexity || 'N/A'}\nExpected Space Complexity: ${problem.spaceComplexity || 'N/A'}` : 'Free-form coding session.'}

Code (${existingSession.language}):
\`\`\`
${codeToScore}
\`\`\`

Test Results: ${passedTests}/${totalTests} passed
Hints Used: ${existingSession.hintsUsed}
Time Spent: ${Math.round((Date.now() - existingSession.startedAt.getTime()) / 1000)}s

Score the code quality out of 40 points based on:
- Correctness & edge case handling (0-15)
- Time/space complexity efficiency (0-15)
- Code readability & style (0-10)

Deduct points if hints were used: -3 per hint level used (max deduction: -12).

Respond in JSON format:
{
  "qualityScore": <0-40>,
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "strengths": ["..."],
  "improvements": ["..."],
  "summary": "Brief 2-3 sentence analysis"
}`;

          const aiResponse = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 800,
            messages: [{ role: 'user', content: analysisPrompt }],
          });

          const aiText = aiResponse.content[0].type === 'text' ? aiResponse.content[0].text : '';
          const jsonMatch = aiText.match(/\{[\s\S]*\}/);

          if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            const qualityScore = Math.min(40, Math.max(0, analysis.qualityScore || 0));
            updateData.score = Math.min(100, testScore + qualityScore);
            updateData.aiAnalysis = JSON.stringify(analysis);
          } else {
            updateData.score = testScore;
          }
        } catch (aiError) {
          console.error('AI scoring failed:', aiError);
          updateData.score = testScore;
        }
      }
    }

    // Add code snapshot if requested
    if (validated.addSnapshot && validated.code) {
      const snapshots = safeJsonParse<Array<{ timestamp: number; code: string }>>(existingSession.codeSnapshots, []);
      snapshots.push({
        timestamp: Date.now(),
        code: validated.code,
      });
      updateData.codeSnapshots = JSON.stringify(snapshots);
    }

    const updatedSession = await prisma.codingSession.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error updating coding session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

// DELETE /api/coding/session/[id] - Delete a coding session
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

    const existingSession = await prisma.codingSession.findUnique({
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

    await prisma.codingSession.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coding session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
