import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// GET /api/job-description - List user's saved JDs
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    const jobDescriptions = await prisma.jobDescription.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Parse JSON fields
    const parsed = jobDescriptions.map(jd => ({
      ...jd,
      skills: JSON.parse(jd.skills),
      requirements: JSON.parse(jd.requirements),
      responsibilities: JSON.parse(jd.responsibilities),
      customQuestions: JSON.parse(jd.customQuestions),
      prepSuggestions: JSON.parse(jd.prepSuggestions),
    }));

    return NextResponse.json({ jobDescriptions: parsed });
  } catch (error) {
    console.error('Error fetching job descriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job descriptions' },
      { status: 500 }
    );
  }
}

// POST /api/job-description - Parse and save a new JD
const createJDSchema = z.object({
  title: z.string().min(1),
  company: z.string().optional(),
  rawText: z.string().min(50), // Require at least 50 chars of JD text
  includeResumeMatch: z.boolean().optional(), // Compare with user's resume
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = createJDSchema.parse(body);

    // Get user's primary resume if requested
    let resumeContext = '';
    if (validated.includeResumeMatch) {
      const resume = await prisma.resume.findFirst({
        where: {
          userId: session.user.id,
          isPrimary: true,
        },
      });

      if (resume) {
        resumeContext = `
User's Resume:
Name: ${resume.fullName}
Summary: ${resume.summary || 'Not provided'}
Skills: ${resume.skills}
Experience: ${resume.experience}
Education: ${resume.education}
Projects: ${resume.projects}
`;
      }
    }

    // Use AI to parse the job description
    const parsePrompt = `Analyze this job description and extract structured information.

Job Title: ${validated.title}
Company: ${validated.company || 'Not specified'}

Job Description:
${validated.rawText}

${resumeContext ? `\n${resumeContext}` : ''}

Provide a detailed analysis in the following JSON format:
{
  "skills": ["skill1", "skill2", ...],
  "requirements": ["requirement1", "requirement2", ...],
  "responsibilities": ["responsibility1", "responsibility2", ...],
  "experience": "e.g., 5+ years, Senior level, etc.",
  "customQuestions": [
    {
      "question": "Interview question tailored to this role",
      "category": "technical|behavioral|situational",
      "tips": "Tips for answering this question"
    },
    ... (generate 8-12 relevant questions)
  ],
  "prepSuggestions": [
    "Suggestion for how to prepare for this interview",
    ... (5-8 suggestions)
  ],
  "companyInsights": "Any insights about the company culture, values, or interview style based on the JD"${resumeContext ? `,
  "matchScore": <0-100 score of how well the resume matches>,
  "gapAnalysis": {
    "strongMatches": ["areas where resume strongly matches"],
    "gaps": ["skills or requirements the candidate may need to address"],
    "recommendations": ["specific recommendations to improve match"]
  }` : ''}
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: parsePrompt,
        },
      ],
    });

    const responseText = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Failed to parse job description' },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Save to database
    const jobDescription = await prisma.jobDescription.create({
      data: {
        userId: session.user.id,
        title: validated.title,
        company: validated.company,
        rawText: validated.rawText,
        skills: JSON.stringify(parsed.skills || []),
        requirements: JSON.stringify(parsed.requirements || []),
        responsibilities: JSON.stringify(parsed.responsibilities || []),
        experience: parsed.experience,
        customQuestions: JSON.stringify(parsed.customQuestions || []),
        prepSuggestions: JSON.stringify(parsed.prepSuggestions || []),
        companyInsights: parsed.companyInsights,
        matchScore: parsed.matchScore,
        gapAnalysis: parsed.gapAnalysis ? JSON.stringify(parsed.gapAnalysis) : null,
      },
    });

    return NextResponse.json({
      jobDescription: {
        ...jobDescription,
        skills: parsed.skills || [],
        requirements: parsed.requirements || [],
        responsibilities: parsed.responsibilities || [],
        customQuestions: parsed.customQuestions || [],
        prepSuggestions: parsed.prepSuggestions || [],
        gapAnalysis: parsed.gapAnalysis || null,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error parsing job description:', error);
    return NextResponse.json(
      { error: 'Failed to parse job description' },
      { status: 500 }
    );
  }
}

// DELETE /api/job-description?id=xxx - Delete a saved JD
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID required' },
        { status: 400 }
      );
    }

    const existing = await prisma.jobDescription.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Job description not found' },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    await prisma.jobDescription.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job description:', error);
    return NextResponse.json(
      { error: 'Failed to delete job description' },
      { status: 500 }
    );
  }
}
