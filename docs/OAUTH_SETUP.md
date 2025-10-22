# OAuth Social Login Setup Guide

This guide will help you set up Google and GitHub OAuth authentication for PrepCoach.

## Overview

Social login allows users to sign up and sign in using their existing Google or GitHub accounts, making registration faster and reducing password fatigue.

## Benefits

- Faster signup (one-click authentication)
- No password to remember
- Reduced friction for new users
- Increased conversion rates
- Secure authentication via trusted providers

## Setup Instructions

### 1. Google OAuth Setup

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (required for OAuth)

#### Step 2: Create OAuth Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Configure the consent screen if prompted:
   - User Type: External
   - App name: PrepCoach (or your app name)
   - User support email: Your email
   - Developer contact: Your email
4. Application type: **Web application**
5. Name: PrepCoach Web Client
6. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Click **Create**
8. Copy your **Client ID** and **Client Secret**

#### Step 3: Add Credentials to .env

```bash
GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

### 2. GitHub OAuth Setup

#### Step 1: Create OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the details:
   - **Application name**: PrepCoach
   - **Homepage URL**:
     - Development: `http://localhost:3000`
     - Production: `https://yourdomain.com`
   - **Authorization callback URL**:
     - Development: `http://localhost:3000/api/auth/callback/github`
     - Production: `https://yourdomain.com/api/auth/callback/github`
4. Click **Register application**

#### Step 2: Generate Client Secret

1. On your OAuth app page, click **Generate a new client secret**
2. Copy your **Client ID** and **Client Secret** immediately (secret only shows once!)

#### Step 3: Add Credentials to .env

```bash
GITHUB_CLIENT_ID=your_actual_client_id_here
GITHUB_CLIENT_SECRET=your_actual_client_secret_here
```

### 3. Configure NextAuth (Already Done!)

The NextAuth configuration has already been updated to support Google and GitHub OAuth. The following providers are configured in `app/api/auth/[...nextauth]/route.ts`:

- Google OAuth Provider
- GitHub OAuth Provider
- Credentials Provider (email/password)

### 4. Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the sign-in page: `http://localhost:3000/auth/signin`

3. You should see:
   - Email/password login form
   - "Or continue with" divider
   - "Sign in with Google" button
   - "Sign in with GitHub" button

4. Click a social login button and verify:
   - You're redirected to Google/GitHub
   - After authorization, you're redirected back to your app
   - You're signed in and redirected to the dashboard

## Production Deployment

### Important Notes

1. **Update Redirect URIs**: After deploying to production, add your production domain to the authorized redirect URIs in both Google Cloud Console and GitHub OAuth settings.

2. **Use Environment Variables**: Never commit OAuth credentials to your repository. Always use environment variables.

3. **HTTPS Required**: OAuth providers require HTTPS in production. Make sure your production deployment uses HTTPS.

### Production Checklist

- [ ] Add production redirect URI to Google OAuth: `https://yourdomain.com/api/auth/callback/google`
- [ ] Add production redirect URI to GitHub OAuth: `https://yourdomain.com/api/auth/callback/github`
- [ ] Update `NEXTAUTH_URL` to your production domain
- [ ] Verify `NEXTAUTH_SECRET` is set (generate with `openssl rand -base64 32`)
- [ ] Test social login on production domain
- [ ] Verify email addresses are being stored correctly
- [ ] Test account linking (existing email + OAuth)

## How It Works

### New User Flow

1. User clicks "Sign in with Google" or "Sign in with GitHub"
2. User is redirected to OAuth provider
3. User authorizes the application
4. OAuth provider redirects back with authorization code
5. NextAuth exchanges code for user profile data
6. New user is created in database with:
   - Email from OAuth provider
   - Name from OAuth provider
   - Profile image URL
   - Default subscription settings (free tier)
7. Account record is created linking OAuth provider to user
8. User is signed in and redirected to `/auth/welcome` (from signup) or `/dashboard` (from signin)

### Existing User Flow

1. If a user with the same email already exists:
   - The OAuth account is linked to the existing user
   - User can now sign in with either email/password OR OAuth
2. User is signed in and redirected to dashboard

### Session Management

- Sessions use JWT tokens (stored in cookies)
- JWT contains user ID for database lookups
- Tokens are encrypted using `NEXTAUTH_SECRET`
- Session expires based on NextAuth configuration

## Security Features

1. **CSRF Protection**: NextAuth includes built-in CSRF protection
2. **State Parameter**: OAuth flow uses state parameter to prevent CSRF
3. **Secure Cookies**: Cookies are httpOnly and secure (in production)
4. **JWT Encryption**: Session tokens are encrypted
5. **Account Linking**: Prevents duplicate accounts with same email

## Troubleshooting

### "Configuration error" when clicking social login

**Cause**: OAuth credentials are missing or invalid

**Solution**:
1. Check that `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc. are set in `.env`
2. Verify credentials are correct (no extra spaces, complete strings)
3. Restart dev server after adding credentials

### Redirect URI mismatch error

**Cause**: The redirect URI in your OAuth app doesn't match the actual callback URL

**Solution**:
1. Check the exact error message from Google/GitHub
2. Verify redirect URI in OAuth app settings matches exactly:
   - `http://localhost:3000/api/auth/callback/google` (for Google)
   - `http://localhost:3000/api/auth/callback/github` (for GitHub)
3. Ensure no trailing slashes
4. Make sure to use `http://` for localhost, not `https://`

### User is created but not signed in

**Cause**: Session configuration or callback issue

**Solution**:
1. Check browser console for errors
2. Verify `NEXTAUTH_SECRET` is set
3. Verify `NEXTAUTH_URL` matches your actual domain
4. Clear cookies and try again

### Email not returned from OAuth provider

**Cause**: OAuth scope doesn't include email, or user denied email access

**Solution**:
1. Google: Ensure Google+ API is enabled
2. GitHub: In OAuth app settings, request email scope
3. Ask user to re-authorize and grant email permission

## Database Schema

The Prisma schema already includes the necessary tables:

### Account Table
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String  // "google" or "github"
  providerAccountId String  // OAuth provider's user ID
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

## Support

If you encounter issues:

1. Check the [NextAuth.js documentation](https://next-auth.js.org/providers/google)
2. Review Google/GitHub OAuth documentation
3. Check browser console and server logs for detailed errors
4. Verify all environment variables are set correctly

## Next Steps

After setting up OAuth:

1. Test with multiple users
2. Test account linking (sign up with email, then connect OAuth)
3. Add more OAuth providers if needed (Facebook, Twitter, etc.)
4. Customize the OAuth consent screen with your branding
5. Monitor OAuth usage in Google Cloud Console and GitHub settings

## Additional Resources

- [NextAuth.js Google Provider Docs](https://next-auth.js.org/providers/google)
- [NextAuth.js GitHub Provider Docs](https://next-auth.js.org/providers/github)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Apps Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
