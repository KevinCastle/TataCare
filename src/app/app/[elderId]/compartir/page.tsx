import type { Metadata } from 'next';
import { accesoAlTata, puedeEditar } from '@/lib/access';
import { db } from '@/lib/db';
import { formatoFechaHora, iniciales } from '@/lib/utils';
import { crearAccesoMedico, invitarCuidador, quitarCuidador, revocarInvite } from '@/lib/actions/share';
import { AccesoMedicoForm, InvitarCuidadorForm } from '@/components/compartir-client';
import { AppBar, Content } from '@/components/shell';
import { Avatar, Card, Chip, SectionLabel } from '@/components/ui';
import { ConfirmSubmit, CopyButton } from '@/components/ui-client';

export const metadata: Metadata = { title: 'Compartir' };

const ROLES: Record<string, { texto: string; tone: 'pino' | 'aviso' | 'niebla' }> = {
  OWNER: { texto: 'Dueño/a', tone: 'pino' },
  EDITOR: { texto: 'Editor/a', tone: 'aviso' },
  VIEWER: { texto: 'Lector/a', tone: 'niebla' },
};

export default async function CompartirPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder, role, user } = await accesoAlTata(elderId);

  const ahora = new Date();
  const [cuidadores, invitaciones] = await Promise.all([
    db.caregiver.findMany({
      where: { elderId },
      include: { user: { select: { id: true, name: true, surname: true } } },
      orderBy: { since: 'asc' },
    }),
    db.invite.findMany({
      where: { elderId, revokedAt: null, usedAt: null, expiresAt: { gt: ahora } },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const invitesCuidador = invitaciones.filter((i) => i.kind === 'CAREGIVER');
  const codigosMedico = invitaciones.filter((i) => i.kind === 'DOCTOR');
  const soyOwner = role === 'OWNER';

  return (
    <>
      <AppBar title="Compartir" subtitle={`Ficha de ${elder.name} ${elder.surname}`} backHref={`/app/${elderId}/mas`} />
      <Content>
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <SectionLabel>Personas con acceso</SectionLabel>
            <Card className="flex flex-col gap-3 p-3.5">
              {cuidadores.map((c) => (
                <div key={c.userId} className="flex items-center gap-3">
                  <Avatar initials={iniciales(c.user.name, c.user.surname)} size="sm" tone={c.role === 'OWNER' ? 'copihue' : 'pino'} />
                  <p className="min-w-0 flex-1 truncate font-bold">
                    {c.user.name} {c.user.surname}
                    {c.userId === user.id ? <span className="font-normal text-niebla"> (tú)</span> : null}
                  </p>
                  <Chip tone={ROLES[c.role].tone}>{ROLES[c.role].texto}</Chip>
                  {soyOwner && c.userId !== user.id ? (
                    <form action={quitarCuidador.bind(null, elderId, c.userId)}>
                      <ConfirmSubmit confirmText="Sí, quitar">Quitar</ConfirmSubmit>
                    </form>
                  ) : null}
                </div>
              ))}
            </Card>
          </section>

          {soyOwner ? (
            <section className="flex flex-col gap-2">
              <SectionLabel>Invitar cuidador</SectionLabel>
              <Card className="flex flex-col gap-4">
                <InvitarCuidadorForm action={invitarCuidador.bind(null, elderId)} />
                {invitesCuidador.map((i) => (
                  <div key={i.id} className="flex flex-wrap items-center gap-2 rounded-xl border-[1.5px] border-dashed border-linea p-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono font-bold text-pino-oscuro">{i.code}</p>
                      <p className="text-[0.8rem] text-niebla">
                        {i.role === 'VIEWER' ? 'Solo mirar' : 'Puede editar'} · un solo uso · vence{' '}
                        {formatoFechaHora(i.expiresAt)}
                      </p>
                    </div>
                    <CopyButton path={`/app/invitacion/${i.code}`} />
                    <form action={revocarInvite.bind(null, elderId, i.id)}>
                      <button type="submit" className="min-h-12 rounded-xl px-3 font-bold text-alerta hover:bg-alerta/10">
                        Revocar
                      </button>
                    </form>
                  </div>
                ))}
              </Card>
            </section>
          ) : null}

          {puedeEditar(role) ? (
            <section className="flex flex-col gap-2">
              <SectionLabel>Acceso para el médico</SectionLabel>
              <Card className="flex flex-col gap-4">
                <AccesoMedicoForm action={crearAccesoMedico.bind(null, elderId)} />
                {codigosMedico.map((i) => (
                  <div key={i.id} className="flex flex-wrap items-center gap-2 rounded-xl border-[1.5px] border-dashed border-linea p-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xl font-bold tracking-wider text-pino-oscuro">{i.code}</p>
                      <p className="text-[0.8rem] text-niebla">Solo lectura · expira {formatoFechaHora(i.expiresAt)}</p>
                    </div>
                    <CopyButton path={`/dr/${i.code}`} />
                    <form action={revocarInvite.bind(null, elderId, i.id)}>
                      <button type="submit" className="min-h-12 rounded-xl px-3 font-bold text-alerta hover:bg-alerta/10">
                        Revocar
                      </button>
                    </form>
                  </div>
                ))}
                <p className="rounded-xl border-[1.5px] border-dashed border-linea px-3 py-2.5 text-[0.9rem] text-niebla">
                  El médico entra con el código en <span className="font-bold">tata-care.app/dr</span> — sin crear
                  cuenta. Ve la ficha completa en modo lectura mientras el código esté vigente.
                </p>
              </Card>
            </section>
          ) : null}
        </div>
      </Content>
    </>
  );
}
