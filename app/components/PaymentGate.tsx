'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PaymentGateProps {
  children: React.ReactNode;
  feature?: string;
}

export default function PaymentGate({ children, feature = 'this feature' }: PaymentGateProps) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // TEMPORARY: Disable payment gates for demo/testing
  // Set NEXT_PUBLIC_DISABLE_PAYMENT_GATES=true in Vercel env to disable gates
  const paymentGatesDisabled = process.env.NEXT_PUBLIC_DISABLE_PAYMENT_GATES === 'true';

  useEffect(() => {
    if (paymentGatesDisabled) {
      // Payment gates disabled - grant access to everyone
      setHasAccess(true);
      setLoading(false);
      return;
    }
    checkSubscription();
  }, [paymentGatesDisabled]);

  const checkSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscription-status');
      if (response.ok) {
        const data = await response.json();
        setHasAccess(data.hasAccess || data.tier !== 'free');
      } else {
        // If API fails, default to blocking access
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Payment Required Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-purple-200">
            {/* Lock Icon */}
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-orange-100 to-red-100 mb-6">
              <svg className="h-12 w-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Header */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Upgrade to Access {feature}
              </span>
            </h1>
            <p className="text-gray-600 text-center mb-8 text-lg">
              Subscribe to PrepCoach Pro to unlock unlimited access to all features and accelerate your interview preparation.
            </p>

            {/* Features Included */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-8 border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                What You'll Get
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Unlimited Interviews</h4>
                    <p className="text-sm text-gray-600">Practice with 45+ questions per role</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">AI Feedback</h4>
                    <p className="text-sm text-gray-600">Get detailed insights on every response</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">LinkedIn Optimizer</h4>
                    <p className="text-sm text-gray-600">3x more profile views</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Career Roadmap</h4>
                    <p className="text-sm text-gray-600">Personalized growth plans</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Salary Negotiation</h4>
                    <p className="text-sm text-gray-600">$15K+ average increase</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Resume Builder</h4>
                    <p className="text-sm text-gray-600">ATS-optimized templates</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Highlight */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 mb-8 text-white text-center">
              <p className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-90">Special Offer</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-xl opacity-90">/month</span>
              </div>
              <p className="text-sm opacity-90">Cancel anytime, no hidden fees</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4">
              <Link
                href="/pricing"
                className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl text-center transform hover:scale-105"
              >
                View Pricing & Subscribe
              </Link>
              <Link
                href="/dashboard"
                className="w-full px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all text-center"
              >
                ← Back to Dashboard
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Cancel Anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Instant Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User has access - render the children
  return <>{children}</>;
}
