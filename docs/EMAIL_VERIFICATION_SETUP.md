# Email Verification & Password Reset Setup Guide

## Overview

PrepCoach now includes complete email verification and password reset functionality to enhance account security and user experience.

## Features

### 1. **Email Verification**
- Automatic verification emails sent on signup
- 24-hour token expiration
- Resend verification email option
- Beautiful email templates with branding
- Success/error pages with automatic redirects

### 2. **Password Reset**
- Secure "Forgot Password" flow
- 1-hour token expiration for security
- Password strength validation (min. 8 characters)
- Email confirmation of password reset
- Protection against email enumeration attacks

### 3. **Security Features**
- Secure token generation using crypto.randomBytes
- Tokens hashed and stored in database
- Automatic token cleanup after use/expiration
- No account existence disclosure for security
- HTTPS email links

## Setup Instructions

### Step 1: Get Resend API Key

1. **Sign up for Resend**
   - Visit: https://resend.com/
   - Create an account (free tier: 100 emails/day)

2. **Get API Key**
   - Go to API Keys section
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Verify Domain (Optional for Production)**
   - For development: Use `onboarding@resend.dev` (no verification needed)
   - For production: Add your domain and verify DNS records
   - Set up SPF, DKIM, and DMARC for best deliverability

### Step 2: Configure Environment Variables

Add these to your `.env` file:

```env
# Resend Email Service
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev  # Development
# RESEND_FROM_EMAIL=noreply@yourdomain.com  # Production

# NextAuth URL (required for email links)
NEXTAUTH_URL=http://localhost:3000  # Development
# NEXTAUTH_URL=https://yourdomain.com  # Production
```

### Step 3: Database Migration

The database schema has already been updated. If you need to run migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

### Step 4: Test the System

```bash
npm run dev
```

## How It Works

### Email Verification Flow

```
User Signs Up
     ↓
Account Created (emailVerified = null)
     ↓
Verification Token Generated (24h expiry)
     ↓
Email Sent with Verification Link
     ↓
User Clicks Link → /auth/verify-email?token=xxx
     ↓
Token Validated & Not Expired?
     ├─ YES → Set emailVerified = Date, Delete Token, Redirect to Sign In
     └─ NO  → Show Error, Option to Resend
```

### Password Reset Flow

```
User Clicks "Forgot Password"
     ↓
Enters Email → /auth/forgot-password
     ↓
User Exists?
     ├─ YES → Generate Reset Token (1h expiry), Send Email
     └─ NO  → Show Generic Success Message (security)
     ↓
User Clicks Email Link → /auth/reset-password?token=xxx
     ↓
Token Validated & Not Expired?
     ├─ YES → User Enters New Password, Update User, Delete Token
     └─ NO  → Show Error, Link to Request New Reset
     ↓
Redirect to Sign In with Success Message
```

## API Endpoints

### Email Verification

#### `GET /api/auth/verify-email?token=xxx`
- Verifies email address using token
- Updates `emailVerified` field
- Deletes used token
- Returns success/error status

#### `POST /api/auth/resend-verification`
```json
{
  "email": "user@example.com"
}
```
- Generates new verification token
- Sends new verification email
- Deletes any existing tokens for user

### Password Reset

#### `POST /api/auth/forgot-password`
```json
{
  "email": "user@example.com"
}
```
- Generates password reset token
- Sends reset email
- Always returns success (prevents email enumeration)

#### `POST /api/auth/reset-password`
```json
{
  "token": "xxx",
  "password": "newpassword123"
}
```
- Validates reset token
- Updates user password (hashed with bcrypt)
- Deletes used token
- Returns success/error status

### Signup (Updated)

#### `POST /api/auth/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- Creates user account
- Generates verification token
- Sends verification email
- Returns user data and success message

## Frontend Pages

### `/auth/verify-email`
- Automatic token verification on page load
- Loading, success, and error states
- Auto-redirect to sign in after 3 seconds
- Resend verification option on error

### `/auth/forgot-password`
- Email input form
- Loading states
- Success confirmation
- Link back to sign in

### `/auth/reset-password`
- Token validation on page load
- New password + confirmation fields
- Password strength validation (min 8 chars)
- Auto-redirect after successful reset

### `/auth/signin` (Updated)
- Added "Forgot password?" link
- Success messages for verification/reset
- URL parameter handling

### `/auth/signup` (Updated)
- Updated password requirement to 8 characters
- Shows success message after signup
- Email verification notice
- Auto-redirect to sign in after 5 seconds

## Email Templates

### Verification Email
- **Subject**: ✅ Verify your PrepCoach account
- **Content**:
  - Branded header with gradient
  - Clear call-to-action button
  - Alternative link for manual copy/paste
  - 24-hour expiration notice
  - Professional footer

### Password Reset Email
- **Subject**: 🔒 Reset your PrepCoach password
- **Content**:
  - Security-focused design
  - Reset password button
  - Alternative link
  - 1-hour expiration warning
  - Security notice about ignoring if not requested

