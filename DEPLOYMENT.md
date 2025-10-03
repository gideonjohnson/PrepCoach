# PrepCoach - Production Deployment Guide

This guide walks you through deploying PrepCoach to production.

## Prerequisites

- GitHub account (repository already created)
- Vercel account (recommended) or Railway/Render
- Stripe account for payments
- Anthropic API key
- OpenAI API key

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Connect to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository: `davidmo92-hub/prepcoach`

### Step 2: Configure Environment Variables

In Vercel project settings, add these environment variables:

```env
# Database (Vercel Postgres or external)
DATABASE_URL=your_production_database_url

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_generated_secret_here

# AI APIs
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-proj-...

# Admin Credentials
ADMIN_EMAIL=admin@prepcoach.local
ADMIN_PASSWORD=YourSecurePasswordHere

# Stripe (Production keys)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

### Step 3: Set up Database

#### Option A: Vercel Postgres (Recommended)

1. In Vercel project, go to "Storage" tab
2. Create new Postgres database
3. Copy connection string to `DATABASE_URL`
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

#### Option B: External Database (Railway, Supabase, PlanetScale)

1. Create database on your preferred platform
2. Copy connection string to `DATABASE_URL`
3. Ensure connection string includes SSL parameters
4. Run migrations

### Step 4: Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET`

### Step 5: Configure Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **Live Mode** (toggle in top-right)
3. Get API keys from Developers > API keys
4. Create products:
   - Product: "PrepCoach Pro" ($19/month)
   - Product: "PrepCoach Enterprise" ($99/month)
5. Copy Price IDs to environment variables
6. Set up webhook:
   - Endpoint URL: `https://your-domain.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### Step 6: Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Visit your deployment URL

### Step 7: Create Admin User

Run this command in Vercel CLI or via Vercel's Shell:

```bash
npm run create-admin
```

Or manually via Prisma Studio:

```bash
npx prisma studio
```

## Option 2: Deploy to Railway

### Step 1: Create Railway Project

1. Go to [Railway](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" > "Deploy from GitHub repo"
4. Select `davidmo92-hub/prepcoach`

### Step 2: Add PostgreSQL Database

1. In Railway project, click "New"
2. Select "Database" > "PostgreSQL"
3. Copy the connection string

### Step 3: Configure Environment Variables

Add all environment variables listed in Option 1, Step 2

### Step 4: Deploy

Railway will automatically deploy on every push to main branch.

## Option 3: Deploy to Render

### Step 1: Create Web Service

1. Go to [Render](https://render.com)
2. Sign in with GitHub
3. Click "New" > "Web Service"
4. Connect `davidmo92-hub/prepcoach`

### Step 2: Configure Service

- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm start`
- **Environment**: Node

### Step 3: Add PostgreSQL Database

1. Create new PostgreSQL database in Render
2. Link to web service
3. Copy internal connection string to `DATABASE_URL`

### Step 4: Add Environment Variables

Add all variables from Option 1, Step 2

## Post-Deployment Checklist

### 1. Test Authentication
- [ ] Sign up with new account
- [ ] Sign in with credentials
- [ ] Test admin login at `/admin/login`

### 2. Test Core Features
- [ ] Start interview practice
- [ ] Record answer
- [ ] Get AI feedback
- [ ] View results dashboard

### 3. Test Subscription System
- [ ] Check limits as free user
- [ ] Test upgrade flow (use Stripe test mode first)
- [ ] Verify subscription webhook updates database

### 4. Security Checks
- [ ] Verify `.env` is in `.gitignore`
- [ ] Confirm database not committed to git
- [ ] Check all API routes have authentication
- [ ] Test CORS and security headers

### 5. Performance Optimization
- [ ] Enable Vercel Analytics
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CDN for static assets
- [ ] Test page load times

## Stripe Testing

Before going live, test with Stripe test mode:

1. Use test API keys (`sk_test_...` and `pk_test_...`)
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date, any CVC
4. Verify subscription updates in database
5. Test webhook delivery in Stripe Dashboard

## Database Migrations

When updating the schema:

```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Deploy to production
npx prisma migrate deploy
```

## Monitoring and Logs

### Vercel
- Logs available in project dashboard
- Real-time function logs
- Analytics built-in

### Railway
- Logs in deployments tab
- Metrics dashboard available

### Render
- Logs in service dashboard
- Metrics and health checks

## Troubleshooting

### Build Failures

**Error**: `Prisma schema not found`
```bash
npx prisma generate
```

**Error**: `Module not found`
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues

**Error**: `P1001: Can't reach database`
- Check DATABASE_URL format
- Ensure SSL is enabled: `?sslmode=require`
- Verify network access (whitelist IPs if needed)

### Stripe Webhooks Not Working

- Verify webhook URL is correct
- Check webhook secret matches
- Test webhook delivery in Stripe Dashboard
- Ensure endpoint is publicly accessible

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| NEXTAUTH_URL | Yes | Your production URL |
| NEXTAUTH_SECRET | Yes | Random secret (32+ chars) |
| ANTHROPIC_API_KEY | Yes | Claude API key |
| OPENAI_API_KEY | Yes | Whisper API key |
| ADMIN_EMAIL | Yes | Master admin email |
| ADMIN_PASSWORD | Yes | Master admin password |
| STRIPE_SECRET_KEY | Optional | Stripe secret key |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Optional | Stripe public key |
| STRIPE_WEBHOOK_SECRET | Optional | Stripe webhook secret |
| STRIPE_PRO_PRICE_ID | Optional | Pro tier price ID |
| STRIPE_ENTERPRISE_PRICE_ID | Optional | Enterprise price ID |

## Custom Domain Setup

### Vercel

1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### Railway

1. Go to Settings > Domains
2. Add custom domain
3. Update DNS CNAME record
4. SSL auto-provisioned

### Render

1. Go to Settings > Custom Domain
2. Add domain
3. Update DNS records
4. SSL auto-provisioned

## Support

For deployment issues:
- Vercel: https://vercel.com/support
- Railway: https://railway.app/help
- Render: https://render.com/docs

For application issues:
- GitHub Issues: https://github.com/davidmo92-hub/prepcoach/issues
