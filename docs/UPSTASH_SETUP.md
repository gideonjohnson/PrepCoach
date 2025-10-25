# Upstash Redis Setup for Rate Limiting

## Overview

PrepCoach uses Upstash Redis for rate limiting API routes to prevent abuse and ensure fair usage across all users. Rate limiting is already implemented in the codebase but requires Upstash Redis credentials to be active.

## Current Rate Limiting Status

### ✅ Already Implemented
- Tier-based rate limiting (Free: 10/10s, Pro: 100/10s, Enterprise: 1000/10s)
- API-specific rate limiting for expensive operations
- Graceful fallback (fails open) if Redis not configured

### 🔐 Protected API Routes

| Route | Limit | Identifier | Purpose |
|-------|-------|------------|---------|
| `/api/analyze-response` | 5 req/min | User email | AI feedback analysis (expensive) |
| `/api/transcribe` | 10 req/min | User email | Audio transcription |
| `/api/auth/signup` | 5 req/min | Email/IP | Prevent spam signups |
| `/api/resume/upload-transform` | 3 req/min | User email | Resume AI transformation (very expensive) |
| `/api/auth/forgot-password` | 5 req/min | IP address | Prevent brute force attacks |
| `/api/auth/reset-password` | 5 req/min | IP address | Prevent token guessing |

## Why Upstash?

- **Serverless-native**: Perfect for Vercel/Next.js deployments
- **REST API**: Works in serverless edge environments
- **Global low-latency**: Edge locations worldwide
- **Free tier**: 10,000 requests/day free
- **Simple pricing**: Pay-as-you-go after free tier

## Setup Instructions

### Step 1: Create Upstash Account

1. Go to https://console.upstash.com
2. Sign up with GitHub, Google, or email
3. Verify your email address

### Step 2: Create Redis Database

1. Click **"Create Database"** in the dashboard
2. Configure your database:
   - **Name**: `prepcoach-rate-limit` (or any name)
   - **Type**: Select **"Regional"** (cheaper than Global)
   - **Region**: Choose closest to your primary users
     - US East (N. Virginia) for US users
     - EU (Frankfurt) for European users
     - Asia Pacific (Singapore) for Asian users
   - **TLS**: Enable (recommended)
   - **Eviction**: Enable (automatically remove old data)

3. Click **"Create"**

### Step 3: Get REST API Credentials

1. Click on your newly created database
2. Scroll to **"REST API"** section
3. You'll see two important credentials:
   - **UPSTASH_REDIS_REST_URL**: `https://your-database.upstash.io`
   - **UPSTASH_REDIS_REST_TOKEN**: Long alphanumeric token

4. Keep this tab open or copy both values

### Step 4: Add to Vercel Production

#### Option A: Using Vercel CLI (Recommended)

```bash
# Navigate to project directory
cd C:\Users\Administrator\prepcoach

# Add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_URL production
# Paste: https://your-database.upstash.io

# Add UPSTASH_REDIS_REST_TOKEN
vercel env add UPSTASH_REDIS_REST_TOKEN production
# Paste: Your token here
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/gideons-projects-07acaa4a/prepcoach
2. Click **Settings** → **Environment Variables**
3. Add first variable:
   - **Name**: `UPSTASH_REDIS_REST_URL`
   - **Value**: `https://your-database.upstash.io`
   - **Environment**: ✅ Production only
   - Click **Save**
4. Add second variable:
   - **Name**: `UPSTASH_REDIS_REST_TOKEN`
   - **Value**: Your long token
   - **Environment**: ✅ Production only
   - Click **Save**

### Step 5: Redeploy Application

```bash
# Trigger new deployment to pick up environment variables
vercel --prod
```

Or push a commit to trigger automatic deployment:
```bash
git commit --allow-empty -m "Trigger deployment for Upstash credentials"
git push origin master
```

### Step 6: Verify Rate Limiting Works

#### Test 1: Check Upstash Dashboard
1. Go to Upstash console
2. Click on your database
3. Click **"Data Browser"** tab
4. After making API requests, you should see keys like:
   - `@upstash/ratelimit:aiFeedback:user@example.com`
   - `@upstash/ratelimit:resumeTransform:user@example.com`

#### Test 2: Trigger Rate Limit
1. Log in to https://aiprep.work
2. Go to Resume Builder
3. Try uploading and transforming a resume **4 times in quick succession**
4. The 4th request should return:
   ```json
   {
     "error": "Rate limit exceeded",
     "message": "Too many resume transformation requests. Please try again after [time]."
   }
   ```

#### Test 3: Check Response Headers
Open browser DevTools → Network tab and check response headers:
```
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1730000000
```

## Configuration Reference

### Rate Limit Tiers

Defined in `lib/rate-limit.ts`:

```typescript
// Tier-based limits
freeTierRateLimit: 10 requests per 10 seconds
proTierRateLimit: 100 requests per 10 seconds
enterpriseRateLimit: 1000 requests per 10 seconds

// API-specific limits
aiFeedback: 5 requests per 60 seconds
transcription: 10 requests per 60 seconds
resumeTransform: 3 requests per 60 seconds
auth: 5 requests per 60 seconds
```

