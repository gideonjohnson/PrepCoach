'use client';
// Cache refresh: 2025-10-26 02:30

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAudioRecorder } from './useAudioRecorder';
import { useTextToSpeech } from './useTextToSpeech';
import AIAvatar from './AIAvatar';
import { roles, categories, type Role } from './roles';
import { getQuestionsForRole } from './questions';
import { getQuestionsForRoleAndLevel, type ExperienceLevel } from './questions-by-level';
import { getQuestionsByStage, type Stage, STAGE_CONFIG, getStageColor } from './stage-system';
import { getQuestionsByStage as getQuestionsByStageHelper } from './questions-by-stage';
import Link from 'next/link';
import InterviewerConfig, { InterviewerSettings } from '../components/InterviewerConfig';
import VideoInterviewer from '../components/VideoInterviewer';
import toast from 'react-hot-toast';
import ErrorBoundary from '../components/ErrorBoundary';
import MicrophonePermissionBanner from '../components/MicrophonePermissionBanner';
import BiometricsPanel from '../components/BiometricsPanel';
import PaymentGate from '../components/PaymentGate';
import AIHintsPanel from '../components/AIHintsPanel';
import CodingInterview, { Language } from '../components/CodingInterview';
import { useMediaStream } from './biometrics/useMediaStream';
import { VocalAnalyzer } from './biometrics/vocalAnalytics';
import { VisualAnalyzer } from './biometrics/visualAnalytics';
import { useTensorFlowVision } from './biometrics/useTensorFlowVision';
import { VocalMetrics, VisualMetrics } from './biometrics/types';

// Helper to determine if a role requires coding interview
function isCodingRole(role: Role): boolean {
  const codingKeywords = [
    'Software Engineer',
    'Backend',
    'Frontend',
    'Full-Stack',
    'Data Engineer',
    'DevOps',
    'Site Reliability',
    'ML Engineer',
    'Systems Engineer'
  ];
  return codingKeywords.some(keyword => role.title.includes(keyword));
}

type Step = 'role-selection' | 'interviewer-config' | 'interview';

interface ResumeSession {
  sessionId: string;
  role: Role;
  currentQuestion: number;
  responses: Array<{ audioURL: string | null; duration: number; feedback?: string }>;
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumeSessionId = searchParams.get('resume');

