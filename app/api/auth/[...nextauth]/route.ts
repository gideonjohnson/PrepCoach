import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('[AUTH] Missing credentials');
          return null;
        }

        try {
          // Normalize email to lowercase and trim whitespace
          const email = credentials.email.toLowerCase().trim();
          const password = credentials.password.trim();

          console.log('[AUTH] Attempting login for:', email);

          const user = await prisma.user.findUnique({
            where: {
              email: email
            }
          });

          if (!user) {
            console.log('[AUTH] User not found:', email);
            return null;
          }

          if (!user.password) {
            console.log('[AUTH] User has no password:', email);
            return null;
          }

          const isCorrectPassword = await bcrypt.compare(
            password,
            user.password
          );

          if (!isCorrectPassword) {
            console.log('[AUTH] Password mismatch for:', email);
            return null;
          }

          console.log('[AUTH] Login successful for:', email);
          return {
            id: user.id,
            email: user.email!,
            name: user.name,
          };
        } catch (error) {
          console.error('[AUTH] Error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Handle OAuth sign-ins (Google/GitHub)
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          if (!user.email) {
            console.error('[AUTH] OAuth user has no email');
            return false;
          }

          // Normalize email to lowercase to prevent duplicates
          const normalizedEmail = user.email.toLowerCase().trim();

          // Check if user already exists
          let existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
          });

          if (!existingUser) {
            // Create new user with proper defaults
            // Use try-catch to handle potential race condition
            try {
              existingUser = await prisma.user.create({
                data: {
                  email: normalizedEmail,
                  name: user.name || null,
                  image: user.image || null,
                  emailVerified: new Date(), // OAuth users are auto-verified
                  password: null, // OAuth users don't have passwords
                  subscriptionTier: 'free',
                  subscriptionStatus: 'inactive',
                  interviewsThisMonth: 0,
                  feedbackThisMonth: 0,
                  lastResetDate: new Date(),
                }
              });
              console.log('[AUTH] Created new OAuth user:', existingUser.id);
            } catch (createError: any) {
              // Handle race condition: user was created by another request
              if (createError.code === 'P2002') {
                existingUser = await prisma.user.findUnique({
                  where: { email: normalizedEmail }
                });
                if (!existingUser) {
                  throw createError; // Re-throw if still not found
                }
                console.log('[AUTH] User created concurrently, using existing:', existingUser.id);
              } else {
                throw createError; // Re-throw other errors
              }
            }
          }

          // Update existing user's profile image if they don't have one and OAuth provides one
          if (existingUser && !existingUser.image && user.image) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { image: user.image }
            });
          }

          // Check if this OAuth account is already linked
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId
              }
            }
          });

          if (!existingAccount) {
            // Link OAuth account to user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              }
            });
            console.log('[AUTH] Linked OAuth account:', account.provider);
          }

          // Update user object with database ID for JWT token
          user.id = existingUser.id;

          return true;
        } catch (error) {
          console.error('[AUTH] OAuth sign in error:', error);
          return false;
        }
      }

      // Allow credentials provider through
      return true;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