### Adjusting Rate Limits

To change rate limits, edit `lib/rate-limit.ts`:

```typescript
export const apiRateLimiters = {
  aiFeedback: ratelimit.slidingWindow(5, '60s'),  // Change 5 to desired limit
  transcription: ratelimit.slidingWindow(10, '60s'),
  resumeTransform: ratelimit.slidingWindow(3, '60s'),
  auth: ratelimit.slidingWindow(5, '60s'),
};
```

Then redeploy:
```bash
git add lib/rate-limit.ts
git commit -m "Adjust rate limits"
git push origin master
```

## Cost Estimation

### Free Tier
- **Requests**: 10,000 per day
- **Storage**: 256 MB
- **Bandwidth**: 200 MB/day
- **Max connections**: 100

**Estimated usage for PrepCoach**:
- Average user: ~50 API calls per session
- Expected: 200 users/day = 10,000 calls/day
- ✅ Fits perfectly in free tier!

### Paid Tier (if you exceed free)
- **Pay-as-you-go**: $0.20 per 100K requests
- **Storage**: $0.25/GB per month

**Example costs**:
- 1 million requests/month: ~$2/month
- 10 million requests/month: ~$20/month

## Troubleshooting

### Rate Limiting Not Working

**Symptom**: Can make unlimited requests without being blocked

**Checks**:
1. Verify environment variables in Vercel:
   ```bash
   vercel env ls production
   ```
   Should show `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

2. Check Vercel deployment logs:
   ```bash
   vercel logs --prod
   ```
   Look for errors about Upstash connection

3. Check Upstash database is active:
   - Go to console → Database should show "Active" status
   - Check Data Browser for any keys

4. Verify code is deployed:
   - Check git commit matches Vercel deployment
   - Confirm recent deployment included rate limit changes

### "Failed to connect to Redis" Error

**Cause**: Invalid credentials or network issue

**Fix**:
1. Double-check credentials in Upstash console
2. Ensure you copied complete URL and token (no trailing spaces)
3. Verify database is not paused or deleted
4. Check Upstash status page: https://status.upstash.com

### Rate Limits Too Strict

**Symptom**: Legitimate users hitting rate limits frequently

**Fix**: Adjust limits in `lib/rate-limit.ts`:

```typescript
// Increase from 3 to 5 requests per minute
resumeTransform: ratelimit.slidingWindow(5, '60s'),
```

### Rate Limits Too Lenient

**Symptom**: Abuse still occurring, costs increasing

**Fix**: Decrease limits and add IP-based limiting:

```typescript
// Stricter limits
resumeTransform: ratelimit.slidingWindow(2, '60s'),

// Use IP instead of email for anonymous users
const identifier = session?.user?.email || req.ip || 'anonymous';
```

## Monitoring

### Upstash Dashboard
- Monitor request volume
- Check storage usage
- View recent commands
- Analyze performance

### Vercel Logs
```bash
vercel logs --prod --follow
```
Look for rate limit messages:
- "Rate limit exceeded for..."
- "Rate limit check passed for..."

### Sentry Errors
Rate limit errors (429 status) are automatically tracked in Sentry:
1. Go to https://daf-xq.sentry.io
2. Filter by HTTP status 429
3. Analyze which endpoints are being rate limited most

## Security Best Practices

### ✅ Current Implementation
- Credentials stored as environment variables (not in code)
- Rate limiting on authentication endpoints (prevents brute force)
- Different limits for different user tiers (fair usage)
- IP-based limiting for anonymous requests

### 🔐 Recommendations
1. **Monitor anomalies**: Set up Sentry alerts for unusual rate limit patterns
2. **Rotate tokens**: Update Upstash tokens every 6 months
3. **Use different databases**: Separate dev/staging/production databases
4. **Enable TLS**: Always use HTTPS for Upstash connections (already enabled)

## Alternative: Development Without Upstash

If you want to test locally without Upstash:

### Option 1: Mock Rate Limiter
The current implementation gracefully fails open, so rate limiting is disabled if credentials are missing.

### Option 2: Local Redis
```bash
# Install Redis locally
# Windows: Download from https://github.com/microsoftarchive/redis/releases

# Add to .env.local
UPSTASH_REDIS_REST_URL=http://localhost:6379
UPSTASH_REDIS_REST_TOKEN=your-local-token
```

## Additional Resources

- **Upstash Docs**: https://docs.upstash.com/redis
- **@upstash/ratelimit Docs**: https://github.com/upstash/ratelimit
- **Vercel Environment Variables**: https://vercel.com/docs/environment-variables
- **Rate Limiting Best Practices**: https://cloud.google.com/architecture/rate-limiting-strategies

## Support

**Issues with this setup?**
- Check Upstash status: https://status.upstash.com
- Contact Upstash support: support@upstash.com
- Check PrepCoach docs: `/docs/` folder

---

**Last Updated**: October 25, 2025
**Status**: 🟡 Pending Upstash account setup
**Required For**: Production rate limiting activation
