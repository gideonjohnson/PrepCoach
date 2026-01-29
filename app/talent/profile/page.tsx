'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface TalentProfile {
  id: string;
  anonymousId: string;
  displayTitle: string | null;
  codingScore: number | null;
  systemDesignScore: number | null;
  behavioralScore: number | null;
  overallScore: number | null;
  verifiedSkills: string[];
  skillLevels: Record<string, string>;
  jobPreferences: {
    roles?: string[];
    locations?: string[];
    remote?: boolean;
    salaryMin?: number;
  };
  availability: string;
  workAuthorization: string[];
  requiresSponsorship: boolean;
  yearsExperience: number | null;
  seniorityLevel: string | null;
  totalSessions: number;
  totalPracticeHours: number;
  profileViews: number;
  interviewRequestCount: number;
  isPublic: boolean;
  isOptedIn: boolean;
  lastActiveAt: string;
}

function ScoreBar({ label, score }: { label: string; score: number | null }) {
  if (score === null) return null;
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-white">{score}/100</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function TalentProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    fetch('/api/talent/profile')
      .then((r) => r.json())
      .then((data) => {
        if (!data.isOptedIn) {
          router.push('/talent/opt-in');
          return;
        }
        setProfile(data.profile);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status, router]);

  const handleRefreshScores = async () => {
    try {
      const res = await fetch('/api/talent/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch {
      console.error('Failed to refresh scores');
    }
  };

  const handleToggleVisibility = async () => {
    if (!profile) return;
    try {
      const res = await fetch('/api/talent/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !profile.isPublic }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch {
      console.error('Failed to toggle visibility');
    }
  };

  const handleDeactivate = async () => {
    if (!confirm('Are you sure you want to deactivate your talent profile? Recruiters will no longer be able to find you.')) return;
    try {
      await fetch('/api/talent/profile', { method: 'DELETE' });
      router.push('/dashboard');
    } catch {
      console.error('Failed to deactivate');
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Talent Profile
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshScores}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Refresh Scores
            </button>
            <button
              onClick={handleToggleVisibility}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium ${
                profile.isPublic
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {profile.isPublic ? 'Visible' : 'Hidden'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Anonymous ID */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Anonymous ID</p>
                  <p className="text-lg font-mono text-gray-900 dark:text-white">{profile.anonymousId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Display Title</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {profile.displayTitle || 'Not set'}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{profile.seniorityLevel ? profile.seniorityLevel.charAt(0).toUpperCase() + profile.seniorityLevel.slice(1) : 'N/A'} Level</span>
                <span>{profile.yearsExperience ?? 0} years experience</span>
                <span>{profile.availability.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Scores */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Verified Scores
              </h3>
              {profile.overallScore !== null ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-blue-500">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {profile.overallScore}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Overall Score</p>
                  </div>
                  <ScoreBar label="Coding" score={profile.codingScore} />
                  <ScoreBar label="System Design" score={profile.systemDesignScore} />
                  <ScoreBar label="Behavioral" score={profile.behavioralScore} />
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                  Complete practice sessions to build your verified scores.
                </p>
              )}
            </div>

            {/* Verified Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Verified Skills
              </h3>
              {profile.verifiedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.verifiedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {skill}
                      {profile.skillLevels[skill] && (
                        <span className="ml-1 text-xs opacity-75">
                          ({profile.skillLevels[skill]})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Skills are verified through practice sessions. Complete more sessions to earn verified badges.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                Stats
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Sessions', value: profile.totalSessions },
                  { label: 'Practice Hours', value: profile.totalPracticeHours },
                  { label: 'Profile Views', value: profile.profileViews },
                  { label: 'Interview Requests', value: profile.interviewRequestCount },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                Preferences
              </h3>
              <div className="space-y-3 text-sm">
                {profile.jobPreferences.roles && profile.jobPreferences.roles.length > 0 && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Target Roles:</span>
                    <p className="text-gray-900 dark:text-white">{profile.jobPreferences.roles.join(', ')}</p>
                  </div>
                )}
                {profile.jobPreferences.locations && profile.jobPreferences.locations.length > 0 && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Locations:</span>
                    <p className="text-gray-900 dark:text-white">{profile.jobPreferences.locations.join(', ')}</p>
                  </div>
                )}
                {profile.jobPreferences.remote !== undefined && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Remote:</span>
                    <span className="ml-1 text-gray-900 dark:text-white">
                      {profile.jobPreferences.remote ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
                {profile.workAuthorization.length > 0 && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Work Auth:</span>
                    <p className="text-gray-900 dark:text-white">{profile.workAuthorization.join(', ')}</p>
                  </div>
                )}
                {profile.requiresSponsorship && (
                  <p className="text-yellow-600 dark:text-yellow-400">Requires visa sponsorship</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => router.push('/talent/opt-in')}
                className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Edit Preferences
              </button>
              <button
                onClick={handleDeactivate}
                className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                Deactivate Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
