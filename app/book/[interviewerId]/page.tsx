'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import BookingCalendar from '@/app/components/BookingCalendar';

type Interviewer = {
  id: string;
  displayName: string;
  currentCompany: string | null;
  currentRole: string | null;
  yearsExperience: number;
  expertise: string[];
  ratePerHour: number;
  rating: number;
  totalSessions: number;
  timezone: string;
  availability: { day: string; startTime: string; endTime: string }[];
};

const SESSION_TYPES = [
  { value: 'coding', label: 'Coding Interview', icon: '💻', description: 'Practice LeetCode-style problems with live feedback' },
  { value: 'system_design', label: 'System Design', icon: '🏗️', description: 'Design scalable systems with expert guidance' },
  { value: 'behavioral', label: 'Behavioral', icon: '🗣️', description: 'Master the STAR method and soft skills' },
  { value: 'mock_full', label: 'Full Mock Interview', icon: '🎯', description: 'Complete interview simulation with multiple rounds' },
];

const DURATION_OPTIONS = [
  { value: 30, label: '30 min', multiplier: 0.5 },
  { value: 60, label: '60 min', multiplier: 1 },
  { value: 90, label: '90 min', multiplier: 1.5 },
];

export default function BookingPage({ params }: { params: Promise<{ interviewerId: string }> }) {
  const { interviewerId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [interviewer, setInterviewer] = useState<Interviewer | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState('');
  const [duration, setDuration] = useState(60);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchInterviewer();
  }, [interviewerId]);

  const fetchInterviewer = async () => {
    try {
      const response = await fetch(`/api/interviewers/${interviewerId}`);
      if (!response.ok) throw new Error('Interviewer not found');
      const data = await response.json();
      setInterviewer(data.interviewer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = interviewer
    ? Math.round(interviewer.ratePerHour * (duration / 60))
    : 0;

  const handleBook = async () => {
    if (!selectedSlot || !sessionType) {
      setError('Please select a time slot and session type');
      return;
    }

    setBooking(true);
    setError('');

    try {
      const response = await fetch('/api/sessions/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerId,
          sessionType,
          scheduledAt: selectedSlot.toISOString(),
          duration,
          isAnonymous,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      // Redirect to payment page
      router.push(`/checkout/session/${data.session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setBooking(false);
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
          <p className="text-gray-400 mb-8">Please sign in to book a session.</p>
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

  if (!interviewer) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Interviewer Not Found</h1>
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

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href={`/interviewers/${interviewerId}`} className="text-gray-400 hover:text-orange-400 mb-6 inline-block">
          ← Back to Profile
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
              <h1 className="text-2xl font-bold text-white mb-2">Book a Session</h1>
              <p className="text-gray-400">with {interviewer.displayName}</p>

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-4 my-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        s < step ? 'bg-green-500 text-white' :
                        s === step ? 'bg-orange-500 text-white' :
                        'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {s < step ? '✓' : s}
                    </div>
                    {s < 3 && <div className={`w-12 h-1 mx-2 rounded ${s < step ? 'bg-green-500' : 'bg-gray-800'}`} />}
                  </div>
                ))}
              </div>

              {/* Step 1: Session Type */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">Select Session Type</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SESSION_TYPES.filter(t => interviewer.expertise.includes(t.value) || t.value === 'mock_full').map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSessionType(type.value)}
                        className={`p-4 rounded-xl text-left transition-all ${
                          sessionType === type.value
                            ? 'bg-orange-500/20 border-2 border-orange-500'
                            : 'bg-gray-800/50 border-2 border-transparent hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-2xl">{type.icon}</span>
                        <h3 className="text-white font-semibold mt-2">{type.label}</h3>
                        <p className="text-gray-400 text-sm">{type.description}</p>
                      </button>
                    ))}
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Duration</h3>
                    <div className="flex gap-3">
                      {DURATION_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setDuration(opt.value)}
                          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                            duration === opt.value
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!sessionType}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Date & Time with Calendar */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">Select Date & Time</h2>

                  <BookingCalendar
                    availability={interviewer.availability}
                    timezone={interviewer.timezone}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    weeksToShow={4}
                  />

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!selectedSlot}
                      className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold disabled:opacity-50"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">Confirm Booking</h2>

                  <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Session Type</span>
                      <span className="text-white">{SESSION_TYPES.find(t => t.value === sessionType)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white">{duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date & Time</span>
                      <span className="text-white">
                        {selectedSlot?.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        at{' '}
                        {selectedSlot?.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500"
                      />
                      <div>
                        <span className="text-white font-medium">Anonymous Mode</span>
                        <p className="text-gray-400 text-sm">Hide your real identity during the session</p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Notes for the interviewer (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="E.g., Preparing for Google L5, focus on dynamic programming..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleBook}
                      disabled={booking}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold disabled:opacity-50"
                    >
                      {booking ? 'Booking...' : `Book & Pay $${(totalPrice / 100).toFixed(0)}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>

              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-lg text-white font-bold">
                  {interviewer.displayName.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold">{interviewer.displayName}</p>
                  <p className="text-gray-400 text-sm">{interviewer.currentCompany}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Session ({duration} min)</span>
                  <span className="text-white">${(totalPrice / 100).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform fee</span>
                  <span className="text-white">Included</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-300">Total</span>
                    <span className="text-orange-400">${(totalPrice / 100).toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Money-back guarantee if cancelled 24h before</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Session recording included</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Written feedback after session</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
