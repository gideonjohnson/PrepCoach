# Sentry Error Tracking - Ready to Configure

**Status:** ✅ Fully Configured - Just Add Your DSN

**Last Updated:** 2025-10-25

---

## What's Been Set Up

PrepCoach now has complete Sentry error tracking ready to go. All code is in place - you just need to add your Sentry credentials.

---

## ✅ Complete Implementation

### 1. Sentry SDK Integration
- ✅ `@sentry/nextjs` v10.20.0 installed
- ✅ Client-side tracking (`sentry.client.config.ts`)
- ✅ Server-side tracking (`sentry.server.config.ts`)
- ✅ Edge runtime tracking (`sentry.edge.config.ts`)

### 2. Next.js Webpack Plugin
- ✅ Source map uploads configured (`next.config.ts`)
- ✅ React component annotations enabled
- ✅ Tunnel route configured (`/monitoring`)
- ✅ Tree-shaking enabled for production

### 3. User Context Tracking
- ✅ Automatic user identification (`SentryUser` component)
- ✅ Tracks user ID, email, subscription tier
- ✅ Clears context on logout
- ✅ Integrated into app providers

### 4. Error Boundaries
- ✅ Already implemented in `ErrorBoundary` component
- ✅ Captures React component errors
- ✅ Sends to Sentry with context

### 5. Testing Tools
- ✅ Test page created: `/test-sentry`
- ✅ Test API endpoint: `/api/test-sentry-error`
- ✅ Tests client errors, server errors, performance
- ✅ Visual configuration status

### 6. Documentation
- ✅ Complete setup guide: `docs/SENTRY_SETUP.md`
- ✅ Step-by-step instructions
- ✅ Configuration examples
- ✅ Troubleshooting tips

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Sentry Account
```
1. Go to https://sentry.io/signup
2. Sign up (free tier: 5,000 errors/month)
3. Create a "Next.js" project
4. Name it "prepcoach"
```

### Step 2: Get Your DSN
After creating the project, copy your DSN:
```
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxx@o12345.ingest.sentry.io/67890
```

### Step 3: Add to Vercel
```bash
# Add DSN
vercel env add NEXT_PUBLIC_SENTRY_DSN production
# Paste your DSN when prompted

# Add organization & project (for source maps)
vercel env add SENTRY_ORG production
# Enter your org slug (e.g., "prepcoach")

vercel env add SENTRY_PROJECT production
# Enter your project slug (e.g., "prepcoach")

# Add auth token (for source maps)
vercel env add SENTRY_AUTH_TOKEN production
# Create token at: https://sentry.io/settings/account/api/auth-tokens/
# Needs scopes: project:releases, project:write
```

### Step 4: Deploy
```bash
git push origin master
```

Vercel will automatically build and deploy with Sentry enabled.

### Step 5: Test
```
1. Visit https://aiprep.work/test-sentry
2. Click "Client-Side Error" button
3. Check Sentry dashboard for the error
```

**If you see the error in Sentry: ✅ You're done!**

---

## 📊 Features Enabled

### Error Tracking
- ✅ Client-side JavaScript errors
- ✅ Server-side Node.js errors
- ✅ API route errors
- ✅ Unhandled promise rejections
- ✅ React component errors

### Performance Monitoring
- ✅ Page load times
- ✅ API response times
- ✅ Database query performance
- ✅ Custom transactions

### Session Replay
- ✅ 10% of all sessions recorded
- ✅ 100% of error sessions recorded
- ✅ Video playback of user actions
- ✅ Console logs and network requests

### Context & Filtering
- ✅ User identification (ID, email, tier)
- ✅ Sensitive data filtering (auth headers, cookies)
- ✅ Browser extension errors filtered
- ✅ Custom tags and metadata

---

## 🔐 Security Features

### Sensitive Data Protection
```typescript
// Automatically removes:
- Authorization headers
- Cookie headers
- API keys in query params
- Auth tokens in URLs
```

### Privacy Compliance
```typescript
// Session replay settings:
- Text masking enabled
- Media blocking enabled
- Sensitive inputs hidden
```

---

## 📁 Files Created/Modified

### New Files
```
✅ docs/SENTRY_SETUP.md          - Complete setup guide
✅ app/test-sentry/page.tsx      - Testing dashboard
✅ app/api/test-sentry-error/    - Test API endpoint
✅ app/components/SentryUser.tsx - User tracking component
✅ SENTRY_READY.md              - This file
```

### Modified Files
```
✅ app/providers.tsx             - Added SentryUser component
```

### Existing Files (Pre-configured)
```
✅ sentry.client.config.ts       - Client SDK config
✅ sentry.server.config.ts       - Server SDK config
✅ sentry.edge.config.ts         - Edge runtime config
✅ next.config.ts                - Webpack plugin config
✅ .env.example                  - Environment template
```

