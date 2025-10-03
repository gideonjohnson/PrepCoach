'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PRICING_TIERS } from '@/lib/pricing';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (tier: 'pro' | 'enterprise') => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || 'Failed to create checkout session. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              PrepCoach
            </Link>
            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg transition">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 transition">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg transition">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Perfect Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade as you grow. No credit card required for Free tier.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-orange-300 transition">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{PRICING_TIERS.free.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">${PRICING_TIERS.free.price}</span>
                <span className="text-gray-600">/{PRICING_TIERS.free.interval}</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {PRICING_TIERS.free.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/auth/signup">
              <button className="w-full px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition">
                Get Started Free
              </button>
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-2xl p-8 border-2 border-orange-600 transform scale-105 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
              MOST POPULAR
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{PRICING_TIERS.pro.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">${PRICING_TIERS.pro.price}</span>
                <span className="text-orange-100">/{PRICING_TIERS.pro.interval}</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {PRICING_TIERS.pro.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade('pro')}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : session ? 'Upgrade to Pro' : 'Start Pro Trial'}
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200 hover:border-purple-400 transition">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{PRICING_TIERS.enterprise.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">${PRICING_TIERS.enterprise.price}</span>
                <span className="text-gray-600">/{PRICING_TIERS.enterprise.interval}</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {PRICING_TIERS.enterprise.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade('enterprise')}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : session ? 'Upgrade to Enterprise' : 'Get Enterprise'}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens when I hit my Free tier limits?</h3>
              <p className="text-gray-600">You'll be notified when approaching your limits. You can upgrade to Pro for unlimited access or wait until next month.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a free trial for Pro?</h3>
              <p className="text-gray-600">Currently, all new users start on the Free tier. Contact us for Pro trial access.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
