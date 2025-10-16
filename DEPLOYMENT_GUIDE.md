# PrepCoach Deployment Guide for aiprep.work

## Domain: aiprep.work

This guide will help you deploy PrepCoach to your domain `aiprep.work`.

---

## Pre-Deployment Checklist

### 1. **Generate Secure NextAuth Secret**
```bash
openssl rand -base64 32
```
Replace `NEXTAUTH_SECRET` in your production environment with the generated value.

### 2. **Environment Variables for Production**

When deploying, set these environment variables on your hosting platform:

```env
# Database (Use production database URL)
DATABASE_URL=your_production_database_url

# AI API Keys
ANTHROPIC_API_KEY=your_real_anthropic_api_key
OPENAI_API_KEY=your_real_openai_api_key

# NextAuth Configuration
NEXTAUTH_SECRET=your_generated_secret_from_step_1
NEXTAUTH_URL=https://aiprep.work

# App URL
NEXT_PUBLIC_APP_URL=https://aiprep.work

# Stripe Configuration (Production Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_PRO_MONTHLY_PRICE_ID=price_your_pro_monthly_price
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_your_enterprise_monthly_price
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Admin Credentials
ADMIN_EMAIL=admin@aiprep.work
ADMIN_PASSWORD=your_secure_admin_password

# Optional: Email Service
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@aiprep.work
```

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- Built specifically for Next.js
- Automatic deployments from Git
- Free SSL certificates
- Global CDN
- Zero configuration needed

**Steps:**

1. **Install Vercel CLI** (optional, can also use web interface)
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI:**
   ```bash
   cd /c/Users/Administrator/prepcoach
   vercel
   ```

   Or **Deploy via Web Interface:**
   - Go to https://vercel.com
   - Sign in with GitHub/GitLab/Bitbucket
   - Click "Import Project"
   - Select your prepcoach repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables:**
   - In Vercel dashboard → Your Project → Settings → Environment Variables
   - Add all production environment variables listed above

4. **Configure Custom Domain:**
   - In Vercel dashboard → Your Project → Settings → Domains
   - Add `aiprep.work`
   - Add DNS records to your domain registrar:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21

     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

5. **Deploy:**
   - Push to your Git repository
   - Vercel auto-deploys on every push to main branch

---

### Option 2: AWS (EC2 + RDS)

**Steps:**

1. **Launch EC2 Instance:**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Security groups: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Install Dependencies:**
   ```bash
   # SSH into your EC2 instance
   sudo apt update
   sudo apt install -y nodejs npm nginx certbot python3-certbot-nginx
   ```

3. **Clone and Build:**
   ```bash
   cd /home/ubuntu
   git clone your_repository_url prepcoach
   cd prepcoach
   npm install
   npm run build
   ```

4. **Set Environment Variables:**
   ```bash
   nano .env.production
   # Add all production environment variables
   ```

5. **Setup PM2 for Process Management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "prepcoach" -- start
   pm2 startup
   pm2 save
   ```

6. **Configure Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/aiprep.work
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name aiprep.work www.aiprep.work;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/aiprep.work /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo certbot --nginx -d aiprep.work -d www.aiprep.work
   ```

8. **Setup Database (RDS):**
   - Create PostgreSQL RDS instance
   - Update `DATABASE_URL` in environment variables
   - Run migrations:
     ```bash
     npx prisma migrate deploy
     ```

9. **Configure DNS:**
   - Point `aiprep.work` A record to your EC2 Elastic IP
   - Point `www.aiprep.work` CNAME to `aiprep.work`

---

### Option 3: DigitalOcean App Platform

**Steps:**

1. **Create App:**
   - Go to https://cloud.digitalocean.com
   - Apps → Create App
   - Connect your GitHub repository

2. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Environment: Node.js

3. **Add Environment Variables:**
   - Add all production environment variables

4. **Add Domain:**
   - Settings → Domains → Add Domain
   - Enter `aiprep.work`
   - Follow DNS configuration instructions

