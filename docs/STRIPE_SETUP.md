# Stripe Payment Integration - Setup Guide

## ✅ What's Been Implemented

### **Files Created:**
1. ✅ `lib/stripe.ts` - Stripe client configuration
2. ✅ `app/api/stripe/create-checkout-session/route.ts` - Checkout session creation
3. ✅ `app/api/stripe/webhook/route.ts` - Webhook handler for subscription events
4. ✅ Updated `.env.example` with Stripe environment variables

### **Features:**
- ✅ Stripe Checkout for Pro ($19/month) and Enterprise ($99/month) subscriptions
- ✅ Automatic subscription management via webhooks
- ✅ Database sync for user subscription status
- ✅ Payment success/failure handling
- ✅ Subscription updates and cancellations

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Stripe Account
1. Visit https://dashboard.stripe.com/register
2. Complete account setup
3. Switch to **Test Mode** (toggle in top-right)

### Step 2: Get API Keys
1. Go to **Developers** → **API keys**
2. Copy **Secret key** (starts with `sk_test_`)
3. Copy **Publishable key** (starts with `pk_test_`)

### Step 3: Create Products & Prices

#### Create Pro Subscription:
1. Go to **Products** → Click **+ Add product**
2. **Name**: PrepCoach Pro
3. **Description**: Unlimited interview practice with AI feedback
4. **Pricing**:
   - **Price**: $19.00
   - **Billing period**: Monthly
   - **Currency**: USD
5. Click **Save product**
6. **Copy the Price ID** (starts with `price_`)

#### Create Enterprise Subscription:
1. Click **+ Add product** again
2. **Name**: PrepCoach Enterprise
3. **Description**: Team management and company-specific prep
4. **Pricing**:
   - **Price**: $99.00
   - **Billing period**: Monthly
   - **Currency**: USD
5. Click **Save product**
6. **Copy the Price ID** (starts with `price_`)

### Step 4: Configure Environment Variables

Add to your `.env` file:

```env
# Stripe API Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Stripe Price IDs
STRIPE_PRO_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx

# Stripe Webhook Secret (we'll get this in Step 5)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Step 5: Set Up Webhooks

#### For Local Development (using Stripe CLI):
```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe
# Or download from: https://github.com/stripe/stripe-cli/releases

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to http://localhost:3001/api/stripe/webhook
```

This will give you a **webhook signing secret** (starts with `whsec_`). Add it to your `.env` file.

#### For Production:
1. Go to **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. **Endpoint URL**: `https://yourdomain.com/api/stripe/webhook`
4. **Events to listen to**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** and add to your `.env` file

### Step 6: Restart Dev Server

```bash
npm run dev
```

---

## 🧪 Testing

### Test Card Numbers (Test Mode Only):
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

**CVV**: Any 3 digits
**Exp Date**: Any future date
**ZIP**: Any 5 digits

### Test Flow:
1. Sign up for account
2. Go to `/pricing` (you'll need to create this page)
3. Click "Upgrade to Pro"
4. Enter test card number
5. Complete checkout
6. Check dashboard - subscription should be "Pro"

---

## 📋 Next Steps to Complete

### 1. Create Pricing Page (`app/pricing/page.tsx`)

This page should:
- Display all subscription tiers (Free, Pro, Enterprise)
- Show features for each tier
- "Upgrade" buttons that call `/api/stripe/create-checkout-session`
- Handle Stripe redirect

### 2. Add Subscription Management to Profile/Dashboard

Show user:
- Current subscription tier
- Next billing date
- Usage limits
- "Manage Subscription" button (Billing Portal)

### 3. Create Billing Portal Endpoint

`app/api/stripe/create-portal-session/route.ts`:

```typescript
import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  // Create Stripe Customer Portal session
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,  // You'll need to store this
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  });

  return NextResponse.json({ url: portalSession.url });
}
```

### 4. Update Database Schema (Optional but Recommended)

Add `stripeCustomerId` and `stripeSubscriptionId` to User model:

```prisma
model User {
  // ... existing fields

  stripeCustomerId      String?
  stripeSubscriptionId  String?
}
```

This helps with managing customers in Stripe.

---

## 🔒 Security Notes

### ⚠️ Important:
- **NEVER** expose your Secret Key on the client side
- **ALWAYS** verify webhooks using the signing secret
- Use **Test Mode** for development
- Switch to **Live Mode** only in production

### Rate Limiting:
Add rate limiting to checkout endpoint to prevent abuse:

```typescript
// In create-checkout-session/route.ts
// Add this before creating checkout session:

const recentCheckouts = await prisma.checkoutAttempt.count({
  where: {
    userId: session.user.id,
    createdAt: { gte: new Date(Date.now() - 60000) } // Last minute
  }
});

if (recentCheckouts > 3) {
  return NextResponse.json(
    { error: 'Too many checkout attempts. Please try again later.' },
    { status: 429 }
  );
}
```

---

## 💰 Pricing Strategy

### Current Tiers:
- **Free**: 3 interviews/month, 5 AI feedback requests
- **Pro**: $19/month - Unlimited everything
- **Enterprise**: $99/month - Team features + priority support
- **Lifetime**: One-time $0 (special access)

### Recommended Pricing Adjustments:
Consider adding:
- **Starter**: $9/month - 10 interviews, 20 feedback requests
- **Annual Pro**: $15/month (billed $180/year) - Save $48/year
- **Annual Enterprise**: $80/month (billed $960/year) - Save $228/year

---

## 📊 Monitoring

### Stripe Dashboard:
Monitor these metrics:
- Monthly Recurring Revenue (MRR)
- Churn rate
- Failed payments
- Active subscriptions

### Application Monitoring:
Track:
- Conversion rate (signups → paid)
- Upgrade paths (Free → Pro → Enterprise)
- Feature usage by tier
- Customer Lifetime Value (CLV)

---

## 🐛 Troubleshooting

### "Payment method not configured"
- Check `STRIPE_SECRET_KEY` is set
- Verify you're in Test Mode for testing
- Check Price IDs are correct

### Webhook not receiving events
- Verify webhook signing secret
- Check endpoint URL is correct
- Ensure webhook is enabled in Stripe Dashboard
- For local dev: Make sure `stripe listen` is running

### Subscription not updating in database
- Check webhook handler logs
- Verify user ID is in subscription metadata
- Check database connection

---

## 🚀 Going Live

### Pre-Launch Checklist:
- [ ] Switch Stripe to **Live Mode**
- [ ] Update API keys in production `.env`
- [ ] Create live products/prices
- [ ] Set up production webhook endpoint
- [ ] Test with real card (then refund)
- [ ] Enable Stripe Radar for fraud protection
- [ ] Set up email receipts
- [ ] Configure tax settings (if applicable)
- [ ] Add terms of service link to checkout
- [ ] Test cancellation flow

---

## 📞 Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Test Cards: https://stripe.com/docs/testing

---

**Last Updated**: October 2025
**Version**: 1.0.0
