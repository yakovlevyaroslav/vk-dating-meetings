import type { NextAuthConfig } from 'next-auth';

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
      }
      return token;
    },
    session({ session, token }) {
      if (typeof token.id === 'string') {
        session.user.id = token.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
