'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/app/components/Header';

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
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
  linkedinUrl: string | null;
  timezone: string;
  ratePerHour: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationNotes: string | null;
  isActive: boolean;
  rating: number;
  totalSessions: number;
  createdAt: string;
  user: User;
};

const EXPERTISE_LABELS: Record<string, string> = {
  coding: 'Coding',
  system_design: 'System Design',
  behavioral: 'Behavioral',
  engineering_management: 'Eng. Management',
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
  data_engineering: 'Data Engineering',
  ml_ai: 'ML/AI',
};

export default function AdminInterviewersPage() {
  const { data: session, status } = useSession();
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'pending' | 'verified' | 'rejected' | 'all'>('pending');
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchInterviewers();
    }
  }, [status, filter]);

  const fetchInterviewers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/interviewers?status=${filter}`);
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        throw new Error('Failed to fetch interviewers');
      }
      const data = await response.json();
      setInterviewers(data.interviewers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/interviewers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: 'verified',
          verificationNotes: notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify');
      }

      setSelectedInterviewer(null);
      setNotes('');
      fetchInterviewers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!notes.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/interviewers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: 'rejected',
          verificationNotes: notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject');
      }

      setSelectedInterviewer(null);
      setNotes('');
      fetchInterviewers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setActionLoading(false);
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

  if (error === 'Access denied. Admin privileges required.') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🚫</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Interviewer Verification</h1>
            <p className="text-gray-400">Review and verify interviewer applications</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
          >
            ← Admin Dashboard
          </Link>
        </div>

        {error && error !== 'Access denied. Admin privileges required.' && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-gray-900/50 rounded-xl p-1 mb-6 inline-flex gap-1">
          {(['pending', 'verified', 'rejected', 'all'] as const).map((f) => (
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

        {/* Interviewers List */}
        {interviewers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📋</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Interviewers</h3>
            <p className="text-gray-400">No {filter !== 'all' ? filter : ''} interviewer applications found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviewers.map((interviewer) => (
              <div
                key={interviewer.id}
                className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-xl p-6 border-2 border-white/10"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Profile Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-xl text-white font-bold flex-shrink-0">
                      {interviewer.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{interviewer.displayName}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          interviewer.verificationStatus === 'verified'
                            ? 'bg-green-500/20 text-green-400'
                            : interviewer.verificationStatus === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {interviewer.verificationStatus}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {interviewer.currentRole} {interviewer.currentCompany && `@ ${interviewer.currentCompany}`}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {interviewer.expertise.slice(0, 4).map((exp) => (
                          <span
                            key={exp}
                            className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded text-xs"
                          >
                            {EXPERTISE_LABELS[exp] || exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-white font-bold">{interviewer.yearsExperience}</p>
                      <p className="text-gray-500">Years</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold">${(interviewer.ratePerHour / 100).toFixed(0)}</p>
                      <p className="text-gray-500">Rate/hr</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold">{interviewer.previousCompanies.length}</p>
                      <p className="text-gray-500">Companies</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedInterviewer(interviewer);
                        setNotes(interviewer.verificationNotes || '');
                      }}
                      className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
                    >
                      Review
                    </button>
                    {interviewer.verificationStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleVerify(interviewer.id)}
                          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedInterviewer(interviewer);
                            setNotes('');
                          }}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-sm text-gray-400">
                  <span>User: {interviewer.user.email}</span>
                  <span>Registered: {new Date(interviewer.createdAt).toLocaleDateString()}</span>
                  {interviewer.linkedinUrl && (
                    <a
                      href={interviewer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedInterviewer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Review Application</h2>
                <button
                  onClick={() => {
                    setSelectedInterviewer(null);
                    setNotes('');
                  }}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                    {selectedInterviewer.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedInterviewer.displayName}</h3>
                    <p className="text-gray-400">
                      {selectedInterviewer.currentRole} @ {selectedInterviewer.currentCompany}
                    </p>
                    <p className="text-gray-500 text-sm">{selectedInterviewer.user.email}</p>
                  </div>
                </div>

                {selectedInterviewer.bio && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase mb-1">Bio</h4>
                    <p className="text-gray-300">{selectedInterviewer.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase mb-1">Experience</h4>
                    <p className="text-white">{selectedInterviewer.yearsExperience} years</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase mb-1">Rate</h4>
                    <p className="text-white">${(selectedInterviewer.ratePerHour / 100).toFixed(0)}/hr</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase mb-1">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterviewer.expertise.map((exp) => (
                      <span key={exp} className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-sm">
                        {EXPERTISE_LABELS[exp] || exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase mb-1">Previous Companies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterviewer.previousCompanies.map((company) => (
                      <span key={company} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase mb-1">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterviewer.languages.map((lang) => (
                      <span key={lang} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedInterviewer.linkedinUrl && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase mb-1">LinkedIn</h4>
                    <a
                      href={selectedInterviewer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {selectedInterviewer.linkedinUrl}
                    </a>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Admin Notes</h4>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this application..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      setSelectedInterviewer(null);
                      setNotes('');
                    }}
                    className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  {selectedInterviewer.verificationStatus !== 'rejected' && (
                    <button
                      onClick={() => handleReject(selectedInterviewer.id)}
                      disabled={actionLoading}
                      className="px-6 py-3 bg-red-500/20 text-red-400 rounded-lg font-semibold disabled:opacity-50"
                    >
                      Reject
                    </button>
                  )}
                  {selectedInterviewer.verificationStatus !== 'verified' && (
                    <button
                      onClick={() => handleVerify(selectedInterviewer.id)}
                      disabled={actionLoading}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold disabled:opacity-50"
                    >
                      {actionLoading ? 'Processing...' : 'Approve'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
