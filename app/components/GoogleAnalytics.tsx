'use client';

import Script from 'next/script';
import { GA_TRACKING_ID, isGAEnabled } from '@/lib/analytics';

/**
 * Google Analytics 4 (GA4) component
 *
 * Injects Google Analytics tracking script and initializes gtag.
 * Only loads in production with valid tracking ID.
 */
export default function GoogleAnalytics() {
  // Don't load GA if tracking ID is not configured
  if (!isGAEnabled()) {
    return null;
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
}
