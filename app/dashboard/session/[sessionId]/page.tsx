'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { exportSessionToPDF, exportSessionToCSV } from '@/lib/exportUtils';

interface InterviewResponse {
  question: string;
  audioURL: string | null;
  duration: number;
  feedback?: string;
  timestamp: number;
}

interface InterviewSession {
  id: string;
  roleTitle: string;
  roleCategory: string;
  roleLevel: string;
  company: string;
  date: number;
  responses: InterviewResponse[];
  completionRate: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [expandedFeedback, setExpandedFeedback] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Load session from database
    const loadSession = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setSession(data.session);
        } else {
          // Session not found, redirect to dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error loading session:', error);
        router.push('/dashboard');
      }
    };

    loadSession();
  }, [sessionId, router]);

  const toggleFeedback = (index: number) => {
    const newExpanded = new Set(expandedFeedback);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFeedback(newExpanded);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  const answeredResponses = session.responses.filter(r => r.audioURL);
  const feedbackCount = answeredResponses.filter(r => r.feedback).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <div className="flex gap-3">
              <button
                onClick={() => exportSessionToPDF(session)}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                title="Export to PDF"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </button>
              <button
                onClick={() => exportSessionToCSV(session)}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                title="Export to CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV
              </button>
              {session.completionRate < 100 && (
                <Link
                  href={`/practice?resume=${session.id}`}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg"
                >
                  Continue Interview
                </Link>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
              {session.roleTitle}
            </h1>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 rounded-full text-sm font-semibold shadow-sm">
                {session.company}
              </span>
              <span className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-full text-sm font-semibold shadow-sm">
                {session.roleLevel}
              </span>
              <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-full text-sm font-semibold shadow-sm">
                {session.roleCategory}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date(session.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{session.answeredQuestions}/{session.totalQuestions}</p>
              <p className="text-sm text-gray-600">Questions Answered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{session.completionRate}%</p>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{feedbackCount}/{answeredResponses.length}</p>
              <p className="text-sm text-gray-600">AI Feedback</p>
            </div>
          </div>
        </div>
      </div>

      {/* Questions & Responses */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {session.responses.map((response, index) => {
            const isAnswered = !!response.audioURL;
            const hasFeedback = !!response.feedback;
            const isExpanded = expandedFeedback.has(index);

            return (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all animate-fadeIn ${
                  isAnswered ? 'border-green-100' : 'border-gray-100'
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Question Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                    isAnswered
                      ? 'bg-gradient-to-br from-green-100 to-green-50 text-green-700'
                      : 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {response.question}
                    </h3>
                    {!isAnswered && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Not answered yet
                      </span>
                    )}
                  </div>
                </div>

                {/* Audio Response */}
                {isAnswered && (
                  <div className="ml-14 space-y-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-700 font-semibold">Your Response</span>
                        <span className="ml-auto text-sm text-green-600 font-medium">
                          {Math.floor(response.duration / 60)}:{(response.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      <audio
                        controls
                        src={response.audioURL || ''}
                        className="w-full"
                        preload="metadata"
                      />
                    </div>

                    {/* AI Feedback */}
                    {hasFeedback && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-bold text-blue-900">AI Feedback</h4>
                          </div>
                          <button
                            onClick={() => toggleFeedback(index)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        {isExpanded && (
                          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed animate-fadeIn">
                            {response.feedback}
                          </div>
                        )}
                        {!isExpanded && (
                          <p className="text-sm text-blue-700">
                            Click to view detailed feedback
                          </p>
                        )}
                      </div>
                    )}

                    {/* No Feedback Yet */}
                    {!hasFeedback && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-gray-600">No AI feedback available for this response</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
