'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/app/components/Header';

type ExpertSession = {
  id: string;
  sessionType: string;
  scheduledAt: string;
  duration: number;
  status: string;
  isAnonymous: boolean;
  totalAmount: number;
  interviewer: {
    id: string;
    displayName: string;
    currentCompany: string | null;
    expertise: string[];
    rating: number;
  };
};

const SESSION_TYPES: Record<string, { label: string; icon: string }> = {
  coding: { label: 'Coding', icon: '💻' },
  system_design: { label: 'System Design', icon: '🏗️' },
  behavioral: { label: 'Behavioral', icon: '🗣️' },
  mock_full: { label: 'Full Mock', icon: '🎯' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending_payment: { label: 'Pending Payment', color: 'yellow' },
  scheduled: { label: 'Scheduled', color: 'blue' },
  in_progress: { label: 'In Progress', color: 'green' },
  completed: { label: 'Completed', color: 'gray' },
  cancelled: { label: 'Cancelled', color: 'red' },
  no_show: { label: 'No Show', color: 'red' },
};

export default function SessionsPage() {
  const { data: session, status } = useSession();
  const [sessions, setSessions] = useState<ExpertSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSessions();
    }
  }, [status, filter]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sessions/book?status=${filter}`);
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
          <Link
            href="/api/auth/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
              My Sessions
            </h1>
            <p className="text-gray-400">View and manage your interview sessions</p>
          </div>
          <Link
            href="/interviewers"
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold"
          >
            Book New Session
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gray-900/50 rounded-xl p-1 mb-6 inline-flex gap-1">
          {(['upcoming', 'past', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg font-medium transition-all capitalize ${
                filter === f
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📅</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Sessions Found</h3>
            <p className="text-gray-400 mb-8">
              {filter === 'upcoming'
                ? "You don't have any upcoming sessions."
                : filter === 'past'
                ? "You haven't completed any sessions yet."
                : "You haven't booked any sessions yet."}
            </p>
            <Link
              href="/interviewers"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold"
            >
              Find an Interviewer
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((expertSession) => {
              const sessionType = SESSION_TYPES[expertSession.sessionType] || { label: expertSession.sessionType, icon: '📋' };
              const statusConfig = STATUS_CONFIG[expertSession.status] || { label: expertSession.status, color: 'gray' };
              const scheduledDate = new Date(expertSession.scheduledAt);
              const isToday = scheduledDate.toDateString() === new Date().toDateString();

              return (
                <Link
                  key={expertSession.id}
                  href={expertSession.status === 'pending_payment' ? `/checkout/session/${expertSession.id}` : `/sessions/${expertSession.id}`}
                  className="block bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-xl p-5 border-2 border-white/10 hover:border-orange-500/50 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-xl text-white font-bold flex-shrink-0">
                        {expertSession.interviewer.displayName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{sessionType.icon}</span>
                          <h3 className="text-white font-semibold">{sessionType.label}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            statusConfig.color === 'green' ? 'bg-green-500/20 text-green-400' :
                            statusConfig.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                            statusConfig.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                            statusConfig.color === 'red' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          with {expertSession.interviewer.displayName}
                          {expertSession.interviewer.currentCompany && ` • ${expertSession.interviewer.currentCompany}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className={`font-medium ${isToday ? 'text-orange-400' : 'text-white'}`}>
                          {isToday ? 'Today' : scheduledDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-gray-500">
                          {scheduledDate.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </p>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
