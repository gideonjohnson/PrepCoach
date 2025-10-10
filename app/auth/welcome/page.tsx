'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    // Countdown redirect to pricing
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/pricing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Welcome Icon */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mb-8 animate-bounce">
          <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </div>

        {/* Welcome Message */}
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">PrepCoach</span>!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {session?.user?.name ? `Hi ${session.user.name}! ` : 'Hi! '}
          Your account has been created successfully.
        </p>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">One More Step</h2>
          <p className="text-gray-600 mb-6">
            To start practicing with AI-powered interview prep, please select your subscription plan.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">350+ Role-Specific Questions</h3>
                <p className="text-sm text-gray-600">Practice for any position</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Real-Time AI Feedback</h3>
                <p className="text-sm text-gray-600">Improve with every answer</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Audio & Video Recording</h3>
                <p className="text-sm text-gray-600">Review your performance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Performance Analytics</h3>
                <p className="text-sm text-gray-600">Track your progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/pricing">
          <button className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-lg font-semibold hover:shadow-lg transition-all">
            Choose Your Plan
          </button>
        </Link>

        {/* Auto-redirect notice */}
        <p className="text-sm text-gray-500 mt-8">
          Redirecting to pricing page in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
