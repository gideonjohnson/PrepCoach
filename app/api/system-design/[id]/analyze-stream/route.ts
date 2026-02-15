import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { safeJsonParse } from '@/lib/utils';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// POST /api/system-design/[id]/analyze-stream - Stream AI analysis feedback
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = await params;
    const body = await req.json();
    const { diagramData, analysisType = 'full' } = body;

    if (!diagramData) {
      return new Response(JSON.stringify({ error: 'Diagram data is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the session
    const existingSession = await prisma.systemDesignSession.findUnique({
      where: { id },
      include: { problem: true },
    });

    if (!existingSession) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (existingSession.userId !== session.user.id) {
      return new Response(JSON.stringify({ error: 'Access denied' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build the analysis prompt based on type
    const rubric = existingSession.problem
      ? safeJsonParse(existingSession.problem.rubric, [])
      : [];

    const rubricText = rubric.length > 0
      ? `\nScoring Rubric:\n${rubric.map((r: { criterion: string; maxPoints: number; description: string }) =>
          `- ${r.criterion} (max ${r.maxPoints} pts): ${r.description}`
        ).join('\n')}\n`
      : '';

    const problemContext = existingSession.problem
      ? `
Problem: ${existingSession.problem.title}
Description: ${existingSession.problem.description}
Functional Requirements: ${safeJsonParse(existingSession.problem.functionalReqs, []).join(', ')}
Non-Functional Requirements: ${safeJsonParse(existingSession.problem.nonFunctionalReqs, []).join(', ')}
Constraints: ${safeJsonParse(existingSession.problem.constraints, []).join(', ')}
Key Components Expected: ${safeJsonParse(existingSession.problem.keyComponents, []).join(', ')}
${rubricText}`
      : 'Free-form system design practice';

    let systemPrompt: string;
    let userPrompt: string;

    switch (analysisType) {
      case 'quick':
        // Quick feedback - just strengths and immediate suggestions
        systemPrompt = `You are an expert system design interviewer providing real-time feedback. Be concise and actionable. Respond in a conversational tone as if coaching the candidate live.`;
        userPrompt = `Review this system design diagram and provide quick feedback.

${problemContext}

Diagram:
${JSON.stringify(diagramData, null, 2)}

Provide 2-3 immediate observations and 1-2 quick suggestions for improvement. Be encouraging but constructive.`;
        break;

      case 'scalability':
        // Focus on scalability analysis
        systemPrompt = `You are an expert in distributed systems and scalability. Analyze system designs for their ability to handle growth.`;
        userPrompt = `Analyze this system design for scalability concerns.

${problemContext}

Diagram:
${JSON.stringify(diagramData, null, 2)}

Focus on:
1. Potential bottlenecks as traffic increases
2. Database scaling strategies
3. Caching opportunities
4. Load balancing considerations
5. Horizontal vs vertical scaling options`;
        break;

      case 'reliability':
        // Focus on reliability and fault tolerance
        systemPrompt = `You are an expert in building reliable, fault-tolerant distributed systems. Analyze designs for resilience.`;
        userPrompt = `Analyze this system design for reliability and fault tolerance.

${problemContext}

Diagram:
${JSON.stringify(diagramData, null, 2)}

Focus on:
1. Single points of failure
2. Redundancy and replication strategies
3. Failure recovery mechanisms
4. Data consistency considerations
5. Circuit breaker and retry patterns`;
        break;

      case 'full':
      default:
        // Full comprehensive analysis
        systemPrompt = `You are an expert system design interviewer providing detailed feedback. Structure your analysis clearly with sections.`;
        userPrompt = `Provide a comprehensive analysis of this system design.

${problemContext}

Notes from candidate: ${existingSession.notes || 'None'}

Diagram:
${JSON.stringify(diagramData, null, 2)}

Analyze the design covering:
1. **Overall Assessment** - Score (0-100) and summary
2. **Strengths** - What's done well
3. **Areas for Improvement** - Specific weaknesses
4. **Missing Components** - What should be added
5. **Scalability** - How well it handles growth
6. **Reliability** - Fault tolerance and resilience
7. **Recommendations** - Prioritized suggestions`;
        break;
    }

    // Create streaming response
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            stream: true,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
          });

          let fullText = '';

          for await (const event of response) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const text = event.delta.text;
              fullText += text;

              // Send the chunk
              const chunk = JSON.stringify({ type: 'chunk', text }) + '\n';
              controller.enqueue(encoder.encode(chunk));
            }
          }

          // Send completion signal with full text
          const completion = JSON.stringify({
            type: 'done',
            fullText,
            analysisType,
          }) + '\n';
          controller.enqueue(encoder.encode(completion));

          // Update session with analysis (async, don't wait)
          prisma.systemDesignSession.update({
            where: { id },
            data: {
              aiAnalysis: fullText,
            },
          }).catch(err => console.error('Failed to save analysis:', err));

          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorChunk = JSON.stringify({
            type: 'error',
            message: 'Analysis failed',
          }) + '\n';
          controller.enqueue(encoder.encode(errorChunk));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in analyze-stream:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze design' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
