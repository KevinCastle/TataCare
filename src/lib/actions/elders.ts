'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { accesoAlTata, usuarioActual } from '@/lib/access';
import { erroresDeZod, type FormState } from '@/lib/form-state';

const tataSchema = z.object({
  name: z.string().trim().min(1, 'Escribe su nombre'),
  surname: z.string().trim().min(1, 'Escribe su apellido'),
  sex: z.enum(['femenino', 'masculino'], { message: 'Elige una opción' }),
  birthdate: z
    .string()
    .min(1, 'La fecha de nacimiento calcula su edad automáticamente')
    .refine((v) => !Number.isNaN(Date.parse(v)) && new Date(v) < new Date(), {
      message: 'Revisa la fecha — debe ser en el pasado',
    }),
  bloodType: z.string().optional(),
  insurance: z.string().optional(),
  nationality: z.string().trim().optional(),
  identificationNumber: z.string().trim().optional(),
  weightKg: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine((v) => v === undefined || (Number.isInteger(v) && v > 0 && v < 400), {
      message: 'Escribe el peso en kilos, por ejemplo 68',
    }),
});

function datosDeTata(formData: FormData) {
  const parsed = tataSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false as const, error: erroresDeZod(parsed.error) };
  const d = parsed.data;
  return {
    ok: true as const,
    data: {
      name: d.name,
      surname: d.surname,
      sex: d.sex,
      birthdate: new Date(d.birthdate),
      bloodType: d.bloodType || null,
      insurance: d.insurance || null,
      nationality: d.nationality || null,
      identificationNumber: d.identificationNumber || null,
      weightKg: d.weightKg ?? null,
    },
  };
}

export async function crearTata(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await usuarioActual();
  const result = datosDeTata(formData);
  if (!result.ok) return result.error;

  const elder = await db.elder.create({
    data: {
      ...result.data,
      caregivers: { create: { userId: user.id, role: 'OWNER' } },
    },
  });

  revalidatePath('/app');
  redirect(`/app/${elder.id}`);
}

export async function editarTata(elderId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await accesoAlTata(elderId, 'EDITOR');
  const result = datosDeTata(formData);
  if (!result.ok) return result.error;

  await db.elder.update({ where: { id: elderId }, data: result.data });

  revalidatePath(`/app/${elderId}`);
  redirect(`/app/${elderId}`);
}

export async function eliminarTata(elderId: string) {
  await accesoAlTata(elderId, 'OWNER');
  await db.elder.delete({ where: { id: elderId } });
  revalidatePath('/app');
  redirect('/app');
}
