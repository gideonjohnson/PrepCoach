'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';

const blogPosts = [
  {
    slug: 'ai-interview-practice-guide',
    title: 'How AI Interview Practice Can Transform Your Job Search in 2025',
    excerpt: 'Discover how artificial intelligence is revolutionizing interview preparation and helping candidates land their dream jobs faster than ever before.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop',
    date: 'January 15, 2025',
    readTime: '8 min read',
    category: 'Interview Tips',
  },
  {
    slug: 'common-interview-mistakes',
    title: '10 Common Interview Mistakes That Cost You Job Offers (And How to Avoid Them)',
    excerpt: 'Learn the most critical interview mistakes that prevent candidates from getting hired, plus proven strategies to overcome them using AI-powered practice.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
    date: 'January 14, 2025',
    readTime: '10 min read',
    category: 'Career Advice',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
            <span className="text-blue-600 font-semibold text-sm">Career Insights & Tips</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            PrepCoach <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert advice, interview tips, and career strategies to help you land your dream job
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                {/* Featured Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <time>{post.date}</time>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 mb-4 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center text-blue-600 font-semibold">
                    Read More
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Practice Your Interview Skills?
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of candidates using PrepCoach to ace their interviews and land their dream jobs
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105">
                Start Free Trial
              </button>
            </Link>
            <Link href="/practice">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold border-2 border-white hover:bg-blue-700 transition">
                Browse Practice Questions
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
