'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';

interface SystemDesignProblem {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  companies: string[];
  tags: string[];
  isPremium: boolean;
  totalAttempts: number;
}

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-700' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  hard: { label: 'Hard', color: 'bg-red-100 text-red-700' },
};

const CATEGORY_LABELS: Record<string, string> = {
  web_services: 'Web Services',
  distributed_systems: 'Distributed Systems',
  databases: 'Databases',
  messaging: 'Messaging',
  storage: 'Storage',
};

export default function SystemDesignPage() {
  const [problems, setProblems] = useState<SystemDesignProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await fetch('/api/system-design');
        const data = await res.json();
        if (res.ok) setProblems(data.problems);
      } catch (error) {
        console.error('Failed to fetch system design problems:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, []);

  const categories = [...new Set(problems.map(p => p.category))];
  const filtered = filter === 'all'
    ? problems
    : problems.filter(p => p.difficulty === filter || p.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">System Design</h1>
          <p className="text-lg text-gray-600">
            Practice designing scalable systems used at top tech companies
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
            }`}
          >
            All
          </button>
          {['easy', 'medium', 'hard'].map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === d ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === cat ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
              }`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {/* Problems Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">🏗️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No problems found</h3>
            <p className="text-gray-500">Try changing your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((problem) => {
              const diff = DIFFICULTY_CONFIG[problem.difficulty];
              return (
                <Link
                  key={problem.id}
                  href={`/system-design/${problem.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {problem.title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${diff.color}`}>
                      {diff.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {problem.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-medium">
                        {CATEGORY_LABELS[problem.category] || problem.category}
                      </span>
                      {problem.companies.slice(0, 3).map((c, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {c}
                        </span>
                      ))}
                    </div>
                    {problem.totalAttempts > 0 && (
                      <span className="text-xs text-gray-400">{problem.totalAttempts} attempts</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
