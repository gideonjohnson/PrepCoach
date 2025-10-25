import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  try {
    // Trigger a test error
    throw new Error('Test server-side error from PrepCoach API');
  } catch (error) {
    // Capture the error in Sentry with context
    Sentry.captureException(error, {
      tags: {
        test_type: 'server_error',
        feature: 'sentry_test',
        endpoint: '/api/test-sentry-error',
      },
      level: 'error',
      extra: {
        timestamp: new Date().toISOString(),
        test: true,
      },
    });

    return NextResponse.json({
      error: 'Test error captured',
      message: 'Error successfully sent to Sentry',
      timestamp: new Date().toISOString(),
    });
  }
}
