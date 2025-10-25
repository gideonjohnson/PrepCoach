/**
 * Analytics tracking utilities
 *
 * Provides centralized analytics tracking for Google Analytics 4 (GA4)
 * with type-safe event tracking and user identification.
 */

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

// Check if GA is enabled
export const isGAEnabled = (): boolean => {
  return !!GA_TRACKING_ID && GA_TRACKING_ID !== 'your_ga_tracking_id_here';
};

/**
 * Track page views
 */
export const pageview = (url: string): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('config', GA_TRACKING_ID!, {
    page_path: url,
  });
};

/**
 * Standard event names for consistency
 */
export const AnalyticsEvents = {
  // Authentication
  SIGNUP: 'signup',
  LOGIN: 'login',
  LOGOUT: 'logout',

  // Interview Practice
  INTERVIEW_START: 'interview_start',
  INTERVIEW_COMPLETE: 'interview_complete',
  QUESTION_ANSWERED: 'question_answered',

  // AI Feedback
  FEEDBACK_REQUEST: 'feedback_request',
  FEEDBACK_VIEWED: 'feedback_viewed',

  // Audio
  AUDIO_RECORD_START: 'audio_record_start',
  AUDIO_RECORD_STOP: 'audio_record_stop',
  AUDIO_TRANSCRIBE: 'audio_transcribe',

  // Resume
  RESUME_UPLOAD: 'resume_upload',
  RESUME_TRANSFORM: 'resume_transform',
  RESUME_DOWNLOAD: 'resume_download',
  RESUME_ATS_SCAN: 'resume_ats_scan',

  // LinkedIn
  LINKEDIN_OPTIMIZE: 'linkedin_optimize',
  LINKEDIN_ANALYSIS: 'linkedin_analysis',

  // Career Planning
  ROADMAP_GENERATE: 'roadmap_generate',
  ROADMAP_EXPORT: 'roadmap_export',

  // Salary
  SALARY_ANALYZE: 'salary_analyze',
  SALARY_COMPARE: 'salary_compare',

  // Payments
  UPGRADE_CLICK: 'upgrade_click',
  CHECKOUT_START: 'checkout_start',
  PURCHASE: 'purchase',
  SUBSCRIPTION_CANCEL: 'subscription_cancel',

  // Engagement
  SHARE_RESULT: 'share_result',
  EXPORT_DATA: 'export_data',
  HELP_VIEWED: 'help_viewed',
} as const;

/**
 * Event parameters interface
 */
export interface AnalyticsEventParams {
  // Common parameters
  category?: string;
  label?: string;
  value?: number;

  // User context
  user_id?: string;
  user_tier?: string;

  // Interview specific
  role?: string;
  difficulty?: string;
  question_type?: string;
  session_id?: string;
  score?: number;

  // Conversion tracking
  currency?: string;
  transaction_id?: string;

  // Custom dimensions
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track custom events
 */
export const event = (
  eventName: string,
  params?: AnalyticsEventParams
): void => {
  if (!isGAEnabled()) {
    console.log('[Analytics - Dev Mode]', eventName, params);
    return;
  }

  window.gtag?.('event', eventName, params);
};

/**
 * Set user properties for tracking
 */
export const setUser = (userId: string, properties?: {
  email?: string;
  subscriptionTier?: string;
  [key: string]: string | undefined;
}): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('set', 'user_properties', {
    user_id: userId,
    ...properties,
  });
};

/**
 * Clear user properties (on logout)
 */
export const clearUser = (): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('set', 'user_properties', {
    user_id: undefined,
  });
};

/**
 * Track conversions (purchases, upgrades)
 */
export const trackConversion = (params: {
  transactionId: string;
  value: number;
  currency?: string;
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}): void => {
  event(AnalyticsEvents.PURCHASE, {
    transaction_id: params.transactionId,
    value: params.value,
    currency: params.currency || 'USD',
  });
};

/**
 * Track exceptions/errors
 */
export const trackException = (description: string, fatal = false): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('event', 'exception', {
    description,
    fatal,
  });
};

/**
 * Track timing (performance metrics)
 */
export const trackTiming = (params: {
  name: string;
  value: number;
  category?: string;
  label?: string;
}): void => {
  event('timing_complete', {
    name: params.name,
    value: params.value,
    category: params.category,
    label: params.label,
  });
};

/**
 * Helper to track AI operations (expensive operations we want to monitor)
 */
export const trackAIOperation = (params: {
  operation: string;
  tokens?: number;
  duration?: number;
  success: boolean;
  error?: string;
}): void => {
  event('ai_operation', {
    category: 'AI',
    label: params.operation,
    value: params.tokens || 0,
    success: params.success,
    duration: params.duration,
    error: params.error,
  });
};

/**
 * Helper to track user journey milestones
 */
export const trackMilestone = (milestone: string): void => {
  event('milestone', {
    category: 'User Journey',
    label: milestone,
  });
};
