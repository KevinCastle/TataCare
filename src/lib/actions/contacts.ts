'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { accesoAlTata } from '@/lib/access';
import { erroresDeZod, type FormState } from '@/lib/form-state';

const contactoSchema = z.object({
  name: z.string().trim().min(1, 'Escribe el nombre'),
  role: z.string().trim().min(1, 'Di quién es: hija, doctor de cabecera, clínica…'),
  phone: z.string().trim().min(8, 'Escribe el teléfono completo, por ejemplo +56 9 1234 5678'),
  address: z.string().trim().optional(),
});

export async function crearContacto(elderId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await accesoAlTata(elderId, 'EDITOR');
  const parsed = contactoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return erroresDeZod(parsed.error);

  const contacto = await db.contact.create({
    data: { elderId, ...parsed.data, address: parsed.data.address || null },
  });

  // El primer contacto queda como prioritario automáticamente
  const elder = await db.elder.findUnique({ where: { id: elderId }, select: { favoriteContactId: true } });
  if (!elder?.favoriteContactId) {
    await db.elder.update({ where: { id: elderId }, data: { favoriteContactId: contacto.id } });
  }

  revalidatePath(`/app/${elderId}`);
  redirect(`/app/${elderId}/contactos`);
}

export async function editarContacto(
  elderId: string,
  contactoId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await accesoAlTata(elderId, 'EDITOR');
  const parsed = contactoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return erroresDeZod(parsed.error);

  await db.contact.update({
    where: { id: contactoId, elderId },
    data: { ...parsed.data, address: parsed.data.address || null },
  });
  revalidatePath(`/app/${elderId}`);
  redirect(`/app/${elderId}/contactos`);
}

export async function marcarPrioritario(elderId: string, contactoId: string) {
  await accesoAlTata(elderId, 'EDITOR');
  const contacto = await db.contact.findFirst({ where: { id: contactoId, elderId }, select: { id: true } });
  if (!contacto) return;
  await db.elder.update({ where: { id: elderId }, data: { favoriteContactId: contactoId } });
  revalidatePath(`/app/${elderId}`);
  revalidatePath(`/app/${elderId}/contactos`);
}

export async function eliminarContacto(elderId: string, contactoId: string) {
  await accesoAlTata(elderId, 'EDITOR');
  await db.contact.delete({ where: { id: contactoId, elderId } });
  const elder = await db.elder.findUnique({ where: { id: elderId }, select: { favoriteContactId: true } });
  if (elder?.favoriteContactId === contactoId) {
    await db.elder.update({ where: { id: elderId }, data: { favoriteContactId: null } });
  }
  revalidatePath(`/app/${elderId}`);
  redirect(`/app/${elderId}/contactos`);
}
