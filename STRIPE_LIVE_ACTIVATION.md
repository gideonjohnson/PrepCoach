# Stripe Live Mode Activation Guide

## Prerequisites
- ✅ Stripe account activated
- ✅ Business details completed in Stripe
- ✅ Bank account connected for payouts
- ⚠️ Must complete identity verification

## Step 1: Activate Your Stripe Account

1. Go to https://dashboard.stripe.com/
2. Complete business profile:
   - Business type
   - Business address
   - Tax information
3. Add bank account for payouts:
   - Dashboard → Settings → Bank accounts and scheduling
   - Add external account
4. Complete identity verification (if required)

## Step 2: Get Live API Keys

### Get Secret Key
1. Go to: https://dashboard.stripe.com/apikeys
2. **IMPORTANT:** Toggle from "Test mode" to "Live mode" (top right)
3. Under "Standard keys" section:
   - Copy "Secret key" (starts with `sk_live_...`)
   - Save it securely - you'll need it for environment variables

### Get Publishable Key
1. Same page (https://dashboard.stripe.com/apikeys)
2. Still in "Live mode"
3. Under "Standard keys" section:
   - Copy "Publishable key" (starts with `pk_live_...`)
   - Save it securely

## Step 3: Create Live Products & Prices

### Create Pro Plan ($19/month)
1. Go to: https://dashboard.stripe.com/products
2. **Ensure you're in "Live mode"** (top right toggle)
3. Click "Add product"
4. Fill in:
   - **Name:** PrepCoach Pro
   - **Description:** Professional interview prep with unlimited practice sessions
   - **Pricing model:** Standard pricing
   - **Price:** $19.00 USD
   - **Billing period:** Monthly
5. Click "Save product"
6. **Copy the Price ID** (starts with `price_...`)
   - This is your `STRIPE_PRO_MONTHLY_PRICE_ID`

### Create Enterprise Plan ($49/month)
1. Same page: https://dashboard.stripe.com/products
2. Click "Add product"
3. Fill in:
   - **Name:** PrepCoach Enterprise
   - **Description:** Advanced interview prep with AI video interviewer and priority support
   - **Pricing model:** Standard pricing
   - **Price:** $49.00 USD
   - **Billing period:** Monthly
4. Click "Save product"
5. **Copy the Price ID** (starts with `price_...`)
   - This is your `STRIPE_ENTERPRISE_MONTHLY_PRICE_ID`

## Step 4: Set Up Production Webhook

### Create Webhook Endpoint
1. Go to: https://dashboard.stripe.com/webhooks
2. **Ensure you're in "Live mode"**
3. Click "Add endpoint"
4. Fill in:
   - **Endpoint URL:** `https://aiprep.work/api/stripe/webhook`
   - **Description:** Production webhook for subscription events
5. Under "Select events to listen to", choose:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Click "Add endpoint"
7. **Copy the "Signing secret"** (starts with `whsec_...`)
   - This is your `STRIPE_WEBHOOK_SECRET`

## Step 5: Update Vercel Environment Variables

**CRITICAL:** You're updating LIVE keys - double-check everything!

### Update Secret Key
```bash
# Remove old test key
vercel env rm STRIPE_SECRET_KEY production

# Add live key (paste your sk_live_... key when prompted)
vercel env add STRIPE_SECRET_KEY production
```

### Update Publishable Key
```bash
# Remove old test key
vercel env rm NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production

# Add live key (paste your pk_live_... key when prompted)
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
```

### Update Pro Price ID
```bash
# Remove old test price
vercel env rm STRIPE_PRO_MONTHLY_PRICE_ID production

# Add live price ID (paste your price_... ID when prompted)
vercel env add STRIPE_PRO_MONTHLY_PRICE_ID production
```

### Update Enterprise Price ID
```bash
# Remove old test price
vercel env rm STRIPE_ENTERPRISE_MONTHLY_PRICE_ID production

# Add live price ID (paste your price_... ID when prompted)
vercel env add STRIPE_ENTERPRISE_MONTHLY_PRICE_ID production
```

### Update Webhook Secret
```bash
# Remove old test webhook
vercel env rm STRIPE_WEBHOOK_SECRET production

# Add live webhook secret (paste your whsec_... secret when prompted)
vercel env add STRIPE_WEBHOOK_SECRET production
```

## Step 6: Verify Configuration

### Check All Variables Are Set
```bash
vercel env ls | grep STRIPE
```

You should see:
- ✅ STRIPE_SECRET_KEY (Encrypted, Production)
- ✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (Encrypted, Production)
- ✅ STRIPE_PRO_MONTHLY_PRICE_ID (Encrypted, Production)
- ✅ STRIPE_ENTERPRISE_MONTHLY_PRICE_ID (Encrypted, Production)
- ✅ STRIPE_WEBHOOK_SECRET (Encrypted, Production)

## Step 7: Deploy to Production

```bash
# Redeploy with new live keys
vercel --prod --yes
```

Wait 1-2 minutes for deployment to complete.

## Step 8: Test Live Payments

### Test Checkout Flow
1. Go to: https://aiprep.work/pricing
2. Click "Get Started" on Pro or Enterprise
3. Use a **REAL credit card** (you'll be charged!)
4. Complete the checkout
5. Verify:
   - Payment appears in Stripe Dashboard (Live mode)
   - Subscription appears in https://dashboard.stripe.com/subscriptions
   - User subscription updated in your database

### Recommended: Test with $1 Product First
Before testing with real prices, consider creating a $1 test product in live mode to verify everything works without spending $19-49.

## Step 9: Monitor Webhooks

1. Go to: https://dashboard.stripe.com/webhooks
2. Click on your production webhook
3. Check "Events" tab to see incoming webhook events
4. Verify events are being delivered successfully

## Security Checklist

- [ ] Live keys are ONLY in Vercel production environment
- [ ] Test keys are still in Preview/Development environments
- [ ] Webhook endpoint uses HTTPS (✅ https://aiprep.work)
- [ ] Webhook secret is kept secure
- [ ] Bank account is connected for payouts
- [ ] Email notifications are enabled in Stripe

## Troubleshooting

### Payments Failing
1. Check Stripe Dashboard → Logs for error messages
2. Verify webhook is receiving events
3. Check Vercel logs for errors
4. Ensure all 5 environment variables are set correctly

### Webhook Not Receiving Events
1. Verify endpoint URL: `https://aiprep.work/api/stripe/webhook`
2. Check "Events" tab in webhook settings
3. Test webhook with "Send test webhook" button
4. Verify `STRIPE_WEBHOOK_SECRET` matches dashboard

### Subscription Not Updating Database
1. Check Vercel logs during webhook event
2. Verify database connection is working
3. Check webhook event types are correct
4. Ensure user exists in database before subscribing

## Cost Breakdown

**Stripe Fees (Live Mode):**
- 2.9% + $0.30 per successful card charge
- Example:
  - $19 Pro plan: You receive $18.16 ($19 - $0.55 - $0.30)
  - $49 Enterprise: You receive $47.28 ($49 - $1.42 - $0.30)

## Rollback Plan

If you need to switch back to test mode:
```bash
# Switch all keys back to test mode
vercel env rm STRIPE_SECRET_KEY production
vercel env add STRIPE_SECRET_KEY production
# (paste test key sk_test_...)

# Repeat for all other variables
# Then redeploy
vercel --prod --yes
```

## Post-Activation

After successful activation:
- [ ] Update documentation with live mode status
- [ ] Set up email alerts for failed payments
- [ ] Monitor first 10 transactions closely
- [ ] Set up Stripe billing alerts
- [ ] Consider adding Stripe Tax for automatic tax calculation

## Summary

**You're going LIVE!** This means:
- ✅ Real credit cards will be charged
- ✅ Real money goes to your bank account
- ⚠️ Double-check all prices before launching
- ⚠️ Test thoroughly before announcing

**After activation, your pricing:**
- Pro: $19/month (you receive ~$18.16 after fees)
- Enterprise: $49/month (you receive ~$47.28 after fees)
