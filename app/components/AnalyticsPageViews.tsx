'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/analytics';

/**
 * Analytics Page View Tracker
 *
 * Automatically tracks page views when the route changes in Next.js App Router.
 * Handles both pathname and search params changes.
 */
function AnalyticsPageViewsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = searchParams?.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsPageViews() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>}>
      <AnalyticsPageViewsContent />
    </Suspense>
  );
}
