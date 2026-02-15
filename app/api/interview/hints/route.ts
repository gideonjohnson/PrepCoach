import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Apply rate limiting for AI hints endpoint
    const identifier = (session?.user as { id: string })?.id;
    const rateLimit = await checkApiRateLimit('aiFeedback', identifier);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many hint requests. Please try again later.',
          resetAt: new Date(rateLimit.reset).toISOString()
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.reset.toString(),
          }
        }
      );
    }

    const body = await request.json();

    // Validate input
    const hintsSchema = z.object({
      question: z.string().trim().min(1, 'Question is required').max(2000, 'Question too long'),
      role: z.string().trim().max(200, 'Role too long').optional(),
      category: z.string().trim().max(100, 'Category too long').optional(),
    });

    const validation = hintsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const { question, role, category } = validation.data;

    const prompt = `You are an expert interview coach. Generate 4 smart, actionable hints to help a candidate answer this interview question effectively.

CONTEXT:
- Role: ${role || 'General Position'}
- Category: ${category || 'General'}
- Question: "${question}"

Generate exactly 4 hints in this format:

1. **Framework Hint** (icon: 💡)
   - Title: Suggested framework to structure the answer (e.g., "Use the STAR Method", "Apply First Principles")
   - Content: Brief explanation of how to apply this framework to THIS specific question

2. **Key Point Hint** (icon: 🎯)
   - Title: Critical point they MUST cover (e.g., "Emphasize Impact", "Show Leadership")
   - Content: Specific aspect they should definitely include and why it matters for ${role || 'this role'}

3. **Example Hint** (icon: 💼)
   - Title: Type of example that would work well (e.g., "Use a Team Conflict Example", "Cite a Technical Challenge")
   - Content: Specific guidance on what kind of story/example would resonate for this question

4. **Pitfall Hint** (icon: ⚠️)
   - Title: Common mistake to avoid (e.g., "Don't Be Too Vague", "Avoid Taking All Credit")
   - Content: Specific warning about what NOT to do or say

Return your response as valid JSON in this EXACT format:
{
  "hints": [
    {
      "type": "framework",
      "icon": "💡",
      "title": "Brief framework title",
      "content": "Detailed explanation"
    },
    {
      "type": "key_point",
      "icon": "🎯",
      "title": "Key point title",
      "content": "Detailed explanation"
    },
    {
      "type": "example",
      "icon": "💼",
      "title": "Example type",
      "content": "Detailed explanation"
    },
    {
      "type": "pitfall",
      "icon": "⚠️",
      "title": "Pitfall to avoid",
      "content": "Detailed explanation"
    }
  ]
}

IMPORTANT: Return ONLY valid JSON, no other text.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON response
    let hintsData;
    try {
      hintsData = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse AI response:', responseText);
      return NextResponse.json({ error: 'Invalid AI response' }, { status: 500 });
    }

    return NextResponse.json(hintsData);
  } catch (error) {
    console.error('Error generating hints:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to generate hints',
        message,
      },
      { status: 500 }
    );
  }
}
