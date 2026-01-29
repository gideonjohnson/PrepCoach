# PrepCoach Expansion - Continuation Tracker

> **Purpose:** This file tracks implementation progress across sessions so work
> can resume instantly after a crash or context loss. Update this file after
> completing each item.
>
> **Reference:** `expansion plan/expansion.pdf`

---

## Status Summary

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | AI Enhancements (coding, system design, recording, JD parsing) | COMPLETE (pending DB push) |
| Phase 2 | Human-Led Anonymous Mock Interviews | COMPLETE |
| Phase 3 | Hiring Marketplace | COMPLETE |

---

## PHASE 1: AI Enhancements

### 1.1 Schema & Pricing
- [x] Prisma schema: `SessionRecording`, `CodingSession`, `SystemDesignSession`, `Problem`, `SystemDesignProblem`, `JobDescription` models
- [x] Added `role` field to `User` model
- [x] Added Phase 1 relations to `User` model
- [x] `lib/pricing.ts`: Expert session pricing, coaching packages, marketplace credits, helper functions
- [x] Run `prisma generate` to apply schema changes (db push pending — DB unreachable)

### 1.2 Problems (Coding)
- [x] `app/api/problems/route.ts` — List/create problems API
- [x] `app/api/problems/[slug]/route.ts` — Get/update/delete single problem API
- [x] `app/problems/page.tsx` — Problems listing page
- [x] `app/problems/[slug]/page.tsx` — Single problem page
- [x] `app/components/ProblemCard.tsx` — Problem card component
- [x] `app/components/ProblemFilters.tsx` — Filter/search component
- [x] Seed file created (`prisma/seed.ts`) with 18 coding + 6 system design problems (run pending — DB unreachable)
- [x] Problem pagination (API already supports it, page wired up)
- [x] Company tag filtering (API + ProblemFilters updated)

### 1.3 Coding Sessions
- [x] `app/api/coding/session/route.ts` — Create coding session API
- [x] `app/api/coding/session/[id]/route.ts` — Get/update coding session API
- [x] `app/components/CollaborativeCodingPad.tsx` — Monaco-based code editor
- [x] Code execution / test runner integration (`app/api/coding/execute/route.ts`)
- [x] AI hints endpoint (`app/api/coding/hints/route.ts`)
- [x] Coding session completion & scoring logic (PATCH handler with AI analysis)
- [x] Coding session replay from snapshots (`app/coding/replay/[id]/page.tsx`)

### 1.4 System Design Sessions
- [x] `app/api/system-design/route.ts` — Create system design session API
- [x] `app/api/system-design/[id]/route.ts` — Get/update system design session API
- [x] `app/components/SystemDesignCanvas.tsx` — Design canvas component
- [x] System design problem seed data (6 problems in seed.ts)
- [x] AI analysis endpoint for designs (already in [id]/route.ts)
- [x] System design scoring rubric logic (rubric wired into AI prompt)
- [x] System design session replay (`app/system-design/replay/[id]/page.tsx`)

### 1.5 Session Recording
- [x] `app/api/recording/route.ts` — Create recording API
- [x] `app/api/recording/[id]/route.ts` — Get/update/manage recording API
- [x] `app/components/SessionRecorder.tsx` — Recording component (audio/video/screen)
- [x] `app/components/SessionReplayPlayer.tsx` — Replay player component
- [x] S3/R2 upload integration for media files (`lib/storage.ts`, `app/api/recording/upload/route.ts`)
- [x] Transcription pipeline (`app/api/recording/transcribe/route.ts`)
- [x] Recording processing pipeline (`app/api/recording/process/route.ts`)

### 1.6 Job Description Parser
- [x] `app/api/job-description/route.ts` — Parse/analyze JD API
- [x] JD listing/history page (`app/job-descriptions/page.tsx` + `[id]/page.tsx`)
- [x] AI-generated custom interview questions from JD (generated in POST /api/job-description, displayed in detail page Questions tab)
- [x] Resume-to-JD match scoring (matchScore calculated when includeResumeMatch=true)
- [x] Gap analysis UI (detail page Gaps tab with strong matches, gaps, recommendations)

