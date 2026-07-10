'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { accesoAlTata } from '@/lib/access';
import { guardarArchivo } from '@/lib/storage';
import { erroresDeZod, type FormState } from '@/lib/form-state';

const TIPOS = ['examen', 'receta', 'epicrisis', 'otro'] as const;
const MAX_MB = 10;

const documentoSchema = z.object({
  title: z.string().trim().min(1, 'Ponle un nombre reconocible, como "Examen de sangre marzo"'),
  type: z.enum(TIPOS, { message: 'Elige qué tipo de documento es' }),
  date: z.string().optional(),
});

export async function subirDocumento(elderId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { user } = await accesoAlTata(elderId, 'EDITOR');

  const parsed = documentoSchema.safeParse({
    title: formData.get('title'),
    type: formData.get('type'),
    date: formData.get('date'),
  });
  if (!parsed.success) return erroresDeZod(parsed.error);

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { errors: { file: 'Elige el archivo — foto o PDF' } };
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    return { errors: { file: `El archivo pesa más de ${MAX_MB} MB — prueba con una foto más liviana` } };
  }
  if (!/^(image\/|application\/pdf)/.test(file.type)) {
    return { errors: { file: 'Solo fotos o PDF por ahora' } };
  }

  const fileUrl = await guardarArchivo(file, `documentos/${elderId}`);

  await db.document.create({
    data: {
      elderId,
      uploaderId: user.id,
      title: parsed.data.title,
      type: parsed.data.type,
      fileUrl,
      mimeType: file.type,
      date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
    },
  });

  revalidatePath(`/app/${elderId}/carpeta`);
  redirect(`/app/${elderId}/carpeta`);
}

export async function eliminarDocumento(elderId: string, documentoId: string) {
  await accesoAlTata(elderId, 'EDITOR');
  await db.document.delete({ where: { id: documentoId, elderId } });
  revalidatePath(`/app/${elderId}/carpeta`);
  redirect(`/app/${elderId}/carpeta`);
}
