'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚', color: 'from-purple-500 to-pink-500' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀', color: 'from-blue-500 to-cyan-500' },
    { id: 'interview', name: 'Interview Practice', icon: '🎤', color: 'from-orange-500 to-red-500' },
    { id: 'resume', name: 'Resume Builder', icon: '📄', color: 'from-green-500 to-emerald-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-indigo-500 to-purple-500' },
    { id: 'billing', name: 'Billing & Plans', icon: '💳', color: 'from-yellow-500 to-orange-500' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧', color: 'from-red-500 to-pink-500' },
  ];

  const articles: HelpArticle[] = [
    // Getting Started
    {
      id: 'quick-start',
      title: 'Quick Start Guide',
      category: 'getting-started',
      description: 'Learn how to get started with PrepCoach in 5 minutes',
      icon: '⚡',
    },
    {
      id: 'create-account',
      title: 'Creating Your Account',
      category: 'getting-started',
      description: 'Sign up and set up your profile',
      icon: '👤',
    },
    {
      id: 'choose-plan',
      title: 'Choosing the Right Plan',
      category: 'getting-started',
      description: 'Compare plans and find what works for you',
      icon: '💎',
    },

    // Interview Practice
    {
      id: 'start-interview',
      title: 'Starting Your First Interview',
      category: 'interview',
      description: 'How to begin a mock interview session',
      icon: '🎯',
    },
    {
      id: 'interview-recording',
      title: 'Recording Your Responses',
      category: 'interview',
      description: 'Audio recording tips and best practices',
      icon: '🎙️',
    },
    {
      id: 'ai-feedback',
      title: 'Understanding AI Feedback',
      category: 'interview',
      description: 'How to interpret and improve from feedback',
      icon: '🤖',
    },
    {
      id: 'interview-types',
      title: 'Interview Question Types',
      category: 'interview',
      description: 'Behavioral, technical, and situational questions',
      icon: '❓',
    },

    // Resume Builder
    {
      id: 'upload-resume',
      title: 'Uploading Your Resume',
      category: 'resume',
      description: 'Supported formats and upload process',
      icon: '📤',
    },
    {
      id: 'transform-resume',
      title: 'AI Resume Transformation',
      category: 'resume',
      description: 'How AI tailors your resume for specific roles',
      icon: '✨',
    },
    {
      id: 'ats-optimization',
      title: 'ATS Optimization',
      category: 'resume',
      description: 'Making your resume ATS-friendly',
      icon: '🎯',
    },
    {
      id: 'download-resume',
      title: 'Downloading & Formats',
      category: 'resume',
      description: 'Export options: PDF, DOCX, and more',
      icon: '💾',
    },

    // LinkedIn
    {
      id: 'linkedin-optimize',
      title: 'LinkedIn Profile Optimization',
      category: 'linkedin',
      description: 'Enhance your LinkedIn presence',
      icon: '🌟',
    },
    {
      id: 'headline-summary',
      title: 'Writing Effective Headlines',
      category: 'linkedin',
      description: 'Craft compelling LinkedIn headlines',
      icon: '📝',
    },

    // Billing & Plans
    {
      id: 'upgrade-plan',
      title: 'Upgrading Your Plan',
      category: 'billing',
      description: 'How to upgrade to Pro or Enterprise',
      icon: '⬆️',
    },
    {
      id: 'billing-faq',
      title: 'Billing Questions',
      category: 'billing',
      description: 'Common billing and payment questions',
      icon: '💰',
    },
    {
      id: 'cancel-subscription',
      title: 'Canceling Subscription',
      category: 'billing',
      description: 'How to cancel or pause your subscription',
      icon: '🛑',
    },

    // Troubleshooting
    {
      id: 'audio-issues',
      title: 'Audio Recording Problems',
      category: 'troubleshooting',
      description: 'Fix microphone and recording issues',
      icon: '🔊',
    },
    {
      id: 'login-issues',
      title: 'Login & Access Issues',
      category: 'troubleshooting',
      description: 'Troubleshoot account access problems',
      icon: '🔐',
    },
    {
      id: 'browser-support',
      title: 'Browser Compatibility',
      category: 'troubleshooting',
      description: 'Supported browsers and requirements',
      icon: '🌐',
    },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularArticles = articles.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            How can we help you?
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find answers, guides, and resources to make the most of PrepCoach
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 text-lg transition-all"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                    : 'bg-white text-gray-700 hover:shadow-md border-2 border-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Articles (shown when no search/filter) */}
        {searchQuery === '' && activeCategory === 'all' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">🔥</span>
              Popular Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularArticles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/help/${article.id}`}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-orange-300 animate-fadeIn md:transform md:hover:scale-105"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="text-4xl mb-3">{article.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {searchQuery ? `Search Results (${filteredArticles.length})` : 'All Help Articles'}
          </h2>

          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-md border-2 border-gray-100">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or browse all categories
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                View All Articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/help/${article.id}`}
                  className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-orange-300 flex items-start gap-4 animate-fadeIn"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="text-3xl flex-shrink-0">{article.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1">{article.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{article.description}</p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <div className="bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:gideonbosiregj@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:shadow-2xl transition-all md:transform md:hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email Support
            </a>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-xl font-bold hover:bg-white/30 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              Upgrade for Priority Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
