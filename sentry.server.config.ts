import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Don't capture errors in development
  enabled: process.env.NODE_ENV === 'production',

  // Filter out sensitive data
  beforeSend(event, hint) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }

    // Remove sensitive query params
    if (event.request?.query_string) {
      const params = new URLSearchParams(event.request.query_string);
      if (params.has('token')) params.delete('token');
      if (params.has('api_key')) params.delete('api_key');
      event.request.query_string = params.toString();
    }

    return event;
  },
});
