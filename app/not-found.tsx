'use client';

import Link from 'next/link';
import Header from './components/Header';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        {/* 404 Number with Glow Effect */}
        <div className="relative mb-8">
          <h1 className="text-[150px] sm:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 leading-none">
            404
          </h1>
          <div className="absolute inset-0 text-[150px] sm:text-[200px] font-bold text-blue-500/20 blur-3xl leading-none">
            404
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
          Page Not Found
        </h2>
        <p className="text-gray-400 text-lg max-w-md text-center mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
              Go Home
            </button>
          </Link>
          <Link href="/practice">
            <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300">
              Start Practicing
            </button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Popular destinations:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/pricing" className="text-blue-400 hover:text-blue-300 transition-colors">
              Pricing
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/blog" className="text-blue-400 hover:text-blue-300 transition-colors">
              Blog
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors">
              Dashboard
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/help" className="text-blue-400 hover:text-blue-300 transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
