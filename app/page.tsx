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
              <Link href="/">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent cursor-pointer">
                  PrepCoach
                </span>
              </Link>
            </div>
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">How It Works</a>
              <Link href="/resume-builder" className="text-gray-600 hover:text-gray-900 transition">Resume Builder</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</Link>
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
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 transition">Features</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 transition">How It Works</a>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 transition">Pricing</Link>
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
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              AI Interview Practice –{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Your Ultimate Online Interview Practice Tool
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Practice with industry giants like Microsoft, Netflix, and OpenAI.
              Get real-time AI feedback and build confidence for your next interview.
            </p>
            <Link href="/practice">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105">
                Start practicing for free
              </button>
            </Link>
          </div>

          {/* Company Logos */}
          <div className="mt-20">
            <p className="text-center text-gray-500 mb-8">Join a community of 500k+ candidates</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
              <div className="text-3xl font-bold text-gray-800">Meta</div>
              <div className="text-3xl font-bold text-gray-800">Google</div>
              <div className="text-3xl font-bold text-gray-800">Microsoft</div>
              <div className="text-3xl font-bold text-gray-800">Amazon</div>
              <div className="text-3xl font-bold text-gray-800">Netflix</div>
              <div className="text-3xl font-bold text-gray-800">Apple</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Everything You Need to Ace Your Interview
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Master Your Responses</h3>
              <p className="text-gray-600">
                Get instant feedback on your answers with AI-powered analysis.
                Learn what works and what doesn&apos;t in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Speak with Clarity</h3>
              <p className="text-gray-600">
                Practice your delivery, tone, and pacing. Our AI analyzes your
                speech patterns to help you communicate more effectively.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Build Confidence</h3>
              <p className="text-gray-600">
                Practice anytime, anywhere. Turn your weaknesses into strengths
                with unlimited mock interviews tailored to your role.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How PrepCoach Works
          </h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Role</h3>
                    <p className="text-gray-600">
                      Select from 100+ industries and customize your interview
                      based on your target position and experience level.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Practice with AI</h3>
                    <p className="text-gray-600">
                      Engage in realistic mock interviews with our AI interviewer.
                      Answer questions just like you would in a real interview.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Get Instant Feedback</h3>
                    <p className="text-gray-600">
                      Receive detailed analysis on your performance, including
                      what to improve and how to strengthen your responses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl p-12 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-gray-600 font-medium">Interview Practice Interface</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            No More Interview Nerves
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of successful candidates who used PrepCoach to land their dream jobs
          </p>
          <Link href="/practice">
            <button className="px-8 py-4 bg-white text-orange-600 rounded-full text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105">
              Start practicing for free
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PrepCoach</h3>
              <p className="text-gray-400">Your AI-powered interview preparation platform</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PrepCoach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}