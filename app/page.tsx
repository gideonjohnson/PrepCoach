'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent cursor-pointer">
                  PrepCoach
                </span>
                <span className="text-xs font-bold text-gray-400 group-hover:text-orange-500 transition-colors" style={{ fontSize: '0.65rem', verticalAlign: 'super', marginLeft: '-0.1rem' }}>
                  GJ
                </span>
              </Link>
            </div>
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</Link>
              <Link href="/careers" className="text-gray-600 hover:text-gray-900 transition">Careers</Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition">Dashboard</Link>
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{session.user?.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 transition">
                    Sign In
                  </Link>
                  <Link href="/practice">
                    <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium hover:shadow-lg transition">
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
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 transition">Pricing</Link>
                <Link href="/careers" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 transition">Careers</Link>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 transition">Dashboard</Link>
                {session ? (
                  <>
                    <span className="text-gray-700 text-sm">{session.user?.email}</span>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="w-full px-6 py-2 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 transition">
                      Sign In
                    </Link>
                    <Link href="/practice" onClick={() => setMobileMenuOpen(false)}>
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Hero Content */}
            <div className="text-center lg:text-left">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full">
              <span className="text-orange-600 font-semibold text-sm">Join 500,000+ candidates who aced their interviews</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Stop Guessing.{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Start Winning Interviews
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Practice with <strong>45+ real interview questions</strong> for your role. Get instant AI feedback. Land offers at top companies.
              <span className="block mt-2 text-lg font-semibold text-gray-800">95% success rate. 24/7 access. Zero awkwardness.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-stretch sm:items-center mb-8">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-base sm:text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105 min-h-[48px]">
                  Start Practicing Free →
                </button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-800 border-2 border-gray-300 rounded-full text-base sm:text-lg font-semibold hover:border-orange-500 hover:text-orange-500 transition min-h-[48px]">
                  See Plans & Pricing
                </button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Get started in under 60 seconds • No credit card required
            </p>
            </div>

            {/* Right: Hero Image */}
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
                  alt="Professional using laptop for interview prep"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent"></div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl opacity-20 blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl opacity-20 blur-xl"></div>
            </div>
          </div>

          {/* 3D Feature Buttons Section */}
          <div className="mt-20 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Your Complete Career Arsenal
              </h2>
              <p className="text-lg text-gray-600">
                From interview prep to salary negotiation — we've got you covered
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
              {/* Interview Prep Button */}
              <Link href="/practice">
                <div className="group relative bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
                     style={{
                       transformStyle: 'preserve-3d',
                       boxShadow: '0 20px 60px rgba(249, 115, 22, 0.4), 0 10px 20px rgba(0, 0, 0, 0.15)'
                     }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform backdrop-blur-sm">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Interview Prep</h3>
                    <p className="text-white/90 text-sm">45+ Questions</p>
                  </div>
                </div>
              </Link>

              {/* LinkedIn Optimizer Button */}
              <Link href="/linkedin">
                <div className="group relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
                     style={{
                       transformStyle: 'preserve-3d',
                       boxShadow: '0 20px 60px rgba(37, 99, 235, 0.4), 0 10px 20px rgba(0, 0, 0, 0.15)'
                     }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform backdrop-blur-sm">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">LinkedIn Optimizer</h3>
                    <p className="text-white/90 text-sm">3x Profile Views</p>
                  </div>
                </div>
              </Link>

              {/* Career Roadmap Button */}
              <Link href="/roadmap">
                <div className="group relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
                     style={{
                       transformStyle: 'preserve-3d',
                       boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4), 0 10px 20px rgba(0, 0, 0, 0.15)'
                     }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform backdrop-blur-sm">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Career Roadmap</h3>
                    <p className="text-white/90 text-sm">Skills & Timeline</p>
                  </div>
                </div>
              </Link>

              {/* Salary Hub Button */}
              <Link href="/salary">
                <div className="group relative bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
                     style={{
                       transformStyle: 'preserve-3d',
                       boxShadow: '0 20px 60px rgba(34, 197, 94, 0.4), 0 10px 20px rgba(0, 0, 0, 0.15)'
                     }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform backdrop-blur-sm">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Salary Hub</h3>
                    <p className="text-white/90 text-sm">$15K+ Increase</p>
                  </div>
                </div>
              </Link>

              {/* Resume Builder Button */}
              <Link href="/resume-builder">
                <div className="group relative bg-gradient-to-br from-gray-700 to-slate-900 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
                     style={{
                       transformStyle: 'preserve-3d',
                       boxShadow: '0 20px 60px rgba(71, 85, 105, 0.4), 0 10px 20px rgba(0, 0, 0, 0.15)'
                     }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-slate-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform backdrop-blur-sm">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Resume Builder</h3>
                    <p className="text-white/90 text-sm">ATS-Optimized</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto mt-8 mb-8">
              <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">500+</div>
                <div className="text-gray-600 text-xs sm:text-sm">Professional Roles</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">45+</div>
                <div className="text-gray-600 text-xs sm:text-sm">Questions Per Role</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">95%</div>
                <div className="text-gray-600 text-xs sm:text-sm">Success Rate</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">24/7</div>
                <div className="text-gray-600 text-xs sm:text-sm">AI Availability</div>
              </div>
            </div>

          {/* Company Logos */}
          <div className="mt-12 sm:mt-16">
            <p className="text-center text-gray-500 mb-6 sm:mb-8 font-medium text-sm sm:text-base">Our users land offers at companies like</p>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12 opacity-60">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Meta</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Google</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Microsoft</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Amazon</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Netflix</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Apple</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase - Interview & Salary Negotiation */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nail the Interview. Maximize the Offer.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just get the job — get the job with the salary you deserve
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* Interview Practice Card */}
            <Link href="/practice">
              <div className="group bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-orange-200 hover:border-orange-400 cursor-pointer h-full">
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Interview Practice</h3>
                    <p className="text-orange-600 font-semibold text-lg mb-4">Ace every question →</p>
                  </div>
                </div>

                <p className="text-gray-700 text-base mb-6 leading-relaxed">
                  Practice with <strong>45+ actual interview questions</strong> recruiters ask right now. Get instant feedback that makes you better, faster.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">45+ Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">AI Feedback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Audio Recording</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Analytics</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-orange-200">
                  <span className="text-gray-600 text-xs font-medium">500+ Roles</span>
                  <span className="text-orange-600 font-bold text-base group-hover:translate-x-2 transition-transform">Try It Free →</span>
                </div>
              </div>
            </Link>

            {/* LinkedIn Profile Optimizer Card */}
            <Link href="/linkedin">
              <div className="group bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-200 hover:border-blue-400 cursor-pointer h-full">
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">LinkedIn Optimizer</h3>
                    <p className="text-blue-600 font-semibold text-lg mb-4">Get 3x more views →</p>
                  </div>
                </div>

                <p className="text-gray-700 text-base mb-6 leading-relaxed">
                  Make recruiters come to you. AI-powered optimization that gets you <strong>3x more profile views</strong> in just 4 weeks.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Keyword Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Profile Scoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">10+ Templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Visibility Plan</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-blue-200">
                  <span className="text-gray-600 text-xs font-medium">Get 3x more views</span>
                  <span className="text-blue-600 font-bold text-base group-hover:translate-x-2 transition-transform">Optimize →</span>
                </div>
              </div>
            </Link>

            {/* Career Roadmap Planner Card */}
            <Link href="/roadmap">
              <div className="group bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-indigo-200 hover:border-indigo-400 cursor-pointer h-full">
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Career Roadmap</h3>
                    <p className="text-indigo-600 font-semibold text-lg mb-4">Know your path →</p>
                  </div>
                </div>

                <p className="text-gray-700 text-base mb-6 leading-relaxed">
                  Stop wandering. Get a <strong>personalized step-by-step plan</strong> to reach your dream role, with exact skills to learn and timelines to follow.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Skills Gap Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Learning Paths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Timeline Plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Certifications</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-indigo-200">
                  <span className="text-gray-600 text-xs font-medium">Chart your path</span>
                  <span className="text-indigo-600 font-bold text-base group-hover:translate-x-2 transition-transform">Get Started →</span>
                </div>
              </div>
            </Link>

            {/* Salary Negotiation Card */}
            <Link href="/salary">
              <div className="group bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-green-200 hover:border-green-400 cursor-pointer h-full">
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Salary Negotiation</h3>
                    <p className="text-green-600 font-semibold text-lg mb-4">Earn $15K+ more →</p>
                  </div>
                </div>

                <p className="text-gray-700 text-base mb-6 leading-relaxed">
                  Don't leave money on the table. Get word-for-word scripts and real market data that help you negotiate <strong>$15K+ more on average</strong>.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Market Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">12+ Scripts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Calculator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Comparison</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-green-200">
                  <span className="text-gray-600 text-xs font-medium">$15K+ Average</span>
                  <span className="text-green-600 font-bold text-base group-hover:translate-x-2 transition-transform">Start Now →</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Value Prop Banner */}
          <div className="mt-12 bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 rounded-2xl p-8 text-center border-2 border-purple-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Why settle for just the job?
            </h3>
            <p className="text-gray-700 text-lg mb-4">
              Most candidates leave <strong>$10K-50K</strong> on the table every year. Get the offer AND the salary you deserve.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-gray-600">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                95% Interview Success Rate
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                $15K+ Avg Salary Increase
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                500K+ Happy Users
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Interview Prep That Actually Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real questions. Instant feedback. Proven results. Everything you need to dominate your next interview.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">45+ Real Interview Questions</h3>
              <p className="text-gray-600 leading-relaxed">
                Practice the exact questions interviewers ask today. Covering 500+ roles from software engineering to product management. No fluff, just what works.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant AI Feedback</h3>
              <p className="text-gray-600 leading-relaxed">
                Know exactly what to improve—instantly. Get detailed feedback on your answers, communication style, and how to make every response stronger.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Record & Review Your Answers</h3>
              <p className="text-gray-600 leading-relaxed">
                Hear how you actually sound. Practice out loud, get instant transcriptions, and catch those "ums" and "ahs" before the real interview.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Your Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                See yourself getting better. Visual dashboards show exactly where you're improving and what needs work. Watch your confidence grow with every session.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Save & Share Your Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                Download everything as PDF or CSV. Share your wins with mentors, review offline, or keep records for future interviews. Your data, your way.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Practice Until You're Perfect</h3>
              <p className="text-gray-600 leading-relaxed">
                No limits. No restrictions. Practice 10 times or 100 times—whatever it takes to walk into that interview room with unshakeable confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              From Nervous to Confident in 3 Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start practicing in under 60 seconds. Land your dream job this month.
            </p>
          </div>

          {/* Hero Image for How It Works */}
          <div className="mb-16 relative">
            <div className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-orange-50 to-purple-50 rounded-3xl p-8 md:p-12">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Real Practice. Real Results.</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Stop reading generic tips. Start practicing with real questions, getting real feedback, and seeing real improvement. Every single session makes you better.
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Realistic interview simulations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Detailed performance analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Personalized improvement plans</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                    alt="Team collaborating on interview preparation"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition h-full">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-6 text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pick Your Role</h3>
                <p className="text-gray-600 mb-4">
                  Choose your target role. Get <strong>45+ questions</strong> that interviewers actually ask for that specific position. From entry-level to senior roles across 500+ careers.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Software Engineering, Product, Design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Data Science, Machine Learning, AI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Business, Finance, Marketing & More</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition h-full">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-6 text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Practice Out Loud</h3>
                <p className="text-gray-600 mb-4">
                  Answer questions like you're in the real interview. Record your voice, get instant transcriptions, and practice until it feels natural.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">✓</span>
                    <span>Natural conversation flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">✓</span>
                    <span>Audio recording & transcription</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">✓</span>
                    <span>Unlimited practice sessions</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition h-full">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl mb-6 text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">See What to Fix</h3>
                <p className="text-gray-600 mb-4">
                  Get instant, specific feedback on every answer. Know exactly what's working and what needs improvement. Track your progress as you get better.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Content quality assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Communication style analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Actionable improvement suggestions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-100 to-red-100 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-20 blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full">
              <span className="text-orange-600 font-semibold text-sm">Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Real People. Real Offers. Real Results.
            </h2>
            <p className="text-xl text-gray-600">Here's what happened when they stopped overthinking and started practicing</p>
          </div>

          {/* Testimonial Hero Image */}
          <div className="mb-16">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
              <img
                src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1200&h=400&fit=crop"
                alt="Happy professional after successful interview"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-purple-500/80 flex items-center justify-center">
                <div className="text-center text-white px-6">
                  <p className="text-3xl md:text-4xl font-bold mb-4">&quot;I landed my dream job!&quot;</p>
                  <p className="text-lg md:text-xl opacity-90">Join 500,000+ candidates who transformed their careers with PrepCoach</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                &quot;PrepCoach helped me land a senior PM role at Google. The AI feedback was incredibly detailed
                and helped me refine my STAR responses. Worth every penny!&quot;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                  alt="Sarah Chen"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-gray-900">Sarah Chen</p>
                  <p className="text-sm text-gray-500">Product Manager @ Google</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                &quot;As a career switcher into tech, PrepCoach gave me the confidence I needed. The analytics
                showed exactly where I was improving. Got 3 offers in 2 months!&quot;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Michael Rodriguez"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-gray-900">Michael Rodriguez</p>
                  <p className="text-sm text-gray-500">Software Engineer @ Meta</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                &quot;The audio recording feature was game-changing. I could hear myself and identify verbal
                tics. Landed my dream data science role at Netflix!&quot;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face"
                  alt="Aisha Patel"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-gray-900">Aisha Patel</p>
                  <p className="text-sm text-gray-500">Data Scientist @ Netflix</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Dream Job Is Waiting
          </h2>
          <p className="text-xl sm:text-2xl text-white/95 mb-4 max-w-3xl mx-auto">
            Join 500,000+ people who stopped winging it and started winning it
          </p>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            Get instant access to real interview questions, AI feedback, and everything you need to nail your next interview
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <button className="px-10 py-5 bg-white text-orange-600 rounded-full text-lg font-bold hover:shadow-2xl transition transform hover:scale-105 shadow-xl">
                Start Practicing Free →
              </button>
            </Link>
            <Link href="/pricing">
              <button className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-full text-lg font-bold hover:bg-white hover:text-orange-600 transition">
                See Plans & Pricing
              </button>
            </Link>
          </div>
          <div className="mt-8">
            <Link href="/careers">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-2xl transition transform hover:scale-105 shadow-lg">
                Join Our Team - We&apos;re Hiring! 🚀
              </button>
            </Link>
          </div>
          <p className="text-white/80 text-sm mt-6">
            Start in 60 seconds • No credit card • 30-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent cursor-pointer">
                  PrepCoach
                </span>
                <span className="text-sm font-bold text-gray-500 group-hover:text-orange-400 transition-colors" style={{ fontSize: '0.75rem', verticalAlign: 'super', marginLeft: '-0.15rem' }}>
                  GJ
                </span>
              </Link>
              <p className="text-gray-400 mt-4 leading-relaxed">
                The ultimate AI-powered interview preparation platform. Master your interviews with 45+ role-specific questions tailored to current interview standards,
                real-time feedback, and advanced analytics.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="https://x.com/prep_coach" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/enggidpro/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-orange-500 transition">Features</a></li>
                <li><Link href="/pricing" className="hover:text-orange-500 transition">Pricing</Link></li>
                <li><Link href="/resume-builder" className="hover:text-orange-500 transition">Resume Builder</Link></li>
                <li><Link href="/dashboard" className="hover:text-orange-500 transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#how-it-works" className="hover:text-orange-500 transition">How It Works</a></li>
                <li><Link href="/help" className="hover:text-orange-500 transition">Help Center</Link></li>
                <li><Link href="/roadmap" className="hover:text-orange-500 transition">Roadmap</Link></li>
                <li><Link href="/salary" className="hover:text-orange-500 transition">Salary Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/about" className="hover:text-orange-500 transition">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-orange-500 transition font-semibold text-orange-400">Careers 🚀</Link></li>
                <li><Link href="/contact" className="hover:text-orange-500 transition">Contact</Link></li>
                <li><Link href="/pricing" className="hover:text-orange-500 transition">Pricing</Link></li>
                <li><a href="https://github.com/gideonjohnson/PrepCoach" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; 2025 PrepCoach<sup className="text-xs">GJ</sup>. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <Link href="/privacy" className="hover:text-orange-500 transition">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-orange-500 transition">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}