---

## 🎯 What You Get

### Real-Time Alerts
- Email notifications when errors occur
- Slack/Discord integration available
- Custom alert rules (error rate, user impact)

### Debugging Tools
- Full stack traces with source maps
- User session replays
- Breadcrumbs (actions before error)
- Request/response data
- Console logs

### Analytics
- Error frequency trends
- Most affected users
- Browser/device breakdown
- Release tracking
- Performance metrics

---

## 💰 Cost

### Free Tier (Current)
- 5,000 errors/month
- 50 session replays/month
- 10,000 performance events/month
- 1 project
- 30-day data retention

### What Happens at Limit
- Errors stop being tracked until next month
- No data loss for existing errors
- Upgrade prompts in dashboard

### Tips to Stay Free
```typescript
// Adjust sample rates in configs:
tracesSampleRate: 0.1  // Track 10% of transactions
replaysSessionSampleRate: 0.05  // Record 5% of sessions
```

---

## 📈 Monitoring Dashboard

Once configured, you'll have access to:

### Issues Tab
- All errors grouped by type
- Filter by status, user impact, environment
- Stack traces with source code
- User comments and assignments

### Performance Tab
- Page load times
- API endpoint performance
- Database query times
- Web vitals (LCP, FID, CLS)

### Replays Tab
- Video recordings of sessions
- See exactly what user did
- Console logs and network activity
- Click-through debugging

### Releases Tab
- Track errors by deployment
- Compare versions
- Identify which release broke what

---

## 🧪 Testing Checklist

Before going live, test these scenarios:

### Client-Side Errors
- [ ] Visit `/test-sentry`
- [ ] Click "Client-Side Error"
- [ ] Verify error appears in Sentry dashboard
- [ ] Check stack trace shows correct file/line

### Server-Side Errors
- [ ] Visit `/test-sentry`
- [ ] Click "Server-Side Error"
- [ ] Verify API error appears in Sentry
- [ ] Check server context is included

### User Context
- [ ] Sign in to PrepCoach
- [ ] Trigger any error
- [ ] Verify user email/ID shown in Sentry
- [ ] Check subscription tier is tagged

### Performance Tracking
- [ ] Visit `/test-sentry`
- [ ] Click "Performance Tracking"
- [ ] Check transaction appears in Performance tab
- [ ] Verify timing data is accurate

### Session Replay
- [ ] Trigger an error while logged in
- [ ] Go to Sentry → Replays
- [ ] Watch the session recording
- [ ] Verify actions are captured

---

## ⚙️ Configuration Reference

### Environment Variables Required

```bash
# Required for error tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxx@oXXX.ingest.sentry.io/XXX

# Required for source maps (production builds)
SENTRY_AUTH_TOKEN=your_auth_token
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=prepcoach
```

### Optional Configuration

```bash
# Sentry environment name (default: production)
SENTRY_ENVIRONMENT=production

# Disable in specific environments
SENTRY_DISABLED=false
```

---

## 🆘 Troubleshooting

### "DSN not configured" error
**Solution:** Add `NEXT_PUBLIC_SENTRY_DSN` to your environment and redeploy.

### Errors not appearing in Sentry
**Checklist:**
1. Is `NODE_ENV=production`? (Sentry disabled in dev)
2. Is DSN correct and active?
3. Check browser console for Sentry errors
4. Try the `/monitoring` tunnel route

### Source maps not uploading
**Solution:** Ensure `SENTRY_AUTH_TOKEN` has these permissions:
- `project:releases`
- `project:write`
- `org:read`

### Too many events (hitting limits)
**Solution:** Reduce sample rates in config files:
```typescript
tracesSampleRate: 0.1  // 10% instead of 100%
replaysSessionSampleRate: 0.05  // 5% instead of 10%
```

---

## 📞 Support Resources

- **Setup Guide:** `docs/SENTRY_SETUP.md`
- **Test Page:** `/test-sentry`
- **Sentry Docs:** [docs.sentry.io/platforms/javascript/guides/nextjs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- **Discord:** [discord.gg/sentry](https://discord.gg/sentry)

---

## 🎉 Summary

**You have:**
- ✅ Sentry SDK fully configured
- ✅ Error tracking ready
- ✅ Performance monitoring enabled
- ✅ Session replay configured
- ✅ User context tracking
- ✅ Testing tools created
- ✅ Documentation complete

**You need:**
1. Create Sentry account (2 min)
2. Get DSN (1 min)
3. Add to Vercel (2 min)
4. Deploy & test (2 min)

**Total time: ~7 minutes to go live!** ⚡

---

**Ready to configure?** Follow the Quick Start above or read the full guide in `docs/SENTRY_SETUP.md`
