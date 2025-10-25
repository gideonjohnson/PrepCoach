'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import * as Sentry from '@sentry/nextjs';

/**
 * SentryUser Component
 *
 * Automatically sets user context in Sentry when user logs in/out.
 * This helps identify which users are experiencing errors.
 */
export default function SentryUser() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // Set user context in Sentry
      const user = session.user as { id?: string; email?: string | null; name?: string | null; subscriptionTier?: string };

      Sentry.setUser({
        id: user.id || 'unknown',
        email: user.email || undefined,
        username: user.name || undefined,
        // Add subscription tier if available
        subscription: user.subscriptionTier || 'free',
      });

      // Add tags for filtering
      Sentry.setTag('user_tier', user.subscriptionTier || 'free');
      Sentry.setTag('user_authenticated', 'true');

    } else {
      // User is not authenticated - clear user context
      Sentry.setUser(null);
      Sentry.setTag('user_authenticated', 'false');
    }
  }, [session, status]);

  // This component doesn't render anything
  return null;
}
