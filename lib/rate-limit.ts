import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter that allows:
// - 10 requests per 10 seconds for free users
// - 100 requests per 10 seconds for pro users
// - 1000 requests per 10 seconds for enterprise users

// Initialize Redis client (only if configured)
let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// Free tier rate limiter
export const freeTierRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
      prefix: "@ratelimit/free",
    })
  : null;

// Pro tier rate limiter
export const proTierRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "10 s"),
      analytics: true,
      prefix: "@ratelimit/pro",
    })
  : null;

// Enterprise tier rate limiter
export const enterpriseRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(1000, "10 s"),
      analytics: true,
      prefix: "@ratelimit/enterprise",
    })
  : null;

// API-specific rate limiters
export const apiRateLimiters = {
  // AI feedback - expensive operation
  aiFeedback: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per minute
        analytics: true,
        prefix: "@ratelimit/ai-feedback",
      })
    : null,

  // Transcription - moderate cost
  transcription: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per minute
        analytics: true,
        prefix: "@ratelimit/transcription",
      })
    : null,

  // Resume transformation - expensive
  resumeTransform: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, "60 s"), // 3 requests per minute
        analytics: true,
        prefix: "@ratelimit/resume-transform",
      })
    : null,

  // Auth operations - prevent brute force
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 login attempts per minute
        analytics: true,
        prefix: "@ratelimit/auth",
      })
    : null,
};

// Helper function to get rate limiter based on subscription tier
export function getRateLimiterByTier(
  subscriptionTier?: string
): Ratelimit | null {
  if (!redis) return null;

  switch (subscriptionTier) {
    case "enterprise":
    case "lifetime":
      return enterpriseRateLimit;
    case "pro":
      return proTierRateLimit;
    case "free":
    default:
      return freeTierRateLimit;
  }
}

// Helper function to check rate limit
export async function checkRateLimit(
  identifier: string,
  subscriptionTier?: string,
  options?: { failClosed?: boolean }
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  error?: string;
}> {
  const ratelimit = getRateLimiterByTier(subscriptionTier);

  // If no Redis configured, allow all requests (unless failClosed)
  if (!ratelimit) {
    if (options?.failClosed) {
      return {
        success: false,
        limit: 0,
        remaining: 0,
        reset: Date.now() + 60000,
        error: "Rate limiter unavailable",
      };
    }
    return {
      success: true,
      limit: 999999,
      remaining: 999999,
      reset: Date.now() + 60000,
    };
  }

  try {
    const { success, limit, remaining, reset } = await ratelimit.limit(
      identifier
    );

    return {
      success,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    if (options?.failClosed) {
      return {
        success: false,
        limit: 0,
        remaining: 0,
        reset: Date.now() + 60000,
        error: "Rate limit check failed",
      };
    }
    // Fail open - allow request if rate limiting fails
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: Date.now() + 60000,
      error: "Rate limit check failed",
    };
  }
}

// Helper to check API-specific rate limits
export async function checkApiRateLimit(
  apiName: keyof typeof apiRateLimiters,
  identifier: string,
  options?: { failClosed?: boolean }
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  error?: string;
}> {
  const ratelimit = apiRateLimiters[apiName];

  // If no Redis configured, allow all requests (unless failClosed)
  if (!ratelimit) {
    if (options?.failClosed) {
      return {
        success: false,
        limit: 0,
        remaining: 0,
        reset: Date.now() + 60000,
        error: "Rate limiter unavailable",
      };
    }
    return {
      success: true,
      limit: 999999,
      remaining: 999999,
      reset: Date.now() + 60000,
    };
  }

  try {
    const { success, limit, remaining, reset } = await ratelimit.limit(
      identifier
    );

    return {
      success,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    console.error(`Rate limit check failed for ${apiName}:`, error);
    if (options?.failClosed) {
      return {
        success: false,
        limit: 0,
        remaining: 0,
        reset: Date.now() + 60000,
        error: "Rate limit check failed",
      };
    }
    // Fail open - allow request if rate limiting fails
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: Date.now() + 60000,
      error: "Rate limit check failed",
    };
  }
}
