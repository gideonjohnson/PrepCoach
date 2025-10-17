# Activate Security Features - Step-by-Step Guide

## 🚀 Quick Start (10 minutes total)

Follow these steps to activate all security features:

---

## Step 1: Set Up Sentry Error Tracking (3 minutes)

### 1.1 Create Sentry Account
1. Go to https://sentry.io/signup/
2. Sign up with your email or GitHub
3. Choose "Next.js" as your platform

### 1.2 Create Project
1. Project name: `prepcoach`
2. Platform: `Next.js`
3. Click "Create Project"

### 1.3 Get Your DSN
1. You'll see a DSN immediately after project creation
2. It looks like: `https://abc123@o123456.ingest.sentry.io/123456`
3. Copy this DSN

### 1.4 Create Auth Token
1. Go to https://sentry.io/settings/account/api/auth-tokens/
2. Click "Create New Token"
3. Name: `prepcoach-deploy`
4. Scopes: Check `project:releases` and `project:write`
5. Click "Create Token"
6. Copy the token (starts with `sntrys_`)

### 1.5 Get Organization Slug
1. Go to https://sentry.io/settings/
2. Your organization slug is in the URL: `sentry.io/settings/YOUR-ORG-SLUG/`
3. Copy this slug

### 1.6 Add to Vercel
Run these commands:
```bash
# Set Sentry DSN (public - client side)
vercel env add NEXT_PUBLIC_SENTRY_DSN production

# Paste your DSN when prompted, then press Enter

# Set Sentry Organization
vercel env add SENTRY_ORG production

# Paste your org slug, then press Enter

# Set Sentry Project
vercel env add SENTRY_PROJECT production

# Type: prepcoach
# Press Enter

# Set Sentry Auth Token (for source maps)
vercel env add SENTRY_AUTH_TOKEN production

# Paste your auth token, then press Enter
```

---

## Step 2: Set Up Upstash Redis for Rate Limiting (3 minutes)

### 2.1 Create Upstash Account
1. Go to https://console.upstash.com/
2. Sign up with email or GitHub

### 2.2 Create Redis Database
1. Click "Create Database"
2. Name: `prepcoach-ratelimit`
3. Type: Regional
4. Region: Choose closest to your users (e.g., us-east-1)
5. Click "Create"

### 2.3 Get Credentials
1. Click on your new database
2. Scroll to "REST API" section
3. Copy `UPSTASH_REDIS_REST_URL` (looks like: `https://your-db.upstash.io`)
4. Copy `UPSTASH_REDIS_REST_TOKEN` (long string)

### 2.4 Add to Vercel
```bash
# Set Redis REST URL
vercel env add UPSTASH_REDIS_REST_URL production

# Paste your REST URL, then press Enter

# Set Redis REST Token
vercel env add UPSTASH_REDIS_REST_TOKEN production

# Paste your REST token, then press Enter
```

---

## Step 3: Deploy to Production (2 minutes)

### 3.1 Trigger Deployment
```bash
# Trigger a new deployment to activate all security features
git commit --allow-empty -m "Activate security features"
git push origin master
```

### 3.2 Verify Deployment
1. Go to https://vercel.com/gideonbosiregj-6770/prepcoach
2. Wait for deployment to complete (~2 minutes)
3. Check deployment logs for any errors

---

## Step 4: Test Security Features (2 minutes)

### 4.1 Test Rate Limiting
```bash
# Test AI feedback rate limit (should allow 5 requests, block 6th)
# You'll need to be logged in to test this

# Open https://aiprep.work/practice in your browser
# Record and submit 6 responses quickly
# The 6th should show a rate limit error
```

### 4.2 Test Input Validation
```bash
# Test weak password validation
curl -X POST https://aiprep.work/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "weak"
  }'

# Expected response: Validation error about password requirements
```

### 4.3 Test Sentry Error Tracking
1. Go to https://sentry.io/organizations/YOUR-ORG/issues/
2. You should see any errors from your app
3. Try triggering an error on your site to test

---

## Step 5: Configure Sentry Alerts (Optional, 2 minutes)

### 5.1 Set Up Error Alerts
1. Go to https://sentry.io/organizations/YOUR-ORG/alerts/
2. Click "Create Alert"
3. Choose "Issues"
4. Set conditions:
   - When: `An event is seen`
   - If: `The issue is first seen`
   - Then: `Send a notification to` → Your email
5. Click "Save Rule"

