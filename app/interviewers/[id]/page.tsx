'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/app/components/Header';

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  session: {
    sessionType: string;
  };
};

type Interviewer = {
  id: string;
  displayName: string;
  bio: string | null;
  currentCompany: string | null;
  currentRole: string | null;
  previousCompanies: string[];
  yearsExperience: number;
  expertise: string[];
  specializations: string[];
  languages: string[];
  timezone: string;
  ratePerHour: number;
  rating: number;
  totalSessions: number;
  availability: { day: string; startTime: string; endTime: string }[];
  reviews: Review[];
};

const EXPERTISE_MAP: Record<string, { label: string; icon: string }> = {
  coding: { label: 'Coding Interviews', icon: '💻' },
  system_design: { label: 'System Design', icon: '🏗️' },
  behavioral: { label: 'Behavioral', icon: '🗣️' },
  engineering_management: { label: 'Engineering Management', icon: '👔' },
  frontend: { label: 'Frontend', icon: '🎨' },
  backend: { label: 'Backend', icon: '⚙️' },
  mobile: { label: 'Mobile', icon: '📱' },
  data_engineering: { label: 'Data Engineering', icon: '📊' },
  ml_ai: { label: 'ML/AI', icon: '🤖' },
};

const SESSION_TYPE_LABELS: Record<string, string> = {
  coding: 'Coding Interview',
  system_design: 'System Design',
  behavioral: 'Behavioral',
  mock_full: 'Full Mock Interview',
};

const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function InterviewerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [interviewer, setInterviewer] = useState<Interviewer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInterviewer();
  }, [id]);

  const fetchInterviewer = async () => {
    try {
      const response = await fetch(`/api/interviewers/${id}`);
      if (!response.ok) {
        throw new Error('Interviewer not found');
      }
      const data = await response.json();
      setInterviewer(data.interviewer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load interviewer');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !interviewer) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        </div>
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">😕</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Interviewer Not Found</h1>
          <p className="text-gray-400 mb-8">{error || 'This interviewer profile is not available.'}</p>
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

  const sortedAvailability = [...(interviewer.availability || [])].sort(
    (a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/interviewers" className="text-gray-400 hover:text-orange-400 transition-colors">
            ← Back to Interviewers
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-4xl text-white font-bold flex-shrink-0">
                  {interviewer.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{interviewer.displayName}</h1>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                      ✓ Verified
                    </span>
                  </div>
                  {interviewer.currentRole && interviewer.currentCompany && (
                    <p className="text-gray-400 text-lg mb-2">
                      {interviewer.currentRole} at {interviewer.currentCompany}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="text-gray-400">
                      {interviewer.yearsExperience} years experience
                    </span>
                    {interviewer.rating > 0 && (
                      <span className="text-yellow-400">
                        ⭐ {interviewer.rating.toFixed(1)} ({interviewer.totalSessions} sessions)
                      </span>
                    )}
                    <span className="text-gray-400">
                      📍 {interviewer.timezone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            {interviewer.bio && (
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
                <h2 className="text-lg font-bold text-white mb-4">About</h2>
                <p className="text-gray-300 whitespace-pre-wrap">{interviewer.bio}</p>
              </div>
            )}

            {/* Expertise */}
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
              <h2 className="text-lg font-bold text-white mb-4">Interview Expertise</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {interviewer.expertise.map((exp) => (
                  <div
                    key={exp}
                    className="flex items-center gap-2 px-4 py-3 bg-orange-500/10 rounded-lg"
                  >
                    <span className="text-2xl">{EXPERTISE_MAP[exp]?.icon || '📋'}</span>
                    <span className="text-orange-400 font-medium">
                      {EXPERTISE_MAP[exp]?.label || exp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages & Skills */}
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
              <h2 className="text-lg font-bold text-white mb-4">Technical Skills</h2>

              {interviewer.languages.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {interviewer.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {interviewer.specializations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {interviewer.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Previous Companies */}
            {interviewer.previousCompanies.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
                <h2 className="text-lg font-bold text-white mb-4">Work Experience</h2>
                <div className="flex flex-wrap gap-3">
                  {interviewer.previousCompanies.map((company) => (
                    <div
                      key={company}
                      className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg text-gray-300 font-medium"
                    >
                      {company}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {interviewer.reviews.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
                <h2 className="text-lg font-bold text-white mb-4">Recent Reviews</h2>
                <div className="space-y-4">
                  {interviewer.reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400">
                            {'⭐'.repeat(Math.round(review.rating))}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {SESSION_TYPE_LABELS[review.session.sessionType] || review.session.sessionType}
                          </span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-300 text-sm">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Pricing Card */}
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-orange-500/30">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-white">
                    ${(interviewer.ratePerHour / 100).toFixed(0)}
                  </span>
                  <span className="text-gray-400">/hour</span>
                </div>

                <Link
                  href={session ? `/book/${interviewer.id}` : '/api/auth/signin'}
                  className="block w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold text-center hover:shadow-lg transition-all"
                >
                  {session ? 'Book a Session' : 'Sign In to Book'}
                </Link>

                <div className="mt-4 space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>1-hour live interview session</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Personalized feedback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Session recording included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Anonymous mode available</span>
                  </div>
                </div>
              </div>

              {/* Availability */}
              {sortedAvailability.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Availability</h3>
                  <div className="space-y-2 text-sm">
                    {sortedAvailability.map((slot) => (
                      <div key={slot.day} className="flex justify-between">
                        <span className="text-gray-400 capitalize">{slot.day}</span>
                        <span className="text-gray-300">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-4">
                    Times shown in {interviewer.timezone}
                  </p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-white">{interviewer.totalSessions}</p>
                    <p className="text-sm text-gray-400">Sessions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {interviewer.rating > 0 ? interviewer.rating.toFixed(1) : '-'}
                    </p>
                    <p className="text-sm text-gray-400">Rating</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{interviewer.yearsExperience}</p>
                    <p className="text-sm text-gray-400">Years Exp</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{interviewer.expertise.length}</p>
                    <p className="text-sm text-gray-400">Specialties</p>
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
