# Sentry Error Tracking Setup Guide

**Status:** ✅ Sentry SDK Installed & Configured

PrepCoach is pre-configured with Sentry for error tracking, performance monitoring, and session replay. You just need to add your Sentry credentials.

---

## Quick Setup (5 minutes)

### Step 1: Create a Sentry Account

1. Go to [sentry.io/signup](https://sentry.io/signup)
2. Sign up (free plan includes 5,000 errors/month)
3. Choose "Next.js" as your platform when prompted

### Step 2: Create a Project

1. In Sentry dashboard, click **"Create Project"**
2. Select **"Next.js"** as the platform
3. Name your project: **"prepcoach"** (or "prepcoach-production")
4. Click **"Create Project"**

### Step 3: Get Your DSN

After creating the project, you'll see:
```
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxx@o12345.ingest.sentry.io/67890
```

Copy this DSN - you'll need it in the next step.

### Step 4: Get Organization & Project Slugs

1. In Sentry, go to **Settings** → **General Settings**
2. Find your **Organization Slug** (e.g., "prepcoach" or "your-username")
3. Find your **Project Slug** (e.g., "prepcoach")

### Step 5: Create an Auth Token (for Source Maps)

1. Go to **Settings** → **Auth Tokens**
2. Click **"Create New Token"**
3. Set permissions:
   - Scope: **Project**
   - Permissions: **project:releases** and **project:write**
4. Click **"Create Token"**
5. **Copy the token** - you won't see it again!

---

## Configure Environment Variables

### For Local Development (.env)

Add these to your `.env` file:

```bash
# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxx@o12345.ingest.sentry.io/67890

# Sentry Source Maps (optional for local dev)
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=prepcoach
```

### For Production (Vercel)

Add these environment variables in Vercel:

```bash
# Option 1: Via Vercel CLI
vercel env add NEXT_PUBLIC_SENTRY_DSN production
vercel env add SENTRY_AUTH_TOKEN production
vercel env add SENTRY_ORG production
vercel env add SENTRY_PROJECT production

# Option 2: Via Vercel Dashboard
# Go to: https://vercel.com/your-team/prepcoach/settings/environment-variables
```

**Values:**
- `NEXT_PUBLIC_SENTRY_DSN`: Your Sentry DSN (starts with https://)
- `SENTRY_AUTH_TOKEN`: Your Sentry auth token (for uploading source maps)
- `SENTRY_ORG`: Your organization slug (e.g., "prepcoach")
- `SENTRY_PROJECT`: Your project slug (e.g., "prepcoach")

---

## What's Already Configured

### ✅ Sentry Config Files

**Client-side tracking** (`sentry.client.config.ts`):
- Error tracking
- Session replay (10% of sessions, 100% with errors)
- Performance monitoring
- Filters out browser extension errors

**Server-side tracking** (`sentry.server.config.ts`):
- API error tracking
- Removes sensitive headers (authorization, cookies)
- Filters sensitive query params

**Edge runtime tracking** (`sentry.edge.config.ts`):
- Middleware error tracking

### ✅ Next.js Integration

**Webpack plugin** (`next.config.ts`):
- Automatic source map uploads
- React component annotations
- Tunnel route (`/monitoring`) to bypass ad-blockers
- Tree-shakes Sentry logger in production

### ✅ Features Enabled

- 📊 **Performance Monitoring** - Track slow pages and API calls
- 🎥 **Session Replay** - Watch user sessions when errors occur
- 🔍 **Source Maps** - See original code in stack traces
- 🚫 **Sensitive Data Filtering** - Removes auth headers, cookies, tokens
- 🏷️ **React Component Tracking** - See which component caused the error

---

## Test Your Setup

### Option 1: Use the Test Page

We've created a test page to verify Sentry is working:

```bash
# Start dev server
npm run dev

# Visit test page
open http://localhost:3000/test-sentry
```

Click the buttons to trigger different error types:
- Client-side error
- Server-side error
- Unhandled promise rejection

### Option 2: Manual Test

Add this to any page temporarily:

```typescript
// Trigger a test error
throw new Error('Sentry test error - ignore this');
```

Deploy and visit the page. The error should appear in your Sentry dashboard within seconds.

---

## Verify It's Working

1. Go to your Sentry dashboard: [sentry.io](https://sentry.io)
2. Navigate to **Issues**
3. You should see your test error appear

If you see the error with:
- ✅ Full stack trace
- ✅ User session replay
- ✅ Breadcrumbs (actions before error)
- ✅ Request details

**Congratulations! Sentry is fully configured!** 🎉

---

## Production Checklist

Before going live, ensure:

- [ ] `NEXT_PUBLIC_SENTRY_DSN` added to Vercel production environment
- [ ] `SENTRY_AUTH_TOKEN` added to Vercel (for source maps)
- [ ] `SENTRY_ORG` and `SENTRY_PROJECT` added to Vercel
- [ ] Tested error tracking in production
- [ ] Set up Sentry alerts (email/Slack when errors occur)
- [ ] Configure error rate alerts in Sentry

---

## Monitoring & Alerts

### Set Up Alerts

1. Go to **Alerts** in Sentry dashboard
2. Click **"Create Alert"**
3. Choose **"Issues"** alert type
4. Configure trigger (e.g., "When new issue is created")
5. Add notification channel (email, Slack, Discord)

### Recommended Alerts

**Critical:**
- New issues created (notify immediately)
- Error rate exceeds 10 errors/minute
- Performance degradation (page load > 3 seconds)

**Warning:**
- Issue seen by > 100 users
- Error frequency increases 2x

---

## Sentry Dashboard Tour

### Issues Tab
- See all errors grouped by type
- Filter by:
  - Unresolved vs Resolved
  - Environment (production vs staging)
  - User impact (how many users affected)

### Performance Tab
- Page load times
- API response times
- Slow database queries
- Web vitals (LCP, FID, CLS)

### Releases Tab
- Track errors by deployment
- Compare error rates between releases
- See which release introduced a bug

### Replays Tab
- Watch video recordings of user sessions
- See exactly what user did before error
- Includes console logs and network requests

---

## Cost Optimization

### Free Plan Limits
- **5,000 errors/month**
- **50 replays/month**
- **10,000 performance transactions/month**

### Tips to Stay Within Free Tier

1. **Adjust sample rates** in config files:
```typescript
// sentry.client.config.ts
tracesSampleRate: 0.1,  // Sample 10% of transactions
replaysSessionSampleRate: 0.05,  // Record 5% of sessions
```

2. **Filter noisy errors**:
```typescript
beforeSend(event) {
  // Ignore specific errors
  if (event.exception?.values?.[0]?.type === 'ChunkLoadError') {
    return null;
  }
  return event;
}
```

3. **Use environments** to only track production:
```typescript
enabled: process.env.NODE_ENV === 'production'
```

---

## Troubleshooting

### Error: "Sentry DSN not configured"

**Solution:** Make sure `NEXT_PUBLIC_SENTRY_DSN` is set in your environment.

```bash
# Check if it's set
echo $NEXT_PUBLIC_SENTRY_DSN

# For Vercel, check:
vercel env ls
```

### Source maps not uploading

**Solution:** Ensure `SENTRY_AUTH_TOKEN` has correct permissions:
- `project:releases`
- `project:write`
- `org:read`

### Errors not appearing in Sentry

**Checklist:**
- [ ] Is `NODE_ENV=production`? (Sentry is disabled in dev)
- [ ] Is DSN correct? (check for typos)
- [ ] Are you in an ad-blocker? (Use `/monitoring` tunnel route)
- [ ] Check browser console for Sentry errors

---

## Advanced Configuration

### Custom Error Boundaries

Already implemented in `app/components/ErrorBoundary.tsx`:

```typescript
import * as Sentry from '@sentry/nextjs';

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, {
      contexts: { react: errorInfo }
    });
  }
}
```

### User Context

Track which users encounter errors:

```typescript
import * as Sentry from '@sentry/nextjs';

// Set user context when they log in
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
  subscription: user.subscriptionTier,
});

// Clear on logout
Sentry.setUser(null);
```

### Custom Tags

Filter errors by custom dimensions:

```typescript
Sentry.setTag('feature', 'interview-practice');
Sentry.setTag('plan', 'pro');
```

---

## Support

- **Sentry Docs:** [docs.sentry.io/platforms/javascript/guides/nextjs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- **Discord:** [discord.gg/sentry](https://discord.gg/sentry)
- **GitHub:** [github.com/getsentry/sentry-javascript](https://github.com/getsentry/sentry-javascript)

---

## Summary

**What you have:**
- ✅ Sentry SDK installed
- ✅ Config files ready
- ✅ Next.js integration configured
- ✅ Source maps enabled
- ✅ Session replay enabled
- ✅ Sensitive data filtering

**What you need to do:**
1. Create Sentry account (2 min)
2. Get DSN (1 min)
3. Add environment variables (2 min)
4. Test it works (2 min)

**Total time: ~7 minutes** ⚡

Once configured, you'll have:
- Real-time error alerts
- Video replays of user sessions
- Performance monitoring
- Full stack traces with source maps

**Ready to set it up?** Follow Steps 1-5 above!
