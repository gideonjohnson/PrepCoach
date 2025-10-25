'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';

export default function TestSentryPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testClientError = () => {
    addResult('Triggering client-side error...');
    try {
      throw new Error('Test client-side error from PrepCoach');
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          test_type: 'client_error',
          feature: 'sentry_test',
        },
        level: 'error',
      });
      addResult('✅ Client error sent to Sentry');
    }
  };

  const testServerError = async () => {
    addResult('Triggering server-side error...');
    try {
      const response = await fetch('/api/test-sentry-error');
      const data = await response.json();
      if (data.error) {
        addResult('✅ Server error sent to Sentry');
      }
    } catch (error) {
      addResult('❌ Failed to trigger server error');
      console.error(error);
    }
  };

  const testUnhandledRejection = () => {
    addResult('Triggering unhandled promise rejection...');
    Promise.reject(new Error('Test unhandled promise rejection'));
    addResult('✅ Unhandled rejection triggered (check console and Sentry)');
  };

  const testUserContext = () => {
    addResult('Setting user context...');
    Sentry.setUser({
      id: 'test-user-123',
      email: 'test@prepcoach.com',
      username: 'Test User',
      subscription: 'pro',
    });
    addResult('✅ User context set in Sentry');

    // Trigger error with user context
    Sentry.captureMessage('Test message with user context', {
      level: 'info',
      tags: {
        test_type: 'user_context',
      },
    });
    addResult('✅ Message with user context sent');
  };

  const testPerformance = async () => {
    addResult('Testing performance tracking...');

    const transaction = Sentry.startTransaction({
      name: 'test-transaction',
      op: 'test',
    });

    // Simulate some work
    const span = transaction.startChild({
      op: 'test-operation',
      description: 'Simulating slow operation',
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    span.finish();
    transaction.finish();

    addResult('✅ Performance transaction sent to Sentry');
  };

  const clearResults = () => {
    setTestResults([]);
    addResult('Test results cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔍 Sentry Error Tracking Test
          </h1>
          <p className="text-gray-600">
            Use these buttons to test different Sentry features and verify your setup is working.
          </p>
        </div>

        {/* Configuration Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Configuration Status</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {process.env.NEXT_PUBLIC_SENTRY_DSN ? (
                <>
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="font-semibold text-green-700">Sentry DSN Configured</div>
                    <div className="text-sm text-gray-600">
                      DSN: {process.env.NEXT_PUBLIC_SENTRY_DSN.substring(0, 30)}...
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-2xl">❌</span>
                  <div>
                    <div className="font-semibold text-red-700">Sentry DSN Not Configured</div>
                    <div className="text-sm text-gray-600">
                      Add NEXT_PUBLIC_SENTRY_DSN to your environment variables
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {process.env.NODE_ENV === 'production' ? (
                <>
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="font-semibold text-green-700">Production Mode</div>
                    <div className="text-sm text-gray-600">Sentry is enabled</div>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <div className="font-semibold text-yellow-700">Development Mode</div>
                    <div className="text-sm text-gray-600">
                      Sentry is disabled in development. Deploy to test fully.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> In development mode, errors are logged to console but not sent to Sentry.
              Deploy to production or set NODE_ENV=production to test fully.
            </p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Test Error Tracking</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={testClientError}
              className="p-6 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg text-left"
            >
              <div className="text-2xl mb-2">🔴</div>
              <div className="font-bold text-lg mb-1">Client-Side Error</div>
              <div className="text-sm opacity-90">
                Triggers a caught exception on the client
              </div>
            </button>

            <button
              onClick={testServerError}
              className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg text-left"
            >
              <div className="text-2xl mb-2">🔶</div>
              <div className="font-bold text-lg mb-1">Server-Side Error</div>
              <div className="text-sm opacity-90">
                Triggers an error in API route
              </div>
            </button>

            <button
              onClick={testUnhandledRejection}
              className="p-6 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg text-left"
            >
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-bold text-lg mb-1">Unhandled Rejection</div>
              <div className="text-sm opacity-90">
                Triggers an unhandled promise rejection
              </div>
            </button>

            <button
              onClick={testUserContext}
              className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg text-left"
            >
              <div className="text-2xl mb-2">👤</div>
              <div className="font-bold text-lg mb-1">User Context</div>
              <div className="text-sm opacity-90">
                Tests user tracking and context
              </div>
            </button>

            <button
              onClick={testPerformance}
              className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg text-left"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-bold text-lg mb-1">Performance Tracking</div>
              <div className="text-sm opacity-90">
                Tests transaction and span tracking
              </div>
            </button>

            <button
              onClick={clearResults}
              className="p-6 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all shadow-md hover:shadow-lg text-left"
            >
              <div className="text-2xl mb-2">🗑️</div>
              <div className="font-bold text-lg mb-1">Clear Results</div>
              <div className="text-sm opacity-90">
                Clear the test results log
              </div>
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Test Results</h2>
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm">
              {testResults.map((result, index) => (
                <div key={index} className="text-green-400 mb-2">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-3">📖 Setup Instructions</h2>
          <ol className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Create a Sentry account at <a href="https://sentry.io/signup" target="_blank" rel="noopener noreferrer" className="underline">sentry.io/signup</a></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Create a Next.js project in Sentry</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Copy your DSN and add it to environment variables</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Deploy to production and test the buttons above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">5.</span>
              <span>Check your Sentry dashboard to see the errors</span>
            </li>
          </ol>
          <div className="mt-4">
            <Link
              href="/docs/SENTRY_SETUP.md"
              className="inline-block px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              📄 Read Full Setup Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
