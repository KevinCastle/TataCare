'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { accesoAlTata } from '@/lib/access';
import { erroresDeZod, type FormState } from '@/lib/form-state';

const condicionSchema = z.object({
  type: z.enum(['ALLERGY', 'DISEASE'], { message: 'Elige si es alergia o diagnóstico' }),
  name: z.string().trim().min(1, 'Escribe el nombre — es lo que se verá en una urgencia'),
  detail: z.string().trim().optional(),
});

export async function crearCondicion(elderId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { user } = await accesoAlTata(elderId, 'EDITOR');
  const parsed = condicionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return erroresDeZod(parsed.error);

  await db.condition.create({
    data: {
      elderId,
      type: parsed.data.type,
      name: parsed.data.name,
      detail: parsed.data.detail || null,
      registeredBy: user.name ?? null,
    },
  });
  revalidatePath(`/app/${elderId}`);
  redirect(`/app/${elderId}/salud`);
}

export async function editarCondicion(
  elderId: string,
  condicionId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await accesoAlTata(elderId, 'EDITOR');
  const parsed = condicionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return erroresDeZod(parsed.error);

  await db.condition.update({
    where: { id: condicionId, elderId },
    data: {
      type: parsed.data.type,
      name: parsed.data.name,
      detail: parsed.data.detail || null,
    },
  });
  revalidatePath(`/app/${elderId}`);
  redirect(`/app/${elderId}/salud`);
}

export async function eliminarCondicion(elderId: string, condicionId: string) {
  await accesoAlTata(elderId, 'EDITOR');
  await db.condition.delete({ where: { id: condicionId, elderId } });
  revalidatePath(`/app/${elderId}`);
  redirect(`/app/${elderId}/salud`);
}
