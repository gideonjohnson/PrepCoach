import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
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
          // Trim whitespace from email and password
          const email = credentials.email.trim();
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
    async jwt({ token, user }) {
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
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
