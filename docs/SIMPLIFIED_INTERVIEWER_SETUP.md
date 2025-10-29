# Ultra-Realistic AI Interviewer - Simplified Setup

## TL;DR - Super Simple Setup

**You only need ONE API key: D-ID**

1. Get D-ID API key: https://studio.d-id.com/account-settings (20 free videos!)
2. Add to `.env`: `D_ID_API_KEY=your_key_here`
3. Add to Vercel: `vercel env add D_ID_API_KEY production`
4. Done! You now have photorealistic interviewer with excellent voice

## What Changed?

**Old Setup (Complicated):**
- Required 2 API keys: D-ID + ElevenLabs
- Total cost: $4.70 + $5/month = $9.70/month minimum
- More complex configuration

**New Setup (Simplified):**
- ✅ Only 1 API key needed: D-ID
- ✅ Cost: $4.70/month (or FREE for first 20 videos)
- ✅ Includes excellent Microsoft Azure voices built-in
- ✅ ElevenLabs is optional premium upgrade

## Why This Works

**D-ID includes professional voices:**
- Microsoft Azure Neural TTS (included, no extra cost)
- Amazon Polly voices (included, no extra cost)
- **en-US-JennyNeural** - Professional female (default)
- **en-US-GuyNeural** - Professional male
- **en-US-AriaNeural** - Friendly female

Quality: ⭐⭐⭐⭐ (Excellent)

**ElevenLabs (optional upgrade):**
Only add if you want ⭐⭐⭐⭐⭐ (Best in class) voice quality
Cost: Additional $5/month
Improvement: Marginal (Azure is already excellent)

## Quick Setup Guide

### Step 1: Get D-ID API Key

1. Visit: https://studio.d-id.com/
2. Sign up (FREE - get 20 video credits!)
3. Go to: https://studio.d-id.com/account-settings
4. Copy "API Key" under "Credentials"

### Step 2: Add to Local Environment

Edit `.env` file:
```bash
D_ID_API_KEY=your_actual_d_id_key_here
```

### Step 3: Add to Vercel Production

```bash
vercel env add D_ID_API_KEY

# When prompted:
# - Paste your D-ID key
# - Select: Yes for Production
# - Select: Yes for Preview (optional)
# - Select: Yes for Development (optional)
```

### Step 4: Deploy

```bash
git push origin master
# Vercel will auto-deploy with new env var
```

**That's it!** Your realistic AI interviewer is ready.

## What You Get

**Free Tier:**
- 20 photorealistic video generations
- Microsoft Azure Neural voices (excellent quality)
- Perfect lip-sync
- 10+ professional CEO-style avatars
- 4 interviewer tones

**After Free Tier:**
- $4.70/month: 15 minutes of video
- $29/month: 100 minutes of video
- $0.30 per additional minute

## Optional: Add ElevenLabs for Premium Voice

**Only do this if you want the absolute best voice quality**

Most users won't notice the difference. Azure voices are excellent.

### When to add ElevenLabs:

- ✅ You're targeting premium enterprise customers
- ✅ Voice quality is your #1 priority
- ✅ You have budget for the extra $5/month
- ❌ For most users: Azure voices are perfect

### How to add:

1. Get key: https://elevenlabs.io/app/settings/api-keys
2. Add to `.env`: `ELEVENLABS_API_KEY=your_key_here`
3. Add to Vercel: `vercel env add ELEVENLABS_API_KEY production`

**That's it!** The system auto-detects and uses ElevenLabs when available.

## Voice Comparison

| Provider | Quality | Cost | Setup | Recommended |
|----------|---------|------|-------|-------------|
| **Browser TTS** | ⭐⭐ Poor | FREE | None | No |
| **Azure (D-ID built-in)** | ⭐⭐⭐⭐ Excellent | Included with D-ID | D-ID key only | ✅ **Yes** |
| **ElevenLabs (premium)** | ⭐⭐⭐⭐⭐ Best | +$5/month | 2 API keys | Optional |

## Cost Calculator

**100 active users, 5 sessions each = 500 videos/month:**

| Setup | Monthly Cost | Calculation |
|-------|-------------|-------------|
| D-ID only | **$150/month** | 500 videos × 0.5 min/video × $0.30/min = $75<br>Plus 100 min plan: $75 + $29 = ~$150 |
| D-ID + ElevenLabs | **$172/month** | D-ID: $150 + ElevenLabs $22 = $172 |

**Savings by NOT using ElevenLabs:** $22/month (13% cheaper)

## Available Avatars (All Included)

- **professional-female-1** (Default) - Generic professional woman
- **sheryl-sandberg-coo** - COO leadership style
- **marissa-mayer-ceo** - Tech CEO style
- **elon-musk-tech-ceo** - Tech visionary style
- **steve-jobs-visionary** - Product innovator style
- **jeff-bezos-ceo** - Business executive style
- And 5 more...

## Available Azure Voices (All Included)

**Female:**
- `en-US-JennyNeural` (Default) - Professional, clear
- `en-US-AriaNeural` - Friendly, warm
- `en-US-SaraNeural` - Professional, younger
- `en-US-NancyNeural` - Professional, older

**Male:**
- `en-US-GuyNeural` - Professional, confident
- `en-US-TonyNeural` - Professional, warm
- `en-US-ChristopherNeural` - Professional, authoritative

## Testing

### Test Locally

```bash
npm run dev
# Navigate to http://localhost:3000/practice
# Select "Realistic Video" interviewer
# Start a session
# Watch realistic AI interviewer with excellent voice!
```

### Verify Voice Provider

Check browser console for:
```
"Using Microsoft Azure voice: en-US-JennyNeural"
```

Or if you added ElevenLabs:
```
"Using ElevenLabs voice: Bella"
```

## Troubleshooting

### Video not generating

**Check D-ID credits:**
https://studio.d-id.com/account

### Voice sounds robotic

**Likely still using browser TTS**

Fix:
1. Verify `D_ID_API_KEY` in `.env`
2. Restart dev server
3. Clear browser cache
4. Check Network tab for D-ID API calls

### Want to change default voice

Edit: `app/api/interviewer/generate-video/route.ts`

```typescript
// Line 59 - Change Azure voice
voice_id: voiceId || 'en-US-GuyNeural', // Change to male voice
```

Available voices: https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support?tabs=tts

## Summary

**Minimum Recommended Setup:**
- API Keys: 1 (D-ID only)
- Voice Quality: ⭐⭐⭐⭐ (Excellent Azure)
- Monthly Cost: $4.70/month (or FREE for 20 videos)
- Setup Time: 5 minutes

**Premium Setup (Optional):**
- API Keys: 2 (D-ID + ElevenLabs)
- Voice Quality: ⭐⭐⭐⭐⭐ (Best in class)
- Monthly Cost: $9.70/month minimum
- Setup Time: 10 minutes
- Worth it: Only for premium/enterprise users

**Recommendation:** Start with D-ID only. Add ElevenLabs later if you need that extra 10% voice quality.
