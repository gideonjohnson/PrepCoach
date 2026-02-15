import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const jobDescription = formData.get('jobDescription') as string;
    const resumeFile = formData.get('resume') as File | null;
    const resumeDataStr = formData.get('resumeData') as string | null;

    if (!jobDescription) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    let resumeText = '';

    // Parse uploaded resume file or use form data
    if (resumeFile) {
      // For PDF/DOCX parsing, we'll use a simplified text extraction
      // In production, you'd use libraries like pdf-parse or mammoth
      const fileBuffer = await resumeFile.arrayBuffer();
      const fileText = Buffer.from(fileBuffer).toString('utf-8');
      resumeText = fileText;
    } else if (resumeDataStr) {
      const resumeData = JSON.parse(resumeDataStr);
      // Convert form data to text format
      resumeText = formatResumeData(resumeData);
    } else {
      return NextResponse.json({ error: 'Resume file or data is required' }, { status: 400 });
    }

    // Use OpenAI to analyze and optimize the resume for ATS
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert ATS (Applicant Tracking System) resume optimizer. Analyze resumes and job descriptions to provide:
1. An ATS compatibility score (0-100)
2. Specific optimization suggestions
3. Optimized resume content with relevant keywords

Focus on:
- Keyword matching and optimization
- Proper formatting for ATS parsing
- Skills alignment with job requirements
- Quantifiable achievements
- Industry-specific terminology`
        },
        {
          role: 'user',
          content: `Job Description:
${jobDescription}

Current Resume:
${resumeText}

Please provide:
1. ATS compatibility score (0-100)
2. List of specific suggestions to improve ATS compatibility
3. Optimized resume sections (summary, skills, experience) that incorporate relevant keywords from the job description

Respond in JSON format:
{
  "score": number,
  "suggestions": string[],
  "optimizedResume": {
    "summary": "optimized summary",
    "skills": ["skill1", "skill2", ...],
    "experienceSuggestions": ["suggestion1", "suggestion2", ...]
  }
}`
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({
      score: result.score || 0,
      suggestions: result.suggestions || [],
      optimizedResume: result.optimizedResume || null
    });

  } catch (error) {
    console.error('ATS tailoring error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}

interface ResumeExperience {
  position?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

interface ResumeEducation {
  degree?: string;
  field?: string;
  school?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

interface ResumeProject {
  name?: string;
  description?: string;
  technologies?: string;
}

interface ResumeData {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills?: string[];
  experience?: ResumeExperience[];
  education?: ResumeEducation[];
  projects?: ResumeProject[];
}

function formatResumeData(data: ResumeData): string {
  let text = `Name: ${data.fullName}\n`;
  text += `Email: ${data.email}\n`;
  if (data.phone) text += `Phone: ${data.phone}\n`;
  if (data.location) text += `Location: ${data.location}\n`;
  text += '\n';

  if (data.summary) {
    text += `Summary:\n${data.summary}\n\n`;
  }

  if (data.skills && data.skills.length > 0) {
    text += `Skills:\n${data.skills.filter((s: string) => s).join(', ')}\n\n`;
  }

  if (data.experience && data.experience.length > 0) {
    text += 'Experience:\n';
    data.experience.forEach((exp: ResumeExperience) => {
      if (exp.position || exp.company) {
        text += `${exp.position} at ${exp.company}\n`;
        text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
        if (exp.description) text += `${exp.description}\n`;
        text += '\n';
      }
    });
  }

  if (data.education && data.education.length > 0) {
    text += 'Education:\n';
    data.education.forEach((edu: ResumeEducation) => {
      if (edu.degree || edu.school) {
        text += `${edu.degree} in ${edu.field} - ${edu.school}\n`;
        text += `${edu.startDate} - ${edu.endDate}\n`;
        if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
        text += '\n';
      }
    });
  }

  if (data.projects && data.projects.length > 0) {
    text += 'Projects:\n';
    data.projects.forEach((proj: ResumeProject) => {
      if (proj.name) {
        text += `${proj.name}\n`;
        if (proj.description) text += `${proj.description}\n`;
        if (proj.technologies) text += `Technologies: ${proj.technologies}\n`;
        text += '\n';
      }
    });
  }

  return text;
}
