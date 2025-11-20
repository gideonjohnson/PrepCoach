'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent cursor-pointer">
                PrepCoach
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition font-medium">
              Home
            </Link>
            {session && (
              <>
                <Link href="/practice" className="text-gray-600 hover:text-gray-900 transition font-medium">
                  Practice
                </Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition font-medium">
                  Dashboard
                </Link>
              </>
            )}
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition font-medium">
              Pricing
            </Link>
            <Link href="/careers" className="text-gray-600 hover:text-gray-900 transition font-medium">
              Careers
            </Link>
            <Link href="/affiliate" className="text-orange-600 hover:text-orange-700 transition font-semibold">
              Affiliate
            </Link>
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-gray-600 hover:text-gray-900 transition font-medium">
                  {session.user?.email}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 transition font-medium">
                  Sign In
                </Link>
                <Link href="/auth/signup">
                  <button className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium hover:shadow-lg transition">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900 transition font-medium"
              >
                Home
              </Link>
              {session && (
                <>
                  <Link
                    href="/practice"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-gray-900 transition font-medium"
                  >
                    Practice
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-gray-900 transition font-medium"
                  >
                    Dashboard
                  </Link>
                </>
              )}
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900 transition font-medium"
              >
                Pricing
              </Link>
              <Link
                href="/careers"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900 transition font-medium"
              >
                Careers
              </Link>
              <Link
                href="/affiliate"
                onClick={() => setMobileMenuOpen(false)}
                className="text-orange-600 hover:text-orange-700 transition font-semibold"
              >
                Affiliate Program
              </Link>
              {session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-700 font-medium"
                  >
                    {session.user?.email}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full px-6 py-2 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-gray-900 transition font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <button className="w-full px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium hover:shadow-lg transition">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
