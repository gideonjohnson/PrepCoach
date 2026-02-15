'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PRICING_TIERS, INTERVIEWER_TIERS, RECRUITER_TIERS } from '@/lib/pricing';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';

type Audience = 'seekers' | 'interviewers' | 'recruiters';

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Audience>('seekers');

  const handleUpgrade = async (tier: string) => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/pricing');
      return;
    }
    if (status === 'loading') return;

    setLoadingTier(tier);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
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

  const CheckIcon = ({ className = 'text-green-500' }: { className?: string }) => (
    <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const UpgradeButton = ({ tier, label, variant = 'primary' }: { tier: string; label: string; variant?: 'primary' | 'secondary' | 'outline' }) => {
    const isLoading = loadingTier === tier;
    const baseClasses = 'w-full px-6 py-3 sm:py-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px] text-base sm:text-lg';
    const variantClasses = {
      primary: 'bg-white text-orange-600 hover:bg-orange-50',
      secondary: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800',
      outline: 'bg-gray-800 text-white border-2 border-gray-600 hover:border-orange-500',
    };

    return (
      <button
        onClick={() => handleUpgrade(tier)}
        disabled={isLoading || status === 'loading'}
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {isLoading ? (<><LoadingSpinner /> Processing...</>) : (session ? label : 'Sign In to Subscribe')}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-black/50 backdrop-blur-xl border border-orange-500/30 rounded-full">
            <span className="text-orange-400 font-semibold text-sm">Transparent Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 px-4" style={{textShadow: '0 0 80px rgba(255,255,255,0.3)'}}>
            Choose Your <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse">Perfect Plan</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 px-4">
            Simple, transparent pricing for job seekers, interviewers, and recruiters.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-900/80 backdrop-blur-xl rounded-xl p-1.5 border border-white/10">
            {([
              { key: 'seekers' as Audience, label: 'Job Seekers', icon: '🎯' },
              { key: 'interviewers' as Audience, label: 'Interviewers', icon: '🎤' },
              { key: 'recruiters' as Audience, label: 'Recruiters', icon: '🏢' },
            ]).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-3 rounded-lg text-sm sm:text-base font-semibold transition-all ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ============================== */}
        {/* JOB SEEKERS SECTION */}
        {/* ============================== */}
        {activeTab === 'seekers' && (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {/* Free Tier */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{PRICING_TIERS.free.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">$0</span>
                  <span className="text-gray-500">/forever</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {PRICING_TIERS.free.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckIcon className="text-gray-500" />
                    <span className="text-gray-400">{feature}</span>
                  </li>
                ))}
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-500">No AI feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-500">No coding/system design</span>
                </li>
              </ul>
              <Link href="/auth/signup">
                <button className="w-full px-6 py-3 sm:py-4 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition min-h-[48px] text-base sm:text-lg">
                  Get Started Free
                </button>
              </Link>
            </div>

            {/* Pro Tier - Most Popular */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-orange-600 md:transform md:scale-105 relative transition-all duration-300 hover:shadow-3xl md:hover:scale-110">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
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
                    <CheckIcon className="text-yellow-300" />
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>
              <UpgradeButton tier="pro" label="Upgrade to Pro" variant="primary" />
            </div>

            {/* Enterprise Tier */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-xl">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{PRICING_TIERS.enterprise.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">${PRICING_TIERS.enterprise.price}</span>
                  <span className="text-gray-500">/{PRICING_TIERS.enterprise.interval}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {PRICING_TIERS.enterprise.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckIcon className="text-purple-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <UpgradeButton tier="enterprise" label="Upgrade to Enterprise" variant="secondary" />
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* INTERVIEWERS SECTION */}
        {/* ============================== */}
        {activeTab === 'interviewers' && (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-400 max-w-2xl mx-auto">
                Get listed in our interviewer directory. Set your own session rates &mdash; platform takes 20%. Your listing tier controls visibility and features.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
              {(Object.entries(INTERVIEWER_TIERS) as [string, typeof INTERVIEWER_TIERS[keyof typeof INTERVIEWER_TIERS]][]).map(([key, tier]) => {
                const isPopular = 'popular' in tier && tier.popular;
                return (
                  <div
                    key={key}
                    className={`rounded-2xl shadow-lg p-6 sm:p-8 border-2 transition-all duration-300 relative ${
                      isPopular
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 border-orange-600 md:transform md:scale-105 hover:shadow-3xl md:hover:scale-110'
                        : 'bg-gray-900/80 backdrop-blur-xl border-white/10 hover:border-white/20'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                        MOST POPULAR
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-white'}`}>{tier.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-bold ${isPopular ? 'text-white' : 'text-white'}`}>${tier.price}</span>
                        <span className={isPopular ? 'text-orange-100' : 'text-gray-500'}>/{tier.interval}</span>
                      </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckIcon className={isPopular ? 'text-yellow-300' : 'text-orange-500'} />
                          <span className={isPopular ? 'text-white' : 'text-gray-300'}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <UpgradeButton
                      tier={key}
                      label={`Choose ${tier.name}`}
                      variant={isPopular ? 'primary' : 'outline'}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ============================== */}
        {/* RECRUITERS SECTION */}
        {/* ============================== */}
        {activeTab === 'recruiters' && (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-400 max-w-2xl mx-auto">
                Access our talent pool of interview-ready candidates. Credits let you connect with candidates directly.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
              {(Object.entries(RECRUITER_TIERS) as [string, typeof RECRUITER_TIERS[keyof typeof RECRUITER_TIERS]][]).map(([key, tier]) => {
                const isPopular = 'popular' in tier && tier.popular;
                return (
                  <div
                    key={key}
                    className={`rounded-2xl shadow-lg p-6 sm:p-8 border-2 transition-all duration-300 relative ${
                      isPopular
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 border-orange-600 md:transform md:scale-105 hover:shadow-3xl md:hover:scale-110'
                        : 'bg-gray-900/80 backdrop-blur-xl border-white/10 hover:border-white/20'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                        MOST POPULAR
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-white'}`}>{tier.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-bold ${isPopular ? 'text-white' : 'text-white'}`}>${tier.price}</span>
                        <span className={isPopular ? 'text-orange-100' : 'text-gray-500'}>/{tier.interval}</span>
                      </div>
                      <p className={`text-sm mt-2 ${isPopular ? 'text-orange-100' : 'text-gray-500'}`}>
                        {tier.credits} credits/month &bull; Extra credits ${tier.extraCreditPrice}/ea
                      </p>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckIcon className={isPopular ? 'text-yellow-300' : 'text-blue-500'} />
                          <span className={isPopular ? 'text-white' : 'text-gray-300'}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <UpgradeButton
                      tier={key}
                      label={`Choose ${tier.name}`}
                      variant={isPopular ? 'primary' : 'outline'}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* FAQ Section */}
        <div className="mt-16 sm:mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4 px-4">
            Frequently Asked <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-center text-gray-400 mb-8 sm:mb-12 px-4">Everything you need to know about our pricing and plans</p>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 ml-8">
                Yes! You can upgrade or downgrade your plan at any time. When you upgrade, you&apos;ll get immediate access to all the features.
                When you downgrade, changes take effect at the end of your current billing period.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                What happens when I hit my Free tier limits?
              </h3>
              <p className="text-gray-600 ml-8">
                Free tier users get 3 total questions in 1 role. Once you&apos;ve used all 3 questions, you can upgrade to Pro ($19/mo) for unlimited access
                to all roles, AI feedback, coding practice, and more.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                How do interviewer listing tiers work?
              </h3>
              <p className="text-gray-600 ml-8">
                Your listing tier controls your visibility in our directory and the number of active listings you can have.
                You still set your own per-session rates for candidates &mdash; the platform takes a 20% commission on sessions.
                Higher tiers give you featured placement and better search ranking.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                What are recruiter credits?
              </h3>
              <p className="text-gray-600 ml-8">
                Each credit allows you to connect with one candidate from our talent pool. Credits are included monthly with your subscription.
                Need more? You can purchase extra credits at your tier&apos;s rate ($10-$20 per credit depending on plan).
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600 ml-8">
                Absolutely! Cancel anytime from your account settings. You&apos;ll keep access until the end of your billing period.
                We also offer a 7-day money-back guarantee on all plans.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="text-orange-500 text-xl">Q:</span>
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 ml-8">
                We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor Stripe.
                All payments are encrypted and secure.
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
