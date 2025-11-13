import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

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

    const { question, role, category } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

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
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      return NextResponse.json({ error: 'Invalid AI response' }, { status: 500 });
    }

    return NextResponse.json(hintsData);
  } catch (error: any) {
    console.error('Error generating hints:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate hints',
        message: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
