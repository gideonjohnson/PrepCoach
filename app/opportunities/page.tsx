'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  url: string;
  description: string;
  category: string;
  type: string;
  date: string;
  source: string;
}

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'software-dev', label: 'Software Dev' },
  { value: 'customer-support', label: 'Customer Support' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'product', label: 'Product' },
  { value: 'business', label: 'Business' },
  { value: 'data', label: 'Data' },
  { value: 'devops', label: 'DevOps / SysAdmin' },
  { value: 'finance', label: 'Finance / Legal' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'qa', label: 'QA' },
  { value: 'writing', label: 'Writing' },
  { value: 'all-others', label: 'Other' },
];

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').slice(0, 150) + '...';
}

function JobCardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl" />
        <div className="flex-1">
          <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-4 bg-white/10 rounded w-1/2" />
        </div>
      </div>
      <div className="h-4 bg-white/10 rounded w-full mb-2" />
      <div className="h-4 bg-white/10 rounded w-2/3 mb-4" />
      <div className="flex gap-2">
        <div className="h-8 bg-white/10 rounded-lg w-20" />
        <div className="h-8 bg-white/10 rounded-lg w-20" />
      </div>
    </div>
  );
}

function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (category && category !== 'all') params.set('category', category);
      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data.jobs || []);
      setVisibleCount(24);
    } catch {
      setError('Unable to load job listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute top-0 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <span className="text-white">Opportunities</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Job Opportunities
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Discover remote tech roles from top companies. Find your next opportunity and practice for the interview.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto mb-10">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition appearance-none cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-gray-900 text-white">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchJobs}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
            <p className="text-gray-400">Try adjusting your search or category filter.</p>
          </div>
        )}

        {/* Job Cards Grid */}
        {!loading && !error && jobs.length > 0 && (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.slice(0, visibleCount).map((job) => (
              <div
                key={job.id}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-teal-500/30 transition-all duration-300"
              >
                {/* Company header */}
                <div className="flex items-start gap-4 mb-4">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                      {job.company[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg leading-tight truncate group-hover:text-teal-400 transition">
                      {job.title}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">{job.company}</p>
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-300 bg-white/5 px-2 py-1 rounded-lg">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location || 'Remote'}
                  </span>
                  {job.salary && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.salary}
                    </span>
                  )}
                  {job.category && (
                    <span className="text-xs text-teal-400 bg-teal-500/10 px-2 py-1 rounded-lg">
                      {job.category}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 px-2 py-1">
                    {timeAgo(job.date)}
                  </span>
                </div>

                {/* Description preview */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {stripHtml(job.description)}
                </p>

                {/* CTAs */}
                <div className="flex gap-3">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    Apply
                  </a>
                  <Link
                    href="/practice"
                    className="flex-1 text-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg border border-white/10 transition-all"
                  >
                    Practice Interview
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {visibleCount < jobs.length && (
            <div className="text-center mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold rounded-full transition-all transform hover:scale-105"
              >
                Show More ({jobs.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
        )}

        {/* Attribution */}
        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            Jobs provided by{' '}
            <a href="https://remotive.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 underline transition">Remotive</a>,{' '}
            <a href="https://www.arbeitnow.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 underline transition">Arbeitnow</a>, &{' '}
            <a href="https://jobicy.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 underline transition">Jobicy</a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OpportunitiesContent />
    </Suspense>
  );
}
