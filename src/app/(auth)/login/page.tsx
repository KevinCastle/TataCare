import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Iniciar sesión' };

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Hola de nuevo</h1>
      <p className="mt-1 text-niebla">Entra para ver cómo están tus tatas.</p>
      <LoginForm />
      <p className="mt-6 text-center text-niebla">
        ¿Primera vez aquí?{' '}
        <Link href="/registro" className="font-bold text-pino-oscuro underline underline-offset-4">
          Crea tu cuenta
        </Link>
      </p>
    </>
  );
}
