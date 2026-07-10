'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { accesoAlTata } from '@/lib/access';
import { erroresDeZod, type FormState } from '@/lib/form-state';

const gustoSchema = z
  .object({
    detail: z.string().trim().min(1, 'Escribe qué es — por ejemplo "el bolero" o "la sopa fría"'),
    note: z.string().trim().optional(),
    pleasure: z.string().optional(),
    displeasure: z.string().optional(),
    avoid: z.string().optional(),
    activity: z.string().optional(),
  })
  .refine((d) => d.pleasure || d.displeasure || d.avoid || d.activity, {
    message: 'Marca al menos una categoría, para saber dónde mostrarlo',
    path: ['pleasure'],
  });

function datos(formData: FormData) {
  const parsed = gustoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false as const, error: erroresDeZod(parsed.error) };
  const d = parsed.data;
  return {
    ok: true as const,
    data: {
      detail: d.detail,
      note: d.note || null,
      pleasure: Boolean(d.pleasure),
      displeasure: Boolean(d.displeasure),
      avoid: Boolean(d.avoid),
      activity: Boolean(d.activity),
    },
  };
}

export async function crearGusto(elderId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await accesoAlTata(elderId, 'EDITOR');
  const result = datos(formData);
  if (!result.ok) return result.error;

  await db.taste.create({ data: { elderId, ...result.data } });
  revalidatePath(`/app/${elderId}/gustos`);
  redirect(`/app/${elderId}/gustos`);
}

export async function editarGusto(
  elderId: string,
  gustoId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await accesoAlTata(elderId, 'EDITOR');
  const result = datos(formData);
  if (!result.ok) return result.error;

  await db.taste.update({ where: { id: gustoId, elderId }, data: result.data });
  revalidatePath(`/app/${elderId}/gustos`);
  redirect(`/app/${elderId}/gustos`);
}

export async function eliminarGusto(elderId: string, gustoId: string) {
  await accesoAlTata(elderId, 'EDITOR');
  await db.taste.delete({ where: { id: gustoId, elderId } });
  revalidatePath(`/app/${elderId}/gustos`);
  redirect(`/app/${elderId}/gustos`);
}
