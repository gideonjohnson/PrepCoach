# 🎯 PrepCoach - AI-Powered Interview Practice Platform

Practice interviews with AI, get instant feedback, and land your dream job.

## ✨ Features

- 🎭 **341 Real Job Roles** - Practice for positions at Meta, Google, Amazon, and more
- 🤖 **AI Interviewer** - Natural text-to-speech interviewer with animated avatar
- 🎤 **Audio Recording** - Record your responses with browser-based audio capture
- 📊 **AI Feedback** - Get detailed feedback powered by Claude 3.5 Sonnet
- 📈 **Progress Dashboard** - Track your improvement over time with analytics charts
- 🏷️ **Smart Filtering** - Filter by industry, experience level (L1/L2/L3), and role
- 🎯 **LinkedIn-Aligned** - 80% coverage of LinkedIn's top 25 fastest-growing jobs
- 🔐 **User Authentication** - Secure sign-up/sign-in with NextAuth
- 💾 **Database Storage** - Persistent session storage with Prisma + SQLite
- 📤 **Export Options** - Download your interview history as PDF or CSV

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up API Keys

You need two API keys to use AI features:

#### Get Anthropic API Key (for AI Feedback)
1. Visit https://console.anthropic.com/
2. Create an account or sign in
3. Generate a new API key
4. Copy the key (starts with `sk-ant-`)

#### Get OpenAI API Key (for Audio Transcription)
1. Visit https://platform.openai.com/api-keys
2. Create an account or sign in
3. Generate a new API key
4. Copy the key (starts with `sk-`)

### 3. Configure Environment
Edit the `.env` file and add your API keys:

```env
# AI API Keys
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
OPENAI_API_KEY=sk-your-actual-key-here

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Set Up Database
```bash
npx prisma migrate dev --name init
npx prisma generate
```

This creates a local SQLite database and generates the Prisma client.

### 5. Start the Development Server
```bash
npm run dev
```

### 6. Open Your Browser
Visit **http://localhost:3000** (or the port shown in terminal)

⚠️ **Important:** Use `localhost` (not IP address) for audio recording to work!

### 7. Create an Account
- Click "Get Started" or navigate to `/auth/signup`
- Create your account with email and password
- Sign in and start practicing!

## 📖 Detailed Setup

See [SETUP.md](./SETUP.md) for comprehensive setup instructions, troubleshooting, and cost estimates.

## 🎮 How to Use

### 1. Choose a Role
- Browse 341 roles across 22 industries
- Filter by experience level (Entry, Mid, Senior, Executive)
- Search by role, company, or keywords

### 2. Practice Your Interview
- AI interviewer reads questions aloud
- Record your audio responses
- Navigate through 20 questions per session

### 3. Get AI Feedback
- Click "Get AI Feedback" after recording
- Receive detailed analysis including:
  - Overall assessment
  - Strengths (what you did well)
  - Areas for improvement
  - Specific suggestions
  - Scores on content, structure, and communication

### 4. Track Your Progress
- View all interview sessions in the Dashboard
- Monitor completion rates
- Review past feedback
- Track questions answered over time

## 💰 Cost Estimates

**Per Complete Interview (20 questions):**
- Audio transcription: ~$0.12
- AI feedback: ~$0.30
- **Total: ~$0.42**

**Free Tier:**
- Anthropic: $5 credits = ~333 feedback requests
- OpenAI: $5 credits = ~833 minutes of transcription

## 🛠️ Tech Stack

- **Frontend:** Next.js 15.5, React 19, TailwindCSS 4
- **Backend:** Next.js API Routes
- **Database:** Prisma ORM + SQLite (easily switchable to PostgreSQL)
- **Authentication:** NextAuth.js v4 with credentials provider
- **AI:**
  - Claude 3.5 Sonnet (feedback analysis)
  - Whisper API (audio transcription)
  - Web Speech API (text-to-speech)
- **Data Visualization:** Recharts (LineChart, BarChart, PieChart)
- **Export:** jsPDF (PDF generation), CSV export
- **Audio:** MediaRecorder API (browser-based)

## 📁 Project Structure

```
prepcoach/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout with SessionProvider
│   ├── providers.tsx               # NextAuth SessionProvider wrapper
│   ├── auth/
│   │   ├── signin/page.tsx        # Sign-in page
│   │   └── signup/page.tsx        # Sign-up page
│   ├── practice/
│   │   ├── page.tsx               # Interview interface
│   │   ├── roles.ts               # 341 role definitions
│   │   ├── questions.ts           # Interview questions
│   │   ├── useAudioRecorder.ts    # Audio recording hook
│   │   ├── useTextToSpeech.ts     # TTS hook
│   │   └── AIAvatar.tsx           # Animated avatar
│   ├── dashboard/
│   │   ├── page.tsx               # Progress dashboard with analytics
│   │   └── session/[sessionId]/   # Individual session detail view
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/     # NextAuth API routes
│       │   └── signup/            # User registration endpoint
│       ├── analyze-response/      # Claude feedback API
│       └── transcribe/            # Whisper transcription API
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── migrations/                # Database migrations
│   └── dev.db                     # SQLite database (gitignored)
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   └── exportUtils.ts             # PDF/CSV export utilities
├── .env                            # Environment variables (DO NOT COMMIT)
├── .env.example                    # Example env file
├── SETUP.md                        # Detailed setup guide
└── README.md                       # This file
```

## 🔒 Security

- Never commit `.env` file to version control
- Keep API keys secret
- Set spending limits in API provider dashboards
- Rotate keys if accidentally exposed

## 🐛 Common Issues

### Audio Recording Not Working
- ✅ Use `http://localhost:3001` (not IP address)
- ✅ Use Chrome, Firefox, or Edge
- ✅ Allow microphone permissions when prompted

