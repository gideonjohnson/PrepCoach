# Create Paystack Subscription Plans - Quick Guide

**Status**: ✅ API Keys Working | ⚠️ Plans Needed

---

## What You Need to Do

You need to create **2 subscription plans** in your Paystack Dashboard. This will only take 5 minutes!

---

## Step-by-Step Instructions

### 1. Open Paystack Plans Page

Visit: **[https://dashboard.paystack.com/#/plans](https://dashboard.paystack.com/#/plans)**

Or:
1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Click on **"Payments"** in the left sidebar
3. Click on **"Plans"**

---

### 2. Create Pro Plan (₦5,000/month)

Click the **"Create Plan"** button and fill in:

| Field | Value |
|-------|-------|
| **Plan Name** | `PrepCoach Pro` |
| **Plan Amount** | `500000` (in kobo) |
| **Plan Interval** | `monthly` |
| **Plan Currency** | `NGN` (Nigerian Naira) |
| **Plan Description** | `Pro tier: Unlimited interviews and AI feedback` |
| **Send invoices?** | No |
| **Invoice limit** | Leave empty |

> **Important**: 500000 kobo = ₦5,000
> Paystack uses kobo (like cents), so multiply by 100

Click **"Create Plan"**

**Copy the Plan Code** - It will look like: `PLN_xxxxxxxxxx`

---

### 3. Create Enterprise Plan (₦15,000/month)

Click **"Create Plan"** again and fill in:

| Field | Value |
|-------|-------|
| **Plan Name** | `PrepCoach Enterprise` |
| **Plan Amount** | `1500000` (in kobo) |
| **Plan Interval** | `monthly` |
| **Plan Currency** | `NGN` (Nigerian Naira) |
| **Plan Description** | `Enterprise tier: Everything in Pro + team features` |
| **Send invoices?** | No |
| **Invoice limit** | Leave empty |

> **Important**: 1500000 kobo = ₦15,000

Click **"Create Plan"**

**Copy the Plan Code** - It will look like: `PLN_xxxxxxxxxx`

---

### 4. Update Environment Variables

Once you have both plan codes, update your `.env` file:

```bash
# Replace these placeholder values with your actual plan codes
PAYSTACK_PRO_PLAN_CODE=PLN_xxxxxxxxxx          # Your Pro plan code
PAYSTACK_ENTERPRISE_PLAN_CODE=PLN_xxxxxxxxxx  # Your Enterprise plan code
```

**Example** (with real codes):
```bash
PAYSTACK_PRO_PLAN_CODE=PLN_abc123def456
PAYSTACK_ENTERPRISE_PLAN_CODE=PLN_xyz789ghi012
```

---

### 5. Verify Setup

Run the test script again:

```bash
npx tsx scripts/test-paystack.ts
```

You should see:
- ✅ API Keys are valid
- ✅ Found 2 plan(s)
- ✅ All environment variables configured

---

## Quick Reference

### Current Pricing

| Tier | Monthly Price | Plan Code Variable |
|------|--------------|-------------------|
| Pro | ₦5,000 | `PAYSTACK_PRO_PLAN_CODE` |
| Enterprise | ₦15,000 | `PAYSTACK_ENTERPRISE_PLAN_CODE` |

### Amount Conversion

| Naira | Kobo (for Paystack) |
|-------|---------------------|
| ₦5,000 | 500000 |
| ₦15,000 | 1500000 |

**Formula**: Amount in Naira × 100 = Amount in Kobo

---

## Troubleshooting

### Can't find the Plans page?
- Make sure you're logged into [Paystack Dashboard](https://dashboard.paystack.com/)
- Look for "Payments" → "Plans" in the left sidebar
- Or visit the direct link: https://dashboard.paystack.com/#/plans

### Wrong currency?
- Make sure you select **NGN (Nigerian Naira)**
- If NGN is not available, your business might not be verified yet
- Contact Paystack support to enable NGN

### Don't see Plan Code after creating?
- Click on the plan name in the list
- The Plan Code will be shown in the plan details
- It starts with `PLN_`

---

## After Setup

Once you've added the plan codes to `.env`:

1. **Restart your development server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Test the payment flow**:
   - Visit: http://localhost:3000/pricing
   - Click "Upgrade to Pro"
   - You should be redirected to Paystack checkout

3. **Use test card**:
   - Card: 5060666666666666666
   - Expiry: Any future date
   - CVV: 123
   - PIN: 1234

---

## Current Status

✅ **Completed**:
- Paystack account created
- API keys configured
- Test keys working

⚠️ **Next Steps**:
- Create Pro plan (₦5,000/month)
- Create Enterprise plan (₦15,000/month)
- Add plan codes to .env
- Test payment flow

---

## Need Help?

- **Paystack Plans Documentation**: https://paystack.com/docs/payments/subscriptions/
- **Paystack Support**: support@paystack.com
- **Your Test Keys**: Already configured in `.env` file

---

**Estimated Time**: 5-10 minutes

**You're almost there!** Just create the 2 plans and you'll be ready to accept payments! 🚀
