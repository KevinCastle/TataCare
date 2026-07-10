'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { accesoAlTata } from '@/lib/access';
import { erroresDeZod, type FormState } from '@/lib/form-state';

const registroSchema = z.object({
  dayRating: z.coerce.number({ message: 'Marca cómo estuvo el día' }).int().min(1, 'Marca cómo estuvo el día').max(5),
  emotionRating: z.coerce.number({ message: 'Marca su ánimo' }).int().min(1, 'Marca su ánimo').max(5),
  digestionRating: z.coerce
    .number({ message: 'Marca cómo estuvo su digestión' })
    .int()
    .min(1, 'Marca cómo estuvo su digestión')
    .max(5),
  physicalActivity: z.string().optional(),
  note: z.string().trim().optional(),
});

export async function crearRegistro(elderId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { user } = await accesoAlTata(elderId, 'EDITOR');
  const parsed = registroSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return erroresDeZod(parsed.error);

  await db.dailyLog.create({
    data: {
      elderId,
      authorId: user.id,
      dayRating: parsed.data.dayRating,
      emotionRating: parsed.data.emotionRating,
      digestionRating: parsed.data.digestionRating,
      physicalActivity: Boolean(parsed.data.physicalActivity),
      note: parsed.data.note || null,
    },
  });

  revalidatePath(`/app/${elderId}/bitacora`);
  revalidatePath(`/app/${elderId}`);
  return { message: 'ok' };
}
