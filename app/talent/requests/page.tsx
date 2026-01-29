'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface InterviewRequestData {
  id: string;
  roleTitle: string;
  roleDescription: string | null;
  salaryRange: string | null;
  location: string | null;
  message: string | null;
  status: string;
  createdAt: string;
  expiresAt: string;
  company: {
    name: string;
    website: string | null;
    description: string | null;
    city: string | null;
    country: string | null;
  };
  reveals: Array<{
    id: string;
    candidateConsent: boolean;
    recruiterConsent: boolean;
    candidateRevealed: boolean;
    recruiterRevealed: boolean;
    revealedAt: string | null;
  }>;
}

export default function TalentRequestsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<InterviewRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [responding, setResponding] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    fetchRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/talent/requests?status=${filter}`);
      if (res.status === 404) {
        router.push('/talent/opt-in');
        return;
      }
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {
      console.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId: string, action: 'accept' | 'decline') => {
    setResponding(requestId);
    try {
      const res = await fetch(`/api/talent/requests/${requestId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        fetchRequests();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to respond');
      }
    } catch {
      alert('Something went wrong');
    } finally {
      setResponding(null);
    }
  };

  const handleReveal = async (requestId: string) => {
    if (!confirm('Are you sure you want to reveal your identity to this recruiter? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/talent/requests/${requestId}/reveal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.mutualReveal) {
          alert('Profiles mutually revealed! The recruiter will contact you directly.');
        } else {
          alert('Your profile has been revealed. Waiting for the recruiter to reveal theirs.');
        }
        fetchRequests();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to reveal');
      }
    } catch {
      alert('Something went wrong');
    }
  };

  const daysUntilExpiry = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Interview Requests
          </h1>
          <button
            onClick={() => router.push('/talent/profile')}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900"
          >
            My Profile
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {['pending', 'accepted', 'declined', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'pending'
                ? 'No pending interview requests.'
                : `No ${filter} requests found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {req.roleTitle}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {req.company.name}
                      {req.company.city && ` - ${req.company.city}`}
                      {req.company.country && `, ${req.company.country}`}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    req.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : req.status === 'accepted'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {req.salaryRange && <span>{req.salaryRange}</span>}
                  {req.location && <span>{req.location}</span>}
                </div>

                {req.roleDescription && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {req.roleDescription}
                  </p>
                )}

                {req.message && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300 mb-4 italic">
                    &quot;{req.message}&quot;
                  </div>
                )}

                {req.company.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {req.company.description}
                  </p>
                )}

                {/* Actions */}
                {req.status === 'pending' && (
                  <div className="flex gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleRespond(req.id, 'accept')}
                      disabled={responding === req.id}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(req.id, 'decline')}
                      disabled={responding === req.id}
                      className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    >
                      Decline
                    </button>
                    <p className="text-xs text-gray-400 self-center">
                      Expires in {daysUntilExpiry(req.expiresAt)} days
                    </p>
                  </div>
                )}

                {req.status === 'accepted' && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    {req.reveals.length > 0 && req.reveals[0].revealedAt ? (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-green-700 dark:text-green-400">
                        Profiles mutually revealed. The recruiter will contact you directly.
                      </div>
                    ) : req.reveals.length > 0 && req.reveals[0].candidateConsent ? (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-400">
                        You&apos;ve revealed your profile. Waiting for the recruiter.
                      </div>
                    ) : (
                      <button
                        onClick={() => handleReveal(req.id)}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        Reveal My Identity
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