### 1.7 Phase 1 Integration & Polish
- [x] Wire up problems page in main navigation/header (Header.tsx updated)
- [x] Wire up coding session from problem detail page (test runner, AI hints, scoring)
- [x] Wire up system design from dashboard (listing page + detail page with canvas)
- [x] Wire up recording to coding + system design sessions (SessionRecorder integrated)
- [x] Add Phase 1 feature gates to pricing/subscription checks (`lib/pricing.ts` extended)
- [x] End-to-end testing of Phase 1 flows (`__tests__/api/phase1.test.ts` — 24/24 tests passing)

---

## PHASE 2: Human-Led Anonymous Mock Interviews

### 2.1 Schema & Pricing
- [x] Prisma schema: `Interviewer`, `ExpertSession`, `InterviewerReview`, `InterviewerPayout`, `CoachingPackage` models
- [x] Added Phase 2 relations to `User` model
- [x] `lib/pricing.ts`: Expert session types + coaching package pricing

### 2.2 Interviewer System
- [x] Interviewer registration/onboarding flow (`app/interviewer/register/page.tsx`)
- [x] Interviewer profile page (`app/interviewer/profile/page.tsx`)
- [x] Interviewer verification admin panel (`app/admin/interviewers/page.tsx`)
- [x] Admin API for interviewer management (`app/api/admin/interviewers/`)
- [x] Stripe Connect onboarding for payouts (`app/api/interviewer/connect/route.ts`)
- [x] Availability calendar UI (`app/components/AvailabilityCalendar.tsx`, `app/api/interviewer/availability/route.ts`)

### 2.3 Expert Sessions
- [x] Session booking flow (`app/book/[interviewerId]/page.tsx`)
- [x] Session matching / discovery page (`app/interviewers/page.tsx`, `app/interviewers/[id]/page.tsx`)
- [x] Booking API (`app/api/sessions/book/route.ts`)
- [x] WebRTC room creation (`app/api/sessions/[id]/room/route.ts`, `app/sessions/[id]/room/page.tsx`)
- [x] Anonymous identity generation (`lib/anonymous.ts`)
- [x] In-session collaborative coding pad (reuses Phase 1 `CollaborativeCodingPad.tsx`)
- [x] In-session whiteboard (`app/components/Whiteboard.tsx`)
- [x] Post-session feedback form (`app/sessions/[id]/feedback/page.tsx`)
- [x] Identity reveal flow (`app/api/sessions/[id]/reveal/route.ts`)

### 2.4 Coaching Packages
- [x] Package purchase flow (`app/coaching/page.tsx`)
- [x] Package API (`app/api/coaching/packages/route.ts`)
- [x] Package usage tracking (`app/api/coaching/usage/route.ts`)
- [x] Package expiration handling (auto-expire in usage API)

### 2.5 Payments & Payouts
- [x] Expert session payment (Stripe checkout) (`app/api/payments/session/route.ts`)
- [x] Checkout page (`app/checkout/session/[id]/page.tsx`)
- [x] Stripe webhook handler (`app/api/webhooks/stripe/route.ts`)
- [x] Interviewer payout processing (`app/api/interviewer/payouts/route.ts`)
- [x] Payout dashboard for interviewers (`app/interviewer/payouts/page.tsx`)
- [x] Refund / cancellation / no-show handling (`app/api/sessions/[id]/cancel/route.ts`, `app/api/sessions/[id]/no-show/route.ts`)

### 2.6 Phase 2 Integration & Polish
- [x] Navigation updates in Header.tsx (Expert Interviewers, Coaching, My Sessions)
- [x] Sessions listing page (`app/sessions/page.tsx`)
- [x] Session detail page (`app/sessions/[id]/page.tsx`)
- [x] Feedback/review system API (`app/api/sessions/[id]/feedback/route.ts`)
- [x] Phase 2 tests (`__tests__/api/phase2.test.ts`)

---

## PHASE 3: Hiring Marketplace

### 3.1 Schema & Pricing
- [x] Prisma schema: `TalentProfile`, `RecruiterCompany`, `Recruiter`, `RecruiterView`, `InterviewRequest`, `ProfileReveal`, `CreditPurchase` models
- [x] Added Phase 3 relations to `User` model
- [x] `lib/pricing.ts`: Marketplace credit packs pricing

