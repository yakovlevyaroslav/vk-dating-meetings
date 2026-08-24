import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { prisma } from '@/core/db/prisma';

import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {
        },
        password: {
        },
      },
      authorize: async (credentials) => {
        const email = credentials.email;
        const password = credentials.password;

        if (typeof email !== 'string' || typeof password !== 'string') {
          return null;
        }

        const user = await prisma.adminUser.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
