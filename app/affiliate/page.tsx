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
      color: 'from-blue-500 via-cyan-500 to-blue-600',
      glow: 'shadow-blue-500/50',
    },
    {
      referrals: '11-50',
      commission: '25%',
      example: '$625/month',
      color: 'from-purple-500 via-pink-500 to-purple-600',
      badge: 'Popular',
      glow: 'shadow-purple-500/50',
    },
    {
      referrals: '51+',
      commission: '30%',
      example: '$1,500+/month',
      color: 'from-orange-500 via-red-500 to-orange-600',
      badge: 'Top Earner',
      glow: 'shadow-orange-500/50',
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Navigation />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto text-center">
          {/* Floating Badge */}
          <div className="inline-block mb-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <span className="relative px-6 py-3 bg-black/50 backdrop-blur-xl border border-orange-500/30 text-orange-400 rounded-full text-sm font-bold tracking-wider uppercase shadow-lg shadow-orange-500/20">
              Earn Generous Commissions
            </span>
          </div>

          {/* Hero Title with 3D Effect */}
          <h1 className="text-6xl sm:text-7xl font-black mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl" style={{ textShadow: '0 0 80px rgba(255,255,255,0.3)' }}>
              Join the PrepCoach
            </span>
            <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse" style={{ textShadow: '0 0 80px rgba(251,146,60,0.5)' }}>
              Affiliate Program
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Earn up to <strong className="text-orange-400 font-bold">30% recurring commissions</strong> by helping professionals ace their interviews
            and advance their careers. Average affiliate earns <strong className="text-orange-400 font-bold">$2,400+ annually</strong>.
          </p>

          {/* CTA Buttons with Glossy Effect */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/contact?subject=affiliate"
              className="group relative px-12 py-5 overflow-hidden rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 group-hover:from-orange-400 group-hover:via-red-400 group-hover:to-pink-400 transition-all"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-orange-300/20 via-transparent to-pink-300/20 blur-xl"></div>
              <span className="relative text-white drop-shadow-lg">Apply Now - It&apos;s Free</span>
            </Link>
            <a
              href="#how-it-works"
              className="group relative px-12 py-5 bg-white/5 backdrop-blur-xl border-2 border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300 shadow-lg shadow-white/5"
            >
              See How It Works
            </a>
          </div>

          <p className="text-gray-500 text-sm mt-8 flex items-center justify-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">No approval needed</span>
            <span className="px-3 py-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">Instant access</span>
            <span className="px-3 py-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">90-day cookie</span>
            <span className="px-3 py-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">Monthly payouts</span>
          </p>
        </div>
      </div>

      {/* Commission Tiers - 3D Cards */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6" style={{ textShadow: '0 0 60px rgba(255,255,255,0.2)' }}>
              Earnings That <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Scale With You</span>
            </h2>
            <p className="text-xl text-gray-400">
              The more you refer, the higher your commission rate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10" style={{ perspective: '1500px' }}>
            {commissionTiers.map((tier, idx) => (
              <div
                key={idx}
                className="group relative transform hover:scale-105 transition-all duration-500 hover:-translate-y-4"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${tier.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${tier.glow}`}></div>

                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-3xl border-2 border-white/10 p-10 overflow-hidden">
                  {/* Glass Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                  {tier.badge && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${tier.color} rounded-full blur-lg`}></div>
                        <span className={`relative px-6 py-2 bg-gradient-to-r ${tier.color} text-white rounded-full text-sm font-black shadow-2xl border border-white/20`}>
                          {tier.badge}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Commission Icon */}
                  <div className="relative mb-8">
                    <div className={`absolute inset-0 bg-gradient-to-r ${tier.color} rounded-3xl blur-xl opacity-50`}></div>
                    <div className={`relative w-24 h-24 bg-gradient-to-r ${tier.color} rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-white/20 group-hover:rotate-6 transition-transform duration-500`}>
                      <span className="text-4xl font-black text-white drop-shadow-lg">{tier.commission}</span>
                    </div>
                  </div>

                  <h3 className="text-3xl font-black text-white text-center mb-3">
                    {tier.referrals} <span className="text-gray-400 text-xl">Referrals</span>
                  </h3>
                  <p className="text-gray-400 text-center mb-8 font-semibold">
                    {tier.commission} recurring commission
                  </p>

                  {/* Earnings Display */}
                  <div className="relative p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                    <p className="relative text-sm text-gray-500 mb-2 uppercase tracking-wider font-bold">Potential Earnings</p>
                    <p className={`relative text-4xl font-black bg-gradient-to-r ${tier.color} bg-clip-text text-transparent drop-shadow-lg`}>
                      {tier.example}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Example Calculation */}
          <div className="mt-16 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative text-center p-10 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-2xl rounded-3xl border-2 border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
              <p className="relative text-xl text-gray-300 leading-relaxed">
                <strong className="text-white">Example:</strong> Refer 25 customers to our Pro plan ($25/month) and earn{' '}
                <strong className="text-orange-400 text-2xl">$156.25/month</strong> in recurring commissions = <strong className="text-orange-400 text-2xl">$1,875/year</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6" style={{ textShadow: '0 0 60px rgba(255,255,255,0.2)' }}>
              Why Join Our <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Affiliate Program</span>
            </h2>
            <p className="text-xl text-gray-400">
              Industry-leading commissions and unmatched support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="group relative transform hover:scale-105 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Neon Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>

                {/* Card */}
                <div className="relative bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden h-full">
                  {/* Glass Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50"></div>
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                  {/* Icon with Glow */}
                  <div className="relative mb-6">
                    <div className="text-6xl drop-shadow-2xl filter brightness-110 group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                  </div>

                  <h3 className="relative text-2xl font-black text-white mb-4 group-hover:text-orange-400 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="relative text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6" style={{ textShadow: '0 0 60px rgba(255,255,255,0.2)' }}>
              How It <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-400">
              Start earning in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {howItWorks.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Step Card */}
                <div className="flex flex-col items-center text-center transform hover:scale-110 transition-all duration-500 hover:-translate-y-4">
                  {/* Step Number with 3D Effect */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20 group-hover:rotate-12 transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}>
                      <span className="text-3xl font-black text-white drop-shadow-lg">{item.step}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-white mb-3 group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Connecting Line */}
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-1 -z-10">
                    <div className="h-full bg-gradient-to-r from-orange-500/50 via-red-500/30 to-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/contact?subject=affiliate"
              className="group relative inline-block px-14 py-6 overflow-hidden rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 blur-2xl"></div>
              </div>
              <span className="relative text-white drop-shadow-2xl">Get Started Today</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Who Can Join */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6" style={{ textShadow: '0 0 60px rgba(255,255,255,0.2)' }}>
              Who Should <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Join?</span>
            </h2>
            <p className="text-xl text-gray-400">
              Perfect for anyone helping professionals advance their careers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whoCanJoin.map((item, idx) => (
              <div
                key={idx}
                className="group relative transform hover:scale-105 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Glow Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity"></div>

                {/* Card */}
                <div className="relative bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/10 group-hover:border-orange-500/40 transition-all overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>

                  <div className="relative text-5xl mb-5 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    {item.emoji}
                  </div>
                  <h3 className="relative text-xl font-black text-white mb-3 group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="relative text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6" style={{ textShadow: '0 0 60px rgba(255,255,255,0.2)' }}>
              Frequently Asked <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          <div className="space-y-6">
            {faq.map((item, idx) => (
              <div
                key={idx}
                className="group relative transform hover:scale-[1.02] transition-all duration-300"
              >
                {/* Card Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>

                {/* FAQ Card */}
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                  <h3 className="relative text-2xl font-black text-white mb-4 group-hover:text-orange-400 transition-colors">
                    {item.question}
                  </h3>
                  <p className="relative text-gray-300 leading-relaxed text-lg">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          {/* Mega Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-red-500/30 to-pink-500/30 rounded-[3rem] blur-3xl opacity-50"></div>

          <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-[3rem] p-16 border-2 border-white/20 overflow-hidden text-center">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>

            <h2 className="relative text-5xl font-black text-white mb-8" style={{ textShadow: '0 0 60px rgba(255,255,255,0.3)' }}>
              Ready to Start <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Earning?</span>
            </h2>
            <p className="relative text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join hundreds of affiliates already earning passive income by helping professionals
              succeed in their careers. No approval process - start promoting today!
            </p>

            <div className="relative flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/contact?subject=affiliate"
                className="group relative px-14 py-6 overflow-hidden rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 bg-white/20 blur-2xl"></div>
                </div>
                <span className="relative text-white drop-shadow-2xl">Join the Affiliate Program</span>
              </Link>
              <Link
                href="/contact"
                className="group relative px-14 py-6 bg-white/5 backdrop-blur-xl border-2 border-white/30 text-white rounded-2xl font-black text-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Have Questions? Contact Us
              </Link>
            </div>

            <p className="relative text-gray-500 text-sm mt-10 flex items-center justify-center gap-3 flex-wrap">
              <span className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">Average response time: 24 hours</span>
              <span className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">Dedicated affiliate support</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-black/50 backdrop-blur-xl border-t border-white/10 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <span className="text-3xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
              PrepCoach
            </span>
          </div>
          <p className="text-gray-400 mb-3 text-lg">
            Building the future of career development with AI
          </p>
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} PrepCoach. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
