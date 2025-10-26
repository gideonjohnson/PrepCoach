# Ultra-Realistic AI Interviewer Setup Guide

Get natural-sounding voice with a real face that perfectly lip-syncs with interview questions.

## Overview

PrepCoach supports three interviewer modes:

1. **Browser TTS** (Default - Free but robotic)
2. **ElevenLabs Audio** (Ultra-realistic voice with animated avatar)
3. **D-ID Video** (Realistic talking head with perfect lip-sync) ⭐ **RECOMMENDED**

## Quick Start

### Option 1: ElevenLabs Only (Best Voice, Animated Avatar)

**Cost:** Free tier (10,000 chars/month) or $5/month
**Quality:** ⭐⭐⭐⭐⭐ Industry-leading voice
**Setup Time:** 5 minutes

#### Step 1: Get ElevenLabs API Key

1. Visit https://elevenlabs.io/
2. Sign up for free account
3. Go to https://elevenlabs.io/app/settings/api-keys
4. Click "Create API Key"
5. Copy your key (starts with `sk_...`)

#### Step 2: Add to Environment

**Local Development:**
```bash
# Edit .env file
ELEVENLABS_API_KEY=sk_your_actual_key_here
```

**Production (Vercel):**
```bash
# Add to Vercel
vercel env add ELEVENLABS_API_KEY production

# When prompted, paste your key
# Select: Yes for all environments (Production, Preview, Development)
```

#### Step 3: Restart Dev Server
```bash
npm run dev
```

**Result:** Natural voice with animated avatar

---

### Option 2: ElevenLabs + D-ID (Best Overall Experience) ⭐

**Cost:**
- ElevenLabs: Free tier or $5/month
- D-ID: Free trial (20 videos) then $4.70/month (15 min) or $29/month (100 min)

**Quality:** ⭐⭐⭐⭐⭐ Photorealistic talking head
**Setup Time:** 10 minutes

#### Step 1: Get Both API Keys

**ElevenLabs:**
1. Follow Option 1 steps above

**D-ID:**
1. Visit https://studio.d-id.com/
2. Sign up (get 20 free credits = 20 videos)
3. Go to https://studio.d-id.com/account-settings
4. Copy "API Key" under "Credentials"

#### Step 2: Add Both to Environment

**Local Development:**
```bash
# Edit .env file
ELEVENLABS_API_KEY=sk_your_elevenlabs_key_here
D_ID_API_KEY=your_d_id_key_here
```

**Production (Vercel):**
```bash
# Add ElevenLabs
vercel env add ELEVENLABS_API_KEY production
# Paste key when prompted

# Add D-ID
vercel env add D_ID_API_KEY production
# Paste key when prompted
```

#### Step 3: Enable in Practice Page

Users will see a settings panel to choose interviewer type:
- **Animated** (uses ElevenLabs voice)
- **Realistic** (uses D-ID video with ElevenLabs voice)

---

## Available Interviewer Avatars

Your PrepCoach includes these pre-configured professional avatars:

### Male Avatars
- `elon-musk-tech-ceo` - Tech visionary style
- `steve-jobs-visionary` - Product innovator style
- `jeff-bezos-ceo` - Business executive style
- `bill-gates-tech` - Tech founder style
- `professional-male-1` - Generic professional

### Female Avatars
- `sheryl-sandberg-coo` - COO leadership style
- `marissa-mayer-ceo` - Tech CEO style
- `susan-wojcicki-youtube` - Media executive style
- `professional-female-1` - Generic professional (default)

## Interviewer Tones

Choose from 4 different tones:

1. **Professional** (Default) - Balanced, neutral
2. **Friendly** - Warm, encouraging
3. **Strict** - Direct, formal
4. **Encouraging** - Supportive, motivating

## Cost Breakdown

### Monthly Cost Estimates (100 active users, 5 sessions each)

**ElevenLabs Only:**
- Characters per question: ~150
- Total questions: 500
- Characters needed: 75,000
- **Cost: $22/month** (100k character plan)

**D-ID + ElevenLabs:**
- Audio: $22/month (ElevenLabs)
- Video: ~50 minutes total
- **Cost: $22 + $29/month = $51/month** (Creator plan)

**Free Tier Limits:**
- ElevenLabs: 10,000 chars (~65 questions/month)
- D-ID: 20 credits (20 videos total)

## How It Works

### Audio Generation Flow (ElevenLabs)

```
1. User starts practice session
2. Frontend calls /api/interviewer/generate-audio
3. Backend calls ElevenLabs API with:
   - Question text
   - Voice ID (default: Bella - professional female)
   - Tone settings
4. ElevenLabs returns MP3 audio
5. Audio plays with animated avatar
```

