'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { accesoAlTata } from '@/lib/access';

const FECHA_VALIDA = /^\d{4}-\d{2}-\d{2}$/;

export async function tomarTurno(elderId: string, date: string) {
  const { user } = await accesoAlTata(elderId, 'EDITOR');
  if (!FECHA_VALIDA.test(date)) return;

  await db.shift.upsert({
    where: { elderId_date_userId: { elderId, date, userId: user.id } },
    create: { elderId, date, userId: user.id },
    update: {},
  });
  revalidatePath(`/app/${elderId}/turnos`);
  revalidatePath(`/app/${elderId}`);
}

export async function soltarTurno(elderId: string, date: string) {
  const { user } = await accesoAlTata(elderId, 'EDITOR');
  if (!FECHA_VALIDA.test(date)) return;

  await db.shift.deleteMany({ where: { elderId, date, userId: user.id } });
  revalidatePath(`/app/${elderId}/turnos`);
  revalidatePath(`/app/${elderId}`);
}
