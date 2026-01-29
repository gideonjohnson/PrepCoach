'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';

type CoachingPackage = {
  type: string;
  name: string;
  sessions: number;
  price: number;
  description: string;
  validDays: number;
  popular?: boolean;
};

function CoachingPageContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get('cancelled') === 'true';

  const [packages, setPackages] = useState<CoachingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/coaching/packages');
      const data = await response.json();
      setPackages(data.packages || []);
    } catch (err) {
      setError('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageType: string) => {
    if (!session) {
      window.location.href = '/api/auth/signin';
      return;
    }

    setPurchasing(packageType);
    setError('');

    try {
      const response = await fetch('/api/coaching/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Purchase failed');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            Coaching Packages
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Save money with bundled sessions. Get dedicated coaching from expert interviewers
            and accelerate your interview preparation.
          </p>
        </div>

        {cancelled && (
          <div className="mb-8 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-center">
            <p className="text-yellow-400">Your purchase was cancelled. You can try again anytime.</p>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.type}
              className={`relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-8 shadow-lg border-2 ${
                pkg.popular ? 'border-orange-500' : 'border-white/10'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">${(pkg.price / 100).toFixed(0)}</span>
                  <span className="text-gray-400">total</span>
                </div>
                <p className="text-green-400 text-sm mt-2">
                  ${((pkg.price / 100) / pkg.sessions).toFixed(0)}/session
                  <span className="text-gray-500 ml-2">(Save {Math.round((1 - (pkg.price / 100) / (pkg.sessions * 150)) * 100)}%)</span>
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  {pkg.sessions} expert interview sessions
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Valid for {pkg.validDays} days
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Choose any interviewer
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Session recordings included
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Written feedback after each session
                </li>
              </ul>

              <button
                onClick={() => handlePurchase(pkg.type)}
                disabled={purchasing === pkg.type}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {purchasing === pkg.type ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : (
                  'Get Started'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-2">How do coaching packages work?</h3>
              <p className="text-gray-400 text-sm">
                Purchase a package upfront and receive credits for multiple sessions. You can book sessions
                with any available interviewer and use your credits to pay.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Can I get a refund?</h3>
              <p className="text-gray-400 text-sm">
                Unused sessions can be refunded within 30 days of purchase. Partially used packages
                are refunded on a pro-rata basis minus a 10% processing fee.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-2">What happens if my package expires?</h3>
              <p className="text-gray-400 text-sm">
                You&apos;ll receive email reminders before expiration. Expired credits cannot be refunded,
                but you can contact support for a one-time extension if needed.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">
            Not ready for a package? You can also book individual sessions.
          </p>
          <Link
            href="/interviewers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700"
          >
            Browse Interviewers
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CoachingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CoachingPageContent />
    </Suspense>
  );
}