### AI Features Not Working
- ✅ Check API keys are set in `.env`
- ✅ Restart dev server after adding keys
- ✅ Verify you have API credits remaining
- ✅ Check browser console for errors

### Port Already in Use
- ✅ App will automatically use port 3001 if 3000 is busy

## 📊 Role Coverage

**Total Roles:** 341
**Industries:** 22
**Experience Levels:** 4 (Entry, Mid, Senior, Executive)

**Featured Industries:**
- Technology (Software Engineer I/II/III)
- Cybersecurity (SOC Analyst L1/L2/L3)
- Data Science (Data Scientist I/II/III)
- Healthcare (Physical Therapist, Advanced Practice Provider)
- AI & Emerging Tech (AI Consultant, Prompt Engineer)
- Sustainability (ESG Analyst, Carbon Accounting)
- Real Estate (Land Agent, Property Manager)
- Public Sector (Workforce Development, Grants Consultant)
- And 14 more industries...

## 🎯 LinkedIn Top Jobs Coverage

PrepCoach covers **20 out of 25** (80%) of LinkedIn's 2025 fastest-growing jobs, including:
- ✅ Artificial Intelligence Consultant (#2)
- ✅ Physical Therapist (#3)
- ✅ Workforce Development Manager (#4)
- ✅ Travel Advisor (#5)
- ✅ Event Coordinator (#6)
- ✅ Sustainability Specialist (#9)
- ✅ And 14 more from the top 25...

## 🚧 What's Next

Completed features:
- [x] User authentication & profiles (NextAuth with email/password)
- [x] Database integration (Prisma + SQLite)
- [x] Performance analytics & charts (Recharts visualizations)
- [x] Export interview history (PDF/CSV)

Planned features:
- [ ] Email verification for new accounts
- [ ] Password reset functionality
- [ ] Social authentication (Google, GitHub OAuth)
- [ ] Video recording for behavioral interviews
- [ ] Company-specific interview prep (FAANG)
- [ ] Peer review & community features
- [ ] Mobile app (React Native)

## 📞 Support

Having issues? Check these resources:
1. [SETUP.md](./SETUP.md) - Comprehensive setup guide
2. Browser console - Check for error messages
3. API provider status pages
4. Verify API keys are valid

## 📄 License

ISC

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org)
- [Anthropic Claude](https://anthropic.com)
- [OpenAI Whisper](https://openai.com/research/whisper)
- [TailwindCSS](https://tailwindcss.com)

---

**Ready to ace your next interview? Let's go! 🚀**
