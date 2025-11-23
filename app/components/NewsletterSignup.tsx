'use client';

import { useState } from 'react';

interface NewsletterSignupProps {
  variant?: 'inline' | 'card' | 'footer';
  className?: string;
}

export default function NewsletterSignup({ variant = 'card', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus('loading');

    try {
      // Store in localStorage for now (can be connected to email service later)
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (subscribers.includes(email)) {
        setStatus('error');
        setMessage('This email is already subscribed!');
        return;
      }
      subscribers.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));

      setStatus('success');
      setMessage('Thanks for subscribing! Check your inbox for interview tips.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h4 className="font-semibold text-white mb-3">Get Interview Tips</h4>
        <p className="text-gray-400 text-sm mb-4">Weekly tips to ace your interviews</p>
        {status === 'success' ? (
          <p className="text-green-400 text-sm">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
            </button>
            {status === 'error' && (
              <p className="text-red-400 text-sm">{message}</p>
            )}
          </form>
        )}
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className={`bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-center shadow-2xl ${className}`}>
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Get Weekly Interview Tips</h3>
      <p className="text-white/80 mb-6">
        Join 10,000+ job seekers getting exclusive tips, FAANG insights, and salary negotiation strategies.
      </p>

      {status === 'success' ? (
        <div className="bg-white/20 rounded-xl p-4">
          <svg className="w-12 h-12 text-green-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-white font-semibold">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-5 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-5 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-gray-100 transition-all disabled:opacity-50 transform hover:scale-105"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe Free - Get First Tip Now'}
          </button>
          {status === 'error' && (
            <p className="text-red-300 text-sm">{message}</p>
          )}
          <p className="text-white/60 text-xs">No spam. Unsubscribe anytime.</p>
        </form>
      )}
    </div>
  );
}
