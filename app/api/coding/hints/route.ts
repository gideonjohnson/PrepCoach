import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const hintSchema = z.object({
  problemId: z.string(),
  sessionId: z.string().optional(),
  code: z.string().default(''),
  hintLevel: z.number().min(1).max(4),
});

const HINT_LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: 'Give a very subtle nudge. Mention the general category of approach without naming the specific algorithm. Ask a guiding question that points them in the right direction. Do NOT reveal the solution approach.',
  2: 'Name the algorithmic approach or data structure needed (e.g., "Use a hash map" or "Think about dynamic programming"). Explain WHY this approach works for this problem at a high level. Do NOT provide any code or pseudocode.',
  3: 'Provide a detailed step-by-step strategy for solving the problem. Include pseudocode or outline the key steps in order. Mention edge cases to consider. Do NOT write the actual solution code.',
  4: 'Provide the full solution approach with code-level detail. Walk through the logic step by step. Include the time and space complexity analysis. This is the final hint before revealing the solution.',
};

// POST /api/coding/hints - Get a progressive AI hint
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = hintSchema.parse(body);

    // Get the problem details
    const problem = await prisma.problem.findUnique({
      where: { id: validated.problemId },
    });

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Check if there are pre-written hints at this level
    const storedHints: string[] = JSON.parse(problem.hints);
    if (storedHints.length >= validated.hintLevel) {
      // Use stored hint but enhance with AI if user has code
      if (!validated.code) {
        // Return the stored hint directly
        const hint = storedHints[validated.hintLevel - 1];

        // Update session if provided
        if (validated.sessionId) {
          await updateSessionHints(validated.sessionId, validated.hintLevel, hint);
        }

        return NextResponse.json({
          hint,
          hintLevel: validated.hintLevel,
          maxLevel: 4,
          source: 'stored',
        });
      }
    }

    // Generate AI hint based on the problem and user's current code
    const prompt = `You are a coding interview coach. A candidate is working on the following problem and needs a hint.

PROBLEM: ${problem.title}
DESCRIPTION: ${problem.description}
DIFFICULTY: ${problem.difficulty}
CONSTRAINTS: ${problem.constraints}

${validated.code ? `CANDIDATE'S CURRENT CODE:\n\`\`\`\n${validated.code}\n\`\`\`` : 'The candidate has not written any code yet.'}

HINT LEVEL: ${validated.hintLevel} of 4
INSTRUCTION: ${HINT_LEVEL_DESCRIPTIONS[validated.hintLevel]}

${validated.code ? 'Look at the candidate\'s code and tailor your hint based on what they\'ve attempted so far. If they\'re on the right track, encourage them and guide them past their current sticking point. If they\'re going in the wrong direction, gently redirect them.' : ''}

Provide the hint in a clear, encouraging, and concise way. Format the response as plain text (no JSON). Keep it under 200 words for levels 1-2, under 300 words for level 3, and under 400 words for level 4.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [
        { role: 'user', content: prompt },
      ],
    });

    const hint = response.content[0].type === 'text'
      ? response.content[0].text
      : 'Unable to generate hint.';

    // Update session if provided
    if (validated.sessionId) {
      await updateSessionHints(validated.sessionId, validated.hintLevel, hint);
    }

    return NextResponse.json({
      hint,
      hintLevel: validated.hintLevel,
      maxLevel: 4,
      source: 'ai',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error generating hint:', error);
    return NextResponse.json(
      { error: 'Failed to generate hint' },
      { status: 500 }
    );
  }
}

async function updateSessionHints(sessionId: string, hintLevel: number, hint: string) {
  try {
    const existing = await prisma.codingSession.findUnique({
      where: { id: sessionId },
      select: { aiHints: true, hintsUsed: true },
    });

    if (existing) {
      const hints = JSON.parse(existing.aiHints);
      hints.push({
        level: hintLevel,
        hint,
        timestamp: Date.now(),
      });

      await prisma.codingSession.update({
        where: { id: sessionId },
        data: {
          aiHints: JSON.stringify(hints),
          hintsUsed: Math.max(existing.hintsUsed, hintLevel),
        },
      });
    }
  } catch {
    // Non-critical, ignore errors
  }
}
