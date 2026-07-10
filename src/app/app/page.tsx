import type { Metadata } from 'next';
import Link from 'next/link';
import { usuarioActual } from '@/lib/access';
import { db } from '@/lib/db';
import { cerrarSesion } from '@/lib/actions/auth';
import { diasRestantes, edad, fechaISO, iniciales, saludo } from '@/lib/utils';
import { Avatar, ButtonLink, CardLink, Chip, EmptyState, SectionLabel } from '@/components/ui';
import { IconChevron, IconPlus, IconUsers, LogoMark } from '@/components/icons';

export const metadata: Metadata = { title: 'Mis tatas' };

export default async function MisTatasPage() {
  const user = await usuarioActual();
  const hoy = fechaISO();

  const cuidados = await db.caregiver.findMany({
    where: { userId: user.id },
    include: {
      elder: {
        include: {
          conditions: { where: { type: 'ALLERGY' }, select: { id: true } },
          medications: { select: { endDate: true } },
          logs: {
            orderBy: { date: 'desc' },
            take: 1,
            include: { author: { select: { name: true } } },
          },
          shifts: { where: { date: hoy }, include: { user: { select: { name: true } } } },
        },
      },
    },
    orderBy: { elder: { name: 'asc' } },
  });

  const nombrePila = user.name?.split(' ')[0] ?? '';

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4">
      <header className="pt-safe flex items-center gap-3 py-5">
        <span className="flex size-11 items-center justify-center rounded-xl bg-pino text-papel">
          <LogoMark size={26} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.9rem] text-niebla">{saludo()},</p>
          <h1 className="truncate text-xl font-bold leading-tight">{nombrePila}</h1>
        </div>
        <form action={cerrarSesion}>
          <button
            type="submit"
            className="flex min-h-12 items-center rounded-xl px-3 text-[0.9rem] font-bold text-niebla hover:bg-pino/10 hover:text-tinta"
          >
            Salir
          </button>
        </form>
      </header>

      <main id="contenido" className="flex flex-1 flex-col gap-3 pb-10">
        <SectionLabel>Mis tatas</SectionLabel>

        {cuidados.length === 0 ? (
          <EmptyState icon={<IconUsers size={34} />} title="Aún no tienes tatas registrados">
            Crea la ficha de tu adulto mayor y tendrás sus datos importantes siempre a mano.
          </EmptyState>
        ) : (
          cuidados.map(({ elder }) => {
            const porVencer = elder.medications.filter(
              (m) => m.endDate && diasRestantes(m.endDate) >= 0 && diasRestantes(m.endDate) <= 7,
            ).length;
            const remediosActivos = elder.medications.length;
            const ultimoLog = elder.logs[0];
            const turnoHoy = elder.shifts[0];

            return (
              <CardLink key={elder.id} href={`/app/${elder.id}`}>
                <div className="flex items-center gap-3">
                  <Avatar initials={iniciales(elder.name, elder.surname)} imageUrl={elder.avatarUrl} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      {elder.name} {elder.surname}
                    </p>
                    <p className="text-[0.9rem] text-niebla">
                      {edad(elder.birthdate)} años{elder.bloodType ? ` · ${elder.bloodType}` : ''}
                    </p>
                  </div>
                  <IconChevron size={18} className="rotate-180 text-niebla" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {elder.conditions.length > 0 ? (
                    <Chip tone="alerta">
                      ⚠ {elder.conditions.length} {elder.conditions.length === 1 ? 'alergia' : 'alergias'}
                    </Chip>
                  ) : null}
                  {remediosActivos > 0 ? <Chip>{remediosActivos} remedios</Chip> : null}
                  {porVencer > 0 ? (
                    <Chip tone="aviso">
                      ⏳ {porVencer} por vencer
                    </Chip>
                  ) : null}
                  {turnoHoy ? <Chip tone="bien">Hoy cuida {turnoHoy.user.name}</Chip> : null}
                </div>
                {ultimoLog?.note ? (
                  <p className="mt-3 rounded-xl border-[1.5px] border-dashed border-linea px-3 py-2 text-[0.9rem] text-niebla">
                    &ldquo;{ultimoLog.note.length > 90 ? `${ultimoLog.note.slice(0, 90)}…` : ultimoLog.note}&rdquo; —{' '}
                    {ultimoLog.author.name}
                  </p>
                ) : null}
              </CardLink>
            );
          })
        )}

        <ButtonLink href="/app/nuevo" variant="ghost" className="mt-1">
          <IconPlus size={18} /> Agregar a un tata
        </ButtonLink>
      </main>
    </div>
  );
}
