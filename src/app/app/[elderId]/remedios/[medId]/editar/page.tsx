import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { accesoAlTata } from '@/lib/access';
import { db } from '@/lib/db';
import { editarRemedio, eliminarRemedio } from '@/lib/actions/medications';
import { RemedioForm } from '@/components/remedio-form';
import { AppBar, Content } from '@/components/shell';
import { ConfirmSubmit } from '@/components/ui-client';

export const metadata: Metadata = { title: 'Editar remedio' };

export default async function EditarRemedioPage({
  params,
}: {
  params: Promise<{ elderId: string; medId: string }>;
}) {
  const { elderId, medId } = await params;
  const { elder } = await accesoAlTata(elderId, 'EDITOR');

  const [remedio, condiciones] = await Promise.all([
    db.medication.findFirst({ where: { id: medId, elderId } }),
    db.condition.findMany({ where: { elderId }, orderBy: { name: 'asc' } }),
  ]);
  if (!remedio) notFound();

  return (
    <>
      <AppBar title="Editar remedio" subtitle={elder.name} backHref={`/app/${elderId}/remedios`} />
      <Content>
        <RemedioForm
          action={editarRemedio.bind(null, elderId, medId)}
          defaults={remedio}
          condiciones={condiciones}
          submitLabel="Guardar cambios"
        />
        <form action={eliminarRemedio.bind(null, elderId, medId)} className="mt-8 border-t border-linea pt-5">
          <ConfirmSubmit confirmText={`Sí, eliminar ${remedio.name}`}>Eliminar este remedio</ConfirmSubmit>
        </form>
      </Content>
    </>
  );
}
