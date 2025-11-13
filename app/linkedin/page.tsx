'use client';

import { useState } from 'react';
import { LinkedInProfile, OptimizedProfile, ProfileScore, SkillRecommendation, KeywordAnalysis, ConnectionMessageTemplate, VisibilityPlan } from './types';
import { analyzeMultipleJobs, parseJobPosting } from './keywordAnalyzer';
import { optimizeHeadline, optimizeAbout, optimizeExperienceBullets, generateHeadlineExamples } from './profileOptimizer';
import { generateSkillRecommendations, optimizeSkillsOrder, generateSkillsGapSummary } from './skillsRecommender';
import { scoreProfile, generateProfileAssessment } from './profileScorer';
import { getConnectionTemplates, customizeTemplate, scoreConnectionMessage } from './connectionTemplates';
import { generate4WeekPlan, getPostingBestPractices, getEngagementStrategy, getWeeklyChecklist } from './visibilityPlanner';
import PaymentGate from '../components/PaymentGate';

function LinkedInOptimizerContent() {
  const [activeTab, setActiveTab] = useState<'input' | 'optimize' | 'skills' | 'connect' | 'visibility'>('input');
  const [profile, setProfile] = useState<Partial<LinkedInProfile>>({
    headline: '',
    about: '',
    experience: [],
    skills: [],
  });
  const [targetJobs, setTargetJobs] = useState<string[]>(['', '', '']);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysis | null>(null);
  const [optimizedProfile, setOptimizedProfile] = useState<Partial<OptimizedProfile> | null>(null);
  const [profileScore, setProfileScore] = useState<ProfileScore | null>(null);
  const [skillRecommendations, setSkillRecommendations] = useState<SkillRecommendation[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // Handle profile import
  const handleImportProfile = async () => {
    if (!importText.trim() || importText.trim().length < 50) {
      alert('Please paste your LinkedIn profile text (at least 50 characters)');
      return;
    }

    setIsImporting(true);

    try {
      const response = await fetch('/api/linkedin/parse-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileText: importText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse profile');
      }

      // Autofill the form with parsed data
      const parsed = data.profile;

      setProfile({
        headline: parsed.headline || '',
        about: parsed.about || '',
        experience: parsed.experience && parsed.experience.length > 0
          ? parsed.experience.map((exp: any) => ({
              title: exp.title || '',
              company: exp.company || '',
              duration: exp.duration || '',
              description: exp.description || '',
              bullets: []
            }))
          : [],
        skills: parsed.skills || [],
        education: parsed.education || [],
        projects: parsed.projects || [],
        certifications: parsed.certifications || [],
      });

      setShowImportModal(false);
      setImportText('');
      alert('Profile imported successfully! Review the fields and make any adjustments.');
    } catch (error: any) {
      console.error('Import error:', error);
      alert(error.message || 'Failed to import profile. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  // Handle analyze
  const handleAnalyze = () => {
    if (!profile.headline || !profile.about) {
      alert('Please fill in at least your headline and about section');
      return;
    }

    // Filter out empty job descriptions
    const validJobs = targetJobs.filter(job => job.trim().length > 50);

    if (validJobs.length === 0) {
      alert('Please add at least one target job description');
      return;
    }

    // Create full profile object
    const fullProfile: LinkedInProfile = {
      headline: profile.headline || '',
      about: profile.about || '',
      experience: profile.experience || [],
      skills: profile.skills || [],
    };

    // Analyze keywords
    const analysis = analyzeMultipleJobs(fullProfile, validJobs);
    setKeywordAnalysis(analysis);

    // Generate optimized content
    const optimizedHead = optimizeHeadline(fullProfile.headline, targetRole, analysis, fullProfile);
    const optimizedAbt = optimizeAbout(fullProfile.about, targetRole, analysis, fullProfile);

    setOptimizedProfile({
      headline: optimizedHead,
      about: optimizedAbt,
    });

    // Score profile
    const score = scoreProfile(fullProfile, analysis);
    setProfileScore(score);

    // Generate skill recommendations
    const skills = generateSkillRecommendations(fullProfile, analysis, targetRole);
    setSkillRecommendations(skills);

    // Switch to optimize tab
    setActiveTab('optimize');
  };

  // Handle adding experience
  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [
        ...(profile.experience || []),
        { title: '', company: '', duration: '', description: '' },
      ],
    });
  };

  // Handle adding skill
  const addSkill = (skill: string) => {
    if (skill && !profile.skills?.includes(skill)) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), skill],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">LinkedIn Profile Optimizer</h1>
              <p className="text-gray-600">Professional profile optimization powered by advanced AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 overflow-x-auto">
            {[
              { id: 'input', label: 'Profile Input' },
              { id: 'optimize', label: 'Optimization' },
              { id: 'skills', label: 'Skills' },
              { id: 'connect', label: 'Networking' },
              { id: 'visibility', label: 'Visibility Plan' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Tab */}
        {activeTab === 'input' && (
          <div className="space-y-8">
            {/* Import Profile Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Quick Import from LinkedIn</h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Save time! Copy your LinkedIn profile and paste it here. Our AI will automatically extract and fill all your information.
                  </p>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
                  >
                    Import from LinkedIn
                  </button>
                </div>
                <div className="ml-4">
                  <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm-1-7.9c-.7 0-1.3-.6-1.3-1.3 0-.7.6-1.3 1.3-1.3.7 0 1.3.6 1.3 1.3 0 .7-.6 1.3-1.3 1.3zM17 17h-2v-3.5c0-1.4-1.6-1.3-1.6 0V17h-2v-7h2v1c.8-1.5 3.6-1.6 3.6 1.4V17z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your LinkedIn Profile</h2>

              {/* Target Role */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              {/* Headline */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Headline
                </label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your current LinkedIn headline"
                  maxLength={220}
                />
                <p className="text-sm text-gray-500 mt-1">{profile.headline?.length || 0}/220 characters</p>
              </div>

              {/* About */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Section
                </label>
                <textarea
                  value={profile.about}
                  onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your current About section"
                  maxLength={2600}
                />
                <p className="text-sm text-gray-500 mt-1">{profile.about?.length || 0}/2600 characters</p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Skills (add your top skills)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    id="skill-input"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type a skill and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        addSkill(input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('skill-input') as HTMLInputElement;
                      addSkill(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => {
                          setProfile({
                            ...profile,
                            skills: profile.skills?.filter((_, i) => i !== index),
                          });
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Jobs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Target Job Descriptions</h2>
              <p className="text-gray-600 mb-6">Paste 3-5 job descriptions you&apos;re interested in (or URLs - we&apos;ll analyze the keywords)</p>

              {targetJobs.map((job, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job {index + 1}
                  </label>
                  <textarea
                    value={job}
                    onChange={(e) => {
                      const newJobs = [...targetJobs];
                      newJobs[index] = e.target.value;
                      setTargetJobs(newJobs);
                    }}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Paste job description or key requirements..."
                  />
                </div>
              ))}

              <button
                onClick={() => setTargetJobs([...targetJobs, ''])}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add another job
              </button>
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                Analyze & Optimize My Profile
              </button>
            </div>
          </div>
        )}

        {/* Optimization Tab */}
        {activeTab === 'optimize' && (
          <>
            {optimizedProfile && profileScore && keywordAnalysis ? (
              <OptimizationTab
                profile={profile as LinkedInProfile}
                optimizedProfile={optimizedProfile}
                profileScore={profileScore}
                keywordAnalysis={keywordAnalysis}
              />
            ) : (
              <div className="max-w-2xl mx-auto text-center py-16">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                  <div className="text-6xl mb-6">📊</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">No Analysis Yet</h2>
                  <p className="text-gray-600 mb-8 text-lg">
                    To see your optimized profile and recommendations, please fill in your profile information in the <strong>Profile Input</strong> tab and click the <strong>&quot;🚀 Analyze & Optimize My Profile&quot;</strong> button.
                  </p>
                  <button
                    onClick={() => setActiveTab('input')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Go to Profile Input
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <>
            {keywordAnalysis && skillRecommendations.length > 0 ? (
              <SkillsTab
                profile={profile as LinkedInProfile}
                skillRecommendations={skillRecommendations}
                keywordAnalysis={keywordAnalysis}
                targetRole={targetRole}
              />
            ) : (
              <div className="max-w-2xl mx-auto text-center py-16">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                  <div className="text-6xl mb-6">💡</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">No Skills Analysis Yet</h2>
                  <p className="text-gray-600 mb-8 text-lg">
                    To get personalized skill recommendations, please fill in your profile information in the <strong>Profile Input</strong> tab and click the <strong>&quot;🚀 Analyze & Optimize My Profile&quot;</strong> button.
                  </p>
                  <button
                    onClick={() => setActiveTab('input')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Go to Profile Input
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Connection Tab */}
        {activeTab === 'connect' && (
          <ConnectionTab />
        )}

        {/* Visibility Tab */}
        {activeTab === 'visibility' && (
          <VisibilityTab targetRole={targetRole} />
        )}
      </main>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Import LinkedIn Profile</h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportText('');
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">How to import your LinkedIn profile:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Go to your LinkedIn profile page</li>
                <li>Click "More" button, then select "Save to PDF"</li>
                <li>Open the PDF and copy ALL the text (Ctrl+A, then Ctrl+C)</li>
                <li>Paste it in the text area below</li>
                <li>Click "Parse & Import" - our AI will extract everything automatically</li>
              </ol>
              <p className="text-xs text-gray-500 mt-3">
                <strong>Alternative:</strong> You can also manually copy-paste sections from your LinkedIn profile page
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Paste Your LinkedIn Profile Text
              </label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-mono"
                placeholder="Paste your complete LinkedIn profile text here...&#10;&#10;Example:&#10;John Doe&#10;Senior Software Engineer | Full-Stack Development | React, Node.js&#10;&#10;About&#10;Experienced software engineer with 5+ years...&#10;&#10;Experience&#10;Senior Software Engineer at Tech Corp&#10;Jan 2020 - Present..."
              />
              <p className="text-xs text-gray-500 mt-2">
                {importText.length} characters | Minimum 50 characters required
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleImportProfile}
                disabled={isImporting || importText.trim().length < 50}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isImporting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Parsing with AI...
                  </span>
                ) : (
                  'Parse & Import'
                )}
              </button>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportText('');
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Privacy Note:</strong> Your profile data is processed securely and only used to populate the form. We never store your LinkedIn credentials or share your information.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Optimization Tab Component
function OptimizationTab({ profile, optimizedProfile, profileScore, keywordAnalysis }: any) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const assessment = generateProfileAssessment(profileScore);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Profile Score */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Score</h2>
        <div className="grid md:grid-cols-5 gap-6">
          <ScoreCard label="Overall" score={profileScore.overall} />
          <ScoreCard label="Relevance" score={profileScore.relevance} />
          <ScoreCard label="Impact" score={profileScore.impact} />
          <ScoreCard label="Clarity" score={profileScore.clarity} />
          <ScoreCard label="Complete" score={profileScore.completeness} />
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Grade: {assessment.grade}</h3>
          <p className="text-gray-700">{assessment.summary}</p>
        </div>
      </div>

      {/* Keyword Coverage */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Keyword Analysis</h2>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Keyword Coverage</span>
            <span className="font-bold text-blue-600">{keywordAnalysis.coverageScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${keywordAnalysis.coverageScore}%` }}
            />
          </div>
        </div>
        <div className="space-y-2">
          {keywordAnalysis.recommendations.map((rec: string, index: number) => (
            <p key={index} className="text-gray-700">{rec}</p>
          ))}
        </div>
      </div>

      {/* Optimized Headline */}
      {optimizedProfile.headline && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Optimized Headline</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Original:</h3>
              <p className="p-4 bg-gray-50 rounded-lg text-gray-800">{optimizedProfile.headline.original}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Optimized:</h3>
              <div className="relative">
                <p className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-gray-900 font-medium">
                  {optimizedProfile.headline.optimized}
                </p>
                <button
                  onClick={() => copyToClipboard(optimizedProfile.headline.optimized, 'headline')}
                  className="absolute top-2 right-2 px-3 py-1 bg-white text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition"
                >
                  {copiedSection === 'headline' ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Improvements:</h3>
              <ul className="list-disc list-inside space-y-1">
                {optimizedProfile.headline.improvements.map((imp: string, index: number) => (
                  <li key={index} className="text-gray-700">{imp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Optimized About */}
      {optimizedProfile.about && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Optimized About Section</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Optimized:</h3>
              <div className="relative">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-gray-900 whitespace-pre-wrap">
                  {optimizedProfile.about.optimized}
                </div>
                <button
                  onClick={() => copyToClipboard(optimizedProfile.about.optimized, 'about')}
                  className="absolute top-2 right-2 px-3 py-1 bg-white text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition"
                >
                  {copiedSection === 'about' ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Keywords Added:</h3>
              <div className="flex flex-wrap gap-2">
                {optimizedProfile.about.keywordsAdded.map((keyword: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Priorities */}
      {assessment.topPriorities.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎯 Top Priorities</h3>
          <ul className="space-y-2">
            {assessment.topPriorities.map((priority: string, index: number) => (
              <li key={index} className="text-red-800 flex items-start">
                <span className="mr-2">•</span>
                <span>{priority}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Score Card Component
function ScoreCard({ label, score }: { label: string; score: number }) {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="text-center">
      <div className={`w-24 h-24 mx-auto rounded-full ${getColor(score)} flex items-center justify-center text-white text-2xl font-bold shadow-sm`}>
        {score}
      </div>
      <p className="mt-2 font-medium text-gray-700">{label}</p>
    </div>
  );
}

// Skills Tab Component
function SkillsTab({ profile, skillRecommendations, keywordAnalysis, targetRole }: any) {
  const skillsGap = generateSkillsGapSummary(profile, skillRecommendations);
  const { reorderedSkills, reasoning } = optimizeSkillsOrder(profile.skills || [], keywordAnalysis, targetRole);

  return (
    <div className="space-y-8">
      {/* Skills Gap Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills Gap Analysis</h2>
        <p className="text-gray-700 mb-6">{skillsGap.summary}</p>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-red-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-600">{skillsGap.essentialCount}</div>
            <div className="text-sm text-gray-600">Essential Skills Missing</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-600">{skillsGap.recommendedCount}</div>
            <div className="text-sm text-gray-600">Recommended Skills</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600">{skillsGap.niceToHaveCount}</div>
            <div className="text-sm text-gray-600">Nice-to-Have Skills</div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-gray-900 mb-2">Top Actions:</h3>
          {skillsGap.topActions.map((action: string, index: number) => (
            <p key={index} className="text-gray-700">{action}</p>
          ))}
        </div>
      </div>

      {/* Skill Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Skills to Add</h2>
        <div className="space-y-4">
          {skillRecommendations.slice(0, 15).map((rec: SkillRecommendation, index: number) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-gray-900">{rec.skill}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'essential' ? 'bg-red-100 text-red-700' :
                      rec.priority === 'recommended' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rec.reason}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-blue-600">{rec.inDemand}%</div>
                  <div className="text-xs text-gray-500">in demand</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimized Skills Order */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Optimized Skills Order</h2>
        <p className="text-gray-600 mb-4">Reorder your skills to put the most relevant ones first for better recruiter visibility:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {reorderedSkills.map((skill, index) => (
            <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
              {index + 1}. {skill}
            </span>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">Reasoning:</h3>
          {reasoning.map((r, index) => (
            <p key={index} className="text-gray-700 text-sm mb-1">{r}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// Connection Tab Component
function ConnectionTab() {
  const templates = getConnectionTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [customizedMessage, setCustomizedMessage] = useState('');
  const [messageScore, setMessageScore] = useState<any>(null);

  const handleCustomize = () => {
    const score = scoreConnectionMessage(customizedMessage);
    setMessageScore(score);
  };

  return (
    <div className="space-y-8">
      {/* Template Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Connection Message Templates</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {templates.slice(0, 6).map((template, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedTemplate(template);
                setCustomizedMessage(template.template);
              }}
              className={`p-4 border-2 rounded-lg text-left transition ${
                selectedTemplate.scenario === template.scenario
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <h3 className="font-bold text-gray-900 mb-1">{template.scenario}</h3>
            </button>
          ))}
        </div>

        {/* Selected Template */}
        <div className="border-t pt-6">
          <h3 className="font-bold text-lg mb-4">{selectedTemplate.scenario}</h3>
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Template:</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{selectedTemplate.template}</pre>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Example:</h4>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-800">{selectedTemplate.example}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Tips:</h4>
            <ul className="list-disc list-inside space-y-1">
              {selectedTemplate.tips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-700">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Message Customizer */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Customize Your Message</h2>
        <textarea
          value={customizedMessage}
          onChange={(e) => setCustomizedMessage(e.target.value)}
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
          placeholder="Customize your connection message here..."
        />
        <p className="text-sm text-gray-500 mb-4">{customizedMessage.length} characters</p>
        <button
          onClick={handleCustomize}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Score My Message
        </button>

        {messageScore && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Message Score</h3>
              <div className={`text-4xl font-bold ${
                messageScore.score >= 80 ? 'text-green-600' :
                messageScore.score >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {messageScore.score}
              </div>
            </div>
            {messageScore.strengths.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold text-green-700 mb-2">Strengths:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {messageScore.strengths.map((s: string, i: number) => (
                    <li key={i} className="text-gray-700">{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {messageScore.improvements.length > 0 && (
              <div>
                <h4 className="font-bold text-red-700 mb-2">Improvements:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {messageScore.improvements.map((imp: string, i: number) => (
                    <li key={i} className="text-gray-700">{imp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Visibility Tab Component
function VisibilityTab({ targetRole }: { targetRole: string }) {
  const visibilityPlan = generate4WeekPlan(targetRole);
  const postingBestPractices = getPostingBestPractices();
  const engagementStrategy = getEngagementStrategy();
  const [selectedWeek, setSelectedWeek] = useState(1);

  const selectedWeekPlan = visibilityPlan.weeks[selectedWeek - 1];

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4-Week Visibility Plan</h2>
        <p className="text-gray-600 mb-6">Strategic plan to increase your LinkedIn visibility and get noticed by recruiters</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-3">Goals:</h3>
            <ul className="space-y-2">
              {visibilityPlan.goals.map((goal, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Track These Metrics:</h3>
            <ul className="space-y-2">
              {visibilityPlan.metrics.map((metric, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">📊</span>
                  <span className="text-gray-700">{metric}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Week Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex gap-4 mb-6">
          {[1, 2, 3, 4].map((week) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                selectedWeek === week
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week {week}
            </button>
          ))}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">Week {selectedWeek}: {selectedWeekPlan.focus}</h3>

        <div className="mb-6">
          <h4 className="font-bold text-lg mb-3">Tasks:</h4>
          <div className="space-y-3">
            {selectedWeekPlan.tasks.map((task, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900 flex-1">{task.task}</p>
                  <span className={`ml-4 px-2 py-1 rounded-full text-xs font-medium ${
                    task.impact === 'high' ? 'bg-red-100 text-red-700' :
                    task.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.impact} impact
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>📅 {task.frequency}</span>
                  <span>⏱️ {task.timeEstimate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-3">Post Topic Ideas:</h4>
          <ul className="space-y-2">
            {selectedWeekPlan.postTopics.map((topic, index) => (
              <li key={index} className="flex items-start">
                <span className="text-purple-600 mr-2">💡</span>
                <span className="text-gray-700">{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">LinkedIn Best Practices</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-3">Posting Tips:</h3>
            <ul className="space-y-2">
              {postingBestPractices.timing.map((tip, index) => (
                <li key={index} className="text-sm text-gray-700">{tip}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Format Tips:</h3>
            <ul className="space-y-2">
              {postingBestPractices.format.map((tip, index) => (
                <li key={index} className="text-sm text-gray-700">{tip}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Engagement Tips:</h3>
            <ul className="space-y-2">
              {postingBestPractices.engagement.map((tip, index) => (
                <li key={index} className="text-sm text-gray-700">{tip}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Content Tips:</h3>
            <ul className="space-y-2">
              {postingBestPractices.content.map((tip, index) => (
                <li key={index} className="text-sm text-gray-700">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LinkedInOptimizerPage() {
  return (
    <PaymentGate feature="LinkedIn Optimizer">
      <LinkedInOptimizerContent />
    </PaymentGate>
  );
}
