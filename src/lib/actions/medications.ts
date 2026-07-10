'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { accesoAlTata } from '@/lib/access';
import { erroresDeZod, type FormState } from '@/lib/form-state';

const remedioSchema = z.object({
  name: z.string().trim().min(1, 'Escribe el nombre del remedio'),
  dose: z.string().trim().min(1, 'Escribe la dosis — la necesita quien reemplace tu turno'),
  sos: z.string().optional(),
  intervalHours: z.coerce.number().int().min(1).max(48).optional(),
  instructions: z.string().trim().optional(),
  pharmacy: z.string().trim().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  conditionId: z.string().optional(),
  favorite: z.string().optional(),
});

async function datosDeRemedio(elderId: string, formData: FormData, userName: string | null | undefined) {
  const parsed = remedioSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false as const, error: erroresDeZod(parsed.error) };
  const d = parsed.data;

  if (d.endDate && d.startDate && new Date(d.endDate) < new Date(d.startDate)) {
    return {
      ok: false as const,
      error: { errors: { endDate: 'El tratamiento no puede terminar antes de empezar' } },
    };
  }

  // El select de condición solo acepta condiciones del mismo tata
  let conditionId: string | null = null;
  if (d.conditionId) {
    const cond = await db.condition.findFirst({ where: { id: d.conditionId, elderId }, select: { id: true } });
    conditionId = cond?.id ?? null;
  }

  return {
    ok: true as const,
    data: {
      name: d.name,
      dose: d.dose,
      intervalHours: d.sos ? null : (d.intervalHours ?? null),
      instructions: d.instructions || null,
      pharmacy: d.pharmacy || null,
      startDate: d.startDate ? new Date(d.startDate) : null,
      endDate: d.endDate ? new Date(d.endDate) : null,
      favorite: Boolean(d.favorite),
      conditionId,
      registeredBy: userName ?? null,
    },
  };
}

export async function crearRemedio(elderId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { user } = await accesoAlTata(elderId, 'EDITOR');
  const result = await datosDeRemedio(elderId, formData, user.name);
  if (!result.ok) return result.error;

  await db.medication.create({ data: { elderId, ...result.data } });
  revalidatePath(`/app/${elderId}`);
  redirect(`/app/${elderId}/remedios`);
}

export async function editarRemedio(
  elderId: string,
  medId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { user } = await accesoAlTata(elderId, 'EDITOR');
  const result = await datosDeRemedio(elderId, formData, user.name);
  if (!result.ok) return result.error;

  await db.medication.update({ where: { id: medId, elderId }, data: result.data });
  revalidatePath(`/app/${elderId}`);
  redirect(`/app/${elderId}/remedios`);
}

export async function alternarFavorito(elderId: string, medId: string) {
  await accesoAlTata(elderId, 'EDITOR');
  const med = await db.medication.findFirst({ where: { id: medId, elderId }, select: { favorite: true } });
  if (!med) return;
  await db.medication.update({ where: { id: medId }, data: { favorite: !med.favorite } });
  revalidatePath(`/app/${elderId}/remedios`);
  revalidatePath(`/app/${elderId}`);
}

export async function eliminarRemedio(elderId: string, medId: string) {
  await accesoAlTata(elderId, 'EDITOR');
  await db.medication.delete({ where: { id: medId, elderId } });
  revalidatePath(`/app/${elderId}`);
  redirect(`/app/${elderId}/remedios`);
}
