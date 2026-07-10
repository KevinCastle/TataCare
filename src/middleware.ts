import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Protege todo excepto estáticos y API de auth
  matcher: ['/((?!api|_next/static|_next/image|icons|.*\\.png$|.*\\.svg$).*)'],
};
