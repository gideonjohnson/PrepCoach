import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { jsPDF } from 'jspdf';

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string;
  link?: string;
}

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  template?: string;
}

// POST /api/resume/export - Generate PDF from resume data
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: ResumeData = await req.json();
    const { format = 'pdf' } = Object.fromEntries(new URL(req.url).searchParams);

    if (format === 'pdf') {
      const pdfBuffer = generatePDF(data);

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${data.fullName.replace(/\s+/g, '_')}_Resume.pdf"`,
        },
      });
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
  } catch (error) {
    console.error('Resume export error:', error);
    return NextResponse.json({ error: 'Failed to export resume' }, { status: 500 });
  }
}

// Template-specific color schemes
const TEMPLATE_COLORS = {
  modern: {
    primary: [234, 88, 12] as [number, number, number],    // Orange
    secondary: [75, 85, 99] as [number, number, number],   // Gray
    text: [17, 24, 39] as [number, number, number],        // Dark gray
    accent: [249, 115, 22] as [number, number, number],    // Light orange
  },
  classic: {
    primary: [30, 30, 30] as [number, number, number],     // Dark
    secondary: [100, 100, 100] as [number, number, number],
    text: [30, 30, 30] as [number, number, number],
    accent: [50, 50, 50] as [number, number, number],
  },
  minimal: {
    primary: [107, 114, 128] as [number, number, number],  // Muted gray
    secondary: [156, 163, 175] as [number, number, number],
    text: [55, 65, 81] as [number, number, number],
    accent: [75, 85, 99] as [number, number, number],
  },
  creative: {
    primary: [37, 99, 235] as [number, number, number],    // Blue
    secondary: [79, 70, 229] as [number, number, number],  // Indigo
    text: [30, 41, 59] as [number, number, number],
    accent: [59, 130, 246] as [number, number, number],
  },
};

function generatePDF(data: ResumeData): Buffer {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const template = (data.template || 'modern') as keyof typeof TEMPLATE_COLORS;
  const colors = TEMPLATE_COLORS[template] || TEMPLATE_COLORS.modern;

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Set default text color based on template
  doc.setTextColor(...colors.text);

  // Helper functions
  const addText = (text: string, fontSize: number, style: 'normal' | 'bold' = 'normal', align: 'left' | 'center' | 'right' = 'left') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', style);

    if (align === 'center') {
      doc.text(text, pageWidth / 2, y, { align: 'center' });
    } else if (align === 'right') {
      doc.text(text, pageWidth - margin, y, { align: 'right' });
    } else {
      doc.text(text, margin, y);
    }
  };

  const addWrappedText = (text: string, fontSize: number, style: 'normal' | 'bold' = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', style);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    return lines.length * (fontSize * 0.4);
  };

  const addSectionHeader = (title: string) => {
    checkPageBreak(15);
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(template === 'minimal' ? 0.3 : 0.5);

    if (template === 'creative') {
      // Creative template: colored left border
      doc.setFillColor(...colors.primary);
      doc.rect(margin - 3, y - 2, 2, 8, 'F');
      doc.setTextColor(...colors.primary);
    } else {
      // Other templates: underline
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
    }

    y += 6;
    doc.setTextColor(...colors.primary);
    addText(title, template === 'minimal' ? 10 : 12, 'bold');
    doc.setTextColor(...colors.text);
    y += 8;
  };

  const checkPageBreak = (requiredSpace: number) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + requiredSpace > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // Header - Name
  addText(data.fullName || 'Your Name', 24, 'bold', 'center');
  y += 8;

  // Contact Info Line
  const contactParts: string[] = [];
  if (data.email) contactParts.push(data.email);
  if (data.phone) contactParts.push(data.phone);
  if (data.location) contactParts.push(data.location);

  if (contactParts.length > 0) {
    addText(contactParts.join('  |  '), 10, 'normal', 'center');
    y += 5;
  }

  // Links Line
  const linkParts: string[] = [];
  if (data.linkedin) linkParts.push(`LinkedIn: ${data.linkedin}`);
  if (data.github) linkParts.push(`GitHub: ${data.github}`);
  if (data.website) linkParts.push(`Website: ${data.website}`);

  if (linkParts.length > 0) {
    doc.setTextColor(0, 102, 204);
    addText(linkParts.join('  |  '), 9, 'normal', 'center');
    doc.setTextColor(0, 0, 0);
    y += 8;
  } else {
    y += 4;
  }

  // Professional Summary
  if (data.summary) {
    addSectionHeader('PROFESSIONAL SUMMARY');
    const summaryHeight = addWrappedText(data.summary, 10);
    y += summaryHeight + 6;
  }

  // Skills
  const filteredSkills = data.skills?.filter(s => s && s.trim()) || [];
  if (filteredSkills.length > 0) {
    addSectionHeader('SKILLS');
    const skillsText = filteredSkills.join('  •  ');
    const skillsHeight = addWrappedText(skillsText, 10);
    y += skillsHeight + 6;
  }

  // Experience
  const filteredExperience = data.experience?.filter(e => e.company || e.position) || [];
  if (filteredExperience.length > 0) {
    addSectionHeader('EXPERIENCE');

    filteredExperience.forEach((exp) => {
      checkPageBreak(25);

      // Company and Position
      addText(exp.position || 'Position', 11, 'bold');
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const dateText = exp.current ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`;
      doc.text(dateText, pageWidth - margin, y, { align: 'right' });
      y += 5;

      addText(exp.company || 'Company', 10, 'normal');
      y += 5;

      // Description
      if (exp.description) {
        const descLines = exp.description.split('\n').filter(line => line.trim());
        descLines.forEach(line => {
          checkPageBreak(8);
          const bulletText = line.startsWith('•') ? line : `• ${line}`;
          const lineHeight = addWrappedText(bulletText, 10);
          y += lineHeight + 2;
        });
      }
      y += 4;
    });
  }

  // Education
  const filteredEducation = data.education?.filter(e => e.school || e.degree) || [];
  if (filteredEducation.length > 0) {
    addSectionHeader('EDUCATION');

    filteredEducation.forEach((edu) => {
      checkPageBreak(20);

      // Degree and Field
      const degreeText = edu.field ? `${edu.degree} in ${edu.field}` : edu.degree;
      addText(degreeText || 'Degree', 11, 'bold');

      // Dates
      const dateText = `${edu.startDate} - ${edu.endDate}`;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(dateText, pageWidth - margin, y, { align: 'right' });
      y += 5;

      // School
      let schoolText = edu.school || 'School';
      if (edu.gpa) schoolText += ` | GPA: ${edu.gpa}`;
      addText(schoolText, 10, 'normal');
      y += 8;
    });
  }

  // Projects
  const filteredProjects = data.projects?.filter(p => p.name || p.description) || [];
  if (filteredProjects.length > 0) {
    addSectionHeader('PROJECTS');

    filteredProjects.forEach((project) => {
      checkPageBreak(20);

      // Project Name
      let projectTitle = project.name || 'Project';
      if (project.technologies) projectTitle += ` | ${project.technologies}`;
      addText(projectTitle, 11, 'bold');
      y += 5;

      // Description
      if (project.description) {
        const descHeight = addWrappedText(project.description, 10);
        y += descHeight + 2;
      }

      // Link
      if (project.link) {
        doc.setTextColor(0, 102, 204);
        addText(project.link, 9, 'normal');
        doc.setTextColor(0, 0, 0);
        y += 4;
      }
      y += 4;
    });
  }

  // Convert to buffer
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}
