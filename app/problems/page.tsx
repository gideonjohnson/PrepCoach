'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/app/components/Header';
import ProblemCard from '@/app/components/ProblemCard';
import ProblemFilters from '@/app/components/ProblemFilters';
import { Skeleton } from '@/app/components/Skeleton';

interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  companies: string[];
  tags: string[];
  isPremium: boolean;
  successRate: number | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const CATEGORIES = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Binary Search',
  'Sorting',
  'Hash Tables',
  'Recursion',
  'Backtracking',
  'Greedy',
  'Math',
  'Bit Manipulation',
];

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    difficulty?: string;
    category?: string;
    company?: string;
    search?: string;
  }>({});

  const fetchProblems = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');

      if (filters.difficulty) {
        params.set('difficulty', filters.difficulty);
      }
      if (filters.category) {
        params.set('category', filters.category);
      }
      if (filters.company) {
        params.set('company', filters.company);
      }
      if (filters.search) {
        params.set('search', filters.search);
      }

      const response = await fetch(`/api/problems?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setProblems(data.problems);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    fetchProblems(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Problem Library
          </h1>
          <p className="text-lg text-gray-600">
            Practice with 200+ coding problems from top tech companies
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {problems.filter(p => p.difficulty === 'easy').length}
            </div>
            <div className="text-sm text-gray-500">Easy</div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {problems.filter(p => p.difficulty === 'medium').length}
            </div>
            <div className="text-sm text-gray-500">Medium</div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-red-600">
              {problems.filter(p => p.difficulty === 'hard').length}
            </div>
            <div className="text-sm text-gray-500">Hard</div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {pagination?.total || 0}
            </div>
            <div className="text-sm text-gray-500">Total Problems</div>
          </div>
        </div>

        {/* Filters */}
        <ProblemFilters
          onFilterChange={handleFilterChange}
          categories={CATEGORIES}
        />

        {/* Problems Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : problems.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No problems found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {problems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  slug={problem.slug}
                  title={problem.title}
                  difficulty={problem.difficulty}
                  category={problem.category}
                  companies={problem.companies}
                  tags={problem.tags}
                  isPremium={problem.isPremium}
                  successRate={problem.successRate}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-orange-500 text-white'
                          : 'border-2 border-gray-200 text-gray-600 hover:border-orange-400'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {pagination.totalPages > 5 && (
                  <>
                    <span className="text-gray-400">...</span>
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        pagination.page === pagination.totalPages
                          ? 'bg-orange-500 text-white'
                          : 'border-2 border-gray-200 text-gray-600 hover:border-orange-400'
                      }`}
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
