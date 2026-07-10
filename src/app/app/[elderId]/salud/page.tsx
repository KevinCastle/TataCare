import type { Metadata } from 'next';
import Link from 'next/link';
import { accesoAlTata, puedeEditar } from '@/lib/access';
import { db } from '@/lib/db';
import { AppBar, Content } from '@/components/shell';
import { Card, Chip, EmptyState, Fab, SectionLabel } from '@/components/ui';
import { IconAlert, IconPill, IconSalud } from '@/components/icons';

export const metadata: Metadata = { title: 'Salud' };

export default async function SaludPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder, role } = await accesoAlTata(elderId);

  const condiciones = await db.condition.findMany({
    where: { elderId },
    include: { medications: { select: { id: true, name: true } } },
    orderBy: { name: 'asc' },
  });

  const alergias = condiciones.filter((c) => c.type === 'ALLERGY');
  const diagnosticos = condiciones.filter((c) => c.type === 'DISEASE');
  const editor = puedeEditar(role);

  return (
    <>
      <AppBar
        title="Salud"
        subtitle={`${elder.name} · ${alergias.length} ${alergias.length === 1 ? 'alergia' : 'alergias'} · ${diagnosticos.length} ${diagnosticos.length === 1 ? 'diagnóstico' : 'diagnósticos'}`}
        backHref={`/app/${elderId}`}
      />
      <Content>
        <div className="flex flex-col gap-3">
          <SectionLabel>Alergias</SectionLabel>
          {alergias.length === 0 ? (
            <p className="text-[0.9rem] text-niebla">
              Sin alergias registradas. Si no tiene, perfecto — si no estás seguro, pregúntale al médico en el próximo
              control.
            </p>
          ) : (
            alergias.map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-(--radius-card) border-2 border-alerta bg-alerta/5 p-4">
                <IconAlert size={22} className="mt-0.5 shrink-0 text-alerta" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-alerta">{a.name}</p>
                  {a.detail ? <p className="text-[0.95rem]">{a.detail}</p> : null}
                  {a.registeredBy ? <p className="mt-1 text-[0.8rem] text-niebla">Registrada por {a.registeredBy}</p> : null}
                </div>
                {editor ? (
                  <Link
                    href={`/app/${elderId}/salud/${a.id}/editar`}
                    className="shrink-0 rounded-lg px-2 py-1 text-[0.9rem] font-bold text-pino-oscuro underline underline-offset-4"
                  >
                    Editar
                  </Link>
                ) : null}
              </div>
            ))
          )}

          <SectionLabel className="mt-3">Diagnósticos</SectionLabel>
          {diagnosticos.length === 0 ? (
            <EmptyState icon={<IconSalud size={34} />} title="Sin diagnósticos registrados">
              Anota las enfermedades y condiciones que tiene: en una consulta médica es lo primero que preguntan.
            </EmptyState>
          ) : (
            diagnosticos.map((d) => (
              <Card key={d.id} className="p-3.5">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pino/10 text-pino-oscuro">
                    <IconSalud size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-tight">{d.name}</p>
                    {d.detail ? <p className="text-[0.9rem] text-niebla">{d.detail}</p> : null}
                    {d.registeredBy ? <p className="mt-0.5 text-[0.8rem] text-niebla/80">Registrado por {d.registeredBy}</p> : null}
                  </div>
                  {editor ? (
                    <Link
                      href={`/app/${elderId}/salud/${d.id}/editar`}
                      className="shrink-0 rounded-lg px-2 py-1 text-[0.9rem] font-bold text-pino-oscuro underline underline-offset-4"
                    >
                      Editar
                    </Link>
                  ) : null}
                </div>
                {d.medications.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {d.medications.map((m) => (
                      <Chip key={m.id}>
                        <IconPill size={13} /> {m.name}
                      </Chip>
                    ))}
                  </div>
                ) : null}
              </Card>
            ))
          )}
        </div>
        {editor ? <Fab href={`/app/${elderId}/salud/nuevo`} label="Agregar condición o alergia" /> : null}
      </Content>
    </>
  );
}