### 5.2 Set Up Performance Alerts
1. Create another alert
2. Choose "Performance"
3. Set conditions:
   - When: `A metric`
   - If: `transaction.duration` is `above` `1000ms`
   - Then: Send notification
4. Save

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Sentry DSN is set in Vercel environment variables
- [ ] Sentry Auth Token is set in Vercel
- [ ] Upstash Redis URL is set in Vercel
- [ ] Upstash Redis Token is set in Vercel
- [ ] New deployment completed successfully
- [ ] Rate limiting works (test with multiple requests)
- [ ] Input validation works (test with invalid data)
- [ ] Errors appear in Sentry dashboard
- [ ] Sentry alerts are configured

---

## 🔧 Troubleshooting

### Rate Limiting Not Working
**Symptom**: Can make unlimited requests
**Solution**:
1. Check Upstash credentials are correct in Vercel
2. Verify Redis database is active in Upstash dashboard
3. Check Vercel deployment logs for Redis connection errors

### Sentry Not Receiving Errors
**Symptom**: No errors in Sentry dashboard
**Solution**:
1. Verify DSN is correct in Vercel env vars
2. Check Sentry project is active
3. Trigger a test error: Go to a non-existent page like `/test-404`
4. Wait 1-2 minutes for error to appear

### Input Validation Not Working
**Symptom**: Invalid inputs are accepted
**Solution**:
1. Check browser console for validation errors
2. Verify Zod is installed: `npm list zod`
3. Check API route has validation code

### Environment Variables Not Applied
**Symptom**: Features not working after adding env vars
**Solution**:
1. Make sure you added vars to "production" environment
2. Trigger a new deployment: `git commit --allow-empty -m "redeploy" && git push`
3. Wait for deployment to complete

---

## 📊 Monitoring Your Security

### Daily Checks
1. **Sentry Dashboard**: https://sentry.io/organizations/YOUR-ORG/issues/
   - Review new errors
   - Check error trends
   - Investigate high-frequency issues

2. **Upstash Dashboard**: https://console.upstash.com/
   - Monitor request volume
   - Check rate limit hits
   - Review Redis usage

### Weekly Reviews
- Review top errors in Sentry
- Analyze rate limit patterns
- Check for unusual API usage
- Review validation error trends

### Monthly Actions
- Rotate Sentry auth token
- Review and adjust rate limits
- Update validation schemas if needed
- Check for security updates: `npm audit`

---

## 🎯 What's Now Protected

### ✅ Error Tracking & Monitoring
- Real-time error notifications
- Session replay for debugging
- Performance monitoring
- Source map support for readable errors

### ✅ Rate Limiting
- **Free Users**: 10 requests per 10 seconds
- **Pro Users**: 100 requests per 10 seconds
- **Enterprise**: 1000 requests per 10 seconds
- **AI Feedback**: 5 requests per minute
- **Transcription**: 10 requests per minute
- **Auth**: 5 attempts per minute (prevents brute force)

### ✅ Input Validation
- XSS prevention (HTML sanitization)
- SQL injection prevention (Prisma + validation)
- Strong password requirements
- Email validation
- Length limits on all inputs

---

## 🚀 Next Steps After Activation

1. **Monitor for 24 hours**
   - Watch Sentry for unexpected errors
   - Check rate limit hit rates
   - Review validation error patterns

2. **Adjust Rate Limits if Needed**
   - If legitimate users hit limits, increase in `lib/rate-limit.ts`
   - If seeing abuse, decrease limits

3. **Set Up Additional Alerts**
   - Slack integration for critical errors
   - PagerDuty for high-priority issues
   - Email digests for daily summaries

4. **Document Incidents**
   - Keep log of security events
   - Track false positives
   - Note any needed adjustments

---

## 💰 Cost Estimate

### Sentry (Free Tier)
- ✅ 5,000 errors/month: FREE
- ✅ 10,000 performance units/month: FREE
- ✅ 50 session replays/month: FREE
- 💵 After free tier: $29/month

### Upstash Redis (Free Tier)
- ✅ 10,000 requests/day: FREE
- ✅ 256 MB storage: FREE
- 💵 After free tier: Pay as you go (~$0.20 per 100k requests)

**Total Monthly Cost**: $0 for most small apps! 🎉

---

## 📞 Support Resources

- **Sentry Docs**: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Upstash Docs**: https://docs.upstash.com/redis
- **Vercel Env Vars**: https://vercel.com/docs/environment-variables
- **Our Security Docs**: `docs/SECURITY_IMPROVEMENTS.md`

---

**Ready to activate? Start with Step 1!** 🚀
