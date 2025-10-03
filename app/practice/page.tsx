'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAudioRecorder } from './useAudioRecorder';
import { useTextToSpeech } from './useTextToSpeech';
import AIAvatar from './AIAvatar';
import { roles, categories, type Role } from './roles';
import { getQuestionsForRole } from './questions';

type Step = 'role-selection' | 'interview';

interface ResumeSession {
  sessionId: string;
  role: Role;
  currentQuestion: number;
  responses: Array<{ audioURL: string | null; duration: number; feedback?: string }>;
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const resumeSessionId = searchParams.get('resume');

  const [step, setStep] = useState<Step>('role-selection');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [resumeData, setResumeData] = useState<ResumeSession | null>(null);

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

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setResumeData(null); // Clear resume data when starting fresh
    setStep('interview');
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

  if (step === 'role-selection') {
    // Group roles by category for organized display
    const groupedRoles = filteredRoles.reduce((acc, role) => {
      if (!acc[role.category]) {
        acc[role.category] = [];
      }
      acc[role.category].push(role);
      return acc;
    }, {} as Record<string, typeof filteredRoles>);

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slideDown">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4 leading-tight">
              Choose Your Interview Role
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Select from <span className="font-bold text-orange-600">{roles.length} positions</span> across <span className="font-bold text-purple-600">{categories.length - 1} industries</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Real roles from top companies</span>
            </div>
          </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative group">
                <svg className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search roles, companies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none text-lg shadow-sm hover:shadow-md transition-all duration-200"
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

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-left max-w-5xl mx-auto">Filter by Industry</h3>
              <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
                {categories.map((category) => {
                  const count = category === 'All' ? roles.length : roles.filter(r => r.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full font-medium transition ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level Filter */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-left max-w-5xl mx-auto">Filter by Experience Level</h3>
              <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
                {levels.map((level) => {
                  const count = level === 'All'
                    ? filteredRoles.length
                    : roles.filter(r => {
                        const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
                        return matchesCategory && r.level === level;
                      }).length;

                  // Different styling for each level
                  const getLevelStyle = () => {
                    if (selectedLevel === level) {
                      if (level === 'Entry-Level') return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105';
                      if (level === 'Mid-Level') return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg scale-105';
                      if (level === 'Senior') return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg scale-105';
                      if (level === 'Executive') return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg scale-105';
                      return 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg scale-105';
                    }
                    if (level === 'Entry-Level') return 'bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-200';
                    if (level === 'Mid-Level') return 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-2 border-blue-200';
                    if (level === 'Senior') return 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-2 border-purple-200';
                    if (level === 'Executive') return 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-2 border-amber-200';
                    return 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200';
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
                      className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-200 ${getLevelStyle()}`}
                    >
                      <span className="mr-1">{getLevelIcon()}</span>
                      {level} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

          {/* Results count and Clear Filters */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <p className="text-gray-600">
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
            <div className="space-y-12">
              {Object.entries(groupedRoles).map(([category, categoryRoles]) => (
                <div key={category}>
                  <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                    <span className="ml-3 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {categoryRoles.length} {categoryRoles.length === 1 ? 'role' : 'roles'}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryRoles.map((role, index) => (
                      <div
                        key={role.id}
                        onClick={() => handleRoleSelect(role)}
                        className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-orange-500 hover:-translate-y-2 animate-fadeIn"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                            {role.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 rounded-full text-xs font-medium shadow-sm">
                              {role.company}
                            </span>
                            <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-full text-xs font-medium shadow-sm">
                              {role.level}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{role.description}</p>
                        <div className="flex items-center text-orange-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Start Interview</span>
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoles.map((role, index) => (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-orange-500 hover:-translate-y-2 animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {role.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 rounded-full text-xs font-medium shadow-sm">
                        {role.company}
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-full text-xs font-medium shadow-sm">
                        {role.level}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{role.description}</p>
                  <div className="flex items-center text-orange-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Start Interview</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <InterviewSession
        role={selectedRole!}
        onBack={() => {
          setStep('role-selection');
          setResumeData(null);
        }}
        resumeData={resumeData}
      />
    </div>
  );
}

function InterviewSession({
  role,
  onBack,
  resumeData
}: {
  role: Role;
  onBack: () => void;
  resumeData: ResumeSession | null;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(resumeData?.currentQuestion || 0);
  const [responses, setResponses] = useState<Array<{ audioURL: string | null; duration: number; feedback?: string }>>(
    resumeData?.responses || []
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionId] = useState(() => resumeData?.sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const {
    isRecording,
    recordingTime,
    audioURL,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
    getTranscript
  } = useAudioRecorder();

  const { speak, stop, isSpeaking } = useTextToSpeech();

  // Get role-specific questions
  const [questions] = useState(() => getQuestionsForRole(role.category));

  // Auto-play question when it changes
  useEffect(() => {
    speak(questions[currentQuestion]);
    return () => {
      stop();
    };
  }, [currentQuestion]);

  const handleStartRecording = async () => {
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
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
    try {
      // Get transcript from audio
      const transcript = await getTranscript();

      // Call AI feedback API
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
        }),
      });

      const data = await response.json();

      // Handle error responses
      if (!response.ok) {
        let errorMessage = 'Failed to analyze response. Please try again.';

        if (data.code === 'quota_exceeded') {
          errorMessage = `API Quota Exceeded\n\n${data.message}`;
        } else if (data.code === 'rate_limit') {
          errorMessage = `Rate Limit Exceeded\n\n${data.message}`;
        } else if (data.code === 'auth_error') {
          errorMessage = `Authentication Error\n\n${data.message}`;
        } else if (data.message) {
          errorMessage = data.message;
        }

        alert(errorMessage);
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
      }
    } catch (error: any) {
      console.error('Error getting feedback:', error);

      // Check if it's a transcription error
      if (error?.message?.includes('transcribe')) {
        alert('Failed to transcribe audio. Please ensure your microphone is working and try recording again.');
      } else {
        alert('Failed to analyze response. Please check your internet connection and try again.');
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
          {/* Question Card */}
          <div className="bg-white rounded-3xl p-12 mb-8 shadow-xl border-2 border-gray-100 animate-fadeIn">
            <div className="text-center">
              {/* AI Avatar */}
              <div className="mb-6">
                <AIAvatar isSpeaking={isSpeaking} />
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                {questions[currentQuestion]}
              </h3>

              <div className="flex items-center justify-center gap-3 mb-6">
                <button
                  onClick={() => speak(questions[currentQuestion])}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 hover:from-orange-200 hover:to-orange-100 font-medium rounded-full transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSpeaking}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  {isSpeaking ? 'Speaking...' : 'Replay Question'}
                </button>
              </div>

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
    </div>
  );
}

export default function PracticePage() {
  return (
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
  );
}
