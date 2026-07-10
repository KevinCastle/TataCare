import type { Metadata } from 'next';
import Link from 'next/link';
import { RegistroForm } from './registro-form';

export const metadata: Metadata = { title: 'Crear cuenta' };

export default function RegistroPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
      <p className="mt-1 text-niebla">En un minuto tienes la ficha de tu tata lista para compartir.</p>
      <RegistroForm />
      <p className="mt-6 text-center text-niebla">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-bold text-pino-oscuro underline underline-offset-4">
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
