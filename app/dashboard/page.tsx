'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { exportAllSessionsToCSV } from '@/lib/exportUtils';

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

export default function DashboardPage() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    // Load interview sessions from database
    const loadSessions = async () => {
      try {
        const response = await fetch('/api/sessions');
        if (response.ok) {
          const data = await response.json();
          setSessions(data.sessions || []);
        } else {
          console.error('Failed to load sessions');
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  const filteredSessions = sessions.filter(session => {
    if (filter === 'completed') return session.completionRate === 100;
    if (filter === 'in-progress') return session.completionRate < 100;
    return true;
  });

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.completionRate === 100).length;
  const totalQuestionsAnswered = sessions.reduce((sum, s) => sum + s.answeredQuestions, 0);
  const avgCompletionRate = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.completionRate, 0) / sessions.length)
    : 0;

  // Get in-progress sessions for the "Continue Interview" section
  const inProgressSessions = sessions
    .filter(s => s.completionRate < 100)
    .sort((a, b) => b.date - a.date)
    .slice(0, 3);

  // Analytics data processing
  const analyticsData = useMemo(() => {
    // Progress over time (sorted by date)
    const progressData = sessions
      .sort((a, b) => a.date - b.date)
      .map((session, index) => ({
        session: `#${index + 1}`,
        date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completionRate: session.completionRate,
        questionsAnswered: session.answeredQuestions
      }));

    // Category-wise breakdown
    const categoryStats: Record<string, { count: number; avgCompletion: number; totalQuestions: number }> = {};
    sessions.forEach(session => {
      if (!categoryStats[session.roleCategory]) {
        categoryStats[session.roleCategory] = { count: 0, avgCompletion: 0, totalQuestions: 0 };
      }
      categoryStats[session.roleCategory].count += 1;
      categoryStats[session.roleCategory].avgCompletion += session.completionRate;
      categoryStats[session.roleCategory].totalQuestions += session.answeredQuestions;
    });

    const categoryData = Object.entries(categoryStats).map(([category, stats]) => ({
      category: category.length > 15 ? category.substring(0, 15) + '...' : category,
      fullCategory: category,
      sessions: stats.count,
      avgCompletion: Math.round(stats.avgCompletion / stats.count),
      totalQuestions: stats.totalQuestions
    })).sort((a, b) => b.sessions - a.sessions);

    // Level distribution
    const levelStats: Record<string, number> = {};
    sessions.forEach(session => {
      levelStats[session.roleLevel] = (levelStats[session.roleLevel] || 0) + 1;
    });

    const levelData = Object.entries(levelStats).map(([level, count]) => ({
      level,
      count,
      percentage: Math.round((count / sessions.length) * 100)
    }));

    return { progressData, categoryData, levelData };
  }, [sessions]);

  const COLORS = ['#f97316', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        {/* Page Title and Quick Actions */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
            Interview Dashboard
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-4">Track your interview preparation progress</p>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap gap-3">
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
            <Link
              href="/resume-builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-200 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume Builder
            </Link>
            <Link
              href="/linkedin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn Optimizer
            </Link>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Career Roadmap
            </Link>
            <Link
              href="/salary"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Salary Negotiation
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Pricing
            </Link>
            {sessions.length > 0 && (
              <button
                onClick={() => exportAllSessionsToCSV(sessions)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                title="Export all sessions to CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            )}
          </div>
        </div>
        {/* Continue Interview Section */}
        {sessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              {inProgressSessions.length > 0 ? 'Continue Your Interviews' : 'Ready to Start?'}
            </h2>

            {inProgressSessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {inProgressSessions.map((session, index) => (
                  <div
                    key={session.id}
                    className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg border-2 border-orange-200 hover:shadow-xl hover:border-orange-300 transition-all animate-fadeIn transform hover:scale-105"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-4xl">{getCategoryEmoji(session.roleCategory)}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{session.roleTitle}</h3>
                        <p className="text-sm text-gray-600 font-semibold">{session.company}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">
                          {session.answeredQuestions}/{session.totalQuestions} questions
                        </span>
                        <span className="text-xs font-bold text-orange-600">{session.completionRate}%</span>
                      </div>
                      <div className="w-full bg-white/50 rounded-full h-2 shadow-inner">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${session.completionRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <Link
                      href={`/practice?resume=${session.id}`}
                      className="block w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg text-center"
                    >
                      Continue Interview
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 shadow-lg border-2 border-purple-200 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">All interviews completed!</h3>
                <p className="text-gray-600 mb-6">Great job! Ready for your next challenge?</p>
                <Link
                  href="/practice"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:shadow-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Start New Interview
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Stats Overview - More Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all animate-fadeIn transform hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">{totalSessions}</p>
            </div>
            <h3 className="text-xs font-semibold text-white/90 uppercase tracking-wide">Total Interviews</h3>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all animate-fadeIn transform hover:scale-105" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">{completedSessions}</p>
            </div>
            <h3 className="text-xs font-semibold text-white/90 uppercase tracking-wide">Completed</h3>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all animate-fadeIn transform hover:scale-105" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">{totalQuestionsAnswered}</p>
            </div>
            <h3 className="text-xs font-semibold text-white/90 uppercase tracking-wide">Questions Answered</h3>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all animate-fadeIn transform hover:scale-105" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">{avgCompletionRate}%</p>
            </div>
            <h3 className="text-xs font-semibold text-white/90 uppercase tracking-wide">Avg Completion</h3>
          </div>
        </div>

        {/* Analytics Section */}
        {sessions.length > 0 && (
          <div className="mb-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Performance Analytics</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Progress Over Time */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📈</span>
                  Completion Rate Trend
                </h3>
                {analyticsData.progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={analyticsData.progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        stroke="#9ca3af"
                      />
                      <YAxis
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        stroke="#9ca3af"
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '2px solid #f97316',
                          borderRadius: '12px',
                          padding: '12px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="completionRate"
                        stroke="#f97316"
                        strokeWidth={3}
                        dot={{ fill: '#f97316', r: 5 }}
                        activeDot={{ r: 7 }}
                        name="Completion %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">No data available</p>
                )}
              </div>

              {/* Questions Answered Over Time */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 animate-fadeIn" style={{ animationDelay: '50ms' }}>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💬</span>
                  Questions Answered
                </h3>
                {analyticsData.progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData.progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        stroke="#9ca3af"
                      />
                      <YAxis
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        stroke="#9ca3af"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '2px solid #8b5cf6',
                          borderRadius: '12px',
                          padding: '12px'
                        }}
                      />
                      <Bar
                        dataKey="questionsAnswered"
                        fill="#8b5cf6"
                        radius={[8, 8, 0, 0]}
                        name="Questions"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">No data available</p>
                )}
              </div>

              {/* Category Performance */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Performance by Category
                </h3>
                {analyticsData.categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData.categoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        type="number"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        stroke="#9ca3af"
                        domain={[0, 100]}
                      />
                      <YAxis
                        dataKey="category"
                        type="category"
                        tick={{ fill: '#6b7280', fontSize: 11 }}
                        stroke="#9ca3af"
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '2px solid #06b6d4',
                          borderRadius: '12px',
                          padding: '12px'
                        }}
                        content={({ payload }) => {
                          if (payload && payload.length > 0) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white border-2 border-cyan-500 rounded-xl p-3 shadow-lg">
                                <p className="font-bold text-gray-900">{data.fullCategory}</p>
                                <p className="text-sm text-gray-600">Avg Completion: {data.avgCompletion}%</p>
                                <p className="text-sm text-gray-600">Sessions: {data.sessions}</p>
                                <p className="text-sm text-gray-600">Total Questions: {data.totalQuestions}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="avgCompletion"
                        fill="#06b6d4"
                        radius={[0, 8, 8, 0]}
                        name="Avg Completion %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">No data available</p>
                )}
              </div>

              {/* Level Distribution */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 animate-fadeIn" style={{ animationDelay: '150ms' }}>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎓</span>
                  Experience Level Distribution
                </h3>
                {analyticsData.levelData.length > 0 ? (
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={analyticsData.levelData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ level, percentage }) => `${level} (${percentage}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {analyticsData.levelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '2px solid #10b981',
                            borderRadius: '12px',
                            padding: '12px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No data available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 mb-6 p-1 animate-fadeIn">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All ({sessions.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Completed ({completedSessions})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'in-progress'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              In Progress ({totalSessions - completedSessions})
            </button>
          </div>
        </div>

        {/* Interview Sessions List */}
        {filteredSessions.length === 0 ? (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-12 sm:p-16 text-center shadow-lg border-2 border-purple-200 animate-fadeIn">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              {sessions.length === 0 ? 'Start Your Interview Journey' : 'No matching interviews'}
            </h3>
            <p className="text-gray-600 mb-4 text-lg max-w-md mx-auto">
              {sessions.length === 0
                ? 'Practice makes perfect! Begin your first AI-powered mock interview and get instant feedback.'
                : `Try adjusting your filters to see ${filter === 'completed' ? 'in-progress' : 'completed'} interviews.`
              }
            </p>
            {sessions.length === 0 && (
              <>
                <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Real-time feedback
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Track your progress
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Build confidence
                  </div>
                </div>
                <Link
                  href="/practice"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white rounded-full font-bold hover:shadow-2xl transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Start Your First Interview
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSessions.map((session, index) => (
              <div
                key={session.id}
                className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all animate-fadeIn"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Category Emoji & Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-3xl flex-shrink-0">{getCategoryEmoji(session.roleCategory)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{session.roleTitle}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                          session.completionRate === 100
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {session.completionRate === 100 ? '✓ Completed' : 'In Progress'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">{session.company}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs sm:text-sm text-gray-600">{session.roleLevel}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs sm:text-sm text-gray-600">{session.roleCategory}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span>{session.answeredQuestions}/{session.totalQuestions} questions</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:w-auto">
                    {/* Progress Circle */}
                    <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="#e5e7eb"
                            strokeWidth="4"
                            fill="none"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke={session.completionRate === 100 ? "#10b981" : "#f97316"}
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - session.completionRate / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-900">{session.completionRate}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/session/${session.id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all flex items-center gap-1 flex-1 sm:flex-none justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="hidden sm:inline">Details</span>
                      </Link>
                      {session.completionRate < 100 && (
                        <Link
                          href={`/practice?resume=${session.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-bold hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-1 flex-1 sm:flex-none justify-center shadow-md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Resume
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Quick Actions */}
      {sessions.length > 0 && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          <Link
            href="/practice"
            className="group w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center"
            title="Start New Interview"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
