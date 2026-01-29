'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardData {
  recruiter: { name: string; title: string | null };
  company: { name: string; verificationStatus: string };
  stats: {
    creditBalance: number;
    totalViews: number;
    totalRequests: number;
    acceptedRequests: number;
    responseRate: number;
  };
  recentViews: Array<{
    id: string;
    viewedAt: string;
    isStarred: boolean;
    talentProfile: {
      anonymousId: string;
      displayTitle: string | null;
      overallScore: number | null;
      seniorityLevel: string | null;
      availability: string;
    };
  }>;
  activeRequests: Array<{
    id: string;
    roleTitle: string;
    status: string;
    createdAt: string;
    talentProfile: {
      anonymousId: string;
      displayTitle: string | null;
      overallScore: number | null;
    };
  }>;
}

export default function RecruiterDashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    fetch('/api/recruiter/dashboard')
      .then((r) => {
        if (r.status === 403) {
          router.push('/recruiter/register');
          return null;
        }
        return r.json();
      })
      .then((d) => d && setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status, router]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recruiter Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {data.recruiter.name} - {data.company.name}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/recruiter/talent"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Browse Talent
            </Link>
            <Link
              href="/recruiter/credits"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
            >
              Buy Credits
            </Link>
          </div>
        </div>

        {data.company.verificationStatus !== 'verified' && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-yellow-800 dark:text-yellow-200">
            Your company is pending verification. You&apos;ll be able to browse talent and send interview requests once verified.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Credits', value: data.stats.creditBalance, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Profiles Viewed', value: data.stats.totalViews, color: 'text-gray-900 dark:text-white' },
            { label: 'Requests Sent', value: data.stats.totalRequests, color: 'text-gray-900 dark:text-white' },
            { label: 'Response Rate', value: `${data.stats.responseRate}%`, color: 'text-green-600 dark:text-green-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Active Requests
            </h3>
            {data.activeRequests.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No active interview requests.</p>
            ) : (
              <div className="space-y-3">
                {data.activeRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {req.talentProfile.displayTitle || req.talentProfile.anonymousId}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {req.roleTitle} - Score: {req.talentProfile.overallScore ?? 'N/A'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      req.status === 'accepted'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Views */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recently Viewed
            </h3>
            {data.recentViews.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No profiles viewed yet.</p>
            ) : (
              <div className="space-y-3">
                {data.recentViews.map((view) => (
                  <div key={view.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {view.talentProfile.displayTitle || view.talentProfile.anonymousId}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {view.talentProfile.seniorityLevel} - Score: {view.talentProfile.overallScore ?? 'N/A'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(view.viewedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
