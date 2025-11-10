'use client';

import Header from '../components/Header';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">PrepCoach</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Empowering job seekers with AI-powered interview preparation and career development tools
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎯</span> Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              PrepCoach was built to democratize access to professional interview coaching. We believe everyone deserves
              the opportunity to present their best self in interviews, regardless of their background or resources.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By leveraging cutting-edge AI technology, we provide personalized, real-time feedback that helps candidates
              improve their interview skills and land their dream jobs at top companies.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>✨</span> What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Interview Practice</h3>
                  <p className="text-gray-600 text-sm">45+ questions per role across 341 job positions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">AI Feedback</h3>
                  <p className="text-gray-600 text-sm">Real-time analysis powered by Claude 3.5 Sonnet</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Resume Builder</h3>
                  <p className="text-gray-600 text-sm">ATS-optimized templates and AI optimization</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💼</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Career Tools</h3>
                  <p className="text-gray-600 text-sm">LinkedIn optimizer, salary calculator, and roadmaps</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-8 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">341</div>
                <div className="text-sm opacity-90">Job Roles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">45+</div>
                <div className="text-sm opacity-90">Questions/Role</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">95%</div>
                <div className="text-sm opacity-90">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-sm opacity-90">Availability</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <p className="text-gray-600 mb-6">Ready to ace your next interview?</p>
            <Link href="/auth/signup">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
