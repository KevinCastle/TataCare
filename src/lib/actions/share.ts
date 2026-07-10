'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { accesoAlTata, usuarioActual } from '@/lib/access';
import type { FormState } from '@/lib/form-state';

/** Código corto legible: TATA-XXXX (sin 0/O ni 1/I para poder dictarlo por teléfono). */
function generarCodigo() {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(4);
  let sufijo = '';
  for (const b of bytes) sufijo += alfabeto[b % alfabeto.length];
  return `TATA-${sufijo}`;
}

export async function invitarCuidador(elderId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { user } = await accesoAlTata(elderId, 'OWNER');
  const role = formData.get('role') === 'VIEWER' ? 'VIEWER' : 'EDITOR';

  await db.invite.create({
    data: {
      code: generarCodigo(),
      elderId,
      kind: 'CAREGIVER',
      role,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      createdById: user.id,
    },
  });

  revalidatePath(`/app/${elderId}/compartir`);
  return { message: 'ok' };
}

export async function crearAccesoMedico(elderId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { user } = await accesoAlTata(elderId, 'EDITOR');
  const horas = Number(formData.get('horas'));
  const duracion = [24, 48, 168].includes(horas) ? horas : 24;

  await db.invite.create({
    data: {
      code: generarCodigo(),
      elderId,
      kind: 'DOCTOR',
      expiresAt: new Date(Date.now() + duracion * 60 * 60 * 1000),
      createdById: user.id,
    },
  });

  revalidatePath(`/app/${elderId}/compartir`);
  return { message: 'ok' };
}

export async function revocarInvite(elderId: string, inviteId: string) {
  await accesoAlTata(elderId, 'EDITOR');
  await db.invite.update({ where: { id: inviteId, elderId }, data: { revokedAt: new Date() } });
  revalidatePath(`/app/${elderId}/compartir`);
}

export async function quitarCuidador(elderId: string, userId: string) {
  const { user } = await accesoAlTata(elderId, 'OWNER');
  if (userId === user.id) return; // el dueño no se quita a sí mismo
  await db.caregiver.delete({ where: { elderId_userId: { elderId, userId } } });
  revalidatePath(`/app/${elderId}/compartir`);
}

/** El invitado (ya con cuenta y sesión) acepta el código y queda como cuidador. */
export async function aceptarInvitacion(code: string) {
  const user = await usuarioActual();

  const invite = await db.invite.findUnique({ where: { code } });
  if (
    !invite ||
    invite.kind !== 'CAREGIVER' ||
    invite.usedAt ||
    invite.revokedAt ||
    invite.expiresAt < new Date()
  ) {
    redirect('/app?invitacion=invalida');
  }

  const yaEsCuidador = await db.caregiver.findUnique({
    where: { elderId_userId: { elderId: invite.elderId, userId: user.id } },
  });

  if (!yaEsCuidador) {
    await db.$transaction([
      db.caregiver.create({
        data: { elderId: invite.elderId, userId: user.id, role: invite.role ?? 'EDITOR' },
      }),
      db.invite.update({ where: { id: invite.id }, data: { usedAt: new Date() } }),
    ]);
  }

  redirect(`/app/${invite.elderId}`);
}
