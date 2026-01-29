'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';

type InterviewerProfile = {
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
  linkedinUrl: string | null;
  timezone: string;
  ratePerHour: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  rating: number;
  totalSessions: number;
  availability: { day: string; startTime: string; endTime: string }[];
};

const EXPERTISE_LABELS: Record<string, { label: string; icon: string }> = {
  coding: { label: 'Coding', icon: '💻' },
  system_design: { label: 'System Design', icon: '🏗️' },
  behavioral: { label: 'Behavioral', icon: '🗣️' },
  engineering_management: { label: 'Eng. Management', icon: '👔' },
  frontend: { label: 'Frontend', icon: '🎨' },
  backend: { label: 'Backend', icon: '⚙️' },
  mobile: { label: 'Mobile', icon: '📱' },
  data_engineering: { label: 'Data Engineering', icon: '📊' },
  ml_ai: { label: 'ML/AI', icon: '🤖' },
};

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function InterviewerProfileContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === 'true';

  const [profile, setProfile] = useState<InterviewerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  const [editData, setEditData] = useState<Partial<InterviewerProfile>>({});

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/interviewer/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.interviewer);
        setEditData(data.interviewer);
      } else if (response.status === 404) {
        setProfile(null);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/interviewer/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfile(data.interviewer);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async () => {
    if (!profile) return;

    try {
      const response = await fetch('/api/interviewer/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !profile.isActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      setProfile(data.interviewer);
      setSuccess(data.interviewer.isActive ? 'You are now accepting sessions!' : 'Profile deactivated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
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
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        </div>
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-400 mb-8">Please sign in to view your interviewer profile.</p>
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">👔</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Become an Expert Interviewer</h1>
          <p className="text-gray-400 mb-8">
            Share your expertise and help candidates prepare for their dream jobs.
            Earn money conducting mock interviews.
          </p>
          <Link
            href="/interviewer/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
          >
            Register Now
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
        {/* Success Banner for New Registrations */}
        {justRegistered && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-green-400 font-semibold">Registration Submitted!</p>
                <p className="text-green-300 text-sm">Your profile is pending verification. We&apos;ll notify you once approved.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
            {success}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Interviewer Profile
            </h1>
            <p className="text-gray-400">Manage your interviewer profile and settings</p>
          </div>
          <div className="flex gap-3">
            {profile.verificationStatus === 'verified' && (
              <button
                onClick={toggleActive}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  profile.isActive
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {profile.isActive ? '✓ Active' : 'Inactive'}
              </button>
            )}
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Status Card */}
        <div className={`mb-6 p-4 rounded-lg border ${
          profile.verificationStatus === 'verified'
            ? 'bg-green-500/10 border-green-500/30'
            : profile.verificationStatus === 'pending'
            ? 'bg-yellow-500/10 border-yellow-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {profile.verificationStatus === 'verified' ? '✅' : profile.verificationStatus === 'pending' ? '⏳' : '❌'}
            </span>
            <div>
              <p className={`font-semibold ${
                profile.verificationStatus === 'verified'
                  ? 'text-green-400'
                  : profile.verificationStatus === 'pending'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}>
                {profile.verificationStatus === 'verified'
                  ? 'Verified Interviewer'
                  : profile.verificationStatus === 'pending'
                  ? 'Pending Verification'
                  : 'Verification Rejected'}
              </p>
              <p className="text-gray-400 text-sm">
                {profile.verificationStatus === 'verified'
                  ? 'You can now accept interview sessions'
                  : profile.verificationStatus === 'pending'
                  ? 'Your profile is being reviewed by our team'
                  : 'Please contact support for more information'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
          {editMode ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={editData.displayName || ''}
                    onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={(editData.ratePerHour || 0) / 100}
                    onChange={(e) => setEditData({ ...editData, ratePerHour: Math.round(parseFloat(e.target.value) * 100) })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Bio</label>
                <textarea
                  value={editData.bio || ''}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Current Company</label>
                  <input
                    type="text"
                    value={editData.currentCompany || ''}
                    onChange={(e) => setEditData({ ...editData, currentCompany: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Current Role</label>
                  <input
                    type="text"
                    value={editData.currentRole || ''}
                    onChange={(e) => setEditData({ ...editData, currentRole: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditData(profile);
                  }}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-3xl text-white font-bold">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{profile.displayName}</h2>
                  {profile.currentRole && profile.currentCompany && (
                    <p className="text-gray-400">{profile.currentRole} at {profile.currentCompany}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-gray-400">{profile.yearsExperience} years exp.</span>
                    <span className="text-orange-400 font-semibold">${(profile.ratePerHour / 100).toFixed(0)}/hr</span>
                    {profile.rating > 0 && (
                      <span className="text-yellow-400">⭐ {profile.rating.toFixed(1)}</span>
                    )}
                  </div>
                </div>
              </div>

              {profile.bio && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">About</h3>
                  <p className="text-gray-300">{profile.bio}</p>
                </div>
              )}

              {/* Expertise */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.expertise.map((exp) => (
                    <span
                      key={exp}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-sm"
                    >
                      {EXPERTISE_LABELS[exp]?.icon} {EXPERTISE_LABELS[exp]?.label || exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              {profile.languages.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang) => (
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

              {/* Previous Companies */}
              {profile.previousCompanies.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Previous Companies</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.previousCompanies.map((company) => (
                      <span
                        key={company}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{profile.totalSessions}</p>
                  <p className="text-sm text-gray-400">Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{profile.rating > 0 ? profile.rating.toFixed(1) : '-'}</p>
                  <p className="text-sm text-gray-400">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">${(profile.ratePerHour / 100).toFixed(0)}</p>
                  <p className="text-sm text-gray-400">Per Hour</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Availability Section */}
        <div className="mt-6 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Weekly Availability</h3>
          <p className="text-gray-400 text-sm mb-4">Set your available hours for each day of the week.</p>

          <div className="space-y-3">
            {DAYS.map((day) => {
              const availability = profile.availability?.find((a) => a.day === day);
              return (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-24 text-gray-300 capitalize">{day}</span>
                  {availability ? (
                    <span className="text-green-400">
                      {availability.startTime} - {availability.endTime}
                    </span>
                  ) : (
                    <span className="text-gray-500">Not available</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InterviewerProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>}>
      <InterviewerProfileContent />
    </Suspense>
  );
}