  const [step, setStep] = useState<Step>('role-selection');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [resumeData, setResumeData] = useState<ResumeSession | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState('');
  const [interviewerSettings, setInterviewerSettings] = useState<InterviewerSettings>({
    type: 'animated',
    gender: 'female',
    accent: 'american',
    tone: 'friendly',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<ExperienceLevel>('entry');
  const [selectedStage, setSelectedStage] = useState<1 | 2 | 3>(1);
  const [showStageModal, setShowStageModal] = useState(false);

  // Removed payment gate - free tier users now get 3 interviews/month
  // Limits are enforced by /api/user/check-limits endpoint

  // Check if we need to resume a session
  useEffect(() => {
    if (resumeSessionId) {
      const loadSession = async () => {
        try {
          const response = await fetch(`/api/sessions/${resumeSessionId}`);
          if (response.ok) {
            const data = await response.json();
            const session = data.session;

            // Find the role from our roles list
            const role = roles.find(r =>
              r.title === session.roleTitle &&
              r.company === session.company
            );

            if (role) {
              // Find first unanswered question
              const firstUnanswered = session.responses.findIndex((r: any) => !r.audioURL);
              const startQuestion = firstUnanswered >= 0 ? firstUnanswered : session.responses.length - 1;

              setResumeData({
                sessionId: session.id,
                role: role,
                currentQuestion: startQuestion,
                responses: session.responses
              });
              setSelectedRole(role);
              setStep('interview');
            }
          } else {
            console.error('Failed to load session');
          }
        } catch (error) {
          console.error('Error loading session:', error);
        }
      };

      loadSession();
    }
  }, [resumeSessionId]);

  const handleRoleSelect = async (role: Role, skipConfig: boolean = true) => {
    // Check if user can start a new interview
    try {
      const response = await fetch('/api/user/check-limits?feature=interview');
      if (response.ok) {
        const data = await response.json();
        if (!data.allowed) {
          setLimitMessage(data.reason || 'You have reached your interview limit for this month.');
          setShowLimitModal(true);
          return;
        }
      }
    } catch (error) {
      console.error('Error checking limits:', error);
    }

    setSelectedRole(role);
    setResumeData(null); // Clear resume data when starting fresh

    // Reset stage to 1 for new role
    setSelectedStage(1);

    // Show level & stage selection modal before starting interview
    setShowLevelModal(true);
  };

  const handleStartInterview = async (skipConfig: boolean = true) => {
    // Skip interviewer config by default to reduce friction
    if (!skipConfig && !resumeSessionId) {
      setStep('interviewer-config');
    } else {
      setStep('interview');
    }

    // Increment interview counter
    try {
      await fetch('/api/user/increment-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'interview' })
      });
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  // Get unique levels from roles
  const levels = ['All', ...Array.from(new Set(roles.map(r => r.level)))];

  const filteredRoles = roles.filter(role => {
    const matchesCategory = selectedCategory === 'All' || role.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || role.level === selectedLevel;
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLevel, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);

  // Group roles by category for organized display (paginated)
  const groupedRoles = paginatedRoles.reduce((acc, role) => {
    if (!acc[role.category]) {
      acc[role.category] = [];
    }
    acc[role.category].push(role);
    return acc;
  }, {} as Record<string, typeof paginatedRoles>);

  // Interviewer configuration step
  if (step === 'interviewer-config') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <InterviewerConfig
          currentSettings={interviewerSettings}
          onSave={(settings) => {
            setInterviewerSettings(settings);
            setStep('interview');
          }}
          onClose={() => {
            // Use default settings
            setStep('interview');
          }}
        />
      </div>
    );
  }

  // Quick start roles - most popular positions
  const quickStartRoles = [
    roles.find(r => r.title.includes('Software Engineer') && r.company === 'Google'),
    roles.find(r => r.title.includes('Product Manager') && r.company === 'Meta'),
    roles.find(r => r.title.includes('Data Scientist') && r.company === 'Netflix'),
    roles.find(r => r.title.includes('UX Designer') && r.company === 'Apple'),
    roles.find(r => r.title.includes('Marketing Manager') && r.company === 'Amazon'),
    roles.find(r => r.title.includes('Sales') && r.company === 'Salesforce'),
    roles.find(r => r.title.includes('DevOps') && r.company === 'Microsoft'),
    roles.find(r => r.title.includes('Business Analyst') && r.company === 'Google'),
  ].filter(Boolean) as Role[];

  // Get category emoji
  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      'Technology': '💻',
      'Product': '📱',
      'Design': '🎨',
      'Marketing': '📢',
      'Sales': '💼',
      'Finance': '💰',
      'Operations': '⚙️',
      'Data': '📊',
      'Healthcare': '🏥',
      'Education': '📚',
      'Legal': '⚖️',
      'HR': '👥',
    };
    return emojiMap[category] || '🎯';
  };