### 3.2 Talent Profiles
- [x] Opt-in flow for candidates (`app/talent/opt-in/page.tsx`)
- [x] Anonymous talent profile page (`app/talent/profile/page.tsx`)
- [x] Score aggregation from AI sessions (in `app/api/talent/profile/route.ts` `aggregateUserScores()`)
- [x] Verified skills calculation (language-based verification from coding sessions)
- [x] Job preferences editor (in opt-in page and profile API)

### 3.3 Recruiter System
- [x] Recruiter company registration + verification (`app/recruiter/register/page.tsx`, `app/api/recruiter/register/route.ts`)
- [x] Recruiter dashboard (`app/recruiter/dashboard/page.tsx`, `app/api/recruiter/dashboard/route.ts`)
- [x] Talent search / browse with filters (`app/recruiter/talent/page.tsx`, `app/api/talent/search/route.ts`)
- [x] Credit purchase flow (`app/api/recruiter/credits/route.ts`)
- [x] Interview request flow (`app/api/talent/[id]/request/route.ts`)

### 3.4 Matching & Reveal
- [x] Interview request notifications (`app/talent/requests/page.tsx`, `app/api/talent/requests/route.ts`)
- [x] Accept/decline flow for candidates (`app/api/talent/requests/[id]/respond/route.ts`)
- [x] Mutual profile reveal mechanism (`app/api/talent/requests/[id]/reveal/route.ts`)
- [x] Post-reveal contact exchange (candidate name/email/resume shared on mutual reveal)

---

## Files Created This Expansion (for reference)

### API Routes
- `app/api/problems/route.ts`
- `app/api/problems/[slug]/route.ts`
- `app/api/coding/session/route.ts`
- `app/api/coding/session/[id]/route.ts`
- `app/api/coding/execute/route.ts`
- `app/api/coding/hints/route.ts`
- `app/api/system-design/route.ts`
- `app/api/system-design/[id]/route.ts`
- `app/api/recording/route.ts`
- `app/api/recording/[id]/route.ts`
- `app/api/job-description/route.ts`

### Components
- `app/components/CollaborativeCodingPad.tsx`
- `app/components/ProblemCard.tsx`
- `app/components/ProblemFilters.tsx`
- `app/components/SessionRecorder.tsx`
- `app/components/SessionReplayPlayer.tsx`
- `app/components/SystemDesignCanvas.tsx`

### Pages
- `app/problems/page.tsx`
- `app/problems/[slug]/page.tsx`
- `app/system-design/page.tsx`
- `app/system-design/[slug]/page.tsx`
- `app/system-design/replay/[id]/page.tsx`
- `app/coding/replay/[id]/page.tsx`
- `app/job-descriptions/page.tsx`
- `app/job-descriptions/[id]/page.tsx`

### Other Created Files
- `prisma/seed.ts` — 18 coding + 6 system design problems
- `lib/storage.ts` — S3-compatible storage utility
- `__tests__/api/phase1.test.ts` — Phase 1 unit tests (24 tests)
- `app/api/recording/upload/route.ts` — Presigned URL + direct upload
- `app/api/recording/transcribe/route.ts` — Whisper transcription
- `app/api/recording/process/route.ts` — Recording processing pipeline

### Phase 2 API Routes
- `app/api/interviewer/register/route.ts` — Interviewer registration
- `app/api/interviewer/profile/route.ts` — Interviewer profile GET/PATCH
- `app/api/interviewers/route.ts` — Public interviewer listing
- `app/api/interviewers/[id]/route.ts` — Public interviewer detail
- `app/api/admin/interviewers/route.ts` — Admin list interviewers
- `app/api/admin/interviewers/[id]/route.ts` — Admin verify/reject
- `app/api/sessions/book/route.ts` — Session booking
- `app/api/sessions/[id]/feedback/route.ts` — Session feedback
- `app/api/payments/session/route.ts` — Stripe checkout creation
- `app/api/webhooks/stripe/route.ts` — Stripe webhook handler
- `app/api/coaching/packages/route.ts` — Coaching packages

