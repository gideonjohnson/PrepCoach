'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';

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
  const { data: session, status } = useSession();
  const router = useRouter();

  // Access control
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

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

  // ATS Tailoring
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsSuggestions, setAtsSuggestions] = useState<string[]>([]);
  const [isTailoring, setIsTailoring] = useState(false);
  const [showAtsSection, setShowAtsSection] = useState(false);

  // Resume Transformation
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformedData, setTransformedData] = useState<any>(null);
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [showTransformSection, setShowTransformSection] = useState(true);

  // Check subscription access on mount
  // Resume Builder is a Pro-only feature
  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.push('/auth/signin?callbackUrl=/resume-builder');
        return;
      }

      try {
        const response = await fetch('/api/user/subscription-status');
        if (response.ok) {
          const data = await response.json();

          // Resume Builder requires Pro/Enterprise/Lifetime subscription
          if (!data.hasAccess) {
            setShowUpgradeModal(true);
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, [status, router]);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'text/plain')) {
      setUploadedResume(file);
    } else {
      toast.error('Please upload a PDF, DOCX, or TXT file', { duration: 4000 });
    }
  };

  const handleTransformResume = async () => {
    if (!uploadedResume) {
      toast.error('Please upload your resume first', { duration: 3000 });
      return;
    }

    setIsTransforming(true);
    const loadingToast = toast.loading('Analyzing and transforming your resume with AI...');

    try {
      const formData = new FormData();
      formData.append('resume', uploadedResume);
      formData.append('targetRole', targetRole);
      formData.append('targetCompany', targetCompany);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('/api/resume/upload-transform', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        const data = result.data;

        setTransformedData(data);

        // Auto-populate form with parsed data
        if (data.parsedData) {
          const parsed = data.parsedData;
          if (parsed.fullName) setFullName(parsed.fullName);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.location) setLocation(parsed.location);
          if (parsed.linkedin) setLinkedin(parsed.linkedin);
          if (parsed.github) setGithub(parsed.github);
          if (parsed.website) setWebsite(parsed.website);
          if (parsed.summary) setSummary(parsed.summary);
          if (parsed.skills) setSkills(parsed.skills.filter((s: string) => s));
          if (parsed.experience) setExperience(parsed.experience);
          if (parsed.education) setEducation(parsed.education);
          if (parsed.projects) setProjects(parsed.projects);
        }

        // Show optimized versions
        toast.success(
          `Resume transformed successfully! ATS Score: ${data.atsScore}%\n\nYour form has been populated with the optimized content.`,
          { id: loadingToast, duration: 6000 }
        );
      } else {
        toast.error(
          result.error || 'Failed to transform resume',
          { id: loadingToast, duration: 5000 }
        );
      }
    } catch (error) {
      console.error('Transform error:', error);
      toast.error(
        'Failed to transform resume. Please check your connection and try again.',
        { id: loadingToast, duration: 5000 }
      );
    } finally {
      setIsTransforming(false);
    }
  };

  const handleATSTailor = async () => {
    if (!uploadedResume && !fullName) {
      toast.error('Please upload a resume or fill in your information', { duration: 4000 });
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description', { duration: 3000 });
      return;
    }

    setIsTailoring(true);
    try {
      const formData = new FormData();
      if (uploadedResume) {
        formData.append('resume', uploadedResume);
      } else {
        // Use current form data
        const currentResume = {
          fullName,
          email,
          phone,
          location,
          summary,
          experience,
          education,
          skills,
          projects
        };
        formData.append('resumeData', JSON.stringify(currentResume));
      }
      formData.append('jobDescription', jobDescription);

      const response = await fetch('/api/resume/ats-tailor', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setAtsScore(data.score);
        setAtsSuggestions(data.suggestions);

        // Auto-fill optimized content if provided
        if (data.optimizedResume) {
          if (data.optimizedResume.summary) setSummary(data.optimizedResume.summary);
          if (data.optimizedResume.skills) setSkills(data.optimizedResume.skills);
          if (data.optimizedResume.experience) setExperience(data.optimizedResume.experience);
        }
      } else {
        toast.error('Failed to analyze resume. Please try again.', { duration: 4000 });
      }
    } catch (error) {
      console.error('ATS tailoring error:', error);
      alert('Failed to analyze resume');
    } finally {
      setIsTailoring(false);
    }
  };

  const handleAIOptimize = async () => {
    setIsGenerating(true);

    const loadingToast = toast.loading('AI is optimizing your resume...');

    try {
      // Prepare resume data
      const resumeData = {
        fullName,
        email,
        phone,
        location,
        summary,
        experience: experience.filter(exp => exp.company || exp.position),
        education: education.filter(edu => edu.school || edu.degree),
        skills: skills.filter(s => s.trim()),
        projects: projects.filter(proj => proj.name || proj.description),
      };

      // Validate we have some data
      if (!resumeData.summary && resumeData.experience.length === 0) {
        toast.error('Please add some content to your resume before optimizing.', { id: loadingToast });
        return;
      }

      const response = await fetch('/api/resume/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to optimize resume');
      }

      // Apply optimizations
      const { optimizedData } = data;

      if (optimizedData.summary) {
        setSummary(optimizedData.summary);
      }

      // Update experience descriptions
      if (optimizedData.experience && optimizedData.experience.length > 0) {
        setExperience(prevExp => {
          const newExp = [...prevExp];
          optimizedData.experience.forEach((optExp: { company: string; position: string; description: string }, index: number) => {
            if (newExp[index]) {
              // Match by company and position to ensure we're updating the right entry
              const matchingIndex = newExp.findIndex(
                exp => exp.company === optExp.company && exp.position === optExp.position
              );
              if (matchingIndex !== -1) {
                newExp[matchingIndex].description = optExp.description;
              }
            }
          });
          return newExp;
        });
      }

      // Update project descriptions
      if (optimizedData.projects && optimizedData.projects.length > 0) {
        setProjects(prevProjects => {
          const newProjects = [...prevProjects];
          optimizedData.projects.forEach((optProj: { name: string; description: string }, index: number) => {
            if (newProjects[index]) {
              const matchingIndex = newProjects.findIndex(proj => proj.name === optProj.name);
              if (matchingIndex !== -1) {
                newProjects[matchingIndex].description = optProj.description;
              }
            }
          });
          return newProjects;
        });
      }

      // Show recommendations
      if (optimizedData.recommendations && optimizedData.recommendations.length > 0) {
        const recommendationsText = optimizedData.recommendations.slice(0, 3).join('\n• ');
        toast.success(
          <div>
            <strong>Resume optimized! 🎉</strong>
            <div className="mt-2 text-sm">
              <strong>Top recommendations:</strong>
              <div className="mt-1">• {recommendationsText}</div>
            </div>
          </div>,
          { id: loadingToast, duration: 8000 }
        );
      } else {
        toast.success('Resume optimized successfully! 🎉', { id: loadingToast });
      }
    } catch (error) {
      console.error('AI optimization error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to optimize resume. Please try again.',
        { id: loadingToast }
      );
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
        toast.success('Resume saved successfully!', { duration: 3000 });
      } else {
        toast.error('Failed to save resume. Please try again.', { duration: 4000 });
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        {/* Page Title and Quick Navigation */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Resume Builder & Transformer
          </h1>
          <p className="text-gray-600 mb-4">Professional resume optimization powered by advanced AI - trusted by thousands of job seekers</p>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Interview
            </Link>
          </div>
        </div>
        {/* Resume Transformation Hero Section */}
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                AI Resume Transformer
              </h2>
              <p className="text-gray-600 text-base max-w-3xl">
                Upload your resume and transform it into a targeted, high-impact application tool.
                Our AI analyzes, optimizes, and restructures your content to increase your interview success rate.
              </p>
            </div>
            <button
              onClick={() => setShowTransformSection(!showTransformSection)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
            >
              {showTransformSection ? 'Hide' : 'Show'}
            </button>
          </div>

          {showTransformSection && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* File Upload Section */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Upload Your Resume</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                      className="w-full text-sm text-gray-700 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    />
                  </div>
                  {uploadedResume && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-green-900 text-sm">{uploadedResume.name}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-3">Supports PDF, DOCX, and TXT formats</p>
                </div>

                {/* Target Information */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Target Role (Optional)</label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
                      placeholder="e.g., Senior Software Engineer, Product Manager"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Target Company (Optional)</label>
                    <input
                      type="text"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
                      placeholder="e.g., Google, Microsoft, Amazon"
                    />
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Job Description (Recommended)</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
                  placeholder="Paste the full job description here for best results. The AI will tailor your resume to match the requirements..."
                />
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Pro Tip:</strong> Including a job description helps the AI optimize your resume with relevant keywords and achievements
                </p>
              </div>

              {/* Transform Button */}
              <button
                onClick={handleTransformResume}
                disabled={isTransforming || !uploadedResume}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 shadow-sm flex items-center justify-center gap-3"
              >
                {isTransforming ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Transforming Your Resume...</span>
                  </>
                ) : (
                  <span>Transform My Resume</span>
                )}
              </button>

                {/* Transformation Results */}
                {transformedData && (
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">📊 Transformation Results</h3>
                      <div className="text-right">
                        <div className="text-sm text-white/80">ATS Compatibility Score</div>
                        <div className={`text-4xl font-bold ${transformedData.atsScore >= 80 ? 'text-green-300' : transformedData.atsScore >= 60 ? 'text-yellow-300' : 'text-red-300'}`}>
                          {transformedData.atsScore}%
                        </div>
                      </div>
                    </div>

                    {/* Impact Analysis */}
                    {transformedData.impactAnalysis && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-500/20 rounded-lg p-4">
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            <span>✅</span> Strengths
                          </h4>
                          <ul className="text-sm space-y-1">
                            {transformedData.impactAnalysis.strengths.map((strength: string, i: number) => (
                              <li key={i}>• {strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-yellow-500/20 rounded-lg p-4">
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            <span>⚠️</span> Areas to Improve
                          </h4>
                          <ul className="text-sm space-y-1">
                            {transformedData.impactAnalysis.weaknesses.map((weakness: string, i: number) => (
                              <li key={i}>• {weakness}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Keyword Analysis */}
                    {transformedData.keywordAnalysis && (
                      <div className="bg-blue-500/20 rounded-lg p-4">
                        <h4 className="font-bold mb-2">🔍 Keyword Match Analysis</h4>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-2xl font-bold">{transformedData.keywordAnalysis.matchScore}%</div>
                          <div className="text-sm">Match with job description</div>
                        </div>
                        {transformedData.keywordAnalysis.missingKeywords && transformedData.keywordAnalysis.missingKeywords.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-2">Missing Keywords to Add:</p>
                            <div className="flex flex-wrap gap-2">
                              {transformedData.keywordAnalysis.missingKeywords.slice(0, 10).map((keyword: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Recommendations */}
                    {transformedData.recommendations && transformedData.recommendations.length > 0 && (
                      <div className="bg-purple-500/20 rounded-lg p-4">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                          <span>💡</span> AI Recommendations
                        </h4>
                        <ul className="space-y-2 text-sm">
                          {transformedData.recommendations.map((rec: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-yellow-300 font-bold">{i + 1}.</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <p className="font-semibold">
                        ✓ Your resume has been automatically populated with optimized content below!
                      </p>
                      <p className="text-sm text-white/80 mt-1">
                        Review and edit the fields as needed, then save your transformed resume.
                      </p>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* ATS Tailoring Section */}
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                ATS Resume Optimizer
              </h2>
              <p className="text-gray-600 mt-1">Upload your resume and job description to optimize for applicant tracking systems</p>
            </div>
            <button
              onClick={() => setShowAtsSection(!showAtsSection)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
            >
              {showAtsSection ? 'Hide' : 'Show'}
            </button>
          </div>

          {showAtsSection && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* File Upload */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Upload Your Resume (Optional)</label>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                  {uploadedResume && (
                    <p className="mt-2 text-sm text-green-700 font-medium">✓ {uploadedResume.name}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Or use the form below to build from scratch</p>
                </div>

                {/* Job Description */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Job Description *</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
                    placeholder="Paste the job description here..."
                  />
                </div>
              </div>

              {/* Tailor Button */}
              <button
                onClick={handleATSTailor}
                disabled={isTailoring}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isTailoring ? 'Analyzing & Tailoring...' : 'Tailor Resume for ATS'}
              </button>

              {/* ATS Score & Suggestions */}
              {atsScore !== null && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">ATS Compatibility Score:</span>
                    <span className={`text-3xl font-bold ${atsScore >= 80 ? 'text-green-300' : atsScore >= 60 ? 'text-yellow-300' : 'text-red-300'}`}>
                      {atsScore}%
                    </span>
                  </div>

                  {atsSuggestions.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">📋 Optimization Suggestions:</h3>
                      <ul className="space-y-1 text-sm text-blue-100">
                        {atsSuggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span>•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub</label>
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="A brief summary of your professional background and career goals..."
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Skills
                </h2>
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                className="flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-sm"
              >
                {isGenerating ? 'Optimizing...' : 'AI Optimize'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-6 py-3.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 shadow-sm"
              >
                {isSaving ? 'Saving...' : 'Save Resume'}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Preview</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  Export PDF
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

      {/* Upgrade Required Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full sm:max-w-lg p-6 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Upgrade Required</h3>
              <p className="text-base text-gray-600 mb-6">
                The AI Resume Builder is a premium feature. Upgrade to Pro for unlimited access to resume building, transformation, and ATS optimization.
              </p>

              {/* Benefits List */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4 text-center">Pro Plan Includes:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">AI-powered resume transformation for any role</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">ATS optimization and keyword matching</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Unlimited interview practice sessions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Unlimited AI feedback on your responses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Access to 500+ roles with 45+ questions each</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/pricing">
                <button className="w-full px-6 py-3.5 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transition shadow-sm">
                  View Pricing Plans
                </button>
              </Link>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full px-6 py-3.5 bg-gray-100 text-gray-700 rounded-lg text-base font-medium hover:bg-gray-200 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
