'use server';

import { AuthError } from 'next-auth';

import { signIn } from '@/core/auth/auth';

export async function authenticate(_prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/admin',
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Неверный логин или пароль';
    }
    throw error;
  }
}
