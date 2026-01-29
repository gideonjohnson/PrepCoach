'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface TalentCard {
  id: string;
  anonymousId: string;
  displayTitle: string | null;
  codingScore: number | null;
  systemDesignScore: number | null;
  behavioralScore: number | null;
  overallScore: number | null;
  verifiedSkills: string[];
  seniorityLevel: string | null;
  yearsExperience: number | null;
  availability: string;
  totalSessions: number;
  totalPracticeHours: number;
  requiresSponsorship: boolean;
  lastActiveAt: string;
}

const SENIORITY_OPTIONS = ['', 'junior', 'mid', 'senior', 'staff', 'principal'];
const AVAILABILITY_OPTIONS = ['', 'immediately', '2_weeks', '1_month', 'exploring'];

export default function TalentBrowsePage() {
  const { status } = useSession();
  const router = useRouter();
  const [profiles, setProfiles] = useState<TalentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [requestModal, setRequestModal] = useState<string | null>(null);
  const [requestForm, setRequestForm] = useState({
    roleTitle: '',
    roleDescription: '',
    salaryRange: '',
    location: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  // Filters
  const [minScore, setMinScore] = useState(0);
  const [seniority, setSeniority] = useState('');
  const [availability, setAvailability] = useState('');
  const [skill, setSkill] = useState('');

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (minScore > 0) params.set('minScore', String(minScore));
      if (seniority) params.set('seniority', seniority);
      if (availability) params.set('availability', availability);
      if (skill) params.set('skill', skill);

      const res = await fetch(`/api/talent/search?${params}`);
      if (res.status === 403) {
        router.push('/recruiter/register');
        return;
      }
      const data = await res.json();
      setProfiles(data.profiles || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      console.error('Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  }, [page, minScore, seniority, availability, skill, router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    fetchProfiles();
  }, [status, fetchProfiles, router]);

  const sendRequest = async (talentId: string) => {
    setSending(true);
    try {
      const res = await fetch(`/api/talent/${talentId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestForm),
      });

      if (res.ok) {
        setRequestModal(null);
        setRequestForm({ roleTitle: '', roleDescription: '', salaryRange: '', location: '', message: '' });
        alert('Interview request sent successfully!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send request');
      }
    } catch {
      alert('Failed to send request');
    } finally {
      setSending(false);
    }
  };

  const ScoreBadge = ({ score }: { score: number | null }) => {
    if (score === null) return <span className="text-gray-400">-</span>;
    const color = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
    return <span className={`font-bold ${color}`}>{score}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Talent</h1>
          <button
            onClick={() => router.push('/recruiter/dashboard')}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min Score</label>
              <input
                type="number"
                min="0"
                max="100"
                value={minScore || ''}
                onChange={(e) => { setMinScore(parseInt(e.target.value) || 0); setPage(1); }}
                placeholder="0"
                className="w-20 px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Seniority</label>
              <select
                value={seniority}
                onChange={(e) => { setSeniority(e.target.value); setPage(1); }}
                className="px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
              >
                {SENIORITY_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o || 'All Levels'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Availability</label>
              <select
                value={availability}
                onChange={(e) => { setAvailability(e.target.value); setPage(1); }}
                className="px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
              >
                {AVAILABILITY_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o ? o.replace('_', ' ') : 'Any'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Skill</label>
              <input
                type="text"
                value={skill}
                onChange={(e) => { setSkill(e.target.value); setPage(1); }}
                placeholder="e.g., python"
                className="w-28 px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No matching talent profiles found. Try adjusting your filters.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((p) => (
                <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {p.displayTitle || 'Software Engineer'}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {p.anonymousId}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        <ScoreBadge score={p.overallScore} />
                      </div>
                      <p className="text-xs text-gray-500">Overall</p>
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400 mb-3">
                    <span>{p.seniorityLevel || 'N/A'}</span>
                    <span>{p.yearsExperience ?? 0} yrs exp</span>
                    <span>{p.availability.replace('_', ' ')}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <div className="text-center p-1.5 bg-gray-50 dark:bg-gray-700/50 rounded">
                      <p className="text-gray-500">Coding</p>
                      <p className="font-bold text-gray-900 dark:text-white"><ScoreBadge score={p.codingScore} /></p>
                    </div>
                    <div className="text-center p-1.5 bg-gray-50 dark:bg-gray-700/50 rounded">
                      <p className="text-gray-500">Design</p>
                      <p className="font-bold text-gray-900 dark:text-white"><ScoreBadge score={p.systemDesignScore} /></p>
                    </div>
                    <div className="text-center p-1.5 bg-gray-50 dark:bg-gray-700/50 rounded">
                      <p className="text-gray-500">Behavioral</p>
                      <p className="font-bold text-gray-900 dark:text-white"><ScoreBadge score={p.behavioralScore} /></p>
                    </div>
                  </div>

                  {p.verifiedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.verifiedSkills.slice(0, 5).map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>{p.totalSessions} sessions / {p.totalPracticeHours}h practice</span>
                    {p.requiresSponsorship && <span className="text-yellow-600">Visa needed</span>}
                  </div>

                  <button
                    onClick={() => setRequestModal(p.id)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Request Interview
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Request Modal */}
        {requestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Send Interview Request
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This will use 1 credit from your balance.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={requestForm.roleTitle}
                  onChange={(e) => setRequestForm({ ...requestForm, roleTitle: e.target.value })}
                  placeholder="e.g., Senior Backend Engineer"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={requestForm.salaryRange}
                  onChange={(e) => setRequestForm({ ...requestForm, salaryRange: e.target.value })}
                  placeholder="e.g., $150k-$200k"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={requestForm.location}
                  onChange={(e) => setRequestForm({ ...requestForm, location: e.target.value })}
                  placeholder="e.g., Remote, San Francisco"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message to Candidate
                </label>
                <textarea
                  rows={3}
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                  placeholder="Tell them why this role is a great fit..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setRequestModal(null)}
                  className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => sendRequest(requestModal)}
                  disabled={sending || !requestForm.roleTitle}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                >
                  {sending ? 'Sending...' : 'Send Request (1 credit)'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
