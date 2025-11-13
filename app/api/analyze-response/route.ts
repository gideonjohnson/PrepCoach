import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { aiFeedbackSchema, safeValidateData, formatZodError } from '@/lib/validation';
import { getClientIP } from '@/lib/api-middleware';

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
      session.user.email || getClientIP(request)
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

    const { transcript, question, role, category, vocalMetrics, visualMetrics } = validation.data;

    // Build biometric insights section if data is available
    let biometricSection = '';
    if (vocalMetrics || visualMetrics) {
      biometricSection = '\n\nBIOMETRIC DATA COLLECTED:\n';

      if (vocalMetrics) {
        biometricSection += `\nVocal Analysis:
- Speaking Pace: ${vocalMetrics.pace || 'N/A'} words/minute ${vocalMetrics.pace ? (vocalMetrics.pace < 120 ? '(Too slow)' : vocalMetrics.pace > 180 ? '(Too fast)' : '(Good pace)') : ''}
- Clarity Score: ${vocalMetrics.clarity || 'N/A'}/100
- Filler Words: ${vocalMetrics.fillerWordCount || 0} detected${vocalMetrics.fillerWords?.length ? ` (${vocalMetrics.fillerWords.map((f: any) => `"${f.word}": ${f.count}`).join(', ')})` : ''}
- Pause Frequency: ${vocalMetrics.pauseCount || 0} pauses, avg ${vocalMetrics.averagePauseLength || 0}s each
- Energy Level: ${vocalMetrics.energyLevel || 'N/A'}/100
- Volume Consistency: ${vocalMetrics.volumeConsistency || 'N/A'}/100`;
      }

      if (visualMetrics) {
        biometricSection += `\n\nVisual Analysis:
- Eye Contact: ${visualMetrics.eyeContactPercentage || 'N/A'}% of the time
- Posture Score: ${visualMetrics.postureScore || 'N/A'}/100
- Facial Confidence: ${visualMetrics.facialConfidence || 'N/A'}/100
- Smile Frequency: ${visualMetrics.smileFrequency || 0} smiles/minute
- Gesture Frequency: ${visualMetrics.gestureFrequency || 0} gestures/minute
- Facing Camera: ${visualMetrics.facingCamera ? 'Yes' : 'No'}`;
      }
    }

    // Enhanced prompt with tone, context, and nuanced analysis
    const prompt = `You are an expert interview coach with deep expertise in ${category || 'professional'} roles, specifically for ${role || 'positions'}. You provide highly personalized, context-aware feedback that goes beyond surface-level observations.

INTERVIEW CONTEXT:
- Target Role: ${role || 'General Position'}
- Industry/Category: ${category || 'General'}
- Question: "${question}"

CANDIDATE'S RESPONSE:
"${transcript}"${biometricSection}

ANALYSIS FRAMEWORK:

As you analyze, consider these dimensions specific to ${category || 'this'} roles:

1. **TONE & EMOTIONAL INTELLIGENCE ANALYSIS**
   - Detect the candidate's tone: Is it confident, hesitant, enthusiastic, nervous, defensive, or authentic?
   - Assess emotional awareness: Do they show self-awareness, empathy, or emotional maturity?
   - Identify subtle cues: enthusiasm level, genuine passion vs. rehearsed responses, energy alignment with the role

2. **ROLE-SPECIFIC CONTEXT & RELEVANCE**
   - For ${role || 'this role'}: What specific competencies/skills does this answer demonstrate?
   - How well does the response align with what hiring managers in ${category || 'this field'} actually look for?
   - Does the answer demonstrate understanding of ${role || 'role'}-specific challenges?

3. **COMMUNICATION PATTERNS & DELIVERY**${biometricSection ? '\n   - USE THE BIOMETRIC DATA ABOVE to provide objective, data-driven insights on delivery' : ''}
   - Analyze speech patterns: clear structure vs. rambling, use of examples, specificity vs. vagueness
   - Identify verbal tics or filler words that reduce credibility${vocalMetrics?.fillerWordCount ? ` (${vocalMetrics.fillerWordCount} detected - be specific about impact)` : ''}
   - Assess pacing: rushed, well-paced, or overly slow${vocalMetrics?.pace ? ` (actual pace: ${vocalMetrics.pace} wpm - optimal is 140-160)` : ''}
   - Evaluate clarity: jargon usage, accessibility to non-experts, technical depth when appropriate
   - Comment on energy, vocal variety, and engagement level${vocalMetrics?.energyLevel ? ` (measured energy: ${vocalMetrics.energyLevel}/100)` : ''}

4. **BEHAVIORAL FRAMEWORK APPLICATION**
   - Does the response follow a structured approach (STAR, CAR, SOAR)?
   - Are concrete examples provided with measurable outcomes?
   - Is there a clear narrative arc (Situation → Action → Result)?

5. **AUTHENTICITY & CREDIBILITY INDICATORS**
   - Does the response feel genuine or overly rehearsed?
   - Are claims backed by specific details and evidence?
   - Does the candidate demonstrate actual experience vs. theoretical knowledge?

PROVIDE FEEDBACK IN THIS STRUCTURE:

**🎯 Tone & First Impression**
[2-3 sentences analyzing the emotional tone, confidence level, and authenticity of the response. Be specific about what the tone reveals.]

**✅ What's Working Well**
• [Specific strength with context why it matters for ${role || 'this role'}]
• [Another strength with actionable detail]
• [Third strength if applicable]

**⚠️ Critical Gaps & Missed Opportunities**
• [Specific weakness with explanation of impact]
• [Another area needing improvement with context]
• [Third area if applicable]

**💡 How to Level Up This Answer**
• [Concrete, specific suggestion with example of what to say instead]
• [Another actionable recommendation]
• [Third recommendation if applicable]

**🎭 Role-Specific Insights**
[2-3 sentences on how this answer would be perceived by ${role || 'hiring managers'} in ${category || 'this industry'}. Include what top candidates typically emphasize that this answer might be missing.]

**📊 Performance Scores**
- Content Relevance: [X/10] - [Brief explanation]
- Structure & Clarity: [X/10] - [Brief explanation]
- Tone & Confidence: [X/10] - [Brief explanation]
- Authenticity & Impact: [X/10] - [Brief explanation]

**Overall Rating: [X/10]**

IMPORTANT: Be brutally honest but constructive. Avoid generic platitudes. Give specific, actionable insights that the candidate can immediately apply. Reference the exact words/phrases they used when giving feedback.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048, // Increased for more detailed, nuanced feedback
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
