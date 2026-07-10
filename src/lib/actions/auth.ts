'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { signIn, signOut } from '@/auth';
import { db } from '@/lib/db';
import { erroresDeZod, type FormState } from '@/lib/form-state';

const registroSchema = z.object({
  name: z.string().trim().min(1, 'Escribe tu nombre'),
  surname: z.string().trim().min(1, 'Escribe tu apellido'),
  email: z.string().trim().toLowerCase().email('Revisa el correo — le falta algo'),
  password: z.string().min(8, 'Mínimo 8 caracteres, para proteger los datos del tata'),
});

export async function registrar(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registroSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return erroresDeZod(parsed.error);

  const { name, surname, email, password } = parsed.data;

  const existe = await db.user.findUnique({ where: { email } });
  if (existe) {
    return { errors: { email: 'Ya hay una cuenta con este correo — prueba iniciar sesión' } };
  }

  const hash = await bcrypt.hash(password, 10);
  await db.user.create({ data: { name, surname, email, password: hash } });

  await signIn('credentials', { email, password, redirectTo: '/app' });
  return null;
}

export async function iniciarSesion(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await signIn('credentials', {
      email: String(formData.get('email') ?? '').toLowerCase(),
      password: String(formData.get('password') ?? ''),
      redirectTo: '/app',
    });
    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: 'Correo o contraseña incorrectos. Revísalos e intenta de nuevo.' };
    }
    throw error;
  }
}

export async function cerrarSesion() {
  await signOut({ redirectTo: '/' });
}
