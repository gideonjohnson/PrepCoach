'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry
const SESSION_CHECK_INTERVAL = 60 * 1000; // Check every minute

export default function SessionTimeoutWarning() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasShownWarning, setHasShownWarning] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.expires) {
      return;
    }

    const checkSessionExpiry = () => {
      const expiryTime = new Date(session.expires).getTime();
      const currentTime = new Date().getTime();
      const timeUntilExpiry = expiryTime - currentTime;

      // Show warning if less than 5 minutes remaining and haven't shown warning yet
      if (timeUntilExpiry <= SESSION_WARNING_TIME && timeUntilExpiry > 0 && !hasShownWarning) {
        setHasShownWarning(true);
        const minutesLeft = Math.ceil(timeUntilExpiry / 60000);

        toast((t) => (
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Session Expiring Soon</p>
            <p className="text-sm">
              Your session will expire in {minutesLeft} minute{minutesLeft !== 1 ? 's' : ''}.
            </p>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                router.refresh();
                setHasShownWarning(false);
              }}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Refresh Session
            </button>
          </div>
        ), {
          duration: 60000, // Show for 1 minute
          icon: '⏰',
        });
      }

      // Session has expired
      if (timeUntilExpiry <= 0) {
        toast.error('Your session has expired. Please sign in again.', {
          duration: 6000,
        });
        router.push('/auth/signin');
      }
    };

    // Check immediately
    checkSessionExpiry();

    // Then check periodically
    const interval = setInterval(checkSessionExpiry, SESSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [session, status, hasShownWarning, router]);

  return null; // This component doesn't render anything
}
