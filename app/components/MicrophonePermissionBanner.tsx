'use client';

import React from 'react';

interface MicrophonePermissionBannerProps {
  isSupported: boolean;
  permissionStatus: 'unknown' | 'granted' | 'denied' | 'prompt';
  onRequestPermission?: () => void;
}

export default function MicrophonePermissionBanner({
  isSupported,
  permissionStatus,
  onRequestPermission,
}: MicrophonePermissionBannerProps) {
  // Don't show banner if everything is OK
  if (isSupported && permissionStatus === 'granted') {
    return null;
  }

  // Browser not supported
  if (!isSupported) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 mb-6 shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-1">
              Browser Not Supported
            </h3>
            <p className="text-sm text-red-800 mb-2">
              Audio recording is not available in your current browser or configuration.
            </p>
            <div className="text-sm text-red-700">
              <strong>Requirements:</strong>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>Use Chrome, Firefox, Edge, or Safari (latest versions)</li>
                <li>Access via HTTPS or <code className="bg-red-100 px-1 rounded">localhost</code></li>
                <li>Enable JavaScript and cookies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Permission denied
  if (permissionStatus === 'denied') {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 mb-6 shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-orange-900 mb-1">
              Microphone Permission Denied
            </h3>
            <p className="text-sm text-orange-800 mb-2">
              You&apos;ve blocked microphone access. To record your interview responses, please allow microphone permissions.
            </p>
            <div className="text-sm text-orange-700 mb-3">
              <strong>How to fix:</strong>
              <ol className="list-decimal ml-5 mt-1 space-y-1">
                <li>Look for the 🔒 or camera icon in your browser&apos;s address bar</li>
                <li>Click it and change microphone permissions to &quot;Allow&quot;</li>
                <li>Refresh the page</li>
              </ol>
            </div>
            {onRequestPermission && (
              <button
                onClick={onRequestPermission}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors shadow-md"
              >
                Request Permission Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Permission prompt (first time)
  if (permissionStatus === 'prompt') {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 mb-6 shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-900 mb-1">
              Microphone Access Required
            </h3>
            <p className="text-sm text-blue-800 mb-2">
              To record your interview responses, we need access to your microphone. Your audio is only used for transcription and analysis.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Your privacy is protected. Audio is not stored permanently.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
