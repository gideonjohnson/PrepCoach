'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import SentryUser from './components/SentryUser';
import GoogleAnalytics from './components/GoogleAnalytics';
import AnalyticsPageViews from './components/AnalyticsPageViews';
import AnalyticsUser from './components/AnalyticsUser';
import SessionTimeoutWarning from './components/SessionTimeoutWarning';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <GoogleAnalytics />
      <Suspense fallback={null}>
        <AnalyticsPageViews />
      </Suspense>
      <SentryUser />
      <AnalyticsUser />
      <SessionTimeoutWarning />
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
        containerClassName="z-[9999]"
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            maxWidth: '90vw',
            width: '100%',
            fontSize: '14px',
          },
          // Success toast styles
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          // Error toast styles
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
          // Loading toast styles
          loading: {
            style: {
              background: '#3b82f6',
              color: '#fff',
            },
          },
        }}
      />
    </SessionProvider>
  );
}
