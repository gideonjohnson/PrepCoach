'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Countdown redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/pricing';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Cancel Icon */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 mb-8">
          <svg className="h-16 w-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Cancel Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your payment was not completed. No charges were made to your account.
        </p>

        {/* Reassurance Box */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Happened?</h2>
          <p className="text-gray-600 mb-6">
            You&apos;ve cancelled the checkout process. This is completely normal - maybe you want to review the plans again or you&apos;re not quite ready yet.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Your free account is still active!</strong> You can continue using PrepCoach with the free tier features.
            </p>
          </div>

          {/* Quick Feature Comparison */}
          <div className="text-left space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900 text-center mb-4">What You&apos;re Missing:</h3>
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Unlimited interviews</strong> instead of just 3/month</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Unlimited AI feedback</strong> instead of just 5/month</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Advanced analytics</strong> to track your progress</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Priority support</strong> when you need help</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/pricing">
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              View Pricing Again
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all">
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Support Options */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-purple-900 mb-2">Have Questions?</h3>
          <p className="text-sm text-purple-800 mb-4">
            We&apos;re here to help! If you encountered any issues or have questions about our plans, please reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="text-sm text-purple-700 font-semibold hover:text-purple-900">
              Contact Support
            </Link>
            <span className="hidden sm:inline text-purple-300">|</span>
            <Link href="/pricing#faq" className="text-sm text-purple-700 font-semibold hover:text-purple-900">
              View FAQ
            </Link>
          </div>
        </div>

        {/* Auto-redirect notice */}
        <p className="text-sm text-gray-500">
          Redirecting to pricing page in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
