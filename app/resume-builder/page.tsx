'use client';

import { useState } from 'use';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function ResumeBuilder() {
  const { data: session } = useSession();
  const router = useRouter();

  // Personal Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [website, setWebsite] = useState('');
  const [summary, setSummary] = useState('');

  // Experience
  const [experience, setExperience] = useState<Experience[]>([
    {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
  ]);

  // Education
  const [education, setEducation] = useState<Education[]>([
    {
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    }
  ]);

  // Skills
  const [skills, setSkills] = useState<string[]>(['']);

  // Projects
  const [projects, setProjects] = useState<Project[]>([
    {
      name: '',
      description: '',
      technologies: '',
      link: ''
    }
  ]);

  const [template, setTemplate] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const addExperience = () => {
    setExperience([...experience, {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }]);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([...education, {
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addProject = () => {
    setProjects([...projects, {
      name: '',
      description: '',
      technologies: '',
      link: ''
    }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleAIOptimize = async () => {
    setIsGenerating(true);
    try {
      // TODO: Implement AI optimization
      alert('AI optimization will be implemented!');
    } catch (error) {
      console.error('AI optimization error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const resumeData = {
        fullName,
        email,
        phone,
        location,
        linkedin,
        github,
        website,
        summary,
        experience: JSON.stringify(experience),
        education: JSON.stringify(education),
        skills: JSON.stringify(skills),
        projects: JSON.stringify(projects),
        template
      };

      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData)
      });

      if (response.ok) {
        alert('Resume saved successfully!');
      } else {
        alert('Failed to save resume');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                AI Resume Builder
              </h1>
              <p className="text-gray-600 mt-1">Create a professional resume powered by AI</p>
            </div>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition font-medium">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>👤</span> Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-0 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-0 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-0 transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-0 transition-colors"
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-0 transition-colors"
                      placeholder="linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub</label>
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-0 transition-colors"
                      placeholder="github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-0 transition-colors"
                      placeholder="yoursite.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Summary</label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-0 transition-colors"
                    placeholder="A brief summary of your professional background and career goals..."
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>⚡</span> Skills
                </h2>
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition"
                >
                  + Add Skill
                </button>
              </div>

              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => {
                        const newSkills = [...skills];
                        newSkills[index] = e.target.value;
                        setSkills(newSkills);
                      }}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-0 transition-colors"
                      placeholder="e.g., React, Python, AWS"
                    />
                    {skills.length > 1 && (
                      <button
                        onClick={() => removeSkill(index)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAIOptimize}
                disabled={isGenerating}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold hover:shadow-xl transition disabled:opacity-50"
              >
                {isGenerating ? 'Optimizing...' : '✨ AI Optimize'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold hover:shadow-xl transition disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : '💾 Save Resume'}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-gray-200">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Preview</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                  📄 Export PDF
                </button>
              </div>

              {/* Resume Preview */}
              <div className="border-2 border-gray-300 rounded-lg p-8 bg-white min-h-[600px]">
                {fullName && (
                  <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                    <div className="flex items-center justify-center gap-3 mt-2 text-sm text-gray-600">
                      {email && <span>{email}</span>}
                      {phone && <span>• {phone}</span>}
                      {location && <span>• {location}</span>}
                    </div>
                    <div className="flex items-center justify-center gap-3 mt-2 text-sm text-blue-600">
                      {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                      {github && <a href={github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                      {website && <a href={website} target="_blank" rel="noopener noreferrer">Website</a>}
                    </div>
                  </div>
                )}

                {summary && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">
                      PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-sm text-gray-700">{summary}</p>
                  </div>
                )}

                {skills.filter(s => s).length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">
                      SKILLS
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {skills.filter(s => s).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
