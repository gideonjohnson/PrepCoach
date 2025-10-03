'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
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


  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="animate-fadeIn">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                Interview Dashboard
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">Track your interview preparation progress</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {session && (
                <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900 transition flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {session.user?.email}
                </Link>
              )}
              {sessions.length > 0 && (
                <button
                  onClick={() => exportAllSessionsToCSV(sessions)}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm sm:text-base font-semibold hover:shadow-xl transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                  title="Export all sessions to CSV"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">Export</span>
                </button>
              )}
              <Link
                href="/practice"
                className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white rounded-full text-sm sm:text-base font-bold hover:shadow-2xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">New Interview</span>
                <span className="sm:hidden">New</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-800 rounded-full text-sm sm:text-base font-semibold hover:bg-gray-300 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-blue-100 hover:shadow-xl transition-shadow animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 sm:mb-0">Total Interviews</h3>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">{totalSessions}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-green-100 hover:shadow-xl transition-shadow animate-fadeIn" style={{ animationDelay: '50ms' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 sm:mb-0">Completed</h3>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">{completedSessions}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-purple-100 hover:shadow-xl transition-shadow animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 sm:mb-0">Questions</h3>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">{totalQuestionsAnswered}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-orange-100 hover:shadow-xl transition-shadow animate-fadeIn" style={{ animationDelay: '150ms' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 sm:mb-0">Avg Rate</h3>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">{avgCompletionRate}%</p>
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
          <div className="bg-white rounded-2xl p-16 text-center shadow-lg border-2 border-gray-100 animate-fadeIn">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No interviews yet</h3>
            <p className="text-gray-600 mb-8 text-lg">Start practicing to see your progress here</p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white rounded-full font-bold hover:shadow-2xl transition-all transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start Your First Interview
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session, index) => (
              <div
                key={session.id}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{session.roleTitle}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        session.completionRate === 100
                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700'
                          : 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700'
                      }`}>
                        {session.completionRate === 100 ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
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

                {/* Progress Bar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {session.answeredQuestions} of {session.totalQuestions} questions answered
                    </span>
                    <span className="text-sm font-bold text-orange-600">{session.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${session.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href={`/dashboard/session/${session.id}`}
                    className="flex-1 px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-lg font-semibold hover:from-gray-200 hover:to-gray-100 transition-all shadow-sm hover:shadow-md text-center"
                  >
                    View Details
                  </Link>
                  {session.completionRate < 100 && (
                    <Link
                      href={`/practice?resume=${session.id}`}
                      className="flex-1 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg text-center"
                    >
                      Continue Interview
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