## Database Schema

### VerificationToken Model
```prisma
model VerificationToken {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### PasswordResetToken Model
```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Security Considerations

### Token Security
- ✅ Tokens generated with `crypto.randomBytes(32)` (256-bit entropy)
- ✅ Stored as unique strings in database
- ✅ Single-use tokens (deleted after use)
- ✅ Time-limited expiration
- ✅ Cascade deletion if user is deleted

### Email Enumeration Protection
- ✅ Generic success messages for password reset
- ✅ Same response time regardless of user existence
- ✅ No disclosure of account existence

### Password Security
- ✅ Minimum 8 character requirement
- ✅ Bcrypt hashing with cost factor 12
- ✅ Password confirmation in reset flow
- ✅ Old password not required for reset (security trade-off for UX)

## Customization

### Change Email Templates

Edit `/lib/email.ts`:

```typescript
function getVerificationEmailTemplate(verificationUrl: string): string {
  // Customize HTML template
  return `<!DOCTYPE html>...`
}
```

### Adjust Token Expiration

```typescript
// Verification token (currently 24 hours)
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

// Password reset token (currently 1 hour)
const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
```

### Change From Email

Update `.env`:
```env
RESEND_FROM_EMAIL=support@yourdomain.com
```

### Custom Email Branding

Modify the email templates in `/lib/email.ts`:
- Update gradient colors
- Change logo/header
- Customize button styles
- Add company information

## Troubleshooting

### Emails Not Sending

1. **Check API Key**
   ```bash
   echo $RESEND_API_KEY
   ```

2. **Check Console Logs**
   - Look for "Failed to send verification email" or similar errors
   - Verify API key is valid and not expired

3. **Check Resend Dashboard**
   - Visit https://resend.com/emails
   - Check for failed sends
   - Verify domain status (if using custom domain)

4. **Test with Development Email**
   - Use `onboarding@resend.dev` for testing
   - No domain verification required

### Verification Link Not Working

1. **Check NEXTAUTH_URL**
   - Must match your actual domain
   - Include protocol (http:// or https://)
   - No trailing slash

2. **Check Token Expiration**
   - Verification tokens expire after 24 hours
   - Request a new verification email

3. **Check Database**
   - Use Prisma Studio to verify token exists
   ```bash
   npx prisma studio
   ```

### Password Reset Not Working

1. **Token Expired**
   - Reset tokens expire after 1 hour
   - Request a new reset link

2. **Password Too Short**
   - Minimum 8 characters required
   - Check client-side validation

3. **Token Already Used**
   - Tokens are single-use
   - Request new reset if needed

## Production Checklist

### Before Going Live

- [ ] **Domain Verification**
  - Verify domain in Resend dashboard
  - Configure SPF, DKIM, DMARC records
  - Test email deliverability

- [ ] **Environment Variables**
  - Update `NEXTAUTH_URL` to production domain
  - Update `RESEND_FROM_EMAIL` to your domain
  - Use production Resend API key

- [ ] **Email Templates**
  - Update company information
  - Test all email templates
  - Check mobile rendering

- [ ] **Security**
  - Enable HTTPS only
  - Set secure cookie flags in NextAuth
  - Review CORS settings
  - Enable rate limiting

- [ ] **Monitoring**
  - Set up email delivery monitoring
  - Track verification rates
  - Monitor failed email sends
  - Set up alerts for high failure rates

## Cost Optimization

### Resend Pricing
- **Free Tier**: 100 emails/day, 3,000/month
- **Paid Plans**: Start at $20/month for 50,000 emails
- **Cost per Email**: ~$0.0001 after free tier

### Best Practices
- Clean up expired tokens regularly (cron job)
- Implement rate limiting on email sends
- Cache verification status
- Batch email operations when possible

### Example Cron Job (Token Cleanup)
```typescript
// scripts/cleanup-tokens.ts
import prisma from '@/lib/prisma';

async function cleanupExpiredTokens() {
  const now = new Date();

  await prisma.verificationToken.deleteMany({
    where: { expiresAt: { lt: now } }
  });

  await prisma.passwordResetToken.deleteMany({
    where: { expiresAt: { lt: now } }
  });

  console.log('Expired tokens cleaned up');
}

cleanupExpiredTokens();
```

## Future Enhancements

Potential improvements:
- [ ] Email verification reminders
- [ ] Magic link authentication (passwordless)
- [ ] Two-factor authentication (2FA)
- [ ] Email change verification
- [ ] Account activity notifications
- [ ] Custom email templates per user role
- [ ] A/B testing email templates
- [ ] Analytics on email open/click rates

## Support

For issues or questions:
- Resend Documentation: https://resend.com/docs
- PrepCoach Issues: GitHub Repository
- Email Support: support@prepcoach.ai

## Credits

- Email Service: Resend (https://resend.com)
- Email Design: Responsive HTML Email Templates
- Security: OWASP Guidelines

---

**Last Updated**: October 2025
**Version**: 1.0.0
