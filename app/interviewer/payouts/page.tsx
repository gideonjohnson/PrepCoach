'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';

type Payout = {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  sessionsIncluded: number;
  createdAt: string;
  completedAt: string | null;
};

type PendingSession = {
  id: string;
  sessionType: string;
  scheduledAt: string;
  completedAt: string;
  interviewerPayout: number;
};

type ConnectStatus = {
  connected: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
};

type PayoutStats = {
  totalEarnings: number;
  pendingAmount: number;
  thisMonthEarnings: number;
  completedSessions: number;
};

function PayoutsPageContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const refresh = searchParams.get('refresh') === 'true';

  const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [pendingSessions, setPendingSessions] = useState<PendingSession[]>([]);
  const [stats, setStats] = useState<PayoutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  useEffect(() => {
    if (success) {
      setSuccessMsg('Stripe Connect setup completed successfully!');
    }
    if (refresh) {
      fetchData();
    }
  }, [success, refresh]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Connect status
      const connectRes = await fetch('/api/interviewer/connect');
      const connectData = await connectRes.json();
      setConnectStatus(connectData);

      // Fetch payouts and stats
      const payoutsRes = await fetch('/api/interviewer/payouts');
      const payoutsData = await payoutsRes.json();
      setPayouts(payoutsData.payouts || []);
      setPendingSessions(payoutsData.pendingSessions || []);
      setStats(payoutsData.stats || null);
    } catch (err) {
      setError('Failed to load payout data');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    setConnecting(true);
    setError('');
    try {
      const response = await fetch('/api/interviewer/connect', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect');
      }

      // Redirect to Stripe Connect onboarding
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Stripe');
      setConnecting(false);
    }
  };

  const handleRequestPayout = async () => {
    setRequestingPayout(true);
    setError('');
    setSuccessMsg('');
    try {
      const response = await fetch('/api/interviewer/payouts', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request payout');
      }

      setSuccessMsg(data.message);
      fetchData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request payout');
    } finally {
      setRequestingPayout(false);
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

  const pendingAmount = stats?.pendingAmount || 0;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Payouts
            </h1>
            <p className="text-gray-400">Manage your earnings and payouts</p>
          </div>
          <Link
            href="/interviewer/profile"
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
          >
            ← Back to Profile
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
            {successMsg}
          </div>
        )}

        {/* Connect Status */}
        {!connectStatus?.connected || !connectStatus?.payoutsEnabled ? (
          <div className="mb-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border-2 border-purple-500/30">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl">💳</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">Set Up Stripe Connect</h2>
                <p className="text-gray-400 mb-4">
                  Connect your Stripe account to receive payouts for your interview sessions.
                  This is required before you can withdraw your earnings.
                </p>
                <button
                  onClick={handleConnectStripe}
                  disabled={connecting}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {connecting ? 'Connecting...' : connectStatus?.connected ? 'Complete Setup' : 'Connect Stripe'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <span className="text-green-400">Stripe Connect is set up and ready for payouts</span>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5">
              <p className="text-green-100 text-sm mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-white">
                ${(stats.totalEarnings / 100).toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-5">
              <p className="text-yellow-100 text-sm mb-1">Pending Payout</p>
              <p className="text-3xl font-bold text-white">
                ${(stats.pendingAmount / 100).toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-5">
              <p className="text-blue-100 text-sm mb-1">This Month</p>
              <p className="text-3xl font-bold text-white">
                ${(stats.thisMonthEarnings / 100).toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-1">Total Sessions</p>
              <p className="text-3xl font-bold text-white">{stats.completedSessions}</p>
            </div>
          </div>
        )}

        {/* Request Payout Section */}
        {connectStatus?.payoutsEnabled && pendingAmount > 0 && (
          <div className="mb-8 bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 border-2 border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Ready to Withdraw</h3>
                <p className="text-gray-400">
                  You have ${(pendingAmount / 100).toFixed(2)} from {pendingSessions.length} completed sessions
                </p>
              </div>
              <button
                onClick={handleRequestPayout}
                disabled={requestingPayout || pendingAmount < 1000}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {requestingPayout ? 'Processing...' : 'Request Payout'}
              </button>
            </div>
            {pendingAmount < 1000 && (
              <p className="text-yellow-400 text-sm mt-2">
                Minimum payout is $10. You need ${((1000 - pendingAmount) / 100).toFixed(2)} more.
              </p>
            )}
          </div>
        )}

        {/* Pending Sessions */}
        {pendingSessions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Sessions Awaiting Payout</h3>
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl border-2 border-white/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-gray-400 text-sm p-4">Session</th>
                    <th className="text-left text-gray-400 text-sm p-4">Completed</th>
                    <th className="text-right text-gray-400 text-sm p-4">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSessions.map((session) => (
                    <tr key={session.id} className="border-b border-white/5">
                      <td className="p-4 text-white capitalize">{session.sessionType.replace('_', ' ')}</td>
                      <td className="p-4 text-gray-400">
                        {new Date(session.completedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-green-400 text-right">
                        ${(session.interviewerPayout / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payout History */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Payout History</h3>
          {payouts.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl p-12 border-2 border-white/10 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <p className="text-gray-400">No payouts yet. Complete sessions to start earning!</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl border-2 border-white/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-gray-400 text-sm p-4">Date</th>
                    <th className="text-left text-gray-400 text-sm p-4">Sessions</th>
                    <th className="text-left text-gray-400 text-sm p-4">Status</th>
                    <th className="text-right text-gray-400 text-sm p-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="border-b border-white/5">
                      <td className="p-4 text-white">
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-400">{payout.sessionsIncluded} sessions</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          payout.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          payout.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="p-4 text-white text-right font-semibold">
                        ${(payout.amount / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PayoutsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>}>
      <PayoutsPageContent />
    </Suspense>
  );
}
