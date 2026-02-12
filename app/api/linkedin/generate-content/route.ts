import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

type ContentType = 'headline' | 'about' | 'experience' | 'summary' | 'skills';

interface GenerateContentRequest {
  contentType: ContentType;
  currentContent?: string;
  targetRole: string;
  experience?: {
    title: string;
    company: string;
    description?: string;
    bullets?: string[];
  }[];
  skills?: string[];
  achievements?: string[];
  tone?: 'professional' | 'confident' | 'technical' | 'leadership';
  industry?: string;
}

// POST /api/linkedin/generate-content - AI-powered LinkedIn content generation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: GenerateContentRequest = await req.json();
    const {
      contentType,
      currentContent,
      targetRole,
      experience = [],
      skills = [],
      achievements = [],
      tone = 'professional',
      industry,
    } = body;

    if (!targetRole) {
      return NextResponse.json(
        { error: 'Target role is required' },
        { status: 400 }
      );
    }

    let prompt: string;
    let maxTokens: number;

    switch (contentType) {
      case 'headline':
        prompt = buildHeadlinePrompt(targetRole, skills, experience, tone, industry);
        maxTokens = 300;
        break;
      case 'about':
        prompt = buildAboutPrompt(targetRole, currentContent, experience, skills, achievements, tone, industry);
        maxTokens = 1500;
        break;
      case 'experience':
        prompt = buildExperiencePrompt(experience, skills, achievements, tone);
        maxTokens = 2000;
        break;
      case 'summary':
        prompt = buildSummaryPrompt(targetRole, experience, skills, achievements, tone, industry);
        maxTokens = 800;
        break;
      case 'skills':
        prompt = buildSkillsPrompt(targetRole, skills, industry);
        maxTokens = 500;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Parse the response
    let result;
    try {
      result = JSON.parse(content.text);
    } catch {
      // If not JSON, return raw text as content
      result = { content: content.text, suggestions: [] };
    }

    return NextResponse.json({
      contentType,
      generated: result,
      originalContent: currentContent,
    });
  } catch (error) {
    console.error('Error generating LinkedIn content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

function buildHeadlinePrompt(
  targetRole: string,
  skills: string[],
  experience: GenerateContentRequest['experience'],
  tone: string,
  industry?: string
): string {
  const topSkills = skills.slice(0, 5).join(', ');
  const companies = experience?.map(e => e.company).slice(0, 3).join(', ') || '';

  return `You are an expert LinkedIn profile optimizer. Generate 3 compelling headlines for a ${targetRole}${industry ? ` in the ${industry} industry` : ''}.

Context:
- Top skills: ${topSkills || 'Not specified'}
- Recent companies: ${companies || 'Not specified'}
- Tone: ${tone}

Requirements:
- Maximum 220 characters per headline
- Include relevant keywords for recruiter searches
- Show unique value proposition
- Use ${tone} tone

Respond in this exact JSON format:
{
  "headlines": [
    {
      "text": "<headline 1>",
      "keywords": ["keyword1", "keyword2"],
      "focus": "<value prop focus>"
    },
    {
      "text": "<headline 2>",
      "keywords": ["keyword1", "keyword2"],
      "focus": "<value prop focus>"
    },
    {
      "text": "<headline 3>",
      "keywords": ["keyword1", "keyword2"],
      "focus": "<value prop focus>"
    }
  ],
  "tips": ["<tip 1>", "<tip 2>"]
}`;
}

function buildAboutPrompt(
  targetRole: string,
  currentContent: string | undefined,
  experience: GenerateContentRequest['experience'],
  skills: string[],
  achievements: string[],
  tone: string,
  industry?: string
): string {
  const expSummary = experience?.map(e => `${e.title} at ${e.company}`).join('; ') || '';
  const skillsStr = skills.slice(0, 10).join(', ');
  const achievementsStr = achievements.slice(0, 5).join('; ') || 'Not specified';

  return `You are an expert LinkedIn profile optimizer. Generate a compelling About/Summary section for a ${targetRole}${industry ? ` in ${industry}` : ''}.

${currentContent ? `Current About section (to improve):\n${currentContent}\n` : ''}

Context:
- Experience: ${expSummary || 'Not specified'}
- Key skills: ${skillsStr || 'Not specified'}
- Achievements: ${achievementsStr}
- Tone: ${tone}

Requirements:
- Maximum 2,600 characters (LinkedIn limit)
- Use first person
- Include a compelling opening hook
- Structure with clear sections (emoji bullets encouraged)
- Incorporate keywords naturally for recruiter searches
- End with a call-to-action
- ${tone === 'leadership' ? 'Emphasize leadership and strategic impact' : ''}
- ${tone === 'technical' ? 'Highlight technical depth and innovation' : ''}
- ${tone === 'confident' ? 'Use assertive, achievement-focused language' : ''}

Respond in this exact JSON format:
{
  "content": "<full about section text>",
  "wordCount": <number>,
  "keywordsIncluded": ["keyword1", "keyword2", ...],
  "structure": {
    "hook": "<opening line>",
    "sections": ["<section 1 name>", "<section 2 name>", ...],
    "cta": "<call to action>"
  },
  "improvements": ["<improvement 1>", "<improvement 2>", ...]
}`;
}

function buildExperiencePrompt(
  experience: GenerateContentRequest['experience'],
  skills: string[],
  achievements: string[],
  tone: string
): string {
  const expDetails = experience?.map(e => `
Role: ${e.title} at ${e.company}
Current bullets: ${e.bullets?.join('; ') || e.description || 'None provided'}
`).join('\n') || 'No experience provided';

  return `You are an expert LinkedIn profile optimizer. Rewrite these experience bullets to be more impactful and recruiter-friendly.

Experience entries:
${expDetails}

Relevant skills to incorporate: ${skills.slice(0, 10).join(', ')}
Known achievements: ${achievements.slice(0, 5).join('; ') || 'None specified'}
Tone: ${tone}

Requirements for each bullet:
- Start with a strong action verb (Spearheaded, Architected, Delivered, etc.)
- Use the CAR format (Challenge-Action-Result)
- Include metrics when possible (%, $, time saved, etc.)
- Keep each bullet under 200 characters
- Incorporate relevant technical keywords naturally

Respond in this exact JSON format:
{
  "experiences": [
    {
      "title": "<role title>",
      "company": "<company>",
      "bullets": [
        {
          "original": "<original bullet if any>",
          "optimized": "<improved bullet>",
          "improvement": "<what was improved>"
        }
      ]
    }
  ],
  "tips": ["<general tip 1>", "<general tip 2>"]
}`;
}

function buildSummaryPrompt(
  targetRole: string,
  experience: GenerateContentRequest['experience'],
  skills: string[],
  achievements: string[],
  tone: string,
  industry?: string
): string {
  return `You are an expert LinkedIn profile optimizer. Generate a concise professional summary for a ${targetRole}${industry ? ` in ${industry}` : ''}.

Context:
- Experience: ${experience?.map(e => `${e.title} at ${e.company}`).join(', ') || 'Not specified'}
- Skills: ${skills.slice(0, 8).join(', ') || 'Not specified'}
- Achievements: ${achievements.slice(0, 3).join('; ') || 'Not specified'}
- Tone: ${tone}

Requirements:
- 2-3 sentences maximum
- Highlight unique value proposition
- Include 2-3 key skills naturally
- End with what you're looking for or open to

Respond in this exact JSON format:
{
  "summary": "<concise summary text>",
  "characterCount": <number>,
  "keyMessages": ["<key message 1>", "<key message 2>"],
  "variations": [
    "<alternative version 1>",
    "<alternative version 2>"
  ]
}`;
}

function buildSkillsPrompt(
  targetRole: string,
  currentSkills: string[],
  industry?: string
): string {
  return `You are an expert LinkedIn profile optimizer. Recommend the most valuable skills for a ${targetRole}${industry ? ` in ${industry}` : ''} to add to their LinkedIn profile.

Current skills: ${currentSkills.join(', ') || 'None listed'}

Requirements:
- Recommend 15-20 skills total
- Prioritize by recruiter search frequency
- Include both technical and soft skills
- Consider ${industry || 'general tech'} industry trends

Respond in this exact JSON format:
{
  "recommended": [
    {
      "skill": "<skill name>",
      "priority": "high" | "medium" | "low",
      "reason": "<why this skill matters>",
      "category": "technical" | "soft" | "tool" | "methodology"
    }
  ],
  "skillsToRemove": [
    {
      "skill": "<skill to remove>",
      "reason": "<why remove>"
    }
  ],
  "endorsementStrategy": "<strategy for getting endorsements>"
}`;
}
