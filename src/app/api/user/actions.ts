'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

// eslint-disable-next-line consistent-return
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales incorrectas';
        default:
          return 'Algo salió mal';
      }
    }
    throw error;
  }
}
