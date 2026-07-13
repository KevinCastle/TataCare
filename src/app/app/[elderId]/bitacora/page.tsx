import type { Metadata } from 'next';
import { accesoAlTata, puedeEditar } from '@/lib/access';
import { db } from '@/lib/db';
import { formatoFechaCompleta, iniciales } from '@/lib/utils';
import { crearRegistro } from '@/lib/actions/logs';
import { BitacoraForm } from '@/components/bitacora-form';
import { AppBar, Content } from '@/components/shell';
import { Avatar, Card, Chip, EmptyState, SectionLabel } from '@/components/ui';
import { IconNota, IconStar } from '@/components/icons';

export const metadata: Metadata = { title: 'Bitácora' };

const EMOJIS = ['', '😞', '😕', '😐', '🙂', '😄'];

export default async function BitacoraPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder, role } = await accesoAlTata(elderId);

  const [registros, notasMedicas] = await Promise.all([
    db.dailyLog.findMany({
      where: { elderId },
      orderBy: { date: 'desc' },
      take: 30,
      include: { author: { select: { name: true, surname: true, avatarUrl: true } } },
    }),
    db.doctorNote.findMany({ where: { elderId }, orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  return (
    <>
      <AppBar title="Bitácora" subtitle={`El diario compartido de ${elder.name}`} backHref={`/app/${elderId}`} />
      <Content>
        <div className="flex flex-col gap-5">
          {puedeEditar(role) ? <BitacoraForm action={crearRegistro.bind(null, elderId)} nombreTata={elder.name} /> : null}

          {notasMedicas.length > 0 ? (
            <>
              <SectionLabel>🩺 Notas clínicas</SectionLabel>
              {notasMedicas.map((n) => (
                <Card key={n.id} className="border-pino/40 p-3.5">
                  <p className="text-[0.9rem] font-bold text-pino-oscuro">
                    {n.doctorName} · {formatoFechaCompleta(n.createdAt)}
                  </p>
                  <p className="mt-1 text-[0.95rem]">{n.note}</p>
                </Card>
              ))}
            </>
          ) : null}

          <SectionLabel>Registros anteriores</SectionLabel>
          {registros.length === 0 ? (
            <EmptyState icon={<IconNota size={34} />} title="La bitácora está vacía">
              El primer registro es el regalo para quien tome el próximo turno: sabrá cómo venía {elder.name}.
            </EmptyState>
          ) : (
            registros.map((r) => (
              <Card key={r.id} className="p-3.5">
                <div className="flex items-center gap-2.5">
                  <Avatar initials={iniciales(r.author.name, r.author.surname)} imageUrl={r.author.avatarUrl} size="sm" tone="copihue" />
                  <p className="min-w-0 flex-1 truncate text-[0.95rem] font-bold">
                    {r.author.name} · {formatoFechaCompleta(r.date)}
                  </p>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <Chip>
                    <IconStar size={13} /> Día {r.dayRating}/5
                  </Chip>
                  <Chip tone="niebla">
                    <span aria-hidden>{EMOJIS[r.emotionRating]}</span> Ánimo {r.emotionRating}/5
                  </Chip>
                  <Chip tone="niebla">Digestión {r.digestionRating}/5</Chip>
                  {r.physicalActivity ? <Chip tone="bien">↻ Se movió</Chip> : null}
                </div>
                {r.note ? <p className="mt-2.5 text-[0.95rem] text-niebla">&ldquo;{r.note}&rdquo;</p> : null}
              </Card>
            ))
          )}
        </div>
      </Content>
    </>
  );
}
