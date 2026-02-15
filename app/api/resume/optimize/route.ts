import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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
    const rateLimitResult = await checkApiRateLimit('aiFeedback', identifier);

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

    // Build the prompt for Claude - Enhanced for competitive resume optimization
    const prompt = `You are an elite executive resume writer and career strategist with 15+ years of experience optimizing resumes for Fortune 500 companies, FAANG, and top-tier organizations. Your resumes consistently achieve 90%+ ATS pass rates and 3x more interview callbacks.

${targetRole ? `🎯 TARGET ROLE: ${targetRole}\n\n` : ''}CURRENT RESUME DATA:

**PROFESSIONAL SUMMARY:**
${resumeData.summary || 'No summary provided'}

**WORK EXPERIENCE:**
${resumeData.experience.map(exp => `
- ${exp.position} at ${exp.company}
  ${exp.description}
`).join('\n')}

**TECHNICAL SKILLS:**
${resumeData.skills.filter(s => s.trim()).join(', ')}

**KEY PROJECTS:**
${resumeData.projects.map(proj => `
- ${proj.name}
  ${proj.description}
  Technologies: ${proj.technologies}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## YOUR OPTIMIZATION MISSION:

Transform this resume using advanced optimization frameworks used by $500/hr executive career coaches:

### 1. PROFESSIONAL SUMMARY (Executive Branding):
- Craft a powerful 3-4 sentence executive summary
- Lead with quantifiable value proposition (e.g., "Drove $10M revenue growth...")
- Include industry-specific keywords for ATS optimization
- Use powerful positioning language (e.g., "Award-winning," "Results-driven," "Strategic")
- Highlight unique differentiators and competitive advantages
- Target the specific role and industry if provided

### 2. EXPERIENCE OPTIMIZATION (STAR/PAR Framework):
For EACH work experience, apply the PAR (Problem-Action-Result) framework:
- **Situation/Problem**: What challenge existed?
- **Action**: What specific actions did they take? (Use powerful action verbs)
- **Result**: What measurable impact did they achieve?

**Power Verb Categories to Use:**
- Leadership: Spearheaded, Orchestrated, Championed, Pioneered
- Achievement: Achieved, Surpassed, Exceeded, Delivered
- Innovation: Engineered, Architected, Revolutionized, Transformed
- Growth: Scaled, Expanded, Accelerated, Amplified
- Impact: Generated, Optimized, Streamlined, Enhanced

**Quantification Requirements:**
- Add metrics: percentages, dollar amounts, time saved, users impacted
- Use concrete numbers: "Led team of 12" instead of "Led team"
- Show ROI: "Reduced costs by 35% ($2.3M annually)"
- Demonstrate scale: "Serving 100K+ daily active users"

### 3. PROJECT DESCRIPTIONS (Impact-Driven):
Transform each project to showcase:
- Business impact and measurable outcomes
- Technical depth and complexity
- Problem-solving and innovation
- Team leadership or collaboration
- Technologies positioned as tools to achieve results, not just buzzwords

### 4. ATS OPTIMIZATION CHECKLIST:
- Identify critical keywords missing from current resume
- Ensure industry-standard terminology is used
- Check for ATS-friendly formatting suggestions
- Verify all achievements are quantified where possible

### 5. STRATEGIC RECOMMENDATIONS (Top 7):
Provide specific, actionable recommendations that would cost $500+ at TopResume:
- Industry-specific optimizations
- Missing credentials or certifications to highlight
- LinkedIn profile alignment suggestions
- Interview-winning talking points based on achievements
- Competitive positioning advice
- Salary negotiation leverage points
- Personal branding opportunities

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return your response as a JSON object with this structure:
{
  "summary": "Optimized executive summary with quantifiable value proposition and ATS keywords",
  "experience": [
    {
      "company": "company name",
      "position": "position",
      "description": "Bullet points using PAR framework with quantified achievements. Each bullet should start with power verb and include measurable results. Minimum 3-5 bullets per role, each 1-2 lines maximum."
    }
  ],
  "projects": [
    {
      "name": "project name",
      "description": "Impact-driven description highlighting business value, scale, and measurable outcomes. Include specific technologies strategically."
    }
  ],
  "atsKeywords": ["critical keyword 1", "critical keyword 2", "...up to 15 keywords"],
  "recommendations": [
    "Specific recommendation 1 with tactical implementation",
    "Specific recommendation 2 with expected impact",
    "...7 total strategic recommendations"
  ],
  "impactScore": {
    "before": 45,
    "after": 92,
    "improvement": "Explanation of how optimization improved ATS compatibility and recruiter appeal"
  }
}

**CRITICAL**: Every single experience bullet and project description MUST include quantifiable metrics or measurable impact. Generic statements will not pass ATS screening or impress recruiters.`;

    // Call Claude API with increased token limit for comprehensive optimization
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096, // Doubled for more detailed, competitive output
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
