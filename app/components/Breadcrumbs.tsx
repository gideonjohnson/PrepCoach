'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;

      // Skip dynamic segments like [sessionId]
      if (path.startsWith('[')) return;

      let label = path.charAt(0).toUpperCase() + path.slice(1);

      // Custom labels
      if (path === 'resume-builder') label = 'Resume Builder';
      if (path === 'dashboard') label = 'Dashboard';
      if (path === 'practice') label = 'Practice';
      if (path === 'pricing') label = 'Pricing';
      if (path === 'profile') label = 'Profile';

      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-2 text-sm mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
      {breadcrumbs.map((crumb, index) => (
        <div key={`${index}-${crumb.href}`} className="flex items-center gap-2">
          {index > 0 && (
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {index === 0 && (
            <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-orange-600 font-semibold">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-gray-600 hover:text-orange-600 transition-colors font-medium hover:underline"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
