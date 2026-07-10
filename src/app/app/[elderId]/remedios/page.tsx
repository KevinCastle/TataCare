import type { Metadata } from 'next';
import Link from 'next/link';
import { accesoAlTata, puedeEditar } from '@/lib/access';
import { db } from '@/lib/db';
import { diasRestantes } from '@/lib/utils';
import { alternarFavorito } from '@/lib/actions/medications';
import { AppBar, Content } from '@/components/shell';
import { Card, Chip, EmptyState, Fab, SectionLabel } from '@/components/ui';
import { IconHeart, IconPill } from '@/components/icons';

export const metadata: Metadata = { title: 'Remedios' };

function ChipDeVigencia({ endDate }: { endDate: Date | null }) {
  if (!endDate) return null;
  const dias = diasRestantes(endDate);
  if (dias < 0) return <Chip tone="niebla">Tratamiento terminado</Chip>;
  if (dias === 0) return <Chip tone="alerta">⏳ Termina hoy</Chip>;
  if (dias <= 7)
    return (
      <Chip tone="aviso">
        ⏳ {dias === 1 ? 'Queda 1 día' : `Quedan ${dias} días`}
      </Chip>
    );
  return <Chip tone="bien">✓ Quedan {dias} días</Chip>;
}

export default async function RemediosPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder, role } = await accesoAlTata(elderId);

  const remedios = await db.medication.findMany({
    where: { elderId },
    include: { condition: { select: { name: true, type: true } } },
    orderBy: [{ favorite: 'desc' }, { name: 'asc' }],
  });

  const editor = puedeEditar(role);

  return (
    <>
      <AppBar
        title="Remedios"
        subtitle={`${elder.name} · ${remedios.length} ${remedios.length === 1 ? 'registrado' : 'registrados'}`}
        backHref={`/app/${elderId}`}
      />
      <Content>
        <div className="flex flex-col gap-3">
          {remedios.length === 0 ? (
            <EmptyState icon={<IconPill size={34} />} title="Aún no registras remedios">
              Empieza por los del desayuno: nombre, dosis y cada cuántas horas. Quien te reemplace lo va a agradecer.
            </EmptyState>
          ) : (
            remedios.map((m) => (
              <Card key={m.id} className="p-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pino/10 text-pino-oscuro">
                    <IconPill size={18} />
                  </span>
                  {editor ? (
                    <Link href={`/app/${elderId}/remedios/${m.id}/editar`} className="min-w-0 flex-1">
                      <span className="block truncate font-bold leading-tight underline-offset-4 hover:underline">
                        {m.name} {m.dose}
                      </span>
                      <span className="block text-[0.85rem] text-niebla">
                        {m.intervalHours ? `Cada ${m.intervalHours} h` : 'Cuando lo necesite'}
                        {m.condition ? ` · ${m.condition.name}` : ''}
                      </span>
                    </Link>
                  ) : (
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold leading-tight">
                        {m.name} {m.dose}
                      </span>
                      <span className="block text-[0.85rem] text-niebla">
                        {m.intervalHours ? `Cada ${m.intervalHours} h` : 'Cuando lo necesite'}
                        {m.condition ? ` · ${m.condition.name}` : ''}
                      </span>
                    </span>
                  )}
                  {editor ? (
                    <form action={alternarFavorito.bind(null, elderId, m.id)}>
                      <button
                        type="submit"
                        aria-label={m.favorite ? `Quitar ${m.name} de destacados` : `Destacar ${m.name} en la ficha`}
                        aria-pressed={m.favorite}
                        className="flex size-12 items-center justify-center rounded-full hover:bg-copihue/10"
                      >
                        <IconHeart size={20} filled={m.favorite} className={m.favorite ? 'text-copihue' : 'text-niebla/50'} />
                      </button>
                    </form>
                  ) : m.favorite ? (
                    <IconHeart size={20} className="text-copihue" />
                  ) : null}
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <ChipDeVigencia endDate={m.endDate} />
                  {m.pharmacy ? <Chip tone="niebla">{m.pharmacy}</Chip> : null}
                </div>
                {m.instructions ? <p className="mt-2 text-[0.9rem] text-niebla">{m.instructions}</p> : null}
              </Card>
            ))
          )}
          {remedios.length > 0 ? (
            <SectionLabel className="mt-2">♥ = destacado: aparece en la ficha y en urgencia</SectionLabel>
          ) : null}
        </div>
        {editor ? <Fab href={`/app/${elderId}/remedios/nuevo`} label="Agregar remedio" /> : null}
      </Content>
    </>
  );
}
