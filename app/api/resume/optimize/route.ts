import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Anthropic from '@anthropic-ai/sdk';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { getClientIP } from '@/lib/api-middleware';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    // Check if Anthropic API is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting
    const identifier = getClientIP(req);
    const rateLimitResult = await checkApiRateLimit('ai', identifier);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { resumeData, targetRole } = body as { resumeData: ResumeData; targetRole?: string };

    if (!resumeData) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      );
    }

    // Build the prompt for Claude
    const prompt = `You are an expert resume writer and career coach. Optimize the following resume to make it more impactful, professional, and ATS-friendly.

${targetRole ? `Target Role: ${targetRole}\n\n` : ''}Current Resume Data:

**Summary:**
${resumeData.summary || 'No summary provided'}

**Experience:**
${resumeData.experience.map(exp => `
- ${exp.position} at ${exp.company}
  ${exp.description}
`).join('\n')}

**Skills:**
${resumeData.skills.filter(s => s.trim()).join(', ')}

**Projects:**
${resumeData.projects.map(proj => `
- ${proj.name}
  ${proj.description}
  Technologies: ${proj.technologies}
`).join('\n')}

Please provide optimized versions of:
1. Professional Summary (2-3 compelling sentences)
2. Each work experience description (use strong action verbs, quantify achievements)
3. Each project description (highlight impact and technical depth)
4. Top 5 recommended improvements

Return your response as a JSON object with this structure:
{
  "summary": "optimized summary",
  "experience": [
    { "company": "company name", "position": "position", "description": "optimized description" }
  ],
  "projects": [
    { "name": "project name", "description": "optimized description" }
  ],
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response (Claude might wrap it in markdown)
    let optimizedData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        optimizedData = JSON.parse(jsonMatch[0]);
      } else {
        optimizedData = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      optimizedData,
    });
  } catch (error) {
    console.error('Resume optimization error:', error);

    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service not configured. Please contact support.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to optimize resume. Please try again.' },
      { status: 500 }
    );
  }
}