  if (step === 'role-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          {/* Back to Dashboard Link */}
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-10 animate-slideDown">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-3 leading-tight">
              Choose Your Interview Role
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-3">
              Select from <span className="font-bold text-orange-600">{roles.length} positions</span> across <span className="font-bold text-purple-600">{categories.length - 1} industries</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Real roles from top companies</span>
            </div>
          </div>

          {/* Quick Start Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Quick Start</h2>
            <p className="text-gray-600 text-center mb-6">Jump right into the most popular interview roles</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 transform-3d">
              {quickStartRoles.map((role, index) => (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 cursor-pointer border-2 border-gray-200 hover:border-orange-500 animate-pop-3d hover-lift-3d [box-shadow:0_4px_8px_rgba(0,0,0,0.12),0_8px_16px_rgba(0,0,0,0.08)]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                    {getCategoryEmoji(role.category)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                    {role.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-orange-600">{role.company}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-purple-600 font-medium">{role.level}</span>
                  </div>
                  <div className="flex items-center text-orange-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity mt-3">
                    <span>Start now</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-b from-purple-50 via-white to-blue-50 text-gray-500">
                  Or browse all {roles.length} roles below
                </span>
              </div>
            </div>
          </div>

            {/* Search Bar - Sticky on mobile */}
            <div className="max-w-2xl mx-auto mb-6 sticky top-0 z-10 bg-gradient-to-b from-purple-50 via-white to-blue-50 py-3 sm:static sm:py-0">
              <div className="relative group">
                <svg className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search roles, companies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-6 py-3 sm:py-4 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none text-base sm:text-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <div className="mb-4 flex justify-center sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
                  {filteredRoles.length}
                </span>
              </button>
            </div>

            {/* Filters Section */}
            <div className={`mb-6 transition-all duration-300 ${showFilters ? 'block' : 'hidden sm:block'}`}>
              {/* Category Filter */}
              <div className="mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 text-center sm:text-left max-w-5xl mx-auto">Filter by Industry</h3>
                <div className="overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="flex sm:flex-wrap gap-2 max-w-5xl mx-auto sm:justify-center min-w-max sm:min-w-0">
                    {categories.map((category) => {
                      const count = category === 'All' ? roles.length : roles.filter(r => r.category === category).length;
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                            selectedCategory === category
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {category} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-6">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 text-center sm:text-left max-w-5xl mx-auto">Filter by Experience Level</h3>
                <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
                {levels.map((level) => {
                  const count = level === 'All'
                    ? filteredRoles.length
                    : roles.filter(r => {
                        const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
                        return matchesCategory && r.level === level;
                      }).length;

                  // Different styling for each level - more subtle
                  const getLevelStyle = () => {
                    if (selectedLevel === level) {
                      if (level === 'Entry-Level') return 'bg-green-500 text-white shadow-md';
                      if (level === 'Mid-Level') return 'bg-blue-500 text-white shadow-md';
                      if (level === 'Senior') return 'bg-purple-500 text-white shadow-md';
                      if (level === 'Executive') return 'bg-amber-500 text-white shadow-md';
                      return 'bg-gray-700 text-white shadow-md';
                    }
                    return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200';
                  };

                  // Icons for each level
                  const getLevelIcon = () => {
                    if (level === 'Entry-Level') return '🌱';
                    if (level === 'Mid-Level') return '📈';
                    if (level === 'Senior') return '⭐';
                    if (level === 'Executive') return '👑';
                    return '🎯';
                  };

                  return (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium transition-all duration-200 ${getLevelStyle()}`}
                    >
                      <span className="mr-1 text-xs sm:text-base">{getLevelIcon()}</span>
                      {level} ({count})
                    </button>
                  );
                })}
              </div>
              </div>
            </div>

          {/* Results count and Clear Filters */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <p className="text-sm sm:text-base text-gray-600">
              Showing {filteredRoles.length} {filteredRoles.length === 1 ? 'role' : 'roles'}
            </p>
            {(selectedCategory !== 'All' || selectedLevel !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                  setSearchQuery('');
                }}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters
              </button>
            )}
          </div>

          {/* Grouped Role Display */}
          {selectedCategory === 'All' ? (
            // Show grouped by category when "All" is selected
            <div className="space-y-10">
              {Object.entries(groupedRoles).map(([category, categoryRoles]) => (
                <div key={category}>
                  <div className="flex items-center mb-5">
                    <span className="text-2xl mr-2">{getCategoryEmoji(category)}</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{category}</h2>
                    <span className="ml-3 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      {categoryRoles.length}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transform-3d">
                    {categoryRoles.map((role, index) => (
                      <div
                        key={role.id}
                        onClick={() => handleRoleSelect(role)}
                        className="group bg-white rounded-xl p-4 cursor-pointer border border-gray-200 hover:border-orange-500 animate-pop-3d hover-lift-3d [box-shadow:0_2px_4px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.05)]"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="text-2xl flex-shrink-0 transform group-hover:scale-110 transition-transform">
                            {getCategoryEmoji(role.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors leading-tight line-clamp-2">
                              {role.title}
                            </h3>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-md text-xs font-medium">
                                {role.company}
                              </span>
                              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                                {role.level}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2 mb-3">{role.description}</p>
                        <div className="flex items-center text-orange-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Start Interview</span>
                          <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Show single category grid when specific category is selected
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transform-3d">
              {paginatedRoles.map((role, index) => (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className="group bg-white rounded-xl p-4 cursor-pointer border border-gray-200 hover:border-orange-500 animate-pop-3d hover-lift-3d [box-shadow:0_2px_4px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.05)]"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl flex-shrink-0 transform group-hover:scale-110 transition-transform">
                      {getCategoryEmoji(role.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors leading-tight line-clamp-2">
                        {role.title}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-md text-xs font-medium">
                          {role.company}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                          {role.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs line-clamp-2 mb-3">{role.description}</p>
                  <div className="flex items-center text-orange-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Start Interview</span>
                    <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredRoles.length > itemsPerPage && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-medium hover:border-orange-500 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Page</span>
                <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg shadow-md">
                  {currentPage}
                </span>
                <span className="text-sm text-gray-600">of {totalPages}</span>
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-medium hover:border-orange-500 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 transition-all shadow-sm hover:shadow-md"
              >
                Next
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Experience Level Selection Modal */}
        {showLevelModal && selectedRole && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full sm:max-w-2xl p-8 animate-slideUp">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Customize Your Practice</h3>
                <p className="text-gray-600 text-lg">For {selectedRole.title}</p>
                <p className="text-sm text-gray-500 mt-2">Select difficulty stage and experience level</p>
              </div>

              {/* Stage Selection */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  🎯 Select Difficulty Stage
                  <span className="text-xs font-normal text-gray-500">(15 questions per stage)</span>
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {/* Stage 1 */}
                  <button
                    onClick={() => setSelectedStage(1)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      selectedStage === 1
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">🌱</div>
                    <h5 className="font-bold text-sm text-gray-900 mb-1">Stage 1</h5>
                    <p className="text-xs text-gray-600">Foundational</p>
                    <p className="text-xs text-green-600 mt-1 font-semibold">Q1-15</p>
                  </button>

                  {/* Stage 2 */}
                  <button
                    onClick={() => setSelectedStage(2)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      selectedStage === 2
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">📈</div>
                    <h5 className="font-bold text-sm text-gray-900 mb-1">Stage 2</h5>
                    <p className="text-xs text-gray-600">Applied</p>
                    <p className="text-xs text-blue-600 mt-1 font-semibold">Q16-30</p>
                  </button>

                  {/* Stage 3 */}
                  <button
                    onClick={() => setSelectedStage(3)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      selectedStage === 3
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">⭐</div>
                    <h5 className="font-bold text-sm text-gray-900 mb-1">Stage 3</h5>
                    <p className="text-xs text-gray-600">Expert</p>
                    <p className="text-xs text-purple-600 mt-1 font-semibold">Q31-45</p>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  💡 Start with Stage 1 to build foundation, then progress to harder stages
                </p>
              </div>

              {/* Experience Level Selection */}
              <h4 className="text-lg font-bold text-gray-900 mb-3">Select Experience Level</h4>
              <div className="grid grid-cols-1 gap-4 mb-6">
                {/* Entry Level */}
                <button
                  onClick={() => {
                    setSelectedExperienceLevel('entry');
                    setShowLevelModal(false);
                    handleStartInterview();
                  }}
                  className="group relative p-6 rounded-2xl border-2 border-gray-200 bg-white hover:border-green-500 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all text-left hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform">🌱</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700">Entry Level</h4>
                      <p className="text-sm text-gray-600 mb-2">0-2 years of experience</p>
                      <p className="text-xs text-gray-500">Focus on foundational knowledge, learning experiences, and basic problem-solving</p>
                    </div>
                    <svg className="w-6 h-6 text-gray-300 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Mid Level */}
                <button
                  onClick={() => {
                    setSelectedExperienceLevel('mid');
                    setShowLevelModal(false);
                    handleStartInterview();
                  }}
                  className="group relative p-6 rounded-2xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all text-left hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform">📈</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700">Mid Level</h4>
                      <p className="text-sm text-gray-600 mb-2">3-5 years of experience</p>
                      <p className="text-xs text-gray-500">Focus on complex scenarios, proven track record, and intermediate problem-solving</p>
                    </div>
                    <svg className="w-6 h-6 text-gray-300 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Senior Level */}
                <button
                  onClick={() => {
                    setSelectedExperienceLevel('senior');
                    setShowLevelModal(false);
                    handleStartInterview();
                  }}
                  className="group relative p-6 rounded-2xl border-2 border-gray-200 bg-white hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 transition-all text-left hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform">⭐</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700">Senior Level</h4>
                      <p className="text-sm text-gray-600 mb-2">7+ years of experience</p>
                      <p className="text-xs text-gray-500">Focus on leadership, strategy, organizational impact, and team building</p>
                    </div>
                    <svg className="w-6 h-6 text-gray-300 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setShowLevelModal(false);
                    setSelectedRole(null);
                  }}
                  className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Limit Reached Modal */}
        {showLimitModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full sm:max-w-md p-6 sm:p-8 animate-slideUp">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Limit Reached</h3>
                <p className="text-gray-600 mb-6">{limitMessage}</p>
              </div>

              <div className="space-y-3">
                <Link href="/pricing">
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105">
                    Upgrade to Pro
                  </button>
                </Link>
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <InterviewSession
        role={selectedRole!}
        experienceLevel={selectedExperienceLevel}
        stage={selectedStage}
        onBack={() => {
          setStep('role-selection');
          setResumeData(null);
        }}
        resumeData={resumeData}
        interviewerSettings={interviewerSettings}
        onConfigureInterviewer={() => setStep('interviewer-config')}
      />
    </div>
  );
}

function InterviewSession({
  role,
  experienceLevel,
  stage,
  onBack,
  resumeData,
  interviewerSettings,
  onConfigureInterviewer
}: {
  role: Role;
  experienceLevel: ExperienceLevel;
  stage: Stage;
  onBack: () => void;
  resumeData: ResumeSession | null;
  interviewerSettings: InterviewerSettings;
  onConfigureInterviewer: () => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(resumeData?.currentQuestion || 0);
  const [responses, setResponses] = useState<Array<{ audioURL: string | null; duration: number; feedback?: string }>>(
    resumeData?.responses || []
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionId] = useState(() => resumeData?.sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [isCodingQuestion, setIsCodingQuestion] = useState(false);
  const [showCodingInterview, setShowCodingInterview] = useState(false);

  // Biometric tracking state
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [vocalMetrics, setVocalMetrics] = useState<Partial<VocalMetrics> | null>(null);
  const [visualMetrics, setVisualMetrics] = useState<Partial<VisualMetrics> | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const vocalAnalyzerRef = useRef<VocalAnalyzer | null>(null);
  const visualAnalyzerRef = useRef<VisualAnalyzer | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const visualAnalysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Media stream for biometric analysis
  const mediaStream = useMediaStream();
  // Enable TensorFlow.js visual analytics
  const tfVision = useTensorFlowVision();

  const {
    isRecording,
    recordingTime,
    audioURL,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
    getTranscript,
    isSupported,
    permissionStatus
  } = useAudioRecorder();

  // Get role-specific questions based on stage (15 questions per stage)
  const [questions] = useState(() => getQuestionsByStageHelper(role.category, stage));

  // Initialize analyzers
  useEffect(() => {
    if (biometricsEnabled) {
      if (!vocalAnalyzerRef.current) {
        vocalAnalyzerRef.current = new VocalAnalyzer();
      }
      if (!visualAnalyzerRef.current) {
        visualAnalyzerRef.current = new VisualAnalyzer();
      }
    }
  }, [biometricsEnabled]);

  const handleStartRecording = async () => {
    await startRecording();

    // Start biometric tracking if enabled
    if (biometricsEnabled && mediaStream) {
      try {
        // Request both video and audio for full biometric analysis
        await mediaStream.startStream({ video: true, audio: true });

        // Reset analyzers for new recording
        if (vocalAnalyzerRef.current) {
          vocalAnalyzerRef.current.reset();
        }
        if (visualAnalyzerRef.current) {
          visualAnalyzerRef.current.reset();
        }

        // Start collecting audio data for vocal analysis
        analysisIntervalRef.current = setInterval(() => {
          if (vocalAnalyzerRef.current && mediaStream.hasAudio) {
            const audioData = mediaStream.getAudioData();
            const freqData = mediaStream.getFrequencyData();
            vocalAnalyzerRef.current.addAudioFrame(audioData, freqData);

            // Update vocal metrics every second
            const metrics = vocalAnalyzerRef.current.getMetrics();
            setVocalMetrics(metrics);
          }
        }, 1000); // Update every second

        // Start collecting video data for visual analysis
        if (tfVision.isLoaded) {
          visualAnalysisIntervalRef.current = setInterval(async () => {
            if (visualAnalyzerRef.current && mediaStream.hasVideo) {
              try {
                const frameData = mediaStream.captureFrame();
                if (frameData) {
                  // Analyze face and pose
                  const [faceResult, poseResult] = await Promise.all([
                    tfVision.analyzeFace(frameData),
                    tfVision.analyzePose(frameData),
                  ]);

                  visualAnalyzerRef.current.analyzeFrame(faceResult, poseResult);

                  // Update visual metrics
                  const visualMetrics = visualAnalyzerRef.current.getMetrics();
                  setVisualMetrics(visualMetrics);
                }
              } catch (err) {
                console.error('Error during visual analysis:', err);
              }
            }
          }, 2000); // Update every 2 seconds (less frequent to save CPU)
        } else {
          console.warn('TensorFlow.js not loaded, skipping visual analysis');
        }
      } catch (error) {
        console.error('Failed to start biometric tracking:', error);
        toast.error('Biometric tracking unavailable. Recording will continue without it.');
      }
    }
  };

  const handleStopRecording = () => {
    stopRecording();

    // Stop biometric tracking
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }

    if (visualAnalysisIntervalRef.current) {
      clearInterval(visualAnalysisIntervalRef.current);
      visualAnalysisIntervalRef.current = null;
    }

    if (mediaStream.isStreaming) {
      mediaStream.stopStream();
    }

    // Get final metrics
    if (vocalAnalyzerRef.current) {
      const finalMetrics = vocalAnalyzerRef.current.getMetrics();
      setVocalMetrics(finalMetrics);
    }

    if (visualAnalyzerRef.current) {
      const finalVisualMetrics = visualAnalyzerRef.current.getMetrics();
      setVisualMetrics(finalVisualMetrics);
    }
  };

  // Save response when audioURL becomes available
  useEffect(() => {
    if (audioURL && !isRecording) {
      const newResponses = [...responses];
      newResponses[currentQuestion] = {
        audioURL: audioURL,
        duration: recordingTime
      };
      setResponses(newResponses);
    }
  }, [audioURL, isRecording]);

  const handleGetFeedback = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);
    const transcribeToast = toast.loading('Transcribing your audio...');

    try {
      // Get transcript from audio
      const transcript = await getTranscript();

      // Update vocal analyzer with transcript for better analysis
      if (biometricsEnabled && vocalAnalyzerRef.current && transcript) {
        vocalAnalyzerRef.current.setTranscript(transcript);
        const updatedMetrics = vocalAnalyzerRef.current.getMetrics();
        setVocalMetrics(updatedMetrics);
      }

      // Update toast for analysis phase
      toast.loading('Analyzing your response with AI...', { id: transcribeToast });

      // Call AI feedback API with biometric data if available
      const response = await fetch('/api/analyze-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          question: questions[currentQuestion],
          role: role.title,
          category: role.category,
          // Include biometric data for enhanced feedback
          vocalMetrics: vocalMetrics || undefined,
          visualMetrics: visualMetrics || undefined,
        }),
      });

      const data = await response.json();

      // Handle error responses
      if (!response.ok) {
        if (data.code === 'limit_reached') {
          // Show upgrade modal for subscription limits with custom toast
          toast.error(
            (t) => (
              <div className="flex flex-col gap-3">
                <div>
                  <div className="font-semibold mb-1">Subscription Limit Reached</div>
                  <div className="text-sm">{data.message}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                      window.location.href = '/pricing';
                    }}
                    className="px-3 py-1 bg-white text-red-600 rounded font-semibold text-sm hover:bg-red-50"
                  >
                    Upgrade to Pro
                  </button>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded font-semibold text-sm hover:bg-red-700"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ),
            { duration: 8000 }
          );
          return;
        } else if (data.code === 'quota_exceeded') {
          toast.error(`API Quota Exceeded: ${data.message}`, { duration: 6000 });
          return;
        } else if (data.code === 'rate_limit') {
          toast.error(`Rate Limit: ${data.message}`, { duration: 5000 });
          return;
        } else if (data.code === 'auth_error') {
          toast.error(`Authentication Error: ${data.message}`, { duration: 6000 });
          return;
        } else if (data.message) {
          toast.error(data.message);
          return;
        }

        toast.error('Failed to analyze response. Please try again.');
        return;
      }

      if (data.feedback) {
        const newResponses = [...responses];
        newResponses[currentQuestion] = {
          ...newResponses[currentQuestion],
          feedback: data.feedback,
        };
        setResponses(newResponses);
        setShowFeedback(true);
        toast.success('Feedback received! Review your AI analysis below.', {
          id: transcribeToast,
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Error getting feedback:', error);
      toast.dismiss(transcribeToast);

      // Check if it's a transcription error
      if (error?.message?.includes('transcribe')) {
        toast.error('Failed to transcribe audio. Please ensure your microphone is working and try recording again.', {
          duration: 5000,
        });
      } else {
        toast.error('Failed to analyze response. Please check your internet connection and try again.', {
          duration: 5000,
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Save session to database whenever responses change
  useEffect(() => {
    const answeredQuestions = responses.filter(r => r.audioURL).length;
    const completionRate = Math.round((answeredQuestions / questions.length) * 100);

    const sessionData = {
      roleTitle: role.title,
      roleCategory: role.category,
      roleLevel: role.level,
      company: role.company,
      totalQuestions: questions.length,
      answeredQuestions,
      completionRate,
      responses: responses.map((r, index) => ({
        question: questions[index],
        audioURL: r.audioURL,
        duration: r.duration,
        feedback: r.feedback,
        timestamp: Date.now()
      }))
    };

    // Save or update session in database
    const saveSession = async () => {
      try {
        // If resuming, update existing session
        if (resumeData?.sessionId) {
          await fetch(`/api/sessions/${resumeData.sessionId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ responses: sessionData.responses })
          });
        } else {
          // Create new session on first save
          const response = await fetch('/api/sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(sessionData)
          });

          if (response.ok) {
            const data = await response.json();
            // Update sessionId if it was created for the first time
            if (data.session?.id && sessionId !== data.session.id) {
              // Store the new sessionId in state (would need state management for this)
            }
          }
        }
      } catch (error) {
        console.error('Error saving session:', error);
      }
    };

    // Only save if there are responses to save
    if (responses.some(r => r.audioURL)) {
      saveSession();
    }
  }, [responses, sessionId, role, questions, resumeData]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Roles
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">{role.title}</h2>
            <p className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <a
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-lg font-medium hover:from-purple-200 hover:to-purple-100 transition-all shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dashboard
          </a>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 h-1.5 shadow-inner">
        <div
          className="bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 h-1.5 transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-3xl w-full">
          {/* Microphone Permission Banner */}
          <MicrophonePermissionBanner
            isSupported={isSupported}
            permissionStatus={permissionStatus}
            onRequestPermission={handleStartRecording}
          />

