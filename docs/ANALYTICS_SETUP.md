# Google Analytics 4 (GA4) Setup Guide

## Overview

PrepCoach uses Google Analytics 4 (GA4) to track user behavior, conversions, and application performance. This guide covers setup, configuration, and usage.

## Features

✅ **Automatic Page View Tracking**
✅ **User Identification** (tracks logged-in users by ID and subscription tier)
✅ **Custom Event Tracking** (interview practice, resume uploads, purchases)
✅ **Conversion Tracking** (signups, upgrades, purchases)
✅ **Performance Monitoring** (AI operation timing, page load times)
✅ **Error Tracking** (exceptions and failures)

## Setup Instructions

### Step 1: Create Google Analytics 4 Property

1. Go to https://analytics.google.com
2. Click **Admin** (gear icon in bottom left)
3. Click **Create Property**
4. Fill in property details:
   - **Property name**: PrepCoach
   - **Time zone**: Your timezone
   - **Currency**: USD
5. Click **Next** → **Create**
6. Create a **Web** data stream:
   - **Website URL**: https://aiprep.work
   - **Stream name**: PrepCoach Production
7. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Add to Vercel Environment Variables

#### Option A: Using Vercel CLI (Recommended)

```bash
cd C:\Users\Administrator\prepcoach

# Add GA Tracking ID for production
vercel env add NEXT_PUBLIC_GA_TRACKING_ID production
# Paste: G-XXXXXXXXXX (your Measurement ID)

# Add for development (optional)
vercel env add NEXT_PUBLIC_GA_TRACKING_ID development
# Paste: G-XXXXXXXXXX (same or different for dev/prod)
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/gideons-projects-07acaa4a/prepcoach
2. Click **Settings** → **Environment Variables**
3. Add variable:
   - **Name**: `NEXT_PUBLIC_GA_TRACKING_ID`
   - **Value**: `G-XXXXXXXXXX` (your Measurement ID)
   - **Environment**: ✅ Production, Development (optional), Preview (optional)
4. Click **Save**

### Step 3: Add to Local Environment (Development)

Add to `.env.local`:

```bash
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

**Note:** Analytics will only load if a valid tracking ID is set. If not configured, analytics will log events to console in development mode instead.

### Step 4: Deploy

```bash
# Trigger new deployment to pick up environment variable
vercel --prod

# Or push a commit
git commit --allow-empty -m "Trigger deployment for GA setup"
git push origin master
```

### Step 5: Verify Setup

1. Go to https://aiprep.work
2. Open browser DevTools → Network tab
3. Look for requests to `www.google-analytics.com` or `www.googletagmanager.com`
4. Go to GA4 dashboard → Reports → Realtime
5. You should see your visit in real-time

## Usage

### Automatic Tracking

The following are tracked automatically (no code required):

**✅ Page Views**
- Tracked on every route change
- Includes query parameters
- Handled by `<AnalyticsPageViews />` component

**✅ User Identification**
- Tracks user ID when logged in
- Tracks subscription tier (free, pro, enterprise)
- Handled by `<AnalyticsUser />` component

### Manual Event Tracking

#### In React Components (Recommended)

Use the `useAnalytics()` hook:

```typescript
import { useAnalytics } from '@/lib/hooks/useAnalytics';

function MyComponent() {
  const analytics = useAnalytics();

  const handleInterviewStart = () => {
    analytics.trackInterviewStart({
      role: 'Software Engineer',
      difficulty: 'medium',
      sessionId: 'abc123',
    });
  };

  const handleResumeUpload = (file: File) => {
    analytics.trackResumeUpload({
      fileType: file.type,
      fileSize: file.size,
    });
  };

  const handleUpgrade = () => {
    analytics.trackUpgradeClick({
      plan: 'Pro',
      source: 'pricing_page',
    });
  };

  return (
    <button onClick={handleInterviewStart}>
      Start Interview
    </button>
  );
}
```

#### In Server Components or API Routes

Use the analytics utilities directly:

```typescript
import { event, AnalyticsEvents } from '@/lib/analytics';

// Track custom event
event(AnalyticsEvents.RESUME_TRANSFORM, {
  targetRole: 'Software Engineer',
  hasJobDescription: true,
});

// Track conversion
import { trackConversion } from '@/lib/analytics';

trackConversion({
  transactionId: 'txn_123',
  value: 19.00,
  currency: 'USD',
  items: [{
    id: 'pro_monthly',
    name: 'PrepCoach Pro',
    price: 19.00,
    quantity: 1,
  }],
});
```

## Tracked Events

### Authentication Events

| Event | Parameters | Triggered When |
|-------|-----------|----------------|
| `signup` | `user_tier` | User creates account |
| `login` | `user_tier` | User signs in |
| `logout` | - | User signs out |

### Interview Practice Events

| Event | Parameters | Triggered When |
|-------|-----------|----------------|
| `interview_start` | `role`, `difficulty`, `session_id` | Interview session begins |
| `interview_complete` | `role`, `score`, `session_id` | Interview session finishes |
| `question_answered` | `question_type`, `session_id` | User answers question |

### AI Feedback Events

| Event | Parameters | Triggered When |
|-------|-----------|----------------|
| `feedback_request` | `role`, `question_type` | User requests AI feedback |
| `feedback_viewed` | `score` | User views feedback |

### Audio Events

| Event | Parameters | Triggered When |
|-------|-----------|----------------|
| `audio_record_start` | - | Recording starts |
| `audio_record_stop` | `duration` | Recording stops |
| `audio_transcribe` | `duration`, `success` | Transcription completes |

### Resume Events

