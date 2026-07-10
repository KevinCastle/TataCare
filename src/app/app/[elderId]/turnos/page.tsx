import type { Metadata } from 'next';
import { accesoAlTata, puedeEditar } from '@/lib/access';
import { db } from '@/lib/db';
import { fechaISO, iniciales } from '@/lib/utils';
import { soltarTurno, tomarTurno } from '@/lib/actions/shifts';
import { AppBar, Content } from '@/components/shell';
import { Avatar, Card, Chip } from '@/components/ui';

export const metadata: Metadata = { title: 'Turnos' };

const DIAS = 14;

const etiquetaDia = new Intl.DateTimeFormat('es-CL', {
  weekday: 'long',
  day: 'numeric',
  month: 'short',
  timeZone: 'America/Santiago',
});

export default async function TurnosPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder, role, user } = await accesoAlTata(elderId);

  const fechas: { clave: string; etiqueta: string; esHoy: boolean }[] = [];
  for (let i = 0; i < DIAS; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const clave = fechaISO(d);
    fechas.push({
      clave,
      etiqueta: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : etiquetaDia.format(d),
      esHoy: i === 0,
    });
  }

  const turnos = await db.shift.findMany({
    where: { elderId, date: { gte: fechas[0].clave, lte: fechas[DIAS - 1].clave } },
    include: { user: { select: { id: true, name: true, surname: true } } },
  });

  const porDia = new Map<string, typeof turnos>();
  for (const t of turnos) {
    porDia.set(t.date, [...(porDia.get(t.date) ?? []), t]);
  }

  const editor = puedeEditar(role);

  return (
    <>
      <AppBar title="Turnos" subtitle={`¿Quién cuida a ${elder.name}?`} backHref={`/app/${elderId}/mas`} />
      <Content>
        <p className="mb-4 text-[0.95rem] text-niebla">
          Toma los días que puedes cubrir. Los días sin nadie quedan marcados para que se noten a tiempo.
        </p>
        <ol className="flex flex-col gap-2.5">
          {fechas.map(({ clave, etiqueta, esHoy }) => {
            const asignados = porDia.get(clave) ?? [];
            const mio = asignados.some((t) => t.user.id === user.id);
            return (
              <li key={clave}>
                <Card className={`flex items-center gap-3 p-3.5 ${esHoy ? 'border-pino' : ''}`}>
                  <div className="w-28 shrink-0">
                    <p className={`font-bold capitalize leading-tight ${esHoy ? 'text-pino-oscuro' : ''}`}>{etiqueta}</p>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                    {asignados.length === 0 ? (
                      <Chip tone="aviso">Nadie aún</Chip>
                    ) : (
                      asignados.map((t) => (
                        <span key={t.id} className="flex items-center gap-1.5">
                          <Avatar initials={iniciales(t.user.name, t.user.surname)} size="sm" tone={t.user.id === user.id ? 'copihue' : 'pino'} />
                          <span className="text-[0.9rem] font-bold">{t.user.name}</span>
                        </span>
                      ))
                    )}
                  </div>
                  {editor ? (
                    mio ? (
                      <form action={soltarTurno.bind(null, elderId, clave)}>
                        <button
                          type="submit"
                          className="min-h-12 rounded-xl px-3 text-[0.9rem] font-bold text-niebla hover:bg-alerta/10 hover:text-alerta"
                        >
                          Dejar
                        </button>
                      </form>
                    ) : (
                      <form action={tomarTurno.bind(null, elderId, clave)}>
                        <button
                          type="submit"
                          className="min-h-12 rounded-xl border-2 border-pino px-3 text-[0.9rem] font-bold text-pino-oscuro hover:bg-pino/10"
                        >
                          Tomar
                        </button>
                      </form>
                    )
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ol>
      </Content>
    </>
  );
}
