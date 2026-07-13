'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { erroresDeZod, type FormState } from '@/lib/form-state';

const notaSchema = z.object({
  doctorName: z.string().trim().min(1, 'Escriba su nombre — la familia sabrá quién revisó la ficha'),
  note: z.string().trim().min(1, 'Escriba la indicación u observación'),
});

/**
 * Nota clínica desde /dr — SIN sesión: la autorización es el código
 * temporal vigente. Es la única escritura pública de la app.
 */
export async function dejarNotaMedica(code: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const invite = await db.invite.findUnique({ where: { code } });
  const vigente = invite && invite.kind === 'DOCTOR' && !invite.revokedAt && invite.expiresAt > new Date();
  if (!vigente) {
    return { message: 'El código expiró mientras escribía. Pídale uno nuevo a la familia.' };
  }

  const parsed = notaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return erroresDeZod(parsed.error);

  await db.doctorNote.create({
    data: {
      elderId: invite.elderId,
      doctorName: parsed.data.doctorName,
      note: parsed.data.note,
    },
  });

  revalidatePath(`/dr/${code}`);
  revalidatePath(`/app/${invite.elderId}/bitacora`);
  return { message: 'ok' };
}
