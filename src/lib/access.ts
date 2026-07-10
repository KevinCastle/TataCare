import { notFound, redirect } from 'next/navigation';
import type { CaregiverRole } from '@prisma/client';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function usuarioActual() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  return session.user;
}

const jerarquia: Record<CaregiverRole, number> = { VIEWER: 0, EDITOR: 1, OWNER: 2 };

/**
 * Valida que el usuario actual sea cuidador del tata con el rol mínimo.
 * VIEWER lee, EDITOR escribe, OWNER administra el acceso.
 */
export async function accesoAlTata(elderId: string, minimo: CaregiverRole = 'VIEWER') {
  const user = await usuarioActual();
  const caregiver = await db.caregiver.findUnique({
    where: { elderId_userId: { elderId, userId: user.id } },
    include: { elder: true },
  });
  if (!caregiver) notFound();
  if (jerarquia[caregiver.role] < jerarquia[minimo]) redirect(`/app/${elderId}`);
  return { user, elder: caregiver.elder, role: caregiver.role };
}

export function puedeEditar(role: CaregiverRole) {
  return role === 'EDITOR' || role === 'OWNER';
}
