'use client';

import { useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function WelcomeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get role from session or URL param (for OAuth users who haven't refreshed session yet)
  const urlRole = searchParams.get('role');
  const role = session?.user?.role || (urlRole === 'interviewer' ? 'interviewer' : urlRole === 'recruiter' ? 'recruiter' : 'user');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  // Role-specific content
  const getRoleContent = () => {
    switch (role) {
      case 'interviewer':
        return {
          icon: (
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
          gradient: 'from-blue-500 to-purple-600',
          borderColor: 'border-blue-500/30',
          title: 'Welcome, Expert Interviewer!',
          subtitle: 'Complete your interviewer profile to start earning',
          description: 'Set up your profile, verify your expertise, and start conducting paid mock interviews. Earn $50-500/hour helping candidates succeed.',
          benefits: [
            { title: 'Flexible Schedule', desc: 'Work on your own time' },
            { title: 'Competitive Pay', desc: '$50-500/hour' },
            { title: 'Help Others', desc: 'Share your expertise' },
            { title: 'Build Reputation', desc: 'Get verified badge' },
          ],
          cta: { text: 'Set Up Profile', href: '/interviewer/register' },
          secondary: { text: 'View Dashboard', href: '/dashboard' },
        };
      case 'recruiter':
        return {
          icon: (
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
          gradient: 'from-green-500 to-emerald-600',
          borderColor: 'border-green-500/30',
          title: 'Welcome, Recruiter!',
          subtitle: 'Set up your company profile to access pre-vetted talent',
          description: 'Register your company to browse our talent pool of engineers with verified interview performance scores.',
          benefits: [
            { title: 'Pre-Vetted Candidates', desc: 'Verified interview scores' },
            { title: 'Save Time', desc: 'Skip initial screening' },
            { title: 'Quality Hires', desc: 'Proven interview skills' },
            { title: 'Diverse Talent', desc: 'All experience levels' },
          ],
          cta: { text: 'Register Company', href: '/recruiter/register' },
          secondary: { text: 'Browse Talent', href: '/talent/search' },
        };
      default:
        return {
          icon: (
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          ),
          gradient: 'from-orange-500 to-red-500',
          borderColor: 'border-orange-500/30',
          title: 'Welcome to PrepCoach!',
          subtitle: 'Your account has been created successfully',
          description: 'Start practicing with AI-powered mock interviews and get instant feedback to ace your next interview.',
          benefits: [
            { title: '350+ Role-Specific Questions', desc: 'Practice for any position' },
            { title: 'Real-Time AI Feedback', desc: 'Improve with every answer' },
            { title: 'Audio & Video Recording', desc: 'Review your performance' },
            { title: 'Performance Analytics', desc: 'Track your progress' },
          ],
          cta: { text: 'Go to Dashboard', href: '/dashboard' },
          secondary: { text: 'Browse Expert Interviewers', href: '/interviewers' },
        };
    }
  };

  const content = getRoleContent();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Welcome Icon */}
        <div className={`mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-r ${content.gradient} mb-8 animate-bounce shadow-2xl`}>
          {content.icon}
        </div>

        {/* Welcome Message */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          {content.title.split('PrepCoach').map((part, i) =>
            i === 0 ? part : <><span className={`bg-gradient-to-r ${content.gradient} bg-clip-text text-transparent`}>PrepCoach</span>{part}</>
          )}
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          {session?.user?.name ? `Hi ${session.user.name}! ` : 'Hi! '}
          {content.subtitle}
        </p>

        {/* Next Steps */}
        <div className={`bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl shadow-lg p-8 mb-8 border-2 ${content.borderColor}`}>
          <h2 className="text-2xl font-bold text-white mb-4">What&apos;s Next</h2>
          <p className="text-gray-300 mb-6">
            {content.description}
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
            {content.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <svg className={`w-6 h-6 mt-0.5 flex-shrink-0 bg-gradient-to-r ${content.gradient} rounded-full p-1`} fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-semibold text-white">{benefit.title}</h3>
                  <p className="text-sm text-gray-400">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={content.cta.href}>
            <button className={`w-full sm:w-auto px-8 py-4 bg-gradient-to-r ${content.gradient} text-white rounded-lg text-lg font-semibold hover:shadow-lg hover:scale-105 transition-all`}>
              {content.cta.text}
            </button>
          </Link>
          <Link href={content.secondary.href}>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-xl text-white border-2 border-white/20 rounded-lg text-lg font-semibold hover:bg-white/10 hover:border-white/40 transition-all">
              {content.secondary.text}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    }>
      <WelcomeContent />
    </Suspense>
  );
}
