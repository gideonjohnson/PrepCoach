import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { checkRateLimit, checkApiRateLimit } from './rate-limit';
import prisma from './prisma';

export interface RateLimitConfig {
  enabled: boolean;
  apiName?: 'aiFeedback' | 'transcription' | 'resumeTransform' | 'auth';
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'anonymous';
}

/**
 * Middleware to apply rate limiting to API routes
 */
export async function withRateLimit(
  req: NextRequest,
  config: RateLimitConfig = { enabled: true }
) {
  if (!config.enabled) {
    return { allowed: true, response: null };
  }

  try {
    // Get user session
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    // Get user's subscription tier
    let subscriptionTier = 'free';
    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { subscriptionTier: true },
      });
      subscriptionTier = user?.subscriptionTier || 'free';
    }

    // Use IP address as identifier for non-authenticated requests
    const identifier = userEmail || getClientIP(req);

    // Check rate limit
    const rateLimitResult = config.apiName
      ? await checkApiRateLimit(config.apiName, identifier)
      : await checkRateLimit(identifier, subscriptionTier);

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.reset);
      const response = NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again after ${resetDate.toLocaleTimeString()}.`,
          limit: rateLimitResult.limit,
          remaining: 0,
          reset: rateLimitResult.reset,
        },
        { status: 429 }
      );

      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());
      response.headers.set('Retry-After', Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString());

      return { allowed: false, response };
    }

    // Request allowed - return rate limit headers
    return {
      allowed: true,
      response: null,
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.reset.toString(),
      },
    };
  } catch (error) {
    console.error('Rate limit middleware error:', error);
    // Fail open - allow request if middleware fails
    return { allowed: true, response: null };
  }
}

/**
 * Helper to add rate limit headers to a response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  headers?: Record<string, string>
): NextResponse {
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  return response;
}

/**
 * Wrapper for API routes with rate limiting
 */
export function withApiRateLimit<T extends unknown[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>,
  config: RateLimitConfig = { enabled: true }
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    const rateLimitCheck = await withRateLimit(req, config);

    if (!rateLimitCheck.allowed && rateLimitCheck.response) {
      return rateLimitCheck.response;
    }

    const response = await handler(req, ...args);

    // Add rate limit headers to successful responses
    if (rateLimitCheck.headers) {
      return addRateLimitHeaders(response, rateLimitCheck.headers);
    }

    return response;
  };
}
