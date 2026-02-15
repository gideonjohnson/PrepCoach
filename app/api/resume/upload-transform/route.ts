import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkApiRateLimit } from '@/lib/rate-limit';
import { resumeContentTransformSchema, safeValidateData, formatZodError } from '@/lib/validation';
import OpenAI from 'openai';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.' },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Apply rate limiting for resume transformation (expensive operation)
    const rateLimitResult = await checkApiRateLimit(
      'resumeTransform',
      session.user.email || 'anonymous'
    );

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.reset);
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many resume transformation requests. Please try again after ${resetDate.toLocaleTimeString()}.`,
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
          },
        }
      );
    }

    const formData = await req.formData();
    const resumeFile = formData.get('resume') as File | null;
    const targetRole = (formData.get('targetRole') as string) || '';
    const targetCompany = (formData.get('targetCompany') as string) || '';
    const jobDescription = (formData.get('jobDescription') as string) || '';

    if (!resumeFile) {
      return NextResponse.json({ error: 'Resume file is required' }, { status: 400 });
    }

    // Validate file size and type
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (resumeFile.size > maxSize) {
      return NextResponse.json({ error: 'Resume file too large (max 10MB)' }, { status: 400 });
    }

    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(resumeFile.type) && resumeFile.type !== '') {
      return NextResponse.json({ error: 'Invalid file type (must be TXT, PDF, DOC, or DOCX)' }, { status: 400 });
    }

    // Parse file content based on type
    const fileBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    let fileContent = '';

    try {
      if (resumeFile.type === 'application/pdf') {
        // Parse PDF
        const pdfData = await pdfParse(buffer);
        fileContent = pdfData.text;
      } else if (
        resumeFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        resumeFile.type === 'application/msword'
      ) {
        // Parse DOCX
        const result = await mammoth.extractRawText({ buffer });
        fileContent = result.value;
      } else {
        // Plain text
        fileContent = buffer.toString('utf-8');
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse resume file. Please ensure the file is not corrupted.' },
        { status: 400 }
      );
    }

    // Check if content was extracted
    if (!fileContent || fileContent.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from resume. The file may be empty or corrupted.' },
        { status: 400 }
      );
    }

    // Validate content with Zod
    const validation = safeValidateData(resumeContentTransformSchema, {
      resumeContent: fileContent,
      targetRole: targetRole || undefined,
      targetCompany: targetCompany || undefined,
      jobDescription: jobDescription || undefined,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formatZodError(validation.error),
        },
        { status: 400 }
      );
    }

    // Use OpenAI to parse and transform the resume
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 8192,
      response_format: { type: "json_object" },
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume optimizer and career coach. You analyze and transform resumes into high-impact, ATS-optimized versions. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: `Analyze and transform this resume into a high-impact, ATS-optimized version.

**Original Resume Content:**
${fileContent}

**Target Role:** ${targetRole || 'Not specified'}
**Target Company:** ${targetCompany || 'Not specified'}
**Job Description:** ${jobDescription || 'Not specified'}

Please analyze this resume and provide:

1. **Parsed Resume Data** - Extract all information in structured format
2. **ATS Score** - Rate the resume's ATS compatibility (0-100)
3. **Impact Analysis** - Identify weak points and areas for improvement
4. **Transformed Sections** - Provide optimized versions of each section:
   - Professional Summary (3-4 sentences, keyword-rich, achievement-focused)
   - Skills (categorized and prioritized based on target role)
   - Experience (with quantifiable achievements, action verbs, STAR format)
   - Suggestions for missing sections or improvements

5. **Keyword Analysis** - Extract keywords from job description and identify gaps
6. **Actionable Recommendations** - Specific steps to improve the resume

Return your response in the following JSON format:
{
  "parsedData": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "website": "string",
    "summary": "string",
    "skills": ["string"],
    "experience": [
      {
        "company": "string",
        "position": "string",
        "startDate": "string",
        "endDate": "string",
        "current": boolean,
        "description": "string"
      }
    ],
    "education": [
      {
        "school": "string",
        "degree": "string",
        "field": "string",
        "startDate": "string",
        "endDate": "string",
        "gpa": "string"
      }
    ],
    "projects": [
      {
        "name": "string",
        "description": "string",
        "technologies": "string",
        "link": "string"
      }
    ]
  },
  "atsScore": number,
  "impactAnalysis": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "missingElements": ["string"]
  },
  "transformedSections": {
    "summary": "string - optimized professional summary",
    "skills": ["string - categorized skills"],
    "experienceImprovements": [
      {
        "original": "string",
        "improved": "string",
        "reason": "string"
      }
    ]
  },
  "keywordAnalysis": {
    "requiredKeywords": ["string"],
    "missingKeywords": ["string"],
    "matchScore": number
  },
  "recommendations": ["string - specific actionable recommendations"]
}`
        }
      ]
    });

    const responseText = completion.choices[0]?.message?.content || '';

    if (!responseText) {
      throw new Error('Failed to get AI response');
    }

    const result = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Resume transformation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to transform resume' },
      { status: 500 }
    );
  }
}