5. **Deploy:**
   - Click "Deploy"
   - DigitalOcean handles SSL automatically

---

## Post-Deployment Checklist

### 1. **Database Setup:**
```bash
# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database if needed
npx prisma db seed
```

### 2. **Test Critical Features:**
- [ ] Homepage loads at https://aiprep.work
- [ ] User registration works
- [ ] User login works
- [ ] Interview Practice feature works
- [ ] LinkedIn Optimizer works
- [ ] Career Roadmap works
- [ ] Salary Hub works
- [ ] Resume Builder works
- [ ] Stripe payment flow works
- [ ] Admin dashboard accessible

### 3. **Configure Stripe Webhooks:**
- Go to Stripe Dashboard → Developers → Webhooks
- Add endpoint: `https://aiprep.work/api/stripe/webhook`
- Select events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. **Setup Monitoring:**
- [ ] Setup error tracking (Sentry, LogRocket, etc.)
- [ ] Setup uptime monitoring (UptimeRobot, Pingdom)
- [ ] Setup analytics (Google Analytics, Plausible)

### 5. **Security Hardening:**
- [ ] Ensure all API keys are in environment variables (not hardcoded)
- [ ] Enable HTTPS only (redirect HTTP to HTTPS)
- [ ] Setup CORS properly
- [ ] Rate limiting on API routes
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (React handles this)

### 6. **Performance Optimization:**
- [ ] Enable Next.js Image Optimization
- [ ] Setup CDN for static assets
- [ ] Enable compression (Vercel does this automatically)
- [ ] Database connection pooling
- [ ] Cache frequently accessed data

---

## DNS Configuration

Point your domain `aiprep.work` to your deployment:

### For Vercel:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### For AWS/DigitalOcean/Custom Server:
```
Type: A
Name: @
Value: YOUR_SERVER_IP

Type: CNAME
Name: www
Value: aiprep.work
```

### Email Records (Optional - for noreply@aiprep.work):
```
Type: MX
Name: @
Priority: 10
Value: (Your email provider's MX record)

Type: TXT
Name: @
Value: "v=spf1 include:_spf.youremailprovider.com ~all"
```

---

## Troubleshooting

### Issue: "NextAuth configuration error"
**Solution:** Ensure `NEXTAUTH_URL=https://aiprep.work` is set in production environment

### Issue: "Database connection failed"
**Solution:** Verify `DATABASE_URL` is correct and database is accessible from your server

### Issue: "Stripe webhook not working"
**Solution:**
1. Verify webhook endpoint is `https://aiprep.work/api/stripe/webhook`
2. Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
3. Ensure webhook events are selected

### Issue: "Authentication redirects to localhost"
**Solution:** Update `NEXTAUTH_URL` in production environment to `https://aiprep.work`

### Issue: "API keys not working"
**Solution:** Ensure all `NEXT_PUBLIC_*` variables are set before build, other variables can be set after

---

## Recommended: Vercel Deployment (Step by Step)

Since you're using Next.js, I highly recommend Vercel:

### 1. Push to GitHub:
```bash
cd /c/Users/Administrator/prepcoach
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Deploy to Vercel:
1. Go to https://vercel.com/signup
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your `prepcoach` repository
5. Vercel auto-detects Next.js - click "Deploy"

### 3. Add Environment Variables:
Go to Project Settings → Environment Variables and add all production variables

### 4. Add Custom Domain:
1. Project Settings → Domains
2. Add `aiprep.work`
3. Add the DNS records Vercel provides to your domain registrar

### 5. Done!
Your site will be live at https://aiprep.work in 2-3 minutes

---

## Support

If you encounter any issues during deployment, check:
- Vercel deployment logs
- Browser console for errors
- Network tab for failed API calls
- Server logs for backend errors

---

**Prepared for:** aiprep.work
**Date:** October 2025
**Next.js Version:** 15.5.4
