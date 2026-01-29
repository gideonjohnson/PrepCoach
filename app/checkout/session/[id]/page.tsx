'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  platformFee: number;
  notes: string | null;
  interviewer: {
    id: string;
    displayName: string;
    currentCompany: string | null;
    expertise: string[];
    rating: number;
  };
};

const SESSION_TYPES: Record<string, { label: string; icon: string }> = {
  coding: { label: 'Coding Interview', icon: '💻' },
  system_design: { label: 'System Design', icon: '🏗️' },
  behavioral: { label: 'Behavioral Interview', icon: '🗣️' },
  mock_full: { label: 'Full Mock Interview', icon: '🎯' },
};

function CheckoutSessionContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  const [expertSession, setExpertSession] = useState<ExpertSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSession();
    }
  }, [status, id]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/sessions/book?sessionId=${id}`);
      if (!response.ok) throw new Error('Session not found');
      const data = await response.json();

      // Find the specific session from the list
      const found = data.sessions?.find((s: ExpertSession) => s.id === id);
      if (!found) throw new Error('Session not found');

      setExpertSession(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/payments/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setProcessing(false);
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

  if (paymentStatus === 'cancelled') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        </div>
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Payment Cancelled</h1>
          <p className="text-gray-400 mb-8">Your payment was cancelled. You can try again below.</p>
          <button
            onClick={handleCheckout}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold"
          >
            Try Again
          </button>
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
          <Link
            href="/interviewers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold"
          >
            Browse Interviewers
          </Link>
        </div>
      </div>
    );
  }

  if (expertSession.status !== 'pending_payment') {
    router.push(`/sessions/${expertSession.id}`);
    return null;
  }

  const sessionType = SESSION_TYPES[expertSession.sessionType] || { label: expertSession.sessionType, icon: '📋' };
  const scheduledDate = new Date(expertSession.scheduledAt);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-8 shadow-lg border-2 border-white/10">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Complete Your Booking</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Session Details */}
          <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                {expertSession.interviewer.displayName.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">{expertSession.interviewer.displayName}</h2>
                {expertSession.interviewer.currentCompany && (
                  <p className="text-gray-400">{expertSession.interviewer.currentCompany}</p>
                )}
                {expertSession.interviewer.rating > 0 && (
                  <span className="text-yellow-400 text-sm">⭐ {expertSession.interviewer.rating.toFixed(1)}</span>
                )}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Session Type</span>
                <span className="text-white flex items-center gap-2">
                  <span>{sessionType.icon}</span>
                  {sessionType.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date</span>
                <span className="text-white">
                  {scheduledDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time</span>
                <span className="text-white">
                  {scheduledDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration</span>
                <span className="text-white">{expertSession.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mode</span>
                <span className="text-white">{expertSession.isAnonymous ? 'Anonymous' : 'Public'}</span>
              </div>
            </div>

            {expertSession.notes && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400">Notes:</p>
                <p className="text-sm text-gray-300">{expertSession.notes}</p>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Session Fee</span>
                <span className="text-white">${(expertSession.totalAmount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">(Includes platform service fee)</span>
              </div>
              <div className="border-t border-white/10 pt-3 mt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-white">Total</span>
                  <span className="text-orange-400">${(expertSession.totalAmount / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">What&apos;s Included</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Live 1-on-1 video session</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Real-time feedback & guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Session recording for review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Written feedback summary</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Full refund if cancelled 24h before</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={processing}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              <>
                Proceed to Payment - ${(expertSession.totalAmount / 100).toFixed(2)}
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSessionPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>}>
      <CheckoutSessionContent params={params} />
    </Suspense>
  );
}
