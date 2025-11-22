import type { Metadata } from 'next';
import Navigation from '../components/Navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers - Join PrepCoach',
  description: 'Exceptional opportunities for exceptional talent. Shape the future of AI-powered career development.',
};

export default function CareersPage() {
  const positions = [
    {
      id: 1,
      title: 'Head of Product Development',
      type: 'Full-time',
      location: 'Remote (Global)',
      department: 'Product & Strategy',
      salary: 'Competitive + Equity',
      description:
        'An exceptional opportunity for a visionary product leader to define and execute the product strategy for a rapidly scaling AI-powered platform. You will lead the evolution of PrepCoach from an innovative interview preparation tool into the definitive career advancement platform trusted by professionals worldwide.',
      overview:
        'PrepCoach is at an inflection point. With thousands of users trusting our platform to advance their careers, we are seeking a strategic product leader who can translate market insights and technological possibilities into breakthrough products. This is not a conventional product role—you will shape the future of how professionals prepare for career transitions, working at the intersection of AI innovation, behavioral psychology, and user experience.',
      responsibilities: [
        'Define and own the end-to-end product vision and roadmap, balancing innovation with commercial viability',
        'Lead cross-functional teams through the complete product lifecycle from ideation to market success',
        'Establish data-driven frameworks for prioritization, leveraging user analytics, market research, and competitive intelligence',
        'Drive AI/ML integration strategy to deliver differentiated user experiences that competitors cannot replicate',
        'Build and mentor a high-performing product organization as the company scales',
        'Partner with executive leadership to align product strategy with business objectives and growth targets',
        'Champion user-centric design thinking while maintaining focus on business metrics and outcomes',
        'Establish product development processes that enable rapid iteration without compromising quality',
      ],
      requirements: [
        '7+ years of product management experience with at least 3 years in senior leadership roles',
        'Proven track record of launching and scaling B2C or B2B SaaS products that achieved significant market traction',
        'Deep understanding of AI/ML capabilities and how to translate them into compelling product features',
        'Strong analytical acumen with experience using data to drive product decisions and measure success',
        'Demonstrated ability to work effectively with engineering, design, marketing, and sales teams',
        'Experience managing complex product portfolios and making difficult trade-off decisions',
        'Exceptional communication skills with ability to influence stakeholders at all levels',
        'Strategic thinker with strong execution capabilities and bias for action',
      ],
      niceToHave: [
        'Previous experience in EdTech, HR Tech, or career development platforms',
        'Technical background with understanding of modern development frameworks',
        'Experience building products with AI/ML at their core (NLP, computer vision, recommendation systems)',
        'Track record of successful product exits or IPO experience',
        'International market expansion experience',
        'MBA or advanced degree in related field',
      ],
      whatWeOffer: [
        'Competitive base salary with significant equity upside in a high-growth company',
        'Autonomy to shape product direction and build your team',
        'Direct partnership with founders and executive team',
        'Flexible remote work arrangement with annual team offsites',
        'Professional development budget and conference attendance',
        'Comprehensive health benefits and wellness allowance',
      ],
    },
    {
      id: 2,
      title: 'Growth & Customer Success Lead',
      type: 'Full-time',
      location: 'Remote (Global)',
      department: 'Growth & Operations',
      salary: 'Competitive + Performance Incentives',
      description:
        'A career-defining opportunity to drive exponential growth and build world-class customer success operations for an AI platform transforming how professionals advance their careers. You will architect and execute strategies that turn users into advocates while scaling operations to support thousands of paying customers.',
      overview:
        'This dual-mandate role is ideal for a rare individual who combines growth marketing acumen with customer success excellence. You will own the complete user journey—from acquisition through activation, retention, and advocacy. As PrepCoach scales, you will build the systems, processes, and team that enable sustainable growth while maintaining the exceptional customer experience that defines our brand.',
      responsibilities: [
        'Design and execute multi-channel growth strategies across digital marketing, partnerships, content, and community',
        'Build and optimize conversion funnels from awareness through paid subscription, achieving aggressive CAC and LTV targets',
        'Establish customer success frameworks that drive product adoption, engagement, and long-term retention',
        'Create scalable onboarding experiences that demonstrate value within the first user session',
        'Develop customer segmentation strategies to deliver personalized experiences that maximize lifetime value',
        'Implement data infrastructure for tracking growth metrics, customer health scores, and success KPIs',
        'Build strategic partnership programs with universities, bootcamps, and corporate training organizations',
        'Lead customer advocacy initiatives including testimonials, case studies, and referral programs',
        'Analyze user behavior patterns to identify expansion opportunities and reduce churn',
        'Scale the growth and customer success functions through strategic hiring and team development',
      ],
      requirements: [
        '5+ years in growth marketing, customer success, or growth operations roles with proven results',
        'Track record of achieving significant user growth and revenue targets in B2C or B2B SaaS',
        'Deep expertise in digital marketing channels including SEO, SEM, social media, email, and content marketing',
        'Experience building customer success operations from early stage through scale',
        'Strong analytical skills with proficiency in analytics tools (Google Analytics, Mixpanel, Amplitude, etc.)',
        'Data-driven decision maker who balances quantitative metrics with qualitative customer insights',
        'Experience managing customer success or account management teams',
        'Excellent communication skills and ability to build relationships with diverse stakeholders',
        'Self-starter with entrepreneurial mindset and comfort operating in ambiguous environments',
      ],
      niceToHave: [
        'Previous experience in EdTech, career services, or professional development industries',
        'Hands-on experience with marketing automation platforms (HubSpot, Marketo, etc.)',
        'Background in community building and user engagement strategies',
        'Experience with subscription business models and cohort analysis',
        'Knowledge of AI/ML applications in marketing and customer success',
        'International market expansion and localization experience',
        'Experience with enterprise B2B sales and account management',
      ],
      whatWeOffer: [
        'Competitive base salary with performance-based incentives tied to growth metrics',
        'Significant equity ownership with potential for substantial value creation',
        'Budget and autonomy to build your growth and customer success stack',
        'Direct access to founders and voice in company strategy',
        'Flexible remote work with results-oriented culture',
        'Professional development opportunities and conference budget',
        'Comprehensive benefits including health coverage and wellness programs',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50">
      <Navigation />

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                Exceptional Opportunities
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Shape the Future of
              <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Career Development
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join a mission-driven team building AI technology that empowers thousands of
              professionals to advance their careers. We are seeking extraordinary individuals who
              combine strategic thinking with exceptional execution.
            </p>
          </div>
        </div>
      </div>

      {/* Company Value Props */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Exceptional Talent Chooses PrepCoach
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Market-Leading Technology</h3>
              <p className="text-gray-600 leading-relaxed">
                Build at the cutting edge of AI, working with the latest language models, real-time
                processing, and behavioral analytics
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Meaningful Impact</h3>
              <p className="text-gray-600 leading-relaxed">
                Your work directly influences career outcomes for thousands of professionals seeking
                advancement and opportunity
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M trending-up M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Exceptional Growth</h3>
              <p className="text-gray-600 leading-relaxed">
                Significant equity upside, rapid career progression, and the opportunity to shape
                strategy as we scale
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Current Opportunities</h2>
            <p className="text-lg text-gray-600">
              We are selective in our hiring. Each role represents an opportunity to make a
              defining impact on our mission and trajectory.
            </p>
          </div>

          <div className="space-y-8">
            {positions.map((position) => (
              <div
                key={position.id}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="p-10">
                  {/* Header */}
                  <div className="mb-8 pb-8 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                      <div className="mb-4 sm:mb-0">
                        <h3 className="text-3xl font-bold text-gray-900 mb-3">
                          {position.title}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          <span className="px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                            {position.type}
                          </span>
                          <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            {position.location}
                          </span>
                          <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                            {position.department}
                          </span>
                          <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            {position.salary}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">
                      {position.description}
                    </p>
                  </div>

                  {/* Overview */}
                  <div className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">The Opportunity</h4>
                    <p className="text-gray-600 leading-relaxed">{position.overview}</p>
                  </div>

                  {/* Responsibilities */}
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      What You&apos;ll Accomplish
                    </h4>
                    <ul className="space-y-3">
                      {position.responsibilities.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="w-6 h-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-gray-600 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      What You Bring
                    </h4>
                    <ul className="space-y-3">
                      {position.requirements.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="w-6 h-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-600 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Nice to Have */}
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      Additional Differentiators
                    </h4>
                    <ul className="space-y-3">
                      {position.niceToHave.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="w-6 h-6 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <span className="text-gray-600 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What We Offer */}
                  <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">What We Offer</h4>
                    <ul className="space-y-3">
                      {position.whatWeOffer.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-600 leading-relaxed font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="pt-8 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={`/contact?position=${encodeURIComponent(position.title)}`}
                        className="flex-1 text-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        Submit Your Application
                      </Link>
                      <a
                        href={`mailto:gideonbosiregj@gmail.com?subject=Inquiry about ${position.title}`}
                        className="flex-1 text-center px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all duration-300"
                      >
                        Schedule a Conversation
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Process */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Selection Process
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Application Review</h3>
              <p className="text-sm text-gray-600">
                We carefully review every application within 48 hours
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Initial Conversation</h3>
              <p className="text-sm text-gray-600">
                30-minute discussion about your background and aspirations
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Deep Dive</h3>
              <p className="text-sm text-gray-600">
                In-depth interviews with team members and leadership
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                4
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Offer & Onboarding</h3>
              <p className="text-sm text-gray-600">
                Competitive offer and seamless integration into the team
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Don&apos;t See the Perfect Role?
          </h2>
          <p className="text-xl text-white/95 mb-8 leading-relaxed">
            We are always seeking exceptional talent across all functions. If you believe you can
            make a meaningful impact at PrepCoach, we want to hear from you.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Start a Conversation
          </Link>
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