| Event | Parameters | Triggered When |
|-------|-----------|----------------|
| `resume_upload` | `fileType`, `fileSize` | Resume uploaded |
| `resume_transform` | `targetRole`, `hasJobDescription` | Resume transformed with AI |
| `resume_download` | `format` | Resume downloaded |
| `resume_ats_scan` | `score` | ATS scan completed |

### Payment Events

| Event | Parameters | Triggered When |
|-------|-----------|----------------|
| `upgrade_click` | `plan`, `source` | User clicks upgrade button |
| `checkout_start` | `plan`, `value` | Checkout initiated |
| `purchase` | `transaction_id`, `value`, `currency` | Purchase completed |
| `subscription_cancel` | `plan` | Subscription cancelled |

### Performance Events

| Event | Parameters | Triggered When |
|-------|-----------|----------------|
| `ai_operation` | `operation`, `tokens`, `duration`, `success` | AI operation completes |
| `timing_complete` | `name`, `value`, `category` | Performance timing recorded |

## Custom Dimensions & User Properties

### User Properties (automatically set)

- `user_id` - Unique user ID
- `email` - User email (hashed)
- `subscriptionTier` - free, pro, enterprise, lifetime

### Custom Parameters

You can add custom parameters to any event:

```typescript
analytics.trackEvent('custom_event', {
  category: 'Feature',
  label: 'Button Click',
  value: 1,
  custom_param: 'custom_value',
});
```

## GA4 Dashboard Configuration

### Recommended Custom Reports

**1. Conversion Funnel**
- Signup → Interview Practice → Upgrade Click → Purchase

**2. Feature Usage**
- Track usage of Interview Practice, Resume Builder, LinkedIn Optimizer

**3. User Engagement**
- Session duration by subscription tier
- Pages per session
- Return visitor rate

**4. AI Operation Performance**
- AI operation count
- Average duration
- Success rate
- Token usage

### Recommended Conversions

Mark these events as conversions in GA4:

1. `signup` - New user registration
2. `purchase` - Subscription purchase
3. `interview_complete` - Completed interview session
4. `resume_transform` - Used premium feature

**To add conversions:**
1. Go to GA4 → Admin → Events
2. Find the event
3. Toggle "Mark as conversion"

## Tracking Best Practices

### ✅ Do's

- Track key user actions (feature usage, conversions)
- Track performance metrics (AI operation timing)
- Track errors and exceptions
- Use consistent event naming (snake_case)
- Include context parameters (role, difficulty, etc.)

### ❌ Don'ts

- Don't track PII (Personally Identifiable Information)
  - ❌ Full names, email addresses in plain text
  - ✅ User IDs, hashed emails are OK
- Don't track sensitive data (passwords, API keys, tokens)
- Don't track too granularly (every button click)
- Don't forget to test in development first

## Privacy & Compliance

### GDPR Compliance

PrepCoach analytics implementation is GDPR-compliant:

✅ **IP Anonymization**: Enabled (`anonymize_ip: true`)
✅ **Cookie Consent**: Implemented (required for EU users)
✅ **Data Retention**: 14 months (GA4 default)
✅ **User Opt-out**: Supported via cookie preferences

### Data Collection

**What we track:**
- Page views and navigation
- Feature usage (interviews, resume building, etc.)
- Conversion events (signups, upgrades)
- Performance metrics
- User ID (for logged-in users)
- Subscription tier

**What we DON'T track:**
- Passwords or credentials
- Payment details (handled by Stripe)
- Interview responses content (only metadata)
- Resume content (only metadata)
- Personal information beyond user ID

## Troubleshooting

### Analytics Not Loading

**Check:**
1. Is `NEXT_PUBLIC_GA_TRACKING_ID` set in Vercel?
   ```bash
   vercel env ls production
   ```
2. Is the tracking ID format correct? (Should be `G-XXXXXXXXXX`)
3. Check browser console for errors
4. Check Network tab for `gtag` requests

### Events Not Appearing in GA4

**Debugging:**
1. Check GA4 Realtime reports (data appears within seconds)
2. Check standard reports (data appears within 24-48 hours)
3. Use GA4 DebugView:
   - Install Google Analytics Debugger Chrome extension
   - Refresh page
   - Go to GA4 → Admin → DebugView
4. Check browser console (dev mode logs events)

### Double Counting

**Cause:** Analytics loaded multiple times

**Fix:**
- Ensure `<GoogleAnalytics />` is only in `<Providers />`
- Check for duplicate tracking IDs
- Verify `strategy="afterInteractive"` is set

## Development vs Production

**Development Mode:**
- Analytics logs events to console instead of GA
- Helps debug without polluting production data
- Set `NEXT_PUBLIC_GA_TRACKING_ID` in `.env.local` to test

**Production Mode:**
- Analytics sends data to GA4
- Requires valid tracking ID in Vercel environment

## Analytics Dashboard Quick Links

- **Google Analytics**: https://analytics.google.com
- **Realtime Report**: https://analytics.google.com/analytics/web/#/realtime
- **Conversions**: https://analytics.google.com/analytics/web/#/report/conversions
- **User Acquisition**: https://analytics.google.com/analytics/web/#/report/acquisition-overview

## Support

**Issues with this setup?**
- Check this documentation
- Test in GA4 DebugView
- Check Vercel deployment logs
- Review browser console

**Useful Resources:**
- GA4 Documentation: https://support.google.com/analytics/answer/10089681
- GA4 Event Reference: https://developers.google.com/analytics/devguides/collection/ga4/reference/events
- Next.js Analytics: https://nextjs.org/docs/app/building-your-application/optimizing/analytics

---

**Last Updated:** October 25, 2025
**Status:** ✅ Configured
**Ready For:** Production deployment with GA4 tracking ID
