'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PRICING_TIERS } from '@/lib/pricing';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleUpgrade = async (tier: 'pro' | 'enterprise') => {
    // Check authentication
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/pricing');
      return;
    }

    if (status === 'loading') {
      return;
    }

    setLoadingTier(tier);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session. Please try again.');
        setLoadingTier(null);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('An error occurred. Please try again.');
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full">
            <span className="text-orange-600 font-semibold text-sm">Transparent Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 px-4">
            Choose Your <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Perfect Plan</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 px-4">
            Simple, transparent pricing. Start practicing today with our free tier, upgrade when you're ready.
          </p>

          {/* Hero Image */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=400&fit=crop"
                alt="Professional team celebrating success"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-purple-500/80 flex items-center justify-center">
                <div className="text-center text-white px-6">
                  <p className="text-3xl md:text-4xl font-bold mb-2">Start Your Success Story Today</p>
                  <p className="text-lg md:text-xl opacity-90">Join thousands of candidates landing their dream jobs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* Pro Tier - Most Popular */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-orange-600 md:transform md:scale-105 relative transition-all duration-300 hover:shadow-3xl md:hover:scale-110">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
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
              disabled={loadingTier === 'pro' || status === 'loading'}
              className="w-full px-6 py-3 sm:py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px] text-base sm:text-lg"
            >
              {loadingTier === 'pro' ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                session ? 'Upgrade to Pro' : 'Sign In to Upgrade'
              )}
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-xl">
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
              disabled={loadingTier === 'enterprise' || status === 'loading'}
              className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px] text-base sm:text-lg"
            >
              {loadingTier === 'enterprise' ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                session ? 'Upgrade to Enterprise' : 'Sign In to Upgrade'
              )}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 sm:mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4 px-4">
            Frequently Asked <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 px-4">Everything you need to know about our pricing and plans</p>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 ml-8">
                Yes! You can upgrade or downgrade your plan at any time. When you upgrade, you'll get immediate access to all the features.
                When you downgrade, changes take effect at the end of your current billing period, so you won't lose access to features you've already paid for.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                What happens when I hit my Free tier limits?
              </h3>
              <p className="text-gray-600 ml-8">
                You'll be notified when you're approaching your monthly limits (3 interviews and 5 AI feedback requests).
                Once you hit your limits, you can either wait until next month when they reset, or upgrade to Pro for unlimited access to both features.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                Is there a free trial for Pro or Enterprise?
              </h3>
              <p className="text-gray-600 ml-8">
                All new users start on our Free tier, which gives you a great taste of PrepCoach with 3 interviews and 5 AI feedback requests per month.
                This lets you experience the platform before committing to a paid plan. For enterprise trials, please contact our sales team.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 ml-8">
                We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor Stripe.
                All payments are encrypted and secure. We do not store your payment information on our servers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600 ml-8">
                Absolutely! You can cancel your subscription at any time from your account settings. When you cancel, you'll continue to have access
                to your paid features until the end of your current billing period. After that, you'll automatically be moved to the Free tier.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                Is my data secure?
              </h3>
              <p className="text-gray-600 ml-8">
                Yes! We take data security very seriously. All your interview recordings, transcriptions, and personal data are encrypted both
                in transit and at rest. We comply with industry-standard security practices and never share your data with third parties without your explicit consent.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                What's the difference between Pro and Enterprise?
              </h3>
              <p className="text-gray-600 ml-8">
                Pro is perfect for individual job seekers who want unlimited practice. Enterprise is designed for teams and organizations,
                offering team management features for up to 10 users, company-specific interview preparation, dedicated support, and custom integrations.
                If you're a career coach, recruiting agency, or company training your employees, Enterprise is the right choice.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 ml-8">
                We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied with PrepCoach within the first 7 days of your subscription,
                contact our support team and we'll issue a full refund, no questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            Our team is here to help you choose the right plan and get the most out of PrepCoach
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup">
              <button className="px-8 py-3 bg-white text-orange-600 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105">
                Start Free Trial
              </button>
            </Link>
            <a href="mailto:support@prepcoach.ai">
              <button className="px-8 py-3 bg-orange-600 text-white rounded-full font-semibold border-2 border-white hover:bg-orange-700 transition">
                Contact Support
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">PrepCoach</h3>
              <p className="text-gray-400">Your AI-powered interview preparation platform</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/practice" className="hover:text-white transition">Practice</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/resume-builder" className="hover:text-white transition">Resume Builder</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition">About</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
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
