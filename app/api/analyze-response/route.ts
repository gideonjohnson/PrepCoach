import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { aiFeedbackSchema, safeValidateData, formatZodError } from '@/lib/validation';

// Check if API key is configured
if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
  console.warn('⚠️  ANTHROPIC_API_KEY is not configured. AI feedback will not work.');
  console.warn('📝 Get your API key from: https://console.anthropic.com/');
  console.warn('💡 See SETUP.md for detailed instructions');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Apply rate limiting
    const rateLimitResult = await checkApiRateLimit(
      'aiFeedback',
      session.user.email || request.ip || 'anonymous'
    );

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.reset);
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many AI feedback requests. Please try again after ${resetDate.toLocaleTimeString()}.`,
          limit: rateLimitResult.limit,
          remaining: 0,
          reset: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Check subscription limits
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const limitsResponse = await fetch(`${baseUrl}/api/user/check-limits?feature=feedback`, {
        headers: {
          'Cookie': request.headers.get('cookie') || '',
        },
      });

      if (limitsResponse.ok) {
        const limitsData = await limitsResponse.json();
        if (!limitsData.allowed) {
          return NextResponse.json(
            {
              error: 'Subscription limit reached',
              message: limitsData.reason || 'You have reached your feedback limit for this month. Please upgrade to continue.',
              code: 'limit_reached'
            },
            { status: 403 }
          );
        }
      }
    } catch (error) {
      console.error('Error checking limits:', error);
      // Continue even if limit check fails to avoid blocking users
    }

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
      return NextResponse.json(
        {
          error: 'Anthropic API key not configured',
          message: 'Please add your ANTHROPIC_API_KEY to the .env file. See SETUP.md for instructions.',
          setupUrl: 'https://console.anthropic.com/'
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Validate input with Zod
    const validation = safeValidateData(aiFeedbackSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formatZodError(validation.error),
        },
        { status: 400 }
      );
    }

    const { transcript, question, role, category } = validation.data;

    const prompt = `You are an expert interview coach providing constructive feedback on interview responses.

Interview Context:
- Role: ${role || 'General'}
- Category: ${category || 'General'}
- Question: "${question}"

Candidate's Response:
"${transcript}"

Please provide detailed, actionable feedback on this interview response. Structure your feedback as follows:

1. **Overall Assessment** (1-2 sentences): Brief summary of the response quality.

2. **Strengths** (2-3 bullet points): What the candidate did well.

3. **Areas for Improvement** (2-3 bullet points): Specific things to work on.

4. **Suggestions** (2-3 bullet points): Concrete recommendations for improving the answer.

5. **Score** (1-10): Rate the response on:
   - Content & Relevance
   - Structure & Clarity
   - Communication Style

Be constructive, specific, and actionable. Focus on helping the candidate improve their interview skills.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const feedback = message.content[0].type === 'text' ? message.content[0].text : '';

    // Increment feedback usage counter
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      await fetch(`${baseUrl}/api/user/increment-usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || '',
        },
        body: JSON.stringify({ feature: 'feedback' })
      });
    } catch (error) {
      console.error('Error incrementing feedback usage:', error);
      // Don't block the response if usage tracking fails
    }

    return NextResponse.json({ feedback });
  } catch (error: any) {
    console.error('Error analyzing response:', error);

    // Handle quota/credit errors
    if (error?.status === 429 || error?.error?.type === 'insufficient_credits') {
      return NextResponse.json(
        {
          error: 'Anthropic API quota exceeded',
          message: 'You have exceeded your Anthropic API quota. Please check your plan and billing details at https://console.anthropic.com/settings/billing',
          code: 'quota_exceeded'
        },
        { status: 429 }
      );
    }

    // Handle rate limit errors
    if (error?.status === 429 || error?.error?.type === 'rate_limit_error') {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please wait a moment and try again.',
          code: 'rate_limit'
        },
        { status: 429 }
      );
    }

    // Handle authentication errors
    if (error?.status === 401 || error?.error?.type === 'authentication_error') {
      return NextResponse.json(
        {
          error: 'API authentication failed',
          message: 'Your Anthropic API key is invalid. Please check your API key in the .env file.',
          code: 'auth_error'
        },
        { status: 401 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: 'Failed to analyze response',
        message: error?.message || 'An unexpected error occurred while analyzing your response',
        code: 'analysis_failed'
      },
      { status: 500 }
    );
  }
}
