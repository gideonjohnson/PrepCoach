import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
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

    // Apply rate limiting for AI code review endpoint
    const identifier = (session?.user as any)?.id;
    const rateLimit = await checkApiRateLimit('aiFeedback', identifier);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many code review requests. Please try again later.',
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
    const codeReviewSchema = z.object({
      code: z.string().trim().min(1, 'Code is required').max(50000, 'Code too long (max 50KB)'),
      language: z.string().trim().min(1, 'Language is required').max(50, 'Language name too long'),
      question: z.string().trim().min(1, 'Question is required').max(2000, 'Question too long'),
      role: z.string().trim().max(200, 'Role too long').optional(),
      category: z.string().trim().max(100, 'Category too long').optional(),
    });

    const validation = codeReviewSchema.safeParse(body);
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

    const { code, language, question, role, category } = validation.data;

    const prompt = `You are an expert technical interviewer conducting a coding interview. Review this code solution and provide detailed, constructive feedback.

INTERVIEW CONTEXT:
- Role: ${role || 'Software Engineer'}
- Category: ${category || 'Technology'}
- Language: ${language}
- Question: "${question}"

CANDIDATE'S SOLUTION:
\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive code review with the following structure:

**🎯 Solution Assessment**
[2-3 sentences: Does this solve the problem? Is the approach correct? Overall quality?]

**✅ What's Working Well**
• [Specific strength with code example if relevant]
• [Another strength]
• [Third strength if applicable]

**⚠️ Issues & Concerns**
• [Specific bug, error, or problem with explanation]
• [Another issue]
• [Third issue if applicable]

**🔧 Code Quality Analysis**
- **Time Complexity:** O(?) - [Explain]
- **Space Complexity:** O(?) - [Explain]
- **Readability:** [Score/10] - [Brief comment]
- **Best Practices:** [Score/10] - [Brief comment]

**💡 Suggested Improvements**
\`\`\`${language}
// Show a better version or key improvements
// Comment on why these changes are better
\`\`\`

**🎭 Interview Performance**
[2-3 sentences: How would this code be perceived in a real interview at ${role || 'top tech companies'}? Would it pass? What would distinguish it from other candidates?]

**📊 Overall Score: [X/10]**

Be honest, specific, and focus on helping them improve. Reference actual code from their solution when giving feedback.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const feedback = message.content[0].type === 'text' ? message.content[0].text : '';

    // Increment usage counter
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      await fetch(`${baseUrl}/api/user/increment-usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || '',
        },
        body: JSON.stringify({ feature: 'feedback' }),
      });
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }

    return NextResponse.json({ feedback });
  } catch (error: any) {
    console.error('Error reviewing code:', error);
    return NextResponse.json(
      {
        error: 'Failed to review code',
        message: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
