# 🚀 PrepCoach Production Launch Checklist

**Launch Date:** 2025-11-14
**Status:** Ready to Deploy

---

## 📋 Pre-Launch Checklist

### 1. ✅ Sentry Error Tracking Setup

**Steps:**
1. Go to https://sentry.io/signup/
2. Create a free account (or sign in)
3. Create a new project:
   - Platform: **Next.js**
   - Project Name: **PrepCoach** (or prepcoach)
   - Team: Use your default team
4. Copy your DSN (looks like: `https://xxxxx@oXXXXX.ingest.sentry.io/XXXXXXX`)
5. Add to Vercel environment variables:
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@oXXXXX.ingest.sentry.io/XXXXXXX
   SENTRY_ORG=your-org-name
   SENTRY_PROJECT=prepcoach
   ```

**Free Tier Limits:**
- 5,000 errors/month
- 10,000 performance events/month
- 50 session replays/month
- Perfect for MVP launch!

---

### 2. ⚠️ Upstash Redis Setup (Optional but Recommended)

**Option A: Set up now (Recommended)**

**Steps:**
1. Go to https://console.upstash.com/
2. Sign up with GitHub (free)
3. Create new database:
   - Name: **prepcoach-ratelimit**
   - Type: **Regional** (choose closest region)
   - Primary Region: **US East** or your target region
4. Copy credentials:
   ```
   UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AxxxXXXxxxxXXXxx
   ```
5. Add to Vercel environment variables

**Free Tier Limits:**
- 10,000 commands/day
- 256MB storage
- Sufficient for initial launch!

**Option B: Skip for now**
- Rate limiting will "fail open" (allow all requests)
- Can add later without code changes
- Monitor traffic first, then add if needed

---

### 3. ✅ Production Environment Variables

**Required Variables:**

```bash
# Database (Already configured via Vercel?)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://prepcoach.vercel.app" # Your actual domain
NEXTAUTH_SECRET="your-secret-key-here" # Already set?

# AI APIs
ANTHROPIC_API_KEY="sk-ant-api03-..." # Already set?
OPENAI_API_KEY="sk-proj-..." # Already set?

# ElevenLabs (Voice)
ELEVENLABS_API_KEY="sk_..." # Already set?
ELEVENLABS_VOICE_ID="21m00Tcm4TlvDq8ikWAM" # Already set?

# Admin
ADMIN_EMAIL="admin@prepcoach.local" # Already set?
ADMIN_PASSWORD="..." # Already set?

# Stripe (PRODUCTION KEYS!)
STRIPE_SECRET_KEY="sk_live_..." # ⚠️ Must be LIVE key!
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..." # ⚠️ Must be LIVE key!
STRIPE_WEBHOOK_SECRET="whsec_..." # From Stripe dashboard
STRIPE_PRO_PRICE_ID="price_..." # Your live price ID
STRIPE_ENTERPRISE_PRICE_ID="price_..." # Your live price ID

# Paystack (if using)
PAYSTACK_SECRET_KEY="sk_live_..." # ⚠️ Must be LIVE key!
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_live_..." # ⚠️ Must be LIVE key!
PAYSTACK_PRO_PLAN_CODE="PLN_..."
PAYSTACK_ENTERPRISE_PLAN_CODE="PLN_..."

# Sentry (NEW - from step 1)
NEXT_PUBLIC_SENTRY_DSN="https://..."
SENTRY_ORG="your-org"
SENTRY_PROJECT="prepcoach"

# Upstash Redis (NEW - from step 2, optional)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Google Analytics (Optional)
NEXT_PUBLIC_GA_TRACKING_ID="G-XXXXXXXXXX"
```

---

### 4. 🔐 Stripe Live Keys Verification

**⚠️ CRITICAL: Use LIVE keys, not TEST keys!**

**Steps:**
1. Go to https://dashboard.stripe.com/
2. **Toggle from "Test mode" to "Live mode"** (top right)
3. Get API keys:
   - Go to Developers → API Keys
   - Copy **Live** Secret key (starts with `sk_live_`)
   - Copy **Live** Publishable key (starts with `pk_live_`)
4. Get Price IDs:
   - Go to Products
   - Find your Pro plan → Copy price ID (starts with `price_`)
   - Find your Enterprise plan → Copy price ID
5. Set up webhook:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy webhook signing secret (starts with `whsec_`)

**Important:** Test webhooks with Stripe CLI before launch:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

---

### 5. 💳 Payment Gates Status

**Check current status:**

```bash
# Search for payment gates in code
grep -r "PAYMENT_GATES_DISABLED" app/ 2>&1 || echo "No payment gates variable found"
```

**Options:**

**Option A: Keep gates disabled for soft launch**
- Good for testing with initial users
- Collect feedback before monetizing
- Easy to enable later

**Option B: Enable payment gates for launch**
1. Follow instructions in `PAYMENT_GATES_CONTROL.md`
2. Ensure Stripe live keys are set
3. Test checkout flow thoroughly

**Recommendation:** Keep disabled for first week, monitor usage, then enable

---

### 6. 🧪 Pre-Deployment Testing

**Run these tests locally:**

```bash
# 1. Build test
npm run build

