import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Anthropic from '@anthropic-ai/sdk';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { getClientIP } from '@/lib/api-middleware';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * AI-Powered LinkedIn Profile Parser
 * Extracts structured data from copied LinkedIn profile text
 */
export async function POST(req: NextRequest) {
  try {
    // Check API key configuration
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Authentication
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

    const { profileText } = await req.json();

    if (!profileText || profileText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Profile text is too short. Please paste your complete LinkedIn profile.' },
        { status: 400 }
      );
    }

    // Use Claude to parse the LinkedIn profile
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are an expert LinkedIn profile parser. Extract structured information from the following LinkedIn profile text.

**LINKEDIN PROFILE TEXT:**
${profileText}

**YOUR TASK:**
Parse this LinkedIn profile and extract ALL available information into a structured JSON format.

**EXTRACTION RULES:**
1. **Headline**: Extract the professional headline (usually right after the name)
2. **About**: Extract the full "About" or summary section
3. **Experience**: Extract all work experience with:
   - Job title
   - Company name
   - Duration (e.g., "Jan 2020 - Present" or "2 yrs 3 mos")
   - Description/bullets (all accomplishments and responsibilities)
4. **Skills**: Extract all listed skills
5. **Education**: Extract degree, institution, and graduation year
6. **Certifications**: Extract any certifications or licenses
7. **Projects**: Extract notable projects if mentioned

**IMPORTANT PARSING GUIDELINES:**
- If a section is missing, use empty array [] or empty string ""
- Preserve all metrics, numbers, and achievements
- Keep bullet points and descriptions intact
- Extract actual text, don't generate or invent anything
- For experience duration, preserve exactly as written

**OUTPUT FORMAT:**
Return ONLY a valid JSON object with this exact structure:
{
  "headline": "extracted headline text",
  "about": "extracted about/summary section",
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "duration": "time period",
      "description": "full description with all bullets and achievements"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "education": [
    {
      "degree": "degree name",
      "institution": "school name",
      "year": "graduation year or period"
    }
  ],
  "certifications": ["cert1", "cert2"],
  "projects": [
    {
      "title": "project name",
      "description": "project description"
    }
  ]
}

**CRITICAL**: Return ONLY the JSON object, no additional text, explanation, or markdown formatting.`,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response
    let parsedProfile;
    try {
      // Try to extract JSON from potential markdown wrapping
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedProfile = JSON.parse(jsonMatch[0]);
      } else {
        parsedProfile = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      console.error('Response text:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse profile. Please try again or check the format.' },
        { status: 500 }
      );
    }

    // Validate the parsed data has required fields
    if (!parsedProfile.headline && !parsedProfile.about && (!parsedProfile.experience || parsedProfile.experience.length === 0)) {
      return NextResponse.json(
        { error: 'Could not extract enough information from the profile. Please ensure you copied your complete LinkedIn profile text.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: parsedProfile,
    });

  } catch (error) {
    console.error('Profile parsing error:', error);

    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service not configured. Please contact support.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to parse profile. Please try again.' },
      { status: 500 }
    );
  }
}
