'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/analytics';

/**
 * Analytics Page View Tracker
 *
 * Automatically tracks page views when the route changes in Next.js App Router.
 * Handles both pathname and search params changes.
 */
export default function AnalyticsPageViews() {
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