# 2. Check for TypeScript errors
npx tsc --noEmit

# 3. Test production build locally
npm run start

# 4. Security audit
npm audit --production

# 5. Check bundle size
npm run build | grep -i "size"
```

**Critical Manual Tests:**
- [ ] User signup flow
- [ ] Email verification
- [ ] Login/logout
- [ ] Interview practice (all question types)
- [ ] AI feedback generation
- [ ] Resume builder
- [ ] LinkedIn optimizer
- [ ] Subscription checkout (use Stripe test card: 4242 4242 4242 4242)
- [ ] Password reset flow
- [ ] Session timeout warning

---

### 7. 🌐 Vercel Deployment

**Prerequisites:**
- Vercel account connected to GitHub repo
- Domain configured (optional but recommended)

**Deployment Steps:**

**Option A: Deploy via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
5. Add all environment variables (from step 3)
6. Click "Deploy"

**Option B: Deploy via CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Add environment variables
vercel env add NEXT_PUBLIC_SENTRY_DSN
vercel env add UPSTASH_REDIS_REST_URL
# ... etc for all variables
```

**Custom Domain Setup (Recommended):**
1. In Vercel project settings → Domains
2. Add your domain (e.g., prepcoach.ai)
3. Update DNS records as instructed
4. Wait for DNS propagation (5-30 minutes)
5. Update `NEXTAUTH_URL` to your custom domain

---

### 8. ✅ Post-Deployment Verification

**Immediate Checks:**

```bash
# 1. Check deployment is live
curl https://your-domain.vercel.app/

# 2. Check API health
curl https://your-domain.vercel.app/api/health

# 3. Check Sentry is receiving events
# Trigger a test error: Visit /test-sentry
```

**Manual Verification:**
- [ ] Homepage loads correctly
- [ ] Assets (images, fonts) load from CDN
- [ ] User can sign up
- [ ] Email verification works
- [ ] User can practice interview
- [ ] AI feedback generates successfully
- [ ] Sentry captures errors (check dashboard)
- [ ] Rate limiting works (if Upstash configured)
- [ ] Mobile responsive design works
- [ ] Safari compatibility verified

**Database Checks:**
```bash
# Check database connection
npx prisma studio
# Verify users table, sessions, etc.
```

**Stripe Webhook Verification:**
1. Go to Stripe Dashboard → Webhooks
2. Check webhook events are being received
3. Test a subscription checkout end-to-end
4. Verify user subscription status updates in database

---

## 🚨 Emergency Rollback Plan

If something goes wrong:

1. **Vercel:** Instant rollback to previous deployment
   ```bash
   vercel rollback
   ```
   Or via dashboard: Deployments → Previous deployment → Promote to Production

2. **Environment Variables:** Keep a backup of all .env values

3. **Database:** Ensure you have recent backup
   ```bash
   # If using Neon/Supabase, enable daily backups
   ```

---

## 📊 Post-Launch Monitoring

**First 24 Hours:**
- [ ] Monitor Sentry for errors (set up alerts)
- [ ] Check Vercel Analytics for traffic
- [ ] Monitor Stripe dashboard for checkout attempts
- [ ] Check database for user signups
- [ ] Monitor rate limit analytics (if using Upstash)
- [ ] Review server logs in Vercel

**First Week:**
- [ ] Gather user feedback
- [ ] Monitor conversion funnel
- [ ] Check AI API usage (Anthropic/OpenAI costs)
- [ ] Review error rates and fix critical bugs
- [ ] Optimize slow API endpoints

**Tools to Set Up:**
- [ ] Sentry alerts for critical errors
- [ ] Vercel monitoring (built-in)
- [ ] Google Analytics (optional)
- [ ] Stripe email notifications for payments
- [ ] Upstash Redis monitoring

---

## 🎯 Launch Checklist Summary

**Before clicking "Deploy":**
- [ ] Sentry DSN configured
- [ ] Upstash Redis configured (optional)
- [ ] All production env vars added to Vercel
- [ ] Stripe LIVE keys verified (not test!)
- [ ] Stripe webhook configured
- [ ] Payment gates decision made
- [ ] Local build successful
- [ ] Tests passed
- [ ] Domain configured (optional)

**After deployment:**
- [ ] Site is accessible
- [ ] Sentry receiving events
- [ ] User signup works
- [ ] AI features work
- [ ] Payments work (if enabled)
- [ ] Mobile/Safari tested
- [ ] Monitoring set up

---

## 🎉 Ready to Launch!

Your app is production-ready with:
- ✅ Enterprise-grade error tracking
- ✅ Rate limiting protection
- ✅ Input validation & security
- ✅ Cross-browser compatibility
- ✅ Mobile optimization
- ✅ Payment system integration
- ✅ Session management

**Time to deploy:** ~30-60 minutes for full setup

**Let's go live! 🚀**