          {/* Controls Row: Hints, Coding Toggle, Biometrics */}
          <div className="mb-6 flex justify-between items-center flex-wrap gap-3">
            <div className="flex gap-3">
              <button
                onClick={() => setShowHints(!showHints)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {showHints ? 'Hide AI Hints' : '💡 Get AI Hints'}
              </button>

              {/* Coding/Audio Toggle for technical roles */}
              {isCodingRole(role) && (
                <div className="inline-flex gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setShowCodingInterview(false)}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                      !showCodingInterview
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🎙️ Audio Interview
                  </button>
                  <button
                    onClick={() => setShowCodingInterview(true)}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                      showCodingInterview
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    💻 Code Challenge
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setBiometricsEnabled(!biometricsEnabled)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md ${
                biometricsEnabled
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {biometricsEnabled ? 'Biometrics: ON' : 'Enable Biometrics'}
            </button>
          </div>

          {/* Biometrics Panel */}
          {biometricsEnabled && (isRecording || vocalMetrics || visualMetrics) && (
            <div className="mb-8">
              <BiometricsPanel
                vocalMetrics={vocalMetrics}
                visualMetrics={visualMetrics}
                isActive={biometricsEnabled}
              />
            </div>
          )}

          {/* TensorFlow.js Loading Status */}
          {biometricsEnabled && !tfVision.isLoaded && !tfVision.error && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-center animate-fadeIn">
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-blue-700 font-medium">Loading AI vision models...</span>
              </div>
              <p className="text-xs text-blue-600 mt-2">Powered by TensorFlow.js - First load may take a moment</p>
            </div>
          )}

          {/* TensorFlow.js Error */}
          {biometricsEnabled && tfVision.error && (
            <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg animate-fadeIn">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-1">Visual Analysis Temporarily Unavailable</h4>
                  <p className="text-xs text-yellow-700 mb-2">
                    Visual analytics (eye contact, posture) are currently disabled.
                  </p>
                  <p className="text-xs text-yellow-700">
                    <strong>Good news:</strong> Vocal analysis (pace, clarity, filler words) is fully functional and will provide comprehensive feedback.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Visual Analytics Success Message */}
          {biometricsEnabled && tfVision.isLoaded && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg animate-fadeIn">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-green-900 mb-1">Full Biometric Analysis Active</h4>
                  <p className="text-xs text-green-700">
                    Tracking vocal delivery + eye contact + posture in real-time
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Coding Interview Mode */}
          {showCodingInterview && isCodingRole(role) ? (
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden mb-8 animate-fadeIn">
              <CodingInterview
                question={questions[currentQuestion]}
                onSubmit={async (code, language) => {
                  setIsAnalyzing(true);
                  try {
                    const response = await fetch('/api/interview/code-review', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        code,
                        language,
                        question: questions[currentQuestion],
                        role: role.title,
                        category: role.category,
                      }),
                    });

                    if (!response.ok) throw new Error('Failed to get code review');

                    const data = await response.json();
                    const updatedResponses = [...responses];
                    updatedResponses[currentQuestion] = {
                      audioURL: null,
                      duration: 0,
                      feedback: data.feedback,
                    };
                    setResponses(updatedResponses);
                    setShowFeedback(true);
                    toast.success('Code review complete!');
                  } catch (error: any) {
                    toast.error(error.message || 'Failed to analyze code');
                  } finally {
                    setIsAnalyzing(false);
                  }
                }}
                onRunCode={async (code, language) => {
                  const response = await fetch('/api/interview/execute-code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, language }),
                  });
                  if (!response.ok) throw new Error('Execution failed');
                  return await response.json();
                }}
              />
            </div>
          ) : (
            <>
              {/* Question Card - Audio Interview Mode */}
              <div className="bg-white rounded-3xl p-12 mb-8 shadow-xl border-2 border-gray-100 animate-fadeIn">
                <div className="text-center">
                  {/* Video Interviewer */}
                  <div className="mb-6">
                    <VideoInterviewer
                      question={questions[currentQuestion]}
                      settings={interviewerSettings}
                      onSpeakingChange={setIsSpeaking}
                      autoPlay={true}
                    />
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                    {questions[currentQuestion]}
                  </h3>

                  <p className="text-gray-600 text-lg">
                    Take your time to think about your answer before recording
                  </p>
                </div>
              </div>

              {/* Recording Controls */}
              <div className="text-center space-y-6">
            {audioURL && !isRecording && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-4 border-2 border-green-200 shadow-lg animate-fadeIn">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-700 font-semibold text-lg">Response recorded!</span>
                </div>
                <audio controls src={audioURL} className="w-full max-w-md mx-auto mb-5 rounded-lg" />

                <div className="flex gap-4 justify-center items-center">
                  <button
                    onClick={clearRecording}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Clear and re-record
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={handleGetFeedback}
                    disabled={isAnalyzing || !!responses[currentQuestion]?.feedback}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  >
                    {isAnalyzing && (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isAnalyzing ? 'Analyzing...' : responses[currentQuestion]?.feedback ? 'Feedback received ✓' : 'Get AI Feedback'}
                  </button>
                </div>
              </div>
            )}

            {/* Loading Overlay During Analysis */}
            {isAnalyzing && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-4 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">Analyzing Your Response</h3>
                    <p className="text-sm text-gray-600">
                      Our AI is transcribing your audio and providing detailed feedback...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Feedback Display */}
            {showFeedback && responses[currentQuestion]?.feedback && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-4 text-left max-w-3xl mx-auto border-2 border-blue-200 shadow-xl animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-blue-900">AI Feedback</h3>
                  </div>
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {responses[currentQuestion].feedback}
                </div>
              </div>
            )}

            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white rounded-full text-lg font-bold hover:shadow-2xl transition-all transform hover:scale-105 shadow-lg"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
                {audioURL ? 'Re-record Answer' : 'Start Recording'}
              </button>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                    <span className="text-2xl font-mono font-bold text-gray-900">
                      {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 text-center">Recording in progress...</p>
                </div>
                <button
                  onClick={handleStopRecording}
                  className="px-10 py-5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full text-lg font-bold hover:from-gray-900 hover:to-black transition-all shadow-lg hover:shadow-xl"
                >
                  Stop Recording
                </button>
              </div>
            )}
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="group px-6 py-3 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestion === questions.length - 1}
              className="group px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              Next Question
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* AI Hints Panel */}
      <AIHintsPanel
        question={questions[currentQuestion]}
        role={role.title}
        category={role.category}
        isVisible={showHints}
        onToggle={() => setShowHints(!showHints)}
      />
    </div>
  );
}

export default function PracticePage() {
  return (
    <PaymentGate feature="Interview Practice">
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading...</p>
            </div>
          </div>
        }>
          <PracticeContent />
        </Suspense>
      </ErrorBoundary>
    </PaymentGate>
  );
}
