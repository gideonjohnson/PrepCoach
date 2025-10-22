# OAuth Testing Guide - Quick Start

## ✅ Configuration Complete!

Your OAuth is configured and the server is running at:
**http://localhost:3000**

---

## Test OAuth Now (5 minutes)

### Test 1: Google OAuth Signup

1. Open: http://localhost:3000/auth/signup
2. You should see:
   - ✅ Regular signup form (name, email, password)
   - ✅ "Or continue with" divider
   - ✅ **"Sign up with Google"** button (white with Google logo)
   - ✅ **"Sign up with GitHub"** button (dark with GitHub logo)
3. Click **"Sign up with Google"**
4. You'll be redirected to Google
5. Sign in with your Google account
6. Authorize PrepCoach
7. You should be redirected back to: http://localhost:3000/auth/welcome
8. ✅ **Success!** You're logged in via Google

---

### Test 2: GitHub OAuth Signup

1. Open a new incognito/private window
2. Go to: http://localhost:3000/auth/signup
3. Click **"Sign up with GitHub"**
4. Sign in with your GitHub account
5. Authorize PrepCoach
6. You should be redirected back to: http://localhost:3000/auth/welcome
7. ✅ **Success!** You're logged in via GitHub

---

### Test 3: Google OAuth Sign In (Returning User)

1. Sign out if logged in
2. Go to: http://localhost:3000/auth/signin
3. Click **"Sign in with Google"**
4. Select your Google account (should not ask for authorization again)
5. You should be redirected to: http://localhost:3000/dashboard
6. ✅ **Success!** Existing user signed in

---

### Test 4: Account Linking

**Test if email signup + OAuth with same email links properly:**

1. Create account via email:
   - Go to: http://localhost:3000/auth/signup
   - Use email: `test@example.com`
   - Complete signup
2. Sign out
3. Try signing in with Google using `test@example.com`:
   - Should link the OAuth account to existing user
   - Should sign in successfully
4. ✅ **Success!** Account linking works

---

## What to Check

### ✅ Visual Check
- [ ] Social login buttons appear on signup page
- [ ] Social login buttons appear on signin page
- [ ] Buttons have proper styling (Google = white/blue, GitHub = dark)
- [ ] Buttons show correct icons/logos
- [ ] "Or continue with" divider is visible

### ✅ Functionality Check
- [ ] Google OAuth redirects to Google
- [ ] GitHub OAuth redirects to GitHub
- [ ] After authorization, redirects back to your app
- [ ] User is created in database with proper defaults
- [ ] User is signed in (session works)
- [ ] Redirect to `/auth/welcome` for new signups
- [ ] Redirect to `/dashboard` for returning sign-ins

### ✅ Database Check
- [ ] New user created with `subscriptionTier: 'free'`
- [ ] User has `emailVerified` timestamp
- [ ] User has `password: null` (OAuth users)
- [ ] Account record created with OAuth provider info
- [ ] Profile image saved from OAuth provider

### ✅ Account Linking Check
- [ ] Email signup then OAuth with same email = links accounts
- [ ] Can sign in with either method after linking
- [ ] No duplicate users created

---

## Check Server Logs

While testing, watch the server console for these messages:

```
[AUTH] OAuth user has no email  ← ❌ Error (shouldn't happen)
[AUTH] Created new OAuth user: clxxxxx  ← ✅ New user created
[AUTH] Linked OAuth account: google  ← ✅ OAuth linked
[AUTH] User created concurrently, using existing: clxxxxx  ← ✅ Race condition handled
```

---

## Troubleshooting

### "Configuration error"
**Cause**: OAuth credentials missing or invalid
**Fix**:
- Check `.env` has Google/GitHub credentials
- Restart server after adding credentials
- Verify credentials are correct (no extra spaces)

### "Redirect URI mismatch"
**Cause**: OAuth app redirect URI doesn't match
**Fix**:
- Google: Must be exactly `http://localhost:3000/api/auth/callback/google`
- GitHub: Must be exactly `http://localhost:3000/api/auth/callback/github`
- No trailing slashes!
- Check in Google Cloud Console / GitHub Settings

### Button doesn't do anything
**Cause**: JavaScript error or OAuth provider not configured
**Fix**:
- Open browser DevTools console (F12)
- Check for errors
- Verify `GOOGLE_CLIENT_ID` and `GITHUB_CLIENT_ID` are set in `.env`

### User created but not signed in
**Cause**: Session configuration issue
**Fix**:
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies
- Restart server
- Try in incognito mode

### OAuth popup blocked
**Cause**: Browser popup blocker
**Fix**:
- Allow popups for localhost:3000
- Or OAuth opens in same tab (also works)

---

## Expected Behavior

### New OAuth User Flow:
1. Click social login button
2. Redirect to OAuth provider (Google/GitHub)
3. Sign in / authorize
4. Redirect back to app
5. User created in database:
   - ✅ Email from OAuth
   - ✅ Name from OAuth
   - ✅ Profile image from OAuth
   - ✅ `subscriptionTier: 'free'`
   - ✅ `emailVerified: [timestamp]`
   - ✅ `password: null`
6. Account linked in `Account` table
7. Session created (JWT token)
8. Redirect to `/auth/welcome`

### Returning OAuth User Flow:
1. Click social login button
2. Redirect to OAuth provider
3. Auto-approve (or quick authorization)
4. Redirect back to app
5. User found in database
6. Session created
7. Redirect to `/dashboard`

---

## Success Criteria

✅ **OAuth is working if:**
1. Buttons appear on signup/signin pages
2. Clicking buttons redirects to Google/GitHub
3. After authorization, redirects back to app
4. User is signed in (can access dashboard)
5. User data saved in database
6. Can sign out and sign in again
7. Account linking works (same email)

---

## Next: Test These Scenarios

### Edge Cases to Test:
1. **No email from OAuth** (rare, but possible)
   - Should reject with error
2. **Same email, different providers**
   - Email signup → Google OAuth with same email
   - Should link to same account
3. **Concurrent logins**
   - Open 2 browser tabs
   - Sign in with OAuth simultaneously
   - Should not crash (race condition handled)
4. **Sign out and back in**
   - Test session persistence
   - Should remember user
5. **Invalid OAuth credentials**
   - Should fail gracefully with error message

---

## Database Inspection (Optional)

If you want to verify data in database:

```bash
# Open Prisma Studio to view database
npx prisma studio
```

Then check:
- **User table**: New users with `subscriptionTier: 'free'`
- **Account table**: OAuth provider accounts linked
- Email addresses are lowercase
- Profile images are saved

---

## After Testing

Once everything works:

### ✅ Development Complete
- [ ] Google OAuth works
- [ ] GitHub OAuth works
- [ ] Account linking works
- [ ] No errors in console
- [ ] Database records look correct

### 🚀 Ready for Production
When ready to deploy:
1. Update OAuth redirect URIs to production domain
2. Update `NEXTAUTH_URL` in production env vars
3. Use production OAuth credentials (optional)
4. Deploy and test on production domain

---

## Support

- Full setup: `docs/OAUTH_SETUP.md`
- Bug fixes: `BUG_FIXES_REPORT.md`
- Deployment: `DEPLOYMENT_READY.md`

---

**Happy Testing! 🎉**

Your OAuth social login is ready to use!
