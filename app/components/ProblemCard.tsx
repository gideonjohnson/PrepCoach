'use client';

import Link from 'next/link';

interface ProblemCardProps {
  slug: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  companies: string[];
  tags: string[];
  isPremium: boolean;
  successRate: number | null;
}

const DIFFICULTY_CONFIG = {
  easy: {
    label: 'Easy',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
  },
  medium: {
    label: 'Medium',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-300',
  },
  hard: {
    label: 'Hard',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-300',
  },
};

export default function ProblemCard({
  slug,
  title,
  difficulty,
  category,
  companies,
  tags,
  isPremium,
  successRate,
}: ProblemCardProps) {
  const difficultyConfig = DIFFICULTY_CONFIG[difficulty];

  return (
    <Link href={`/problems/${slug}`}>
      <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200 p-5 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{category}</p>
          </div>

          {isPremium && (
            <span className="ml-2 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
              PRO
            </span>
          )}
        </div>

        {/* Difficulty & Success Rate */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${difficultyConfig.bgColor} ${difficultyConfig.textColor} border ${difficultyConfig.borderColor}`}
          >
            {difficultyConfig.label}
          </span>

          {successRate !== null && (
            <span className="text-xs text-gray-500">
              {successRate}% success rate
            </span>
          )}
        </div>

        {/* Companies */}
        {companies.length > 0 && (
          <div className="flex items-center gap-2 mb-3 overflow-hidden">
            <span className="text-xs text-gray-400 shrink-0">Companies:</span>
            <div className="flex gap-1 overflow-x-auto">
              {companies.slice(0, 3).map((company) => (
                <span
                  key={company}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded shrink-0"
                >
                  {company}
                </span>
              ))}
              {companies.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{companies.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="text-xs text-gray-400">+{tags.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
