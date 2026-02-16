'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = (path: string) => pathname === path;
  const userRole = session?.user?.role || 'user';

  // Role-based navigation items
  const candidateNav = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Practice', href: '/practice' },
    { name: 'Problems', href: '/problems' },
    { name: 'Interviewers', href: '/interviewers' },
  ];

  const interviewerNav = [
    { name: 'My Profile', href: '/interviewer/profile' },
    { name: 'Sessions', href: '/interviewer/sessions' },
    { name: 'Availability', href: '/interviewer/availability' },
    { name: 'Payouts', href: '/interviewer/payouts' },
  ];

  const recruiterNav = [
    { name: 'Talent Search', href: '/recruiter/talent' },
    { name: 'Requests', href: '/recruiter/requests' },
    { name: 'Credits', href: '/recruiter/credits' },
    { name: 'Company', href: '/recruiter/company' },
  ];

  const navItems = useMemo(() => {
    if (userRole === 'interviewer') return interviewerNav;
    if (userRole === 'recruiter') return recruiterNav;
    return candidateNav;
  }, [userRole]);

  // Role badge info
  const getRoleBadge = () => {
    if (userRole === 'interviewer') {
      return { text: 'Interviewer', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400' };
    }
    if (userRole === 'recruiter') {
      return { text: 'Recruiter', bgColor: 'bg-green-500/20', textColor: 'text-green-400' };
    }
    return null;
  };

  const roleBadge = getRoleBadge();

  // Dropdown menu configurations
  const productItems = [
    { name: 'Interview Practice', href: '/practice', icon: '💬', description: '45+ questions per role' },
    { name: 'Expert Interviewers', href: '/interviewers', icon: '👔', description: '1-on-1 mock interviews' },
    { name: 'Coding Problems', href: '/problems', icon: '💻', description: 'LeetCode-style practice' },
    { name: 'System Design', href: '/system-design', icon: '🏗️', description: 'Architecture practice' },
    { name: 'Job Matcher', href: '/job-descriptions', icon: '🎯', description: 'JD analysis & prep' },
    { name: 'Coaching Packages', href: '/coaching', icon: '📦', description: 'Save with bundles' },
    { name: 'Resume Builder', href: '/resume-builder', icon: '📄', description: 'ATS-optimized templates' },
    { name: 'LinkedIn Optimizer', href: '/linkedin', icon: '💼', description: '3x profile visibility' },
    { name: 'Career Roadmap', href: '/roadmap', icon: '🗺️', description: 'Skills & timeline' },
    { name: 'Salary Negotiation', href: '/salary', icon: '💰', description: '$15K+ average increase' },
    { name: 'Job Opportunities', href: '/opportunities', icon: '🚀', description: 'Live remote job listings' },
  ];

  const resourceItems = [
    { name: 'Help Center', href: '/help', icon: '❓', description: 'Get answers fast' },
    { name: 'Interview Tips', href: '/help/interview-tips', icon: '💡', description: 'Expert advice' },
    { name: 'Career Guides', href: '/help/career-guides', icon: '📚', description: 'In-depth resources' },
    { name: 'Success Stories', href: '/help/success-stories', icon: '⭐', description: 'Real user results' },
    { name: 'Become Interviewer', href: '/interviewer/register', icon: '🎓', description: 'Earn by coaching' },
    { name: 'Talent Marketplace', href: '/talent/opt-in', icon: '🌟', description: 'Get discovered by recruiters' },
    { name: 'For Recruiters', href: '/recruiter/register', icon: '🏢', description: 'Hire verified engineers' },
  ];

  const companyItems = [
    { name: 'About Us', href: '/about', icon: '🏢', description: 'Our mission' },
    { name: 'Contact', href: '/contact', icon: '📧', description: 'Get in touch' },
    { name: 'Privacy Policy', href: '/privacy', icon: '🔒', description: 'Your data is safe' },
    { name: 'Terms of Service', href: '/terms', icon: '📋', description: 'Legal details' },
  ];

  const handleMouseEnter = (menu: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if no input is focused
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      // Alt/Option + key shortcuts
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            e.preventDefault();
            router.push('/practice');
            break;
          case 'd':
            e.preventDefault();
            router.push('/dashboard');
            break;
          case 'r':
            e.preventDefault();
            router.push('/resume-builder');
            break;
          case 'h':
            e.preventDefault();
            router.push('/');
            break;
          case 'c':
            e.preventDefault();
            router.push('/problems');
            break;
          case 's':
            e.preventDefault();
            router.push('/system-design');
            break;
          case 'j':
            e.preventDefault();
            router.push('/job-descriptions');
            break;
          case 'i':
            e.preventDefault();
            router.push('/interviewers');
            break;
          case 'm':
            e.preventDefault();
            router.push('/sessions');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);

  return (
    <nav
      className={`sticky top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b transition-all duration-300 ${
        scrolled ? 'border-gray-200 shadow-lg' : 'border-gray-100 shadow-sm'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              PrepCoach
            </span>
            <span className="text-xs font-bold text-gray-400 group-hover:text-blue-600 transition-colors" style={{ fontSize: '0.65rem', verticalAlign: 'super', marginLeft: '-0.1rem' }}>
              GJ
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Product Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('product')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center gap-1">
                Product
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'product' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'product' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                  <div className="p-2">
                    {productItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center gap-1">
                Resources
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                  <div className="p-2">
                    {resourceItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('company')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center gap-1">
                Company
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'company' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'company' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                  <div className="p-2">
                    {companyItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/dashboard')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>

            {/* Pricing Link */}
            <Link
              href="/pricing"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/pricing')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Pricing
            </Link>

            {session ? (
              <div className="flex items-center space-x-3 ml-4">
                {/* Role-specific nav items */}
                {navItems.slice(0, 2).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {session.user?.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {session.user?.email?.split('@')[0]}
                  </span>
                  {roleBadge && (
                    <span className={`px-2 py-1 ${roleBadge.bgColor} ${roleBadge.textColor} text-xs font-semibold rounded-full hidden lg:inline`}>
                      {roleBadge.text}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 hover:shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
          }`}
        >
          <div className="flex flex-col space-y-2">
            {/* Product Section */}
            <div className="space-y-1">
              <div className="px-4 py-2 font-semibold text-gray-900 text-sm uppercase tracking-wide">Product</div>
              {productItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-lg ml-2 active:bg-blue-100"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Resources Section */}
            <div className="space-y-1 pt-2">
              <div className="px-4 py-2 font-semibold text-gray-900 text-sm uppercase tracking-wide">Resources</div>
              {resourceItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-lg ml-2 active:bg-blue-100"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Company Section */}
            <div className="space-y-1 pt-2">
              <div className="px-4 py-2 font-semibold text-gray-900 text-sm uppercase tracking-wide">Company</div>
              {companyItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-lg ml-2 active:bg-blue-100"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Role-specific navigation for logged-in users */}
            {session && (
              <div className="pt-2 border-t border-gray-100">
                <div className="px-4 py-2 font-semibold text-gray-900 text-sm uppercase tracking-wide flex items-center gap-2">
                  Quick Links
                  {roleBadge && (
                    <span className={`px-2 py-0.5 ${roleBadge.bgColor} ${roleBadge.textColor} text-xs font-semibold rounded-full`}>
                      {roleBadge.text}
                    </span>
                  )}
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all flex active:bg-blue-100 ml-2 ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Other Links */}
            <div className="pt-2 border-t border-gray-100">
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium transition-all flex active:bg-blue-100 ${
                  isActive('/pricing')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Pricing
              </Link>
            </div>

              {session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-all flex items-center gap-2"
                  >
                    Profile
                    {roleBadge && (
                      <span className={`px-2 py-0.5 ${roleBadge.bgColor} ${roleBadge.textColor} text-xs font-semibold rounded-full`}>
                        {roleBadge.text}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="px-4 py-2 text-left rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-all active:bg-gray-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 active:bg-blue-800 transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
          </div>
        </div>
      </div>
    </nav>
  );
}
