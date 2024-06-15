'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

// eslint-disable-next-line consistent-return
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log(formData);
    await signIn('credentials', formData);
  } catch (error) {
    console.log('error', error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
