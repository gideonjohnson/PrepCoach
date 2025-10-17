# 🚀 Quick Security Activation (5 minutes)

## Option 1: Automated Setup (Recommended)

Run this single command to set up everything interactively:

```bash
bash scripts/setup-security.sh
```

The script will:
1. ✅ Guide you through Sentry setup
2. ✅ Guide you through Upstash setup
3. ✅ Add all environment variables to Vercel
4. ✅ Trigger deployment automatically

---

## Option 2: Manual Setup

### Step 1: Sentry (2 minutes)
```bash
# 1. Go to https://sentry.io/signup/ and create account
# 2. Create Next.js project named "prepcoach"
# 3. Copy your DSN and run:

vercel env add NEXT_PUBLIC_SENTRY_DSN production
# Paste: https://abc@o123.ingest.sentry.io/456

vercel env add SENTRY_ORG production
# Paste: your-org-slug

vercel env add SENTRY_PROJECT production
# Type: prepcoach

vercel env add SENTRY_AUTH_TOKEN production
# Create token at: https://sentry.io/settings/account/api/auth-tokens/
# Scopes: project:releases, project:write
# Paste token here
```

### Step 2: Upstash Redis (2 minutes)
```bash
# 1. Go to https://console.upstash.com/ and create account
# 2. Create Redis database named "prepcoach-ratelimit"
# 3. Get REST API credentials and run:

vercel env add UPSTASH_REDIS_REST_URL production
# Paste: https://your-db.upstash.io

vercel env add UPSTASH_REDIS_REST_TOKEN production
# Paste your token
```

### Step 3: Deploy (1 minute)
```bash
git commit --allow-empty -m "Activate security features"
git push origin master
```

---

## Option 3: Test Without External Services (Development)

If you want to test locally without Sentry/Upstash:

```bash
# Security features will gracefully degrade:
# - Sentry: Disabled in development by default
# - Rate limiting: Allows all requests if Redis not configured
# - Input validation: Still works (no external service needed)

# Just run your local server
npm run dev
```

**Input validation will still work!** It doesn't require any external services.

---

## Verify It's Working

### Test Input Validation (works immediately)
```bash
curl -X POST https://aiprep.work/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"weak"}'

# Should return: Validation errors
```

### Test Rate Limiting (after Upstash setup)
```bash
# Run test script
bash scripts/test-security.sh
```

### Check Sentry (after Sentry setup)
1. Go to https://sentry.io/
2. Visit your app: https://aiprep.work
3. Trigger an error (visit /non-existent-page)
4. Check Sentry dashboard for the error

---

## What's Active Right Now (Before External Setup)

✅ **Already Working:**
- Input validation with Zod (passwords, emails, data)
- XSS prevention (HTML sanitization)
- SQL injection prevention (Prisma ORM)
- Secure password hashing (bcrypt)

⏳ **Needs API Keys:**
- Error tracking (Sentry DSN required)
- Rate limiting (Upstash Redis required)

---

## Cost (Both Have Free Tiers!)

### Sentry Free Tier
- 5,000 errors/month
- 10,000 performance transactions/month
- 50 session replays/month
- **Cost: $0/month for small apps**

### Upstash Free Tier
- 10,000 requests/day
- 256 MB storage
- **Cost: $0/month for small apps**

---

## Quick Links

- 📚 Full Guide: [ACTIVATE_SECURITY.md](./ACTIVATE_SECURITY.md)
- 🔐 Security Docs: [docs/SECURITY_IMPROVEMENTS.md](./docs/SECURITY_IMPROVEMENTS.md)
- 🧪 Test Script: `bash scripts/test-security.sh`
- ⚙️ Setup Script: `bash scripts/setup-security.sh`

---

**Choose your option and let's activate security! 🔐**
