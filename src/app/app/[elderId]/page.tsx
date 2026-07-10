import Link from 'next/link';
import { accesoAlTata, puedeEditar } from '@/lib/access';
import { db } from '@/lib/db';
import { edad, fechaISO, formatoFechaCompleta, iniciales } from '@/lib/utils';
import { AppBar, Content } from '@/components/shell';
import { AlertCard, Avatar, ButtonLink, Card, Chip, SectionLabel } from '@/components/ui';
import { IconAlert, IconDrop, IconEdit, IconHeart, IconPill, IconStar, IconTel } from '@/components/icons';

export default async function FichaPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder, role } = await accesoAlTata(elderId);

  const [conditions, favoritos, contactos, ultimoLog, turnoHoy] = await Promise.all([
    db.condition.findMany({ where: { elderId }, orderBy: { name: 'asc' } }),
    db.medication.findMany({ where: { elderId, favorite: true }, orderBy: { name: 'asc' } }),
    db.contact.findMany({ where: { elderId } }),
    db.dailyLog.findFirst({
      where: { elderId },
      orderBy: { date: 'desc' },
      include: { author: { select: { name: true } } },
    }),
    db.shift.findFirst({ where: { elderId, date: fechaISO() }, include: { user: { select: { name: true } } } }),
  ]);

  const alergias = conditions.filter((c) => c.type === 'ALLERGY');
  const diagnosticos = conditions.filter((c) => c.type === 'DISEASE');
  const contactoPrioritario = contactos.find((c) => c.id === elder.favoriteContactId) ?? contactos[0];

  return (
    <>
      <AppBar
        title={`${elder.name} ${elder.surname}`}
        subtitle={`${edad(elder.birthdate)} años${elder.insurance ? ` · ${elder.insurance}` : ''}`}
        backHref="/app"
        right={
          puedeEditar(role) ? (
            <Link
              href={`/app/${elderId}/editar`}
              aria-label="Editar ficha"
              className="flex size-12 items-center justify-center rounded-full border border-linea bg-crema text-pino-oscuro"
            >
              <IconEdit size={20} />
            </Link>
          ) : undefined
        }
      />
      <Content>
        <div className="flex flex-col gap-4">
          {turnoHoy ? <Chip tone="bien" className="self-start">Hoy cuida {turnoHoy.user.name}</Chip> : null}

          {/* Datos vitales de un vistazo */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 text-center">
              <IconDrop size={16} className="mx-auto text-alerta" />
              <p className="text-xl font-bold leading-tight">{elder.bloodType ?? '—'}</p>
              <p className="text-[0.75rem] text-niebla">Sangre</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="mt-4 text-xl font-bold leading-tight">{elder.weightKg ? `${elder.weightKg} kg` : '—'}</p>
              <p className="text-[0.75rem] text-niebla">Peso</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="mt-4 truncate text-base font-bold leading-tight">{elder.identificationNumber ?? '—'}</p>
              <p className="text-[0.75rem] text-niebla">RUT</p>
            </Card>
          </div>

          {/* Alergias: lo que mata va primero */}
          {alergias.map((a) => (
            <AlertCard key={a.id} title={`Alergia · ${a.name}`}>
              {a.detail}
            </AlertCard>
          ))}

          <section aria-labelledby="condiciones" className="flex flex-col gap-2">
            <SectionLabel className="mt-1" >
              <span id="condiciones">Condiciones</span>
            </SectionLabel>
            {diagnosticos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {diagnosticos.map((d) => (
                  <Chip key={d.id}>{d.name}</Chip>
                ))}
              </div>
            ) : (
              <p className="text-[0.9rem] text-niebla">
                Sin diagnósticos registrados —{' '}
                <Link href={`/app/${elderId}/salud`} className="font-bold text-pino-oscuro underline underline-offset-4">
                  agrégalos en Salud
                </Link>
              </p>
            )}
          </section>

          <section aria-labelledby="destacados" className="flex flex-col gap-2">
            <SectionLabel>
              <span id="destacados">Remedios destacados</span>
            </SectionLabel>
            {favoritos.length > 0 ? (
              favoritos.map((m) => (
                <Link key={m.id} href={`/app/${elderId}/remedios`} className="block">
                  <Card className="flex items-center gap-3 p-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pino/10 text-pino-oscuro">
                      <IconPill size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold leading-tight">
                        {m.name} {m.dose}
                      </span>
                      <span className="block text-[0.85rem] text-niebla">
                        {m.intervalHours ? `Cada ${m.intervalHours} h` : 'Cuando lo necesite'}
                      </span>
                    </span>
                    <IconHeart size={18} className="shrink-0 text-copihue" />
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-[0.9rem] text-niebla">
                Marca con ♥ los remedios críticos en{' '}
                <Link href={`/app/${elderId}/remedios`} className="font-bold text-pino-oscuro underline underline-offset-4">
                  Remedios
                </Link>{' '}
                y aparecerán aquí.
              </p>
            )}
          </section>

          {ultimoLog ? (
            <section aria-labelledby="ultima-bitacora" className="flex flex-col gap-2">
              <SectionLabel>
                <span id="ultima-bitacora">Última bitácora</span>
              </SectionLabel>
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <Avatar initials={iniciales(ultimoLog.author.name)} size="sm" tone="copihue" />
                  <p className="flex-1 text-[0.9rem] font-bold">
                    {ultimoLog.author.name} · {formatoFechaCompleta(ultimoLog.date)}
                  </p>
                  <Chip className="text-[0.75rem]">
                    <IconStar size={12} /> {ultimoLog.dayRating}
                  </Chip>
                </div>
                {ultimoLog.note ? <p className="mt-2 text-[0.95rem] text-niebla">&ldquo;{ultimoLog.note}&rdquo;</p> : null}
              </Card>
            </section>
          ) : null}

          {contactoPrioritario ? (
            <a
              href={`tel:${contactoPrioritario.phone.replace(/\s/g, '')}`}
              className="flex min-h-14 items-center justify-center gap-2 rounded-(--radius-control) bg-pino px-5 text-lg font-bold text-white hover:bg-pino-oscuro"
            >
              <IconTel size={20} /> Llamar a {contactoPrioritario.name} · {contactoPrioritario.role.toLowerCase()}
            </a>
          ) : (
            <ButtonLink href={`/app/${elderId}/contactos`} variant="ghost">
              Agrega un contacto de emergencia
            </ButtonLink>
          )}

          <ButtonLink href={`/app/urgencia/${elderId}`} variant="quiet" className="border-2 border-alerta text-alerta hover:bg-alerta/10">
            <IconAlert size={18} /> Modo urgencia
          </ButtonLink>
        </div>
      </Content>
    </>
  );
}
