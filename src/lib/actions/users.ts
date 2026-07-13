'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { usuarioActual } from '@/lib/access';
import { procesarAvatar } from '@/lib/actions/elders';
import type { FormState } from '@/lib/form-state';

export async function actualizarMiAvatar(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await usuarioActual();

  const avatar = await procesarAvatar(formData);
  if (avatar.error) return avatar.error;
  if (!avatar.url) return { errors: { avatar: 'Elige una foto primero' } };

  await db.user.update({ where: { id: user.id }, data: { avatarUrl: avatar.url } });
  revalidatePath('/app');
  revalidatePath('/app/perfil');
  return { message: 'ok' };
}
