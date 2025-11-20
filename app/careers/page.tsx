import type { Metadata } from 'next';
import Navigation from '../components/Navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers - Join PrepCoach',
  description: 'Join our team and help shape the future of AI-powered interview preparation',
};

export default function CareersPage() {
  const positions = [
    {
      id: 1,
      title: 'Senior Full Stack Engineer',
      type: 'Full-time',
      location: 'Remote',
      department: 'Engineering',
      description:
        'We are looking for an experienced Full Stack Engineer to help build and scale our AI-powered interview platform. You will work on cutting-edge technologies including Next.js, React, Node.js, and AI integrations.',
      responsibilities: [
        'Design and implement scalable features for our interview platform',
        'Integrate AI/ML models for real-time feedback and analysis',
        'Optimize application performance and user experience',
        'Collaborate with product and design teams to build intuitive interfaces',
        'Mentor junior developers and contribute to technical decisions',
      ],
      requirements: [
        '5+ years of experience in full-stack web development',
        'Strong proficiency in React, Next.js, TypeScript, and Node.js',
        'Experience with AI/ML integrations (OpenAI, Anthropic, etc.)',
        'Solid understanding of database design (PostgreSQL, Prisma)',
        'Experience with real-time communication (WebRTC, WebSockets)',
        'Strong problem-solving skills and attention to detail',
      ],
      niceToHave: [
        'Experience with video/audio processing',
        'Knowledge of payment systems (Stripe, Paystack)',
        'Background in EdTech or SaaS products',
        'Open source contributions',
      ],
    },
    {
      id: 2,
      title: 'Product Designer (UI/UX)',
      type: 'Full-time',
      location: 'Remote',
      department: 'Design',
      description:
        'We are seeking a talented Product Designer to create exceptional user experiences for our AI interview platform. You will own the design process from concept to implementation, working closely with engineering and product teams.',
      responsibilities: [
        'Design intuitive and engaging user interfaces for web and mobile',
        'Create user flows, wireframes, prototypes, and high-fidelity mockups',
        'Conduct user research and usability testing to validate design decisions',
        'Establish and maintain design systems and component libraries',
        'Collaborate with engineers to ensure pixel-perfect implementation',
        'Analyze user behavior and iterate on designs based on data',
      ],
      requirements: [
        '3+ years of experience in product design or UX/UI design',
        'Strong portfolio showcasing web and mobile design work',
        'Proficiency in Figma, Sketch, or similar design tools',
        'Deep understanding of user-centered design principles',
        'Experience designing for AI-powered or complex applications',
        'Excellent communication and presentation skills',
      ],
      niceToHave: [
        'Experience with design systems and component libraries',
        'Knowledge of HTML/CSS and frontend frameworks',
        'Background in EdTech or career development tools',
        'Motion design and animation skills',
        'Experience with accessibility standards (WCAG)',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Navigation />

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Help us revolutionize interview preparation with AI. Build products that empower
            thousands of job seekers to land their dream careers.
          </p>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Join PrepCoach?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cutting-Edge Tech</h3>
              <p className="text-gray-600">
                Work with the latest AI technologies, Next.js, React, and modern tools
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Remote-First</h3>
              <p className="text-gray-600">
                Work from anywhere with flexible hours and a great work-life balance
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Make an Impact</h3>
              <p className="text-gray-600">
                Help thousands of people prepare for interviews and advance their careers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Open Positions</h2>
          <div className="space-y-6">
            {positions.map((position) => (
              <div
                key={position.id}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          {position.type}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {position.location}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {position.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6">{position.description}</p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Responsibilities
                      </h4>
                      <ul className="space-y-2">
                        {position.responsibilities.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg
                              className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
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
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {position.requirements.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg
                              className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
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
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Nice to Have</h4>
                      <ul className="space-y-2">
                        {position.niceToHave.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg
                              className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0"
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
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <Link
                      href={`/contact?position=${encodeURIComponent(position.title)}`}
                      className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don&apos;t see a perfect fit?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            We&apos;re always looking for talented people. Send us your resume and let&apos;s
            talk!
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Get in Touch
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} PrepCoach. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
