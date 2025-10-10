# PrepCoach - Production Deployment Guide

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] Completed Stripe setup (see `STRIPE_SETUP.md`)
- [ ] Set up Resend email service (optional but recommended)
- [ ] Chosen a hosting platform (Vercel recommended)
- [ ] Domain name (optional)
- [ ] Database hosting (if not using SQLite)
- [ ] All environment variables ready

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Built specifically for Next.js applications
- Zero-config deployments
- Automatic HTTPS
- Global CDN
- Easy environment variable management
- Free hobby plan available

#### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for production deployment"

# Create a new GitHub repository and push
git remote add origin https://github.com/yourusername/prepcoach.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

#### Step 3: Add Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```env
# Database
DATABASE_URL=file:./dev.db

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-here-generate-with-openssl-rand-base64-32

# OpenAI
OPENAI_API_KEY=sk-proj-your-openai-api-key

# Resend Email (Optional)
RESEND_API_KEY=re_your-resend-api-key-here
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Stripe (Live Mode)
STRIPE_SECRET_KEY=sk_live_your-live-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-live-publishable-key
STRIPE_PRO_MONTHLY_PRICE_ID=price_live-pro-price-id
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_live-enterprise-price-id
STRIPE_WEBHOOK_SECRET=whsec_your-production-webhook-secret
```

**Important**:
- Generate a new `NEXTAUTH_SECRET` for production: `openssl rand -base64 32`
- Use Stripe **LIVE** keys, not test keys
- Set `NEXTAUTH_URL` to your actual domain

#### Step 4: Deploy

Click "Deploy" and wait for build to complete (2-3 minutes).

#### Step 5: Set Up Production Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Switch to Live Mode** (toggle in top right)
3. Go to **Developers** → **Webhooks**
4. Click **+ Add endpoint**
5. **Endpoint URL**: `https://your-domain.vercel.app/api/stripe/webhook`
6. **Events to listen to**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
7. Click "Add endpoint"
8. Copy the **Signing secret** (starts with `whsec_`)
9. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
10. Redeploy your app

---

### Option 2: Railway.app

Railway is another great option with PostgreSQL database included.

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Add PostgreSQL database service
5. Add environment variables (same as Vercel)
6. Update `DATABASE_URL` to use Railway's PostgreSQL connection string
7. Deploy

---

### Option 3: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Import from Git
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
4. Add environment variables
5. Deploy

---

## 🗄️ Database Migration (SQLite → PostgreSQL)

**For production, you should use PostgreSQL instead of SQLite.**

### Why PostgreSQL?
- Better for production workloads
- Supports concurrent writes
- Better data integrity
- Hosted solutions available (Vercel Postgres, Supabase, Railway)

### Migration Steps:

#### 1. Set up PostgreSQL database

**Option A: Vercel Postgres**
```bash
# In Vercel dashboard
Storage → Create Database → Postgres
```

**Option B: Supabase (Free tier available)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string

**Option C: Railway**
1. Add PostgreSQL service to your Railway project
2. Copy connection string

#### 2. Update Prisma schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

#### 3. Update DATABASE_URL

```env
# PostgreSQL format
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

#### 4. Regenerate Prisma client

```bash
npx prisma generate
```

#### 5. Run migrations

```bash
npx prisma db push
```

#### 6. Migrate data (if needed)

If you have existing SQLite data to migrate:

```bash
# Export from SQLite
npx prisma db execute --stdin < export.sql

# Import to PostgreSQL
# Use pg_dump/pg_restore or a migration tool
```

---

## 🔒 Security Checklist

### Environment Variables
- [ ] Generate new `NEXTAUTH_SECRET` for production
- [ ] Use Stripe **Live** keys, not test keys
- [ ] Never commit `.env` files to git
- [ ] Rotate secrets regularly

### Stripe Security
- [ ] Enable Stripe Radar for fraud detection
- [ ] Set up webhook signature verification (already implemented)
- [ ] Configure email receipts
- [ ] Add terms of service link
- [ ] Test webhook endpoint is not publicly exploitable

### Application Security
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set secure headers (Next.js handles this)
- [ ] Rate limit API endpoints (consider adding)
- [ ] Enable CORS protection
- [ ] Validate all user inputs

### Database Security
- [ ] Use connection pooling
- [ ] Enable SSL for database connections
- [ ] Regular backups (automatic with most providers)
- [ ] Restrict database access to application only

---

## 📧 Email Setup (Resend)

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Get API key

### 2. Verify Domain (for production emails)

1. In Resend dashboard, go to **Domains**
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add DNS records to your domain provider:
   - SPF record
   - DKIM record
5. Wait for verification (usually 10-30 minutes)

### 3. Update Environment Variables

```env
RESEND_API_KEY=re_your-api-key-here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 4. Test Email Delivery

```bash
# In your app, try signing up a new user
# You should receive verification email
```

---

## 🧪 Testing Production Build Locally

Before deploying, test the production build:

```bash
# Build the app
npm run build

# Start production server
npm start

# Test at http://localhost:3000
```

