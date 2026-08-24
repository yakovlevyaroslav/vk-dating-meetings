import type { NextAuthConfig } from 'next-auth';

import type { AdminRole } from '@/generated/prisma/enums';

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = request.nextUrl.pathname === '/admin/login';

      if (isLoginPage) {
        return true;
      }

      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (typeof token.id === 'string') {
        session.user.id = token.id;
      }
      session.user.role = (token.role as AdminRole | undefined) ?? 'ADMIN';
      return session;
    },
  },
} satisfies NextAuthConfig;
