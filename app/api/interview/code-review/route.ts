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

    const { code, language, question, role, category } = await request.json();

    if (!code || !language || !question) {
      return NextResponse.json(
        { error: 'Code, language, and question are required' },
        { status: 400 }
      );
    }

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