**Test checklist**:
- [ ] Sign up new user
- [ ] Verify email (if Resend configured)
- [ ] Sign in
- [ ] Start interview session
- [ ] Get AI feedback
- [ ] View dashboard
- [ ] Test payment flow with Stripe test card
- [ ] Check webhook receives events
- [ ] Verify subscription updates in database
- [ ] Test profile page shows correct subscription
- [ ] Test subscription limits

---

## 🎯 Post-Deployment Tasks

### 1. Set Up Monitoring

**Vercel Analytics** (if using Vercel):
- Go to your project → Analytics tab
- Enable Web Analytics
- Monitor page views, performance

**Sentry** (Error tracking):
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### 2. Set Up Stripe Monitoring

- Go to Stripe Dashboard
- Set up email notifications for:
  - Failed payments
  - Subscription cancellations
  - Disputes

### 3. Configure Backups

**Vercel Postgres**:
- Automatic backups included

**Supabase**:
- Go to Database → Backups
- Enable automatic backups

**Railway**:
- Automatic backups included in Pro plan

### 4. Set Up Custom Domain (Optional)

**Vercel**:
1. Go to project Settings → Domains
2. Add your domain
3. Update DNS records with your domain provider
4. Wait for DNS propagation (5-60 minutes)
5. Update `NEXTAUTH_URL` environment variable
6. Redeploy

### 5. SSL Certificate

- Automatic with Vercel/Netlify/Railway
- Certificate auto-renews

### 6. Analytics & SEO

Add to `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'PrepCoach - AI Interview Practice',
  description: 'Master your interviews with AI-powered practice sessions',
  keywords: 'interview prep, AI interview, job interview practice',
  openGraph: {
    title: 'PrepCoach - AI Interview Practice',
    description: 'Master your interviews with AI-powered practice sessions',
    url: 'https://yourdomain.com',
    siteName: 'PrepCoach',
    images: ['/og-image.png'],
  },
};
```

---

## 📊 Monitoring & Maintenance

### Key Metrics to Track

1. **User Metrics**:
   - Sign-ups per day
   - Active users
   - Interview sessions per user
   - Retention rate

2. **Revenue Metrics**:
   - Monthly Recurring Revenue (MRR)
   - Conversion rate (Free → Pro)
   - Churn rate
   - Average Revenue Per User (ARPU)

3. **Technical Metrics**:
   - API response times
   - Error rates
   - Database performance
   - Webhook delivery success rate

### Regular Maintenance Tasks

**Weekly**:
- [ ] Check error logs
- [ ] Monitor failed payments
- [ ] Review user feedback
- [ ] Check webhook delivery logs

**Monthly**:
- [ ] Review analytics
- [ ] Analyze churn reasons
- [ ] Update dependencies: `npm update`
- [ ] Review Stripe Dashboard metrics
- [ ] Database optimization

**Quarterly**:
- [ ] Security audit
- [ ] Performance optimization
- [ ] User survey
- [ ] Pricing analysis

---

## 🚨 Troubleshooting Common Issues

### Issue: Webhooks not being received

**Solution**:
1. Check webhook URL in Stripe Dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` is correct
3. Check Vercel/Railway logs for errors
4. Test webhook with Stripe CLI: `stripe trigger checkout.session.completed`

### Issue: Database connection errors

**Solution**:
1. Verify `DATABASE_URL` is correct
2. Check if database service is running
3. Verify SSL mode settings
4. Check connection pool limits

### Issue: Email not sending

**Solution**:
1. Verify `RESEND_API_KEY` is set
2. Check domain verification status
3. Review Resend Dashboard logs
4. Check spam folder

### Issue: Payment failing

**Solution**:
1. Check Stripe Dashboard for error details
2. Verify Stripe keys are **Live** not Test
3. Check if customer has valid payment method
4. Review webhook events for `invoice.payment_failed`

---

## 💰 Pricing & Cost Estimates

### Vercel
- **Hobby**: $0/month (good for starting out)
- **Pro**: $20/month (recommended for production)
  - More bandwidth
  - Better analytics
  - Priority support

### Database Hosting
- **Vercel Postgres**: $0.50/GB/month (free tier: 256MB)
- **Supabase**: Free tier available, $25/month for Pro
- **Railway**: $5/month minimum, usage-based

### Other Services
- **Resend**: Free tier (100 emails/day), $20/month for 50k emails
- **Stripe**: 2.9% + 30¢ per transaction (no monthly fee)
- **OpenAI API**: Pay per use (~$0.002 per 1K tokens)

**Estimated total for small-scale production**: $25-50/month

---

## 🎉 Launch Checklist

Before announcing your launch:

- [ ] All features tested in production
- [ ] Payment flow tested with real card (then refunded)
- [ ] Email verification working
- [ ] Webhooks receiving events correctly
- [ ] Analytics set up
- [ ] Error monitoring configured
- [ ] Backup system in place
- [ ] Domain configured with SSL
- [ ] Privacy policy and terms of service added
- [ ] Support email set up
- [ ] Social media accounts created
- [ ] Marketing materials prepared

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Stripe Docs**: https://stripe.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Resend Docs**: https://resend.com/docs

---

**Last Updated**: October 2025
**Version**: 1.0.0

**Good luck with your launch! 🚀**
