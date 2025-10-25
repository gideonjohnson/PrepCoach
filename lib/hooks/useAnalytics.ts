'use client';

import { useCallback } from 'react';
import {
  event,
  AnalyticsEvents,
  AnalyticsEventParams,
  trackConversion,
  trackException,
  trackTiming,
  trackAIOperation,
  trackMilestone,
} from '@/lib/analytics';

/**
 * useAnalytics Hook
 *
 * Provides a convenient hook for tracking analytics events from React components.
 * Wraps analytics functions with useCallback for stable references.
 */
export function useAnalytics() {
  const trackEvent = useCallback(
    (eventName: string, params?: AnalyticsEventParams) => {
      event(eventName, params);
    },
    []
  );

  const trackInterviewStart = useCallback((params: {
    role: string;
    difficulty: string;
    sessionId: string;
  }) => {
    event(AnalyticsEvents.INTERVIEW_START, params);
  }, []);

  const trackInterviewComplete = useCallback((params: {
    role: string;
    difficulty: string;
    sessionId: string;
    score?: number;
    questionsAnswered: number;
  }) => {
    event(AnalyticsEvents.INTERVIEW_COMPLETE, params);
  }, []);

  const trackFeedbackRequest = useCallback((params: {
    role: string;
    questionType: string;
    transcriptLength: number;
  }) => {
    event(AnalyticsEvents.FEEDBACK_REQUEST, params);
  }, []);

  const trackResumeUpload = useCallback((params: {
    fileType: string;
    fileSize: number;
  }) => {
    event(AnalyticsEvents.RESUME_UPLOAD, params);
  }, []);

  const trackResumeTransform = useCallback((params: {
    targetRole?: string;
    hasJobDescription: boolean;
  }) => {
    event(AnalyticsEvents.RESUME_TRANSFORM, params);
  }, []);

  const trackUpgradeClick = useCallback((params: {
    plan: string;
    source: string;
  }) => {
    event(AnalyticsEvents.UPGRADE_CLICK, {
      label: params.plan,
      category: params.source,
    });
  }, []);

  const trackCheckoutStart = useCallback((params: {
    plan: string;
    price: number;
  }) => {
    event(AnalyticsEvents.CHECKOUT_START, {
      label: params.plan,
      value: params.price,
    });
  }, []);

  const trackPurchase = useCallback((params: {
    transactionId: string;
    plan: string;
    value: number;
    currency?: string;
  }) => {
    trackConversion({
      transactionId: params.transactionId,
      value: params.value,
      currency: params.currency,
      items: [{
        id: params.plan,
        name: `PrepCoach ${params.plan}`,
        price: params.value,
        quantity: 1,
      }],
    });
  }, []);

  const trackError = useCallback((error: string, fatal = false) => {
    trackException(error, fatal);
  }, []);

  const trackPerformance = useCallback((params: {
    name: string;
    value: number;
    category?: string;
  }) => {
    trackTiming(params);
  }, []);

  const trackAI = useCallback((params: {
    operation: string;
    tokens?: number;
    duration?: number;
    success: boolean;
    error?: string;
  }) => {
    trackAIOperation(params);
  }, []);

  const trackUserMilestone = useCallback((milestone: string) => {
    trackMilestone(milestone);
  }, []);

  return {
    // Generic event tracking
    trackEvent,

    // Predefined events (most common)
    Events: AnalyticsEvents,

    // Feature-specific tracking
    trackInterviewStart,
    trackInterviewComplete,
    trackFeedbackRequest,
    trackResumeUpload,
    trackResumeTransform,

    // Conversion tracking
    trackUpgradeClick,
    trackCheckoutStart,
    trackPurchase,

    // Monitoring
    trackError,
    trackPerformance,
    trackAI,
    trackUserMilestone,
  };
}
