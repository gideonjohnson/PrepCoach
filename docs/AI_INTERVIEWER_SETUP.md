# AI Interviewer Setup Guide

## Overview

PrepCoach now features an advanced AI interviewer system that allows users to practice with either **animated avatars** or **realistic AI-generated human interviewers** with real facial expressions, lip-sync, and neural voice synthesis.

## Features

### 1. **Dual Interviewer Modes**
- **Animated Avatar**: Friendly SVG-based character with dynamic expressions
- **Realistic Celebrity Interviewers**: AI-generated avatars styled after famous business leaders (Elon Musk, Steve Jobs, Sheryl Sandberg, etc.) with photorealistic video and perfect lip-sync

### 2. **Customizable Voice Options**
- **Gender**: Male, Female, or Neutral
- **Accent**: American, British, Australian, Indian, or Neutral
- **Tone**: Professional, Friendly, Strict, or Encouraging

### 3. **Advanced Features**
- Real-time or near-real-time video generation
- Dynamic facial expressions matching question tone
- High-quality neural voice synthesis
- Automatic fallback to browser TTS if APIs are unavailable
- Mobile and desktop responsive design
- Seamless integration with existing interview flow

## Setup Instructions

### Option 1: Animated Avatar (Default - No Setup Required)

The animated avatar works out of the box with browser text-to-speech. No API keys needed!

### Option 2: Realistic AI Interviewer (Recommended)

For the full experience with realistic video avatars and professional voice synthesis:

#### Step 1: D-ID Setup (For Realistic Video)

1. **Sign up for D-ID**
   - Visit: https://studio.d-id.com/
   - Create an account

2. **Get API Key**
   - Go to Account Settings → API Keys
   - Create a new API key
   - Copy the key

3. **Add to Environment**
   ```bash
   # In your .env.local file
   D_ID_API_KEY=your_d_id_api_key_here
   ```

4. **Pricing**
   - ~$0.12 per video minute
   - Free tier: 20 credits (about 20 minutes)
   - Paid plans start at $49/month

#### Step 2: ElevenLabs Setup (For Neural Voice)

1. **Sign up for ElevenLabs**
   - Visit: https://elevenlabs.io/
   - Create an account

2. **Get API Key**
   - Go to Settings → API Keys
   - Generate a new API key
   - Copy the key

3. **Add to Environment**
   ```bash
   # In your .env.local file
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ```

4. **Pricing**
   - ~$0.18 per minute of audio
   - Free tier: 10,000 characters/month
   - Paid plans start at $5/month

#### Step 3: Restart Development Server

```bash
npm run dev
```

## How It Works

### Architecture

```
User Starts Interview
        ↓
Interviewer Configuration Modal
        ↓
User Selects: Type, Gender, Accent, Tone
        ↓
Interview Session Begins
        ↓
For Each Question:
  ├─ If Realistic Mode + D-ID Available
  │   └─ Generate Video with D-ID API (lip-sync + voice)
  ├─ If Animated Mode + ElevenLabs Available
  │   └─ Generate Audio with ElevenLabs API
  └─ Fallback to Browser TTS
        ↓
User Records Answer
        ↓
AI Provides Feedback
```

### API Integration Details

#### D-ID Video Generation (`/api/interviewer/generate-video`)
- Accepts: question text, avatar ID, voice ID, tone
- Returns: video URL with lip-synced interviewer
- Handles: SSML tone adjustment, polling for completion
- Fallback: Returns audio-only mode if D-ID unavailable

#### ElevenLabs Voice Synthesis (`/api/interviewer/generate-audio`)
- Accepts: question text, voice ID, tone
- Returns: base64-encoded MP3 audio
- Handles: Voice settings optimization per tone
- Fallback: Returns browser TTS mode if ElevenLabs unavailable

### Components

1. **InterviewerConfig** (`/app/components/InterviewerConfig.tsx`)
   - Modal for selecting interviewer preferences
   - Avatar gallery for realistic mode
   - Voice and tone customization

2. **VideoInterviewer** (`/app/components/VideoInterviewer.tsx`)
   - Main component handling video/audio playback
   - Switches between animated and realistic modes
   - Manages API calls and fallbacks

## Customization

### Adding New Celebrity Avatars

Edit `/app/components/InterviewerConfig.tsx`:

```typescript
const REALISTIC_AVATARS = {
  male: [
    {
      id: 'your-celebrity-id',
      name: 'Celebrity Name (Style)',
      preview: '/avatars/preview.jpg',
      description: 'Brief description of their style'
    },
    // Add more...
  ],
  // ...
};
```

**Available Celebrity-Style Interviewers:**

**Male:**
- 🚀 Tech CEO (Elon Musk Style) - Innovative, direct, visionary
- 🍎 Visionary Leader (Steve Jobs Style) - Product-focused, perfectionist
- 👥 Startup Founder (Mark Zuckerberg Style) - Fast-paced, data-driven
- 📦 Business Magnate (Jeff Bezos Style) - Customer-obsessed, strategic
- 💻 Tech Pioneer (Bill Gates Style) - Analytical, methodical
- 👔 Professional Executive - Traditional corporate interviewer

