'use client';

import { useState } from 'react';

interface ProblemFiltersProps {
  onFilterChange: (filters: {
    difficulty?: string;
    category?: string;
    company?: string;
    search?: string;
  }) => void;
  categories: string[];
}

const COMPANIES = [
  'Google', 'Amazon', 'Meta', 'Microsoft', 'Apple',
  'Netflix', 'Bloomberg', 'Goldman Sachs', 'Uber', 'Stripe',
];

export default function ProblemFilters({
  onFilterChange,
  categories,
}: ProblemFiltersProps) {
  const [difficulty, setDifficulty] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const emitFilters = (overrides: Partial<{ difficulty: string; category: string; company: string; search: string }> = {}) => {
    const d = overrides.difficulty ?? difficulty;
    const cat = overrides.category ?? category;
    const comp = overrides.company ?? company;
    const s = overrides.search ?? search;
    onFilterChange({
      difficulty: d || undefined,
      category: cat || undefined,
      company: comp || undefined,
      search: s || undefined,
    });
  };

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value);
    emitFilters({ difficulty: value });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    emitFilters({ category: value });
  };

  const handleCompanyChange = (value: string) => {
    setCompany(value);
    emitFilters({ company: value });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    emitFilters({ search: value });
  };

  const clearFilters = () => {
    setDifficulty('');
    setCategory('');
    setCompany('');
    setSearch('');
    onFilterChange({});
  };

  const hasActiveFilters = difficulty || category || company || search;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search problems..."
              className="w-full px-4 py-2 pl-10 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="w-full md:w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors appearance-none bg-white"
          >
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors appearance-none bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Company Filter */}
        <div className="w-full md:w-44">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <select
            value={company}
            onChange={(e) => handleCompanyChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors appearance-none bg-white"
          >
            <option value="">All Companies</option>
            {COMPANIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">Active:</span>
          {difficulty && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1">
              {difficulty}
              <button onClick={() => handleDifficultyChange('')} className="hover:text-orange-900">x</button>
            </span>
          )}
          {category && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1">
              {category}
              <button onClick={() => handleCategoryChange('')} className="hover:text-orange-900">x</button>
            </span>
          )}
          {company && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
              {company}
              <button onClick={() => handleCompanyChange('')} className="hover:text-blue-900">x</button>
            </span>
          )}
          {search && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1">
              &ldquo;{search}&rdquo;
              <button onClick={() => handleSearchChange('')} className="hover:text-orange-900">x</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
