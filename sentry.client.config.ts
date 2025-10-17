import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      // Additional SDK configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Don't capture errors in development
  enabled: process.env.NODE_ENV === 'production',

  // Filter out sensitive data
  beforeSend(event, hint) {
    // Don't send errors from browser extensions
    if (event.exception) {
      const exceptionValue = event.exception.values?.[0]?.value || '';
      if (
        exceptionValue.includes('chrome-extension://') ||
        exceptionValue.includes('moz-extension://')
      ) {
        return null;
      }
    }
    return event;
  },
});
