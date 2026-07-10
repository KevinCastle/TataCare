import type { Metadata } from 'next';
import Link from 'next/link';
import type { Taste } from '@prisma/client';
import { accesoAlTata, puedeEditar } from '@/lib/access';
import { db } from '@/lib/db';
import { AppBar, Content } from '@/components/shell';
import { Card, EmptyState, Fab } from '@/components/ui';
import { IconHeart } from '@/components/icons';

export const metadata: Metadata = { title: 'Gustos y mañas' };

function Grupo({
  id,
  titulo,
  color,
  items,
  elderId,
  editor,
  destacarBorde,
}: {
  id: string;
  titulo: string;
  color: string;
  items: Taste[];
  elderId: string;
  editor: boolean;
  destacarBorde?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className={`text-[0.8rem] font-bold uppercase tracking-[0.12em] ${color}`}>
        {titulo}
      </h2>
      {items.map((t) => (
        <Card key={`${id}-${t.id}`} className={`p-3.5 ${destacarBorde ? 'border-alerta/40' : ''}`}>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-bold leading-snug">{t.detail}</p>
              {t.note ? <p className="text-[0.9rem] text-niebla">{t.note}</p> : null}
            </div>
            {editor ? (
              <Link
                href={`/app/${elderId}/gustos/${t.id}/editar`}
                className="shrink-0 rounded-lg px-2 py-1 text-[0.9rem] font-bold text-pino-oscuro underline underline-offset-4"
              >
                Editar
              </Link>
            ) : null}
          </div>
        </Card>
      ))}
    </section>
  );
}

export default async function GustosPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder, role } = await accesoAlTata(elderId);
  const gustos = await db.taste.findMany({ where: { elderId }, orderBy: { detail: 'asc' } });
  const editor = puedeEditar(role);

  return (
    <>
      <AppBar title="Gustos y mañas" subtitle={`Para conocer a ${elder.name}`} backHref={`/app/${elderId}/mas`} />
      <Content>
        <div className="flex flex-col gap-5">
          {gustos.length === 0 ? (
            <EmptyState icon={<IconHeart size={34} filled={false} />} title="Aún no hay gustos registrados">
              Anota qué le alegra el día, qué no soporta y qué le hace mal — es lo que un cuidador nuevo necesita saber
              primero.
            </EmptyState>
          ) : (
            <>
              <Grupo
                id="le-gusta"
                titulo="♥ Le gusta"
                color="text-copihue"
                items={gustos.filter((g) => g.pleasure)}
                elderId={elderId}
                editor={editor}
              />
              <Grupo
                id="no-le-gusta"
                titulo="✕ No le gusta"
                color="text-niebla"
                items={gustos.filter((g) => g.displeasure)}
                elderId={elderId}
                editor={editor}
              />
              <Grupo
                id="le-hace-mal"
                titulo="⚠ Le hace mal"
                color="text-alerta"
                items={gustos.filter((g) => g.avoid)}
                elderId={elderId}
                editor={editor}
                destacarBorde
              />
              <Grupo
                id="actividades"
                titulo="↻ Actividades"
                color="text-bien"
                items={gustos.filter((g) => g.activity)}
                elderId={elderId}
                editor={editor}
              />
            </>
          )}
        </div>
        {editor ? <Fab href={`/app/${elderId}/gustos/nuevo`} label="Agregar gusto o maña" /> : null}
      </Content>
    </>
  );
}
