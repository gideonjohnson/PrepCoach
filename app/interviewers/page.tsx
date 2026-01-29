'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';

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
};

const EXPERTISE_OPTIONS = [
  { value: 'coding', label: 'Coding', icon: '💻' },
  { value: 'system_design', label: 'System Design', icon: '🏗️' },
  { value: 'behavioral', label: 'Behavioral', icon: '🗣️' },
  { value: 'engineering_management', label: 'Eng. Management', icon: '👔' },
  { value: 'frontend', label: 'Frontend', icon: '🎨' },
  { value: 'backend', label: 'Backend', icon: '⚙️' },
  { value: 'mobile', label: 'Mobile', icon: '📱' },
  { value: 'data_engineering', label: 'Data Engineering', icon: '📊' },
  { value: 'ml_ai', label: 'ML/AI', icon: '🤖' },
];

const EXPERTISE_MAP: Record<string, { label: string; icon: string }> = Object.fromEntries(
  EXPERTISE_OPTIONS.map((e) => [e.value, { label: e.label, icon: e.icon }])
);

export default function InterviewersPage() {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    expertise: '',
    minRate: '',
    maxRate: '',
    sortBy: 'rating',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchInterviewers();
  }, [filters, pagination.page]);

  const fetchInterviewers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        sortBy: filters.sortBy,
      });
      if (filters.expertise) params.set('expertise', filters.expertise);
      if (filters.minRate) params.set('minRate', (parseInt(filters.minRate) * 100).toString());
      if (filters.maxRate) params.set('maxRate', (parseInt(filters.maxRate) * 100).toString());

      const response = await fetch(`/api/interviewers?${params}`);
      const data = await response.json();

      setInterviewers(data.interviewers || []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 0,
      }));
    } catch (error) {
      console.error('Error fetching interviewers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            Expert Interviewers
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Book 1-on-1 mock interviews with experienced engineers from top tech companies.
            Get personalized feedback and improve your interview skills.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Expertise</label>
              <select
                value={filters.expertise}
                onChange={(e) => handleFilterChange('expertise', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">All Types</option>
                {EXPERTISE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Min Rate</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={filters.minRate}
                  onChange={(e) => handleFilterChange('minRate', e.target.value)}
                  placeholder="50"
                  className="w-full pl-8 pr-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Max Rate</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={filters.maxRate}
                  onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                  placeholder="500"
                  className="w-full pl-8 pr-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="rate">Lowest Price</option>
                <option value="sessions">Most Sessions</option>
                <option value="experience">Most Experience</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : interviewers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Interviewers Found</h3>
            <p className="text-gray-400">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <>
            <div className="text-gray-400 text-sm mb-4">
              Showing {interviewers.length} of {pagination.total} interviewers
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviewers.map((interviewer) => (
                <Link
                  key={interviewer.id}
                  href={`/interviewers/${interviewer.id}`}
                  className="group bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border-2 border-white/10 hover:border-orange-500/50 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-2xl text-white font-bold flex-shrink-0">
                      {interviewer.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                        {interviewer.displayName}
                      </h3>
                      {interviewer.currentRole && interviewer.currentCompany && (
                        <p className="text-gray-400 text-sm truncate">
                          {interviewer.currentRole} @ {interviewer.currentCompany}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {interviewer.rating > 0 && (
                          <span className="text-yellow-400 text-sm">
                            ⭐ {interviewer.rating.toFixed(1)}
                          </span>
                        )}
                        <span className="text-gray-500 text-sm">
                          {interviewer.totalSessions} sessions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {interviewer.bio && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {interviewer.bio}
                    </p>
                  )}

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {interviewer.expertise.slice(0, 3).map((exp) => (
                      <span
                        key={exp}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/10 text-orange-400 rounded text-xs"
                      >
                        {EXPERTISE_MAP[exp]?.icon} {EXPERTISE_MAP[exp]?.label || exp}
                      </span>
                    ))}
                    {interviewer.expertise.length > 3 && (
                      <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                        +{interviewer.expertise.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Previous Companies */}
                  {interviewer.previousCompanies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {interviewer.previousCompanies.slice(0, 3).map((company) => (
                        <span
                          key={company}
                          className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <span className="text-2xl font-bold text-white">
                        ${(interviewer.ratePerHour / 100).toFixed(0)}
                      </span>
                      <span className="text-gray-400 text-sm">/hour</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {interviewer.yearsExperience} yrs exp
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* CTA for Becoming Interviewer */}
        <div className="mt-16 bg-gradient-to-r from-purple-900/30 to-orange-900/30 backdrop-blur-2xl rounded-2xl p-8 shadow-lg border-2 border-purple-500/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Are You an Experienced Engineer?
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Share your expertise and help candidates prepare for their dream jobs.
            Earn money conducting mock interviews on your own schedule.
          </p>
          <Link
            href="/interviewer/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
          >
            Become an Interviewer
          </Link>
        </div>
      </div>
    </div>
  );
}