**Female:**
- 💼 COO Leader (Sheryl Sandberg Style) - Operations expert, collaborative
- 🎨 Tech CEO (Marissa Mayer Style) - Product-focused, detail-oriented
- 🏢 Enterprise Leader (Ginni Rometty Style) - Strategic, enterprise-minded
- 📺 Platform CEO (Susan Wojcicki Style) - Media-savvy, growth-focused
- 👔 Professional Executive - Traditional corporate interviewer

### Adding New Voices

Edit the `VOICE_OPTIONS` object in `InterviewerConfig.tsx`:

```typescript
const VOICE_OPTIONS = {
  male: {
    american: { id: 'elevenlabs-voice-id', name: 'Voice Name' },
    // Add more accents/voices...
  },
  // ...
};
```

### Customizing Tones

Modify SSML application in `/app/api/interviewer/generate-video/route.ts`:

```typescript
function applyToneToText(text: string, tone?: string): string {
  switch (tone) {
    case 'friendly':
      return `<speak><prosody rate="medium" pitch="+5%">${text}</prosody></speak>`;
    // Add custom tones...
  }
}
```

## Mobile Responsiveness

The video interviewer is fully responsive:

- **Desktop**: Full-size video player (max 500px height)
- **Tablet**: Scaled video with touch-friendly controls
- **Mobile**: Optimized video container with auto-play support

Video elements include `playsInline` attribute for iOS compatibility.

## Fallback Strategy

The system uses a graceful degradation approach:

1. **Best**: D-ID video + ElevenLabs voice (realistic mode)
2. **Good**: Animated avatar + ElevenLabs voice
3. **Acceptable**: Animated avatar + Browser TTS
4. **Minimum**: Animated avatar only (silent mode with text)

Users are never blocked from using the app due to missing API keys.

## Cost Optimization Tips

### For D-ID:
- Cache generated videos for frequently asked questions
- Use lower resolution avatars for mobile devices
- Implement request throttling

### For ElevenLabs:
- Pre-generate audio for standard questions
- Use compression to reduce character count
- Consider using voice cloning for consistency

### Implementation Example:

```typescript
// Cache frequently asked questions
const questionCache = new Map<string, string>();

const cachedVideoUrl = questionCache.get(questionText);
if (cachedVideoUrl) {
  return cachedVideoUrl;
}

// Generate and cache
const videoUrl = await generateVideo(questionText);
questionCache.set(questionText, videoUrl);
```

## Troubleshooting

### Video Not Playing
- Check if D_ID_API_KEY is set correctly
- Verify API credits are available
- Check browser console for errors
- Ensure video URL is accessible

### Audio Quality Issues
- Verify ELEVENLABS_API_KEY is valid
- Check voice ID matches accent/gender
- Ensure stable internet connection
- Try different voice settings

### Mobile Issues
- Enable autoplay permissions in browser
- Check if data saver mode is enabled
- Verify mobile network quality
- Use lower quality settings for 3G/4G

## Security Notes

- API keys should NEVER be exposed to the client
- All API calls are made server-side
- Video URLs are temporary and expire
- Implement rate limiting to prevent abuse

## Legal & Ethical Considerations

**IMPORTANT:** The celebrity-style avatars are:
- **AI-generated avatars styled after public figures**, NOT actual celebrity likenesses
- Used for **educational and training purposes only**
- **Generic professional avatars** that emulate leadership styles, not specific individuals
- Clearly labeled as "Style" (e.g., "Elon Musk Style") to indicate they are inspirational, not impersonation

**Compliance Guidelines:**
1. ✅ Use D-ID's stock presenters or custom-generated avatars
2. ✅ Label all avatars as "AI-generated" or "Style-based"
3. ✅ Include disclaimer that avatars are not actual celebrities
4. ❌ Do NOT use actual celebrity photos without permission
5. ❌ Do NOT claim or imply celebrity endorsement
6. ❌ Do NOT use for commercial purposes without proper licensing

**Recommended Approach:**
- Use D-ID's default presenter library (Tyler, Eric, Alex, etc.)
- Name avatars by role/style rather than specific people
- Focus on interview style (e.g., "Innovative Tech Leader") vs. celebrity names
- Always include disclaimer in UI

## Future Enhancements

- [ ] Add avatar emotion detection based on question difficulty
- [ ] Implement background customization
- [ ] Add interviewer gestures and body language
- [ ] Support multiple interviewer personalities
- [ ] Create interviewer training mode
- [ ] Add analytics for interviewer preferences

## Support

For issues or questions:
- Check the FAQ: `/docs/FAQ.md`
- Report bugs: GitHub Issues
- Contact: support@prepcoach.ai

## Credits

- Video Generation: D-ID (https://d-id.com)
- Voice Synthesis: ElevenLabs (https://elevenlabs.io)
- Animated Avatars: Custom SVG implementation
