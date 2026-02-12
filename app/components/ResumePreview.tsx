'use client';

import { useMemo } from 'react';

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

interface ResumePreviewProps {
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
  template?: 'modern' | 'classic' | 'minimal' | 'creative';
  scale?: number;
}

export default function ResumePreview({
  fullName,
  email,
  phone,
  location,
  linkedin,
  github,
  website,
  summary,
  experience,
  education,
  skills,
  projects,
  template = 'modern',
  scale = 0.6,
}: ResumePreviewProps) {
  // Filter empty entries
  const filteredExperience = experience.filter(e => e.company || e.position);
  const filteredEducation = education.filter(e => e.school || e.degree);
  const filteredSkills = skills.filter(s => s && s.trim());
  const filteredProjects = projects.filter(p => p.name || p.description);

  // Template styles
  const templateStyles = useMemo(() => {
    switch (template) {
      case 'classic':
        return {
          container: 'bg-white text-gray-900 font-serif',
          header: 'border-b-2 border-gray-800 pb-4 mb-4',
          name: 'text-2xl font-bold text-gray-900',
          section: 'border-t border-gray-300 pt-3 mt-3',
          sectionTitle: 'text-sm font-bold uppercase tracking-wider text-gray-700',
          accent: 'text-gray-700',
        };
      case 'minimal':
        return {
          container: 'bg-white text-gray-800 font-sans',
          header: 'mb-4',
          name: 'text-xl font-light text-gray-900 tracking-wide',
          section: 'mt-4',
          sectionTitle: 'text-xs font-medium uppercase tracking-widest text-gray-500 mb-2',
          accent: 'text-gray-600',
        };
      case 'creative':
        return {
          container: 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-800',
          header: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 -m-4 mb-4 rounded-t',
          name: 'text-2xl font-bold',
          section: 'mt-4',
          sectionTitle: 'text-sm font-bold text-blue-600 border-l-2 border-blue-600 pl-2',
          accent: 'text-blue-600',
        };
      case 'modern':
      default:
        return {
          container: 'bg-white text-gray-900 font-sans',
          header: 'border-b border-gray-200 pb-3 mb-3',
          name: 'text-2xl font-bold text-gray-900',
          section: 'mt-3',
          sectionTitle: 'text-xs font-semibold uppercase tracking-wide text-orange-600 mb-1.5',
          accent: 'text-orange-600',
        };
    }
  }, [template]);

  return (
    <div
      className="origin-top-left overflow-hidden rounded-lg shadow-xl border border-gray-200"
      style={{ transform: `scale(${scale})`, width: `${100 / scale}%` }}
    >
      {/* Resume Paper */}
      <div className={`w-[8.5in] min-h-[11in] p-8 ${templateStyles.container}`}>
        {/* Header */}
        <header className={templateStyles.header}>
          <h1 className={templateStyles.name}>
            {fullName || 'Your Name'}
          </h1>

          {/* Contact Info */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-600">
            {email && <span>{email}</span>}
            {phone && <span>• {phone}</span>}
            {location && <span>• {location}</span>}
          </div>

          {/* Links */}
          {(linkedin || github || website) && (
            <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs ${templateStyles.accent}`}>
              {linkedin && <span>LinkedIn: {linkedin}</span>}
              {github && <span>GitHub: {github}</span>}
              {website && <span>Web: {website}</span>}
            </div>
          )}
        </header>

        {/* Summary */}
        {summary && (
          <section className={templateStyles.section}>
            <h2 className={templateStyles.sectionTitle}>Professional Summary</h2>
            <p className="text-xs leading-relaxed text-gray-700">{summary}</p>
          </section>
        )}

        {/* Skills */}
        {filteredSkills.length > 0 && (
          <section className={templateStyles.section}>
            <h2 className={templateStyles.sectionTitle}>Skills</h2>
            <p className="text-xs text-gray-700">
              {filteredSkills.join('  •  ')}
            </p>
          </section>
        )}

        {/* Experience */}
        {filteredExperience.length > 0 && (
          <section className={templateStyles.section}>
            <h2 className={templateStyles.sectionTitle}>Experience</h2>
            <div className="space-y-3">
              {filteredExperience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {exp.position || 'Position'}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 italic">{exp.company || 'Company'}</p>
                  {exp.description && (
                    <div className="mt-1 text-xs text-gray-700 whitespace-pre-wrap">
                      {exp.description.split('\n').map((line, i) => (
                        <p key={i} className={line.startsWith('•') ? '' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {filteredEducation.length > 0 && (
          <section className={templateStyles.section}>
            <h2 className={templateStyles.sectionTitle}>Education</h2>
            <div className="space-y-2">
              {filteredEducation.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {edu.school}
                    {edu.gpa && <span className="ml-2">GPA: {edu.gpa}</span>}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {filteredProjects.length > 0 && (
          <section className={templateStyles.section}>
            <h2 className={templateStyles.sectionTitle}>Projects</h2>
            <div className="space-y-2">
              {filteredProjects.map((project, idx) => (
                <div key={idx}>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {project.name || 'Project Name'}
                    </h3>
                    {project.technologies && (
                      <span className={`text-xs ${templateStyles.accent}`}>
                        | {project.technologies}
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-xs text-gray-700">{project.description}</p>
                  )}
                  {project.link && (
                    <p className={`text-xs ${templateStyles.accent}`}>{project.link}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!summary && filteredSkills.length === 0 && filteredExperience.length === 0 &&
         filteredEducation.length === 0 && filteredProjects.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            <div className="text-center">
              <p>Start filling in your information</p>
              <p className="text-xs mt-1">Your resume preview will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
