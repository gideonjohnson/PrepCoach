'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      alert('Please upload a PDF, DOCX, or TXT file');
    }
  };

  const handleTransformResume = async () => {
    if (!uploadedResume) {
      alert('Please upload your resume first');
      return;
    }

    setIsTransforming(true);
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

      if (response.ok) {
        const result = await response.json();
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
        if (data.transformedSections) {
          alert(`Resume transformed successfully! ATS Score: ${data.atsScore}%\n\nYour form has been populated with the optimized content.`);
        }
      } else {
        const error = await response.json();
        alert(`Failed to transform resume: ${error.error}`);
      }
    } catch (error) {
      console.error('Transform error:', error);
      alert('Failed to transform resume');
    } finally {
      setIsTransforming(false);
    }
  };

  const handleATSTailor = async () => {
    if (!uploadedResume && !fullName) {
      alert('Please upload a resume or fill in your information');
      return;
    }
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
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
        alert('Failed to analyze resume');
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
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        {/* Page Title and Quick Navigation */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
            AI Resume Builder & Transformer
          </h1>
          <p className="text-gray-600 mb-4">Upload, transform, and optimize your resume with AI - turning static documents into interview-winning tools</p>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:scale-105"
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
        <div className="mb-8 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
                  <span className="text-4xl">🚀</span> AI Resume Transformer
                </h2>
                <p className="text-white/95 text-lg max-w-3xl">
                  Upload your resume and transform it into a dynamic, targeted, and high-impact application tool.
                  Our AI analyzes, optimizes, and restructures your content to drastically increase your chances of landing interviews.
                </p>
              </div>
              <button
                onClick={() => setShowTransformSection(!showTransformSection)}
                className="px-5 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition backdrop-blur-sm"
              >
                {showTransformSection ? 'Hide' : 'Show'}
              </button>
            </div>

            {showTransformSection && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* File Upload Section */}
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <label className="block text-lg font-bold mb-3">📁 Upload Your Resume</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileUpload}
                        className="w-full text-sm text-white file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-white file:text-orange-600 hover:file:bg-white/90 cursor-pointer"
                      />
                    </div>
                    {uploadedResume && (
                      <div className="mt-3 p-3 bg-white/20 rounded-lg flex items-center gap-2">
                        <span className="text-2xl">✓</span>
                        <span className="font-semibold">{uploadedResume.name}</span>
                      </div>
                    )}
                    <p className="text-sm text-white/80 mt-3">Supports PDF, DOCX, and TXT formats</p>
                  </div>

                  {/* Target Information */}
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20 space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">🎯 Target Role (Optional)</label>
                      <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:border-white focus:ring-0 placeholder-white/60 text-white font-medium"
                        placeholder="e.g., Senior Software Engineer, Product Manager"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">🏢 Target Company (Optional)</label>
                      <input
                        type="text"
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:border-white focus:ring-0 placeholder-white/60 text-white font-medium"
                        placeholder="e.g., Google, Microsoft, Amazon"
                      />
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <label className="block text-lg font-bold mb-3">📋 Job Description (Optional but Recommended)</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:border-white focus:ring-0 placeholder-white/60 text-white font-medium"
                    placeholder="Paste the full job description here for best results. The AI will tailor your resume to match the requirements..."
                  />
                  <p className="text-sm text-white/80 mt-2">
                    💡 <strong>Pro Tip:</strong> Including a job description helps the AI optimize your resume with relevant keywords and achievements
                  </p>
                </div>

                {/* Transform Button */}
                <button
                  onClick={handleTransformResume}
                  disabled={isTransforming || !uploadedResume}
                  className="w-full px-8 py-5 bg-white text-orange-600 rounded-xl text-xl font-bold hover:bg-white/95 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl flex items-center justify-center gap-3"
                >
                  {isTransforming ? (
                    <>
                      <span className="animate-spin">⚙️</span>
                      <span>Transforming Your Resume with AI...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Transform My Resume</span>
                      <span>🚀</span>
                    </>
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
        </div>

        {/* ATS Tailoring Section */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>🎯</span> ATS Resume Optimizer
              </h2>
              <p className="text-blue-100 mt-1">Upload your resume and job description to get tailored for ATS systems</p>
            </div>
            <button
              onClick={() => setShowAtsSection(!showAtsSection)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition"
            >
              {showAtsSection ? 'Hide' : 'Show'}
            </button>
          </div>

          {showAtsSection && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* File Upload */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <label className="block text-sm font-semibold mb-2">Upload Your Resume (Optional)</label>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30 cursor-pointer"
                  />
                  {uploadedResume && (
                    <p className="mt-2 text-sm text-blue-100">✓ {uploadedResume.name}</p>
                  )}
                  <p className="text-xs text-blue-100 mt-2">Or use the form below to build from scratch</p>
                </div>

                {/* Job Description */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <label className="block text-sm font-semibold mb-2">Job Description *</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg focus:border-white focus:ring-0 placeholder-blue-200 text-white"
                    placeholder="Paste the job description here..."
                  />
                </div>
              </div>

              {/* Tailor Button */}
              <button
                onClick={handleATSTailor}
                disabled={isTailoring}
                className="w-full px-6 py-4 bg-white text-purple-600 rounded-lg font-bold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTailoring ? '🔄 Analyzing & Tailoring...' : '🚀 Tailor Resume for ATS'}
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

      {/* Upgrade Required Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 animate-slideUp">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Upgrade Required</h3>
              <p className="text-lg text-gray-600 mb-6">
                The AI Resume Builder is a premium feature. Upgrade to Pro for unlimited access to resume building, transformation, and ATS optimization.
              </p>

              {/* Benefits List */}
              <div className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-2xl p-6 mb-6 text-left">
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
                <button className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-lg font-bold hover:shadow-2xl transition transform hover:scale-105 shadow-lg">
                  View Pricing Plans
                </button>
              </Link>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full px-8 py-4 bg-gray-100 text-gray-700 rounded-xl text-lg font-semibold hover:bg-gray-200 transition"
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