### Phase 2 Pages
- `app/interviewer/register/page.tsx` — Interviewer registration form
- `app/interviewer/profile/page.tsx` — Interviewer profile management
- `app/interviewers/page.tsx` — Public interviewer discovery
- `app/interviewers/[id]/page.tsx` — Public interviewer profile
- `app/admin/interviewers/page.tsx` — Admin verification panel
- `app/book/[interviewerId]/page.tsx` — Session booking
- `app/checkout/session/[id]/page.tsx` — Payment checkout
- `app/sessions/page.tsx` — User's sessions list
- `app/sessions/[id]/page.tsx` — Session detail
- `app/sessions/[id]/feedback/page.tsx` — Feedback form
- `app/coaching/page.tsx` — Coaching packages

### Phase 2 Tests
- `__tests__/api/phase2.test.ts` — Phase 2 unit tests

### Modified Files
- `prisma/schema.prisma` — Added all Phase 1/2/3 models
- `lib/pricing.ts` — Added expert session, coaching, marketplace pricing + Phase 1 feature gates
- `package.json` — Added prisma seed script
- `app/components/Header.tsx` — Added nav items + keyboard shortcuts + Phase 2 links
- `app/dashboard/page.tsx` — Added coding/system-design/JD quick links
- `app/api/recording/route.ts` — Support coding + system_design session types

---

### Phase 2 Additional Files (Session 3)
- `app/api/interviewer/connect/route.ts` — Stripe Connect onboarding
- `app/api/interviewer/payouts/route.ts` — Payout processing
- `app/api/interviewer/availability/route.ts` — Availability management API
- `app/api/interviewers/[id]/availability/route.ts` — Public availability for booking
- `app/api/sessions/[id]/room/route.ts` — WebRTC room API
- `app/api/sessions/[id]/reveal/route.ts` — Identity reveal API
- `app/api/sessions/[id]/cancel/route.ts` — Session cancellation + refund
- `app/api/sessions/[id]/no-show/route.ts` — No-show reporting
- `app/api/coaching/usage/route.ts` — Coaching package usage tracking
- `app/interviewer/payouts/page.tsx` — Payout dashboard
- `app/sessions/[id]/room/page.tsx` — WebRTC video room page
- `app/components/VideoRoom.tsx` — WebRTC video component
- `app/components/Whiteboard.tsx` — In-session whiteboard
- `app/components/AvailabilityCalendar.tsx` — Availability calendar component

### Phase 3 Files
- `app/api/talent/profile/route.ts` — Talent profile CRUD + score aggregation
- `app/api/talent/search/route.ts` — Talent search/browse for recruiters
- `app/api/talent/[id]/request/route.ts` — Send interview request to talent
- `app/api/talent/requests/route.ts` — List interview requests for candidates
- `app/api/talent/requests/[id]/respond/route.ts` — Accept/decline requests
- `app/api/talent/requests/[id]/reveal/route.ts` — Mutual profile reveal
- `app/api/recruiter/register/route.ts` — Recruiter registration
- `app/api/recruiter/dashboard/route.ts` — Recruiter dashboard API
- `app/api/recruiter/credits/route.ts` — Credit purchase flow
- `app/talent/opt-in/page.tsx` — Candidate opt-in page
- `app/talent/profile/page.tsx` — Candidate talent profile page
- `app/talent/requests/page.tsx` — Interview requests page
- `app/recruiter/register/page.tsx` — Recruiter registration page
- `app/recruiter/dashboard/page.tsx` — Recruiter dashboard page
- `app/recruiter/talent/page.tsx` — Talent browse/search page

### Schema Changes (Session 3)
- Added `coachingPackageId`, `cancellationReason`, `cancelledAt`, `refundId`, `refundAmount` to `ExpertSession`

---

## Notes

- All 3 phases are now COMPLETE (implementation only, pending DB push).
- No migrations have been run yet for the new schema.
- The expansion plan PDF is at `expansion plan/expansion.pdf`.
- The `tmpclaude-*` files in the project root are stale session markers and can be cleaned up.
