# Paystack Payment Integration Setup

## Overview

PrepCoach uses Paystack as its payment processor for handling subscriptions and one-time payments. This guide will help you set up Paystack integration for your production environment.

## Why Paystack?

Paystack is optimized for African markets and supports:
- Nigerian Naira (NGN) and other African currencies
- Local payment methods (bank transfers, USSD, mobile money)
- Lower transaction fees for African businesses
- Better success rates for African cardholders

## Prerequisites

1. A Paystack account: [Sign up here](https://dashboard.paystack.com/signup)
2. A verified business in Paystack Dashboard
3. Access to your Vercel or production environment variables

## Step 1: Create Paystack Account

1. Visit [Paystack Dashboard](https://dashboard.paystack.com/signup)
2. Sign up with your business email
3. Complete KYC verification (required for live mode)
4. Wait for approval (usually 1-2 business days)

## Step 2: Get API Keys

### Test Keys (for development):
1. Go to [Settings > API Keys & Webhooks](https://dashboard.paystack.com/#/settings/developer)
2. Copy your **Test Secret Key** (starts with `sk_test_`)
3. Copy your **Test Public Key** (starts with `pk_test_`)

### Live Keys (for production):
1. Ensure your business is verified and approved
2. Go to [Settings > API Keys & Webhooks](https://dashboard.paystack.com/#/settings/developer)
3. Copy your **Live Secret Key** (starts with `sk_live_`)
4. Copy your **Live Public Key** (starts with `pk_live_`)

## Step 3: Create Subscription Plans

You need to create two subscription plans in Paystack:

### Pro Plan (₦5,000/month):
1. Go to [Payments > Plans](https://dashboard.paystack.com/#/plans)
2. Click "Create Plan"
3. Fill in:
   - **Name**: PrepCoach Pro
   - **Amount**: 5000 (in kobo, = ₦5,000)
   - **Interval**: Monthly
   - **Currency**: NGN
4. Click "Create Plan"
5. Copy the **Plan Code** (starts with `PLN_`)

### Enterprise Plan (₦15,000/month):
1. Click "Create Plan" again
2. Fill in:
   - **Name**: PrepCoach Enterprise
   - **Amount**: 15000 (in kobo, = ₦15,000)
   - **Interval**: Monthly
   - **Currency**: NGN
3. Click "Create Plan"
4. Copy the **Plan Code** (starts with `PLN_`)

## Step 4: Set Up Webhooks

Webhooks allow Paystack to notify your app about payment events:

1. Go to [Settings > API Keys & Webhooks](https://dashboard.paystack.com/#/settings/developer)
2. Scroll to "Webhook Settings"
3. Add your webhook URL:
   - **Development**: `http://localhost:3000/api/paystack/webhook`
   - **Production**: `https://aiprep.work/api/paystack/webhook`
4. Click "Save Changes"

## Step 5: Configure Environment Variables

Add these variables to your `.env.local` (development) or Vercel environment (production):

```bash
# Paystack Secret Key (use test key for dev, live key for prod)
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Paystack Public Key (use test key for dev, live key for prod)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx

# Paystack Plan Codes (from Step 3)
PAYSTACK_PRO_PLAN_CODE=PLN_xxxxxxxxxxxxx
PAYSTACK_ENTERPRISE_PLAN_CODE=PLN_xxxxxxxxxxxxx

# Your app URL (required for redirects)
NEXTAUTH_URL=https://aiprep.work
```

### For Vercel Production:

```bash
# Set environment variables in Vercel dashboard
vercel env add PAYSTACK_SECRET_KEY production
vercel env add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY production
vercel env add PAYSTACK_PRO_PLAN_CODE production
vercel env add PAYSTACK_ENTERPRISE_PLAN_CODE production
```

## Step 6: Test the Integration

### Test Mode:
1. Use test API keys in your development environment
2. Visit `/pricing` page
3. Click "Upgrade to Pro"
4. Use Paystack's test card:
   - **Card Number**: 5060666666666666666
   - **Expiry**: Any future date
   - **CVV**: 123
   - **PIN**: 1234 (for banks that require it)
5. Complete the payment flow
6. Verify the subscription is updated in your database

### Live Mode:
1. Switch to live API keys in production
2. Test with a real card (you can refund it later)
3. Verify webhooks are received correctly
4. Check Paystack Dashboard for transaction logs

## Step 7: Go Live Checklist

Before enabling payments in production:

- [ ] Business is verified in Paystack
- [ ] Live API keys are configured in Vercel
- [ ] Subscription plans are created and plan codes are set
- [ ] Webhook URL is configured and verified
- [ ] Test transactions completed successfully
- [ ] Database is correctly updating user subscription status
- [ ] Payment confirmation emails are working
- [ ] Refund process is tested and documented

## Pricing Structure

Current pricing (in Nigerian Naira):

| Tier       | Price        | Features |
|------------|--------------|----------|
| Free       | ₦0          | 3 interviews/month, 5 AI feedback/month |
| Pro        | ₦5,000/mo   | Unlimited interviews, unlimited AI feedback |
| Enterprise | ₦15,000/mo  | Everything in Pro + team features |

## Transaction Fees

Paystack charges:
- **Local cards**: 1.5% capped at ₦2,000
- **International cards**: 3.9% + ₦100
- **Bank transfers**: ₦50 flat fee

Plan your pricing accordingly to cover these fees.

## Testing Paystack Integration

Use these test cards for different scenarios:

### Successful transaction:
- **Card**: 5060666666666666666
- **Expiry**: Any future date
- **CVV**: 123

### Insufficient funds:
- **Card**: 5060666666666666666
- **Expiry**: Any future date
- **CVV**: 124

### Declined transaction:
- **Card**: 5060666666666666666
- **Expiry**: Any future date
- **CVV**: 125

More test cards: [Paystack Test Cards](https://paystack.com/docs/payments/test-payments/)

## Webhook Events Handled

The integration handles these Paystack webhook events:

- `charge.success` - Payment completed successfully
- `subscription.create` - New subscription created
- `subscription.disable` - Subscription cancelled
- `subscription.not_renew` - Subscription won't renew
- `invoice.payment_failed` - Payment failed

## API Endpoints

### `/api/paystack/checkout` (POST)
Creates a payment link for a subscription tier.

**Request**:
```json
{
  "tier": "pro" | "enterprise"
}
```

**Response**:
```json
{
  "authorization_url": "https://checkout.paystack.com/...",
  "access_code": "...",
  "reference": "..."
}
```

### `/api/paystack/verify` (GET)
Verifies a payment and updates user subscription.

**Query params**: `?reference=xxx`

### `/api/paystack/webhook` (POST)
Receives webhook events from Paystack.

## Troubleshooting

### Payments not working:
1. Check API keys are correct (live vs test)
2. Verify webhook URL is accessible
3. Check Paystack Dashboard for error logs
4. Ensure plan codes match your Paystack plans

### Webhooks not received:
1. Verify webhook URL in Paystack Dashboard
2. Check server logs for incoming requests
3. Test webhook manually using Paystack's webhook tester
4. Ensure your server is publicly accessible

### Subscription not updating:
1. Check webhook signature verification
2. Verify database connection
3. Check server logs for errors
4. Ensure user IDs are passed correctly in metadata

## Support

- **Paystack Support**: support@paystack.com
- **Paystack Docs**: https://paystack.com/docs
- **Paystack Status**: https://paystack.statuspage.io/

## Migration from Stripe

If you previously used Stripe:

1. ✅ Stripe API routes removed
2. ✅ Stripe packages uninstalled
3. ✅ Paystack integration implemented
4. ✅ Pricing updated to NGN
5. ✅ Documentation updated

All existing users will need to re-subscribe through Paystack. Consider offering a promotional discount for the migration period.

## Next Steps

Once Paystack is configured:

1. Test the complete payment flow
2. Set up payment confirmation emails
3. Configure subscription management (cancel, upgrade, downgrade)
4. Set up monitoring for failed payments
5. Plan customer support for payment issues
6. Consider adding more payment methods (bank transfers, USSD)

---

**Last Updated**: January 2025
**Status**: ✅ Integration Complete - Ready for Configuration
