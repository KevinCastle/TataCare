import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { edad, formatoFechaCompleta, formatoFechaHora } from '@/lib/utils';
import { ButtonLink, Card, Chip, SectionLabel } from '@/components/ui';
import { IconAlert, IconStar, LogoMark } from '@/components/icons';

export const metadata: Metadata = { title: 'Ficha del paciente' };

export default async function FichaMedicoPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const invite = await db.invite.findUnique({
    where: { code: decodeURIComponent(code).toUpperCase() },
  });

  const valido = invite && invite.kind === 'DOCTOR' && !invite.revokedAt && invite.expiresAt > new Date();

  if (!valido) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center gap-6 px-5 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-pino text-papel">
          <LogoMark size={32} />
        </span>
        <Card className="w-full">
          <h1 className="text-xl font-bold">Este código no está vigente</h1>
          <p className="mt-2 text-niebla">
            Puede haber expirado o sido revocado. Pídale a la familia un código nuevo — les toma 10 segundos
            generarlo.
          </p>
        </Card>
        <ButtonLink href="/dr" variant="ghost" className="w-full">
          Probar con otro código
        </ButtonLink>
      </div>
    );
  }

  const elder = await db.elder.findUnique({
    where: { id: invite.elderId },
    include: {
      conditions: { orderBy: { name: 'asc' } },
      medications: { include: { condition: { select: { name: true } } }, orderBy: { name: 'asc' } },
      contacts: true,
      logs: { orderBy: { date: 'desc' }, take: 7, include: { author: { select: { name: true } } } },
    },
  });
  if (!elder) return null;

  const alergias = elder.conditions.filter((c) => c.type === 'ALLERGY');
  const diagnosticos = elder.conditions.filter((c) => c.type === 'DISEASE');
  const contacto = elder.contacts.find((c) => c.id === elder.favoriteContactId) ?? elder.contacts[0];

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pb-16">
      <header className="flex flex-wrap items-center gap-3 border-b border-linea py-4">
        <span className="flex size-10 items-center justify-center rounded-xl bg-pino text-papel">
          <LogoMark size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.8rem] font-bold uppercase tracking-[0.12em] text-niebla">Vista para profesionales · solo lectura</p>
          <h1 className="text-xl font-bold leading-tight">
            {elder.name} {elder.surname}
          </h1>
        </div>
        <Chip tone="aviso">Acceso expira {formatoFechaHora(invite.expiresAt)}</Chip>
      </header>

      <main id="contenido" className="flex flex-col gap-6 pt-6">
        <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-alerta">{elder.bloodType ?? '—'}</p>
            <p className="text-[0.75rem] text-niebla">Grupo sanguíneo</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold">{edad(elder.birthdate)}</p>
            <p className="text-[0.75rem] text-niebla">Años</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold">{elder.weightKg ? `${elder.weightKg}` : '—'}</p>
            <p className="text-[0.75rem] text-niebla">Peso (kg)</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="truncate text-lg font-bold">{elder.insurance ?? '—'}</p>
            <p className="text-[0.75rem] text-niebla">Previsión</p>
          </Card>
        </section>

        <section className="flex flex-col gap-2">
          <SectionLabel>Alergias</SectionLabel>
          {alergias.length === 0 ? (
            <p className="text-niebla">Sin alergias registradas por la familia.</p>
          ) : (
            alergias.map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-(--radius-card) border-2 border-alerta bg-alerta/5 p-4" role="alert">
                <IconAlert size={22} className="mt-0.5 shrink-0 text-alerta" />
                <div>
                  <p className="font-bold text-alerta">{a.name}</p>
                  {a.detail ? <p className="text-[0.95rem]">{a.detail}</p> : null}
                </div>
              </div>
            ))
          )}
        </section>

        <section className="flex flex-col gap-2">
          <SectionLabel>Diagnósticos</SectionLabel>
          {diagnosticos.length === 0 ? (
            <p className="text-niebla">Sin diagnósticos registrados.</p>
          ) : (
            diagnosticos.map((d) => (
              <Card key={d.id} className="p-3.5">
                <p className="font-bold">{d.name}</p>
                {d.detail ? <p className="text-[0.9rem] text-niebla">{d.detail}</p> : null}
              </Card>
            ))
          )}
        </section>

        <section className="flex flex-col gap-2">
          <SectionLabel>Medicación actual</SectionLabel>
          {elder.medications.length === 0 ? (
            <p className="text-niebla">Sin medicación registrada.</p>
          ) : (
            elder.medications.map((m) => (
              <Card key={m.id} className="p-3.5">
                <p className="font-bold">
                  {m.name} {m.dose}
                </p>
                <p className="text-[0.9rem] text-niebla">
                  {m.intervalHours ? `Cada ${m.intervalHours} h` : 'SOS'}
                  {m.condition ? ` · ${m.condition.name}` : ''}
                  {m.instructions ? ` · ${m.instructions}` : ''}
                </p>
              </Card>
            ))
          )}
        </section>

        <section className="flex flex-col gap-2">
          <SectionLabel>Última semana (bitácora de cuidadores)</SectionLabel>
          {elder.logs.length === 0 ? (
            <p className="text-niebla">Sin registros recientes.</p>
          ) : (
            elder.logs.map((r) => (
              <Card key={r.id} className="p-3.5">
                <p className="text-[0.9rem] font-bold">
                  {formatoFechaCompleta(r.date)} · {r.author.name}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <Chip>
                    <IconStar size={13} /> Día {r.dayRating}/5
                  </Chip>
                  <Chip tone="niebla">Ánimo {r.emotionRating}/5</Chip>
                  <Chip tone="niebla">Digestión {r.digestionRating}/5</Chip>
                  {r.physicalActivity ? <Chip tone="bien">Actividad física</Chip> : null}
                </div>
                {r.note ? <p className="mt-2 text-[0.95rem] text-niebla">&ldquo;{r.note}&rdquo;</p> : null}
              </Card>
            ))
          )}
        </section>

        {contacto ? (
          <p className="rounded-xl border-[1.5px] border-dashed border-linea px-4 py-3 text-[0.95rem] text-niebla">
            Contacto de la familia: <span className="font-bold text-tinta">{contacto.name}</span> ({contacto.role}) ·{' '}
            {contacto.phone}
          </p>
        ) : null}
      </main>
    </div>
  );
}
