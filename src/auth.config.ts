import type { NextAuthConfig } from 'next-auth';

/**
 * Config segura para middleware (sin Node APIs).
 * La lógica de credenciales vive en src/auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const enApp = nextUrl.pathname.startsWith('/app');
      const enLogin = nextUrl.pathname === '/login' || nextUrl.pathname === '/registro';

      if (enApp) return isLoggedIn;
      if (enLogin && isLoggedIn) return Response.redirect(new URL('/app', nextUrl));
      return true;
    },
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
