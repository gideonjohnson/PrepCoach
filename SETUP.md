# PrepCoach - Setup Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager
- API keys from Anthropic and OpenAI

---

## 📝 API Key Setup

PrepCoach requires two API keys for AI features to work:

### 1. Anthropic API Key (for AI Feedback)
**Purpose:** Analyzes interview responses and provides detailed feedback

**Get your key:**
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

**Pricing:** Pay-as-you-go
- ~$0.015 per feedback request (using Claude 3.5 Sonnet)
- Free tier available with credits

### 2. OpenAI API Key (for Audio Transcription)
**Purpose:** Transcribes audio recordings using Whisper API

**Get your key:**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

**Pricing:** Pay-as-you-go
- ~$0.006 per minute of audio (Whisper model)
- New accounts get $5 free credits

---

## 🔧 Installation Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Open the `.env` file in the project root and replace the placeholder values:

```env
# AI API Keys
# Get your Anthropic API key from: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here

# Get your OpenAI API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-actual-key-here
```

**Important:**
- Never commit your `.env` file to version control
- Keep your API keys secret
- The `.env` file is already in `.gitignore`

### Step 3: Start Development Server
```bash
npm run dev
```

The app will be available at:
- **Local:** http://localhost:3001
- **Network:** http://10.2.0.2:3001 (not recommended - use localhost for audio recording)

**⚠️ Important:** Always use `http://localhost:3001` for audio recording to work (browser security requirement)

---

## 🧪 Testing the Setup

### Test 1: Audio Recording
1. Go to http://localhost:3001/practice
2. Select any role
3. Click the microphone button
4. Allow microphone permissions when prompted
5. Record a test answer
6. Stop recording - you should see audio playback controls

**Troubleshooting:**
- If microphone doesn't work, make sure you're using `localhost` not IP address
- Check browser permissions (should show microphone icon in address bar)
- Try Chrome, Firefox, or Edge (Safari may have issues)

### Test 2: AI Feedback (Requires API Keys)
1. Complete Test 1 (record an answer)
2. Click "Get AI Feedback"
3. Wait ~5-10 seconds for analysis
4. You should see detailed feedback appear

**Expected Response:**
- Overall assessment
- Strengths (2-3 points)
- Areas for improvement (2-3 points)
- Suggestions (2-3 points)
- Scores for content, structure, and communication

**Troubleshooting:**
- Check that API keys are correctly set in `.env`
- Restart dev server after adding keys
- Check browser console for error messages
- Verify API key validity at provider websites

### Test 3: Dashboard
1. Complete at least one question
2. Go to http://localhost:3001/dashboard
3. You should see your interview session listed
4. Stats should show: 1 total interview, questions answered, completion %

---

## 💰 Cost Estimates

### Typical Usage Costs:
- **One complete interview (20 questions):**
  - Audio transcription: ~$0.12 (20 mins @ $0.006/min)
  - AI feedback: ~$0.30 (20 responses @ $0.015 each)
  - **Total: ~$0.42 per full interview**

### Monthly Cost Examples:
- **Light use** (5 interviews/month): ~$2.10
- **Moderate use** (20 interviews/month): ~$8.40
- **Heavy use** (50 interviews/month): ~$21.00

**Free tier options:**
- Anthropic: $5 free credits = ~333 feedback requests
- OpenAI: $5 free credits = ~833 minutes of transcription

---

## 🛠️ Development Mode (No API Keys Required)

If you want to test the UI without API keys, you can use mock mode:

1. The app will work for:
   - Role selection
   - Audio recording
   - Question navigation
   - Dashboard viewing

2. AI features will fail gracefully:
   - "Get AI Feedback" will show an error
   - Transcription will fail but app won't crash

3. To add mock data for testing:
   - Open browser console
   - Go to Application > Local Storage
   - Add test interview sessions manually

---

## 📁 Project Structure

```
prepcoach/
├── app/
│   ├── page.tsx              # Landing page
│   ├── practice/
│   │   ├── page.tsx          # Interview practice interface
│   │   ├── roles.ts          # 341 role definitions
│   │   ├── questions.ts      # Interview questions database
│   │   ├── useAudioRecorder.ts
│   │   ├── useTextToSpeech.ts
│   │   └── AIAvatar.tsx
│   ├── dashboard/
│   │   └── page.tsx          # Results dashboard
│   └── api/
│       ├── analyze-response/
│       │   └── route.ts      # Claude AI feedback endpoint
│       └── transcribe/
│           └── route.ts      # Whisper transcription endpoint
├── .env                      # API keys (DO NOT COMMIT)
├── package.json
└── SETUP.md                  # This file
```

---

## 🔒 Security Best Practices

1. **Never share your API keys**
2. **Never commit `.env` to git**
3. **Rotate keys if accidentally exposed**
4. **Set spending limits** in API provider dashboards
5. **Monitor usage** regularly

### Setting Spending Limits:
- **Anthropic:** https://console.anthropic.com/settings/limits
- **OpenAI:** https://platform.openai.com/account/limits

---

## 🐛 Common Issues

### Issue: "Port 3000 is already in use"
**Solution:** The app will automatically use port 3001. Use http://localhost:3001

### Issue: "navigator.mediaDevices is undefined"
**Solution:**
- Make sure you're using `http://localhost:3001` (not IP address)
- Use Chrome, Firefox, or Edge
- Enable HTTPS if deploying to production

### Issue: "Transcription failed"
**Solution:**
- Check OPENAI_API_KEY is set correctly
- Verify you have OpenAI credits remaining
- Check browser console for detailed error

### Issue: "AI feedback not working"
**Solution:**
- Check ANTHROPIC_API_KEY is set correctly
- Restart dev server after adding keys
- Verify Anthropic API credits

### Issue: "Audio won't record on network IP"
**Solution:** This is expected. Always use `localhost` for development. Browser security requires secure context (HTTPS or localhost) for microphone access.

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review browser console for errors
3. Check API provider status pages
4. Verify API keys are valid and have credits

---

## 🎉 Ready to Go!

Once your API keys are set up, you're ready to practice interviews!

1. Visit http://localhost:3001
2. Click "Get Started"
3. Choose your role
4. Start practicing!

Good luck with your interview preparation! 🚀
