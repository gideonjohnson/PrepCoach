import type { Metadata } from 'next';
import Navigation from '../components/Navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Affiliate Program - Earn with PrepCoach',
  description: 'Join the PrepCoach affiliate program and earn generous commissions by helping professionals advance their careers. Up to 30% recurring revenue share.',
};

export default function AffiliatePage() {
  const benefits = [
    {
      icon: '💰',
      title: '30% Recurring Commission',
      description: 'Earn 30% commission on all payments from referred customers for 12 months. Average affiliate earns $2,400+ annually.',
    },
    {
      icon: '🎯',
      title: '90-Day Cookie Duration',
      description: 'Long cookie window ensures you get credit for conversions up to 90 days after initial click.',
    },
    {
      icon: '📊',
      title: 'Real-Time Analytics',
      description: 'Track clicks, conversions, and earnings in real-time through your dedicated affiliate dashboard.',
    },
    {
      icon: '💳',
      title: 'Monthly Payouts',
      description: 'Receive payments via PayPal, bank transfer, or Stripe. Minimum payout threshold of just $50.',
    },
    {
      icon: '🎨',
      title: 'Marketing Materials',
      description: 'Access professional banners, email templates, social media content, and landing pages.',
    },
    {
      icon: '👥',
      title: 'Dedicated Support',
      description: 'Get personalized support from our affiliate team to maximize your earnings.',
    },
  ];

  const whoCanJoin = [
    {
      title: 'Career Coaches & Consultants',
      description: 'Help your clients prepare for interviews while earning passive income.',
      emoji: '👔',
    },
    {
      title: 'Content Creators & Bloggers',
      description: 'Monetize your career development content and audience.',
      emoji: '✍️',
    },
    {
      title: 'Online Communities & Forums',
      description: 'Add value to your community while generating revenue.',
      emoji: '💬',
    },
    {
      title: 'Educational Institutions',
      description: 'Support your students and alumni with career resources.',
      emoji: '🎓',
    },
    {
      title: 'HR Professionals & Recruiters',
      description: 'Prepare candidates for interviews and earn commissions.',
      emoji: '🤝',
    },
    {
      title: 'Anyone Passionate About Careers',
      description: 'If you believe in helping others succeed, join us!',
      emoji: '🚀',
    },
  ];

  const commissionTiers = [
    {
      referrals: '1-10',
      commission: '20%',
      example: '$100/month',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      referrals: '11-50',
      commission: '25%',
      example: '$625/month',
      color: 'from-purple-500 to-pink-500',
      badge: 'Popular',
    },
    {
      referrals: '51+',
      commission: '30%',
      example: '$1,500+/month',
      color: 'from-orange-500 to-red-500',
      badge: 'Top Earner',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Sign Up Free',
      description: 'Create your affiliate account in under 2 minutes. No approval process - start immediately.',
    },
    {
      step: '2',
      title: 'Get Your Link',
      description: 'Receive your unique referral link and access marketing materials from your dashboard.',
    },
    {
      step: '3',
      title: 'Share & Promote',
      description: 'Share PrepCoach with your audience through your blog, social media, email, or community.',
    },
    {
      step: '4',
      title: 'Earn Commissions',
      description: 'Get paid 30% recurring commission for every customer who subscribes through your link.',
    },
  ];

  const faq = [
    {
      question: 'How much can I realistically earn?',
      answer: 'Top affiliates earn $3,000-$10,000/month. Average active affiliates earn $500-$2,000/month. Your earnings depend on your audience size and promotion efforts. With just 20 Pro subscribers ($25/month), you earn $150/month recurring.',
    },
    {
      question: 'When and how do I get paid?',
      answer: 'Payments are processed monthly via PayPal, bank transfer, or Stripe on the 15th of each month. Minimum payout is $50. You can track your earnings in real-time through your dashboard.',
    },
    {
      question: 'How long do I earn commissions?',
      answer: 'You earn 30% commission on all payments from your referred customers for 12 months from their signup date. If they remain subscribed for a year, that is 12 months of recurring income for you!',
    },
    {
      question: 'Do I need to be a PrepCoach customer?',
      answer: 'No! While we encourage experiencing the product firsthand, it is not required to join our affiliate program. However, many successful affiliates are also users.',
    },
    {
      question: 'What marketing support do you provide?',
      answer: 'We provide banner ads, email templates, social media graphics, landing pages, product screenshots, promotional copy, and dedicated affiliate support. New materials are added monthly.',
    },
    {
      question: 'Can I promote through paid advertising?',
      answer: 'Yes! You can use Google Ads, Facebook Ads, LinkedIn Ads, and other paid channels. We only prohibit brand bidding (bidding on "PrepCoach" as a keyword) and trademark infringement.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <Navigation />

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold tracking-wide uppercase">
              Earn Generous Commissions
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Join the PrepCoach
            <span className="block">Affiliate Program</span>
          </h1>
          <p className="text-xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed">
            Earn up to <strong>30% recurring commissions</strong> by helping professionals ace their interviews
            and advance their careers. Average affiliate earns <strong>$2,400+ annually</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact?subject=affiliate"
              className="px-10 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Apply Now - It&apos;s Free
            </Link>
            <a
              href="#how-it-works"
              className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300"
            >
              See How It Works
            </a>
          </div>
          <p className="text-white/90 text-sm mt-6">
            No approval needed • Instant access • 90-day cookie • Monthly payouts
          </p>
        </div>
      </div>

      {/* Commission Tiers */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Earnings That Scale With You
            </h2>
            <p className="text-xl text-gray-600">
              The more you refer, the higher your commission rate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {commissionTiers.map((tier, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-3xl border-2 border-gray-200 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-bold shadow-lg">
                      {tier.badge}
                    </span>
                  </div>
                )}
                <div className={`w-16 h-16 bg-gradient-to-r ${tier.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <span className="text-3xl font-bold text-white">{tier.commission}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  {tier.referrals} Referrals
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  {tier.commission} recurring commission
                </p>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Potential Earnings</p>
                  <p className={`text-3xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                    {tier.example}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
            <p className="text-lg text-gray-700">
              <strong>Example:</strong> Refer 25 customers to our Pro plan ($25/month) and earn{' '}
              <strong className="text-orange-600">$156.25/month</strong> in recurring commissions = <strong className="text-orange-600">$1,875/year</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Join Our Affiliate Program
            </h2>
            <p className="text-xl text-gray-600">
              Industry-leading commissions and unmatched support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start earning in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-orange-300 to-transparent -z-10" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/contact?subject=affiliate"
              className="inline-block px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </div>

      {/* Who Can Join */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Who Should Join?
            </h2>
            <p className="text-xl text-gray-600">
              Perfect for anyone helping professionals advance their careers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whoCanJoin.map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-orange-400 transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faq.map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-white/95 mb-8 leading-relaxed">
            Join hundreds of affiliates already earning passive income by helping professionals
            succeed in their careers. No approval process - start promoting today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?subject=affiliate"
              className="px-10 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Join the Affiliate Program
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300"
            >
              Have Questions? Contact Us
            </Link>
          </div>
          <p className="text-white/90 text-sm mt-6">
            Average response time: 24 hours • Dedicated affiliate support
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              PrepCoach
            </span>
          </div>
          <p className="text-gray-400 mb-2">
            Building the future of career development with AI
          </p>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} PrepCoach. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