### Video Generation Flow (D-ID + ElevenLabs)

```
1. User starts practice session
2. Frontend calls /api/interviewer/generate-video
3. Backend calls D-ID API with:
   - Question text
   - Avatar image URL
   - ElevenLabs voice ID
   - Tone (via SSML)
4. D-ID generates video with perfect lip-sync
5. Returns video URL
6. Video autoplays with realistic talking head
```

## Fallback Behavior

**Smart Degradation:**

1. If D-ID key missing → Falls back to ElevenLabs audio
2. If ElevenLabs key missing → Falls back to browser TTS
3. If both missing → Browser TTS (free but robotic)

**No Breaking:** App works without API keys, just with reduced quality.

## Testing

### Test ElevenLabs Integration

```bash
# Start dev server
npm run dev

# Navigate to http://localhost:3000/practice
# Start a session
# Listen for high-quality voice
```

### Test D-ID Integration

```bash
# Ensure both keys are set
# Navigate to http://localhost:3000/practice
# In interviewer settings, select "Realistic Video"
# Start session
# Watch for realistic talking head
```

## Troubleshooting

### No Audio Playing

**Check:**
```bash
# Verify env var is set
echo $ELEVENLABS_API_KEY

# Check browser console for errors
# Should see: "Selected voice: Bella" or "ElevenLabs audio generated"
```

### Video Not Loading

**Check:**
1. D-ID credits: https://studio.d-id.com/account
2. Browser console errors
3. Network tab - look for D-ID API calls
4. Video URL in response

### Voice Sounds Robotic

**Likely Cause:** Still using browser TTS

**Fix:**
1. Verify `ELEVENLABS_API_KEY` in `.env`
2. Restart dev server: `npm run dev`
3. Clear browser cache
4. Check Network tab for `/api/interviewer/generate-audio` calls

## Production Deployment

After adding keys to Vercel:

```bash
# Redeploy to apply env changes
vercel --prod

# Or push to git (triggers auto-deploy)
git add .
git commit -m "Enable realistic AI interviewer"
git push origin master
```

## API Key Security

**Environment Variables:**
- ✅ Store in `.env` (gitignored)
- ✅ Store in Vercel environment variables
- ❌ Never commit to git
- ❌ Never expose in client-side code

**Current Implementation:**
- All API calls happen server-side
- Keys never sent to browser
- Vercel automatically encrypts env vars

## Voice Customization

### Change Default Voice (ElevenLabs)

Edit `/app/api/interviewer/generate-audio/route.ts`:

```typescript
// Line 39 - Change voice ID
voice_id: voiceId || 'EXAVITQu4vr4xnSDxMaL', // Bella (default)

// Popular ElevenLabs voices:
// 'EXAVITQu4vr4xnSDxMaL' - Bella (professional female)
// '21m00Tcm4TlvDq8ikWAM' - Rachel (calm female)
// 'AZnzlk1XvdvUeBnXmlld' - Domi (confident female)
// 'ErXwobaYiN019PkySvjV' - Antoni (professional male)
// 'VR6AewLTigWG4xSOukaG' - Arnold (deep male)
```

### Adjust Voice Settings

Edit tone settings in same file (lines 84-114):

```typescript
case 'professional':
  return {
    stability: 0.5,        // 0-1 (lower = more expressive)
    similarity_boost: 0.75, // 0-1 (higher = more like original)
  };
```

## Advanced: Custom Avatars

### Add Your Own Avatar (D-ID)

1. Upload image to D-ID: https://studio.d-id.com/
2. Get presenter URL
3. Edit `/app/api/interviewer/generate-video/route.ts`:

```typescript
// Line 144-162 - Add custom avatar
const avatarMap = {
  'my-custom-ceo': 'https://your-avatar-url.jpg',
  // ... existing avatars
};
```

## Support

**Documentation:**
- ElevenLabs Docs: https://docs.elevenlabs.io/
- D-ID Docs: https://docs.d-id.com/

**PrepCoach Issues:**
- Check existing setup: `docs/AI_INTERVIEWER_SETUP.md`
- GitHub Issues: Your repo issues page

## Summary

**Minimum Setup (5 min):**
1. Get ElevenLabs API key (free)
2. Add to `.env` and Vercel
3. Restart server

**Full Setup (10 min):**
1. Get ElevenLabs + D-ID keys
2. Add both to `.env` and Vercel
3. Select "Realistic Video" in practice page
4. Enjoy photorealistic AI interviewer!

**Cost:** Free tier sufficient for testing, $5-51/month for production depending on usage.
