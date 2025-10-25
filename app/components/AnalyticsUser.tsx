'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { setUser, clearUser } from '@/lib/analytics';

/**
 * Analytics User Tracker
 *
 * Automatically sets user properties in Google Analytics when user logs in/out.
 * Tracks user ID and subscription tier for segmentation.
 */
export default function AnalyticsUser() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const user = session.user as {
        id?: string;
        email?: string | null;
        subscriptionTier?: string;
      };

      if (user.id) {
        setUser(user.id, {
          email: user.email || undefined,
          subscriptionTier: user.subscriptionTier || 'free',
        });
      }
    } else if (status === 'unauthenticated') {
      clearUser();
    }
  }, [session, status]);

  return null;
}
