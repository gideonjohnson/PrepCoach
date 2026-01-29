'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';

type ExpertSession = {
  id: string;
  sessionType: string;
  scheduledAt: string;
  duration: number;
  status: string;
  isAnonymous: boolean;
  candidateAnonymousName: string | null;
  interviewerAnonymousName: string | null;
  totalAmount: number;
  notes: string | null;
  meetingUrl: string | null;
  recordingUrl: string | null;
  feedbackFromInterviewer: string | null;
  feedbackFromCandidate: string | null;
  interviewer: {
    id: string;
    displayName: string;
    currentCompany: string | null;
    expertise: string[];
    rating: number;
  };
  candidate: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

const SESSION_TYPES: Record<string, { label: string; icon: string }> = {
  coding: { label: 'Coding Interview', icon: '💻' },
  system_design: { label: 'System Design', icon: '🏗️' },
  behavioral: { label: 'Behavioral Interview', icon: '🗣️' },
  mock_full: { label: 'Full Mock Interview', icon: '🎯' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  pending_payment: { label: 'Pending Payment', color: 'yellow', icon: '⏳' },
  scheduled: { label: 'Scheduled', color: 'blue', icon: '📅' },
  in_progress: { label: 'In Progress', color: 'green', icon: '🔴' },
  completed: { label: 'Completed', color: 'gray', icon: '✅' },
  cancelled: { label: 'Cancelled', color: 'red', icon: '❌' },
  no_show: { label: 'No Show', color: 'red', icon: '🚫' },
};

function SessionDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get('payment') === 'success';

  const [expertSession, setExpertSession] = useState<ExpertSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSession();
    }
  }, [status, id]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/sessions/book`);
      if (!response.ok) throw new Error('Failed to load');
      const data = await response.json();

      const found = data.sessions?.find((s: ExpertSession) => s.id === id);
      if (!found) throw new Error('Session not found');

      setExpertSession(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
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

  if (!expertSession) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Session Not Found</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link
            href="/sessions"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold"
          >
            View All Sessions
          </Link>
        </div>
      </div>
    );
  }

  const sessionType = SESSION_TYPES[expertSession.sessionType] || { label: expertSession.sessionType, icon: '📋' };
  const statusConfig = STATUS_CONFIG[expertSession.status] || { label: expertSession.status, color: 'gray', icon: '❓' };
  const scheduledDate = new Date(expertSession.scheduledAt);
  const isUpcoming = scheduledDate > new Date() && expertSession.status === 'scheduled';
  const canJoin = expertSession.status === 'scheduled' && Math.abs(scheduledDate.getTime() - Date.now()) < 15 * 60 * 1000; // 15 min before

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/sessions" className="text-gray-400 hover:text-orange-400 mb-6 inline-block">
          ← Back to Sessions
        </Link>

        {/* Success Banner */}
        {paymentSuccess && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-green-400 font-semibold">Payment Successful!</p>
                <p className="text-green-300 text-sm">Your session is confirmed. You&apos;ll receive a calendar invite shortly.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                    {expertSession.interviewer.displayName.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">{sessionType.icon} {sessionType.label}</h1>
                    <p className="text-gray-400">with {expertSession.interviewer.displayName}</p>
                    {expertSession.interviewer.currentCompany && (
                      <p className="text-gray-500 text-sm">{expertSession.interviewer.currentCompany}</p>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  statusConfig.color === 'green' ? 'bg-green-500/20 text-green-400' :
                  statusConfig.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  statusConfig.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                  statusConfig.color === 'red' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {statusConfig.icon} {statusConfig.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="text-white font-medium">
                    {scheduledDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Time</p>
                  <p className="text-white font-medium">
                    {scheduledDate.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="text-white font-medium">{expertSession.duration} minutes</p>
                </div>
                <div>
                  <p className="text-gray-500">Mode</p>
                  <p className="text-white font-medium">{expertSession.isAnonymous ? 'Anonymous' : 'Public'}</p>
                </div>
              </div>

              {expertSession.isAnonymous && expertSession.candidateAnonymousName && (
                <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
                  <p className="text-purple-400 text-sm">
                    Your anonymous identity: <strong>{expertSession.candidateAnonymousName}</strong>
                  </p>
                </div>
              )}

              {expertSession.notes && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-500 mb-1">Session Notes</p>
                  <p className="text-gray-300">{expertSession.notes}</p>
                </div>
              )}
            </div>

            {/* Join Session Button */}
            {canJoin && expertSession.meetingUrl && (
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border-2 border-green-500/30">
                <h3 className="text-lg font-bold text-white mb-2">Ready to Join?</h3>
                <p className="text-gray-400 text-sm mb-4">Your session is about to start. Click below to join.</p>
                <a
                  href={expertSession.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold"
                >
                  Join Session
                </a>
              </div>
            )}

            {/* Feedback Section */}
            {expertSession.status === 'completed' && expertSession.feedbackFromInterviewer && (
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Interviewer Feedback</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{expertSession.feedbackFromInterviewer}</p>
              </div>
            )}

            {/* Recording Section */}
            {expertSession.status === 'completed' && expertSession.recordingUrl && (
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Session Recording</h3>
                <a
                  href={expertSession.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30"
                >
                  Watch Recording
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
                <div className="space-y-3">
                  {isUpcoming && (
                    <>
                      <button className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-sm">
                        Reschedule
                      </button>
                      <button className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-sm">
                        Cancel Session
                      </button>
                    </>
                  )}
                  {expertSession.status === 'completed' && !expertSession.feedbackFromCandidate && (
                    <Link
                      href={`/sessions/${id}/feedback`}
                      className="block w-full px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 text-sm text-center"
                    >
                      Leave Feedback
                    </Link>
                  )}
                  <Link
                    href={`/interviewers/${expertSession.interviewer.id}`}
                    className="block w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-sm text-center"
                  >
                    View Interviewer Profile
                  </Link>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Payment</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount Paid</span>
                    <span className="text-white">${(expertSession.totalAmount / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-400">Paid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>}>
      <SessionDetailContent params={params} />
    </Suspense>
  );
}
