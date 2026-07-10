import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { accesoAlTata } from '@/lib/access';
import { db } from '@/lib/db';
import { editarCondicion, eliminarCondicion } from '@/lib/actions/conditions';
import { CondicionForm } from '@/components/condicion-form';
import { AppBar, Content } from '@/components/shell';
import { ConfirmSubmit } from '@/components/ui-client';

export const metadata: Metadata = { title: 'Editar condición' };

export default async function EditarCondicionPage({
  params,
}: {
  params: Promise<{ elderId: string; condicionId: string }>;
}) {
  const { elderId, condicionId } = await params;
  const { elder } = await accesoAlTata(elderId, 'EDITOR');

  const condicion = await db.condition.findFirst({ where: { id: condicionId, elderId } });
  if (!condicion) notFound();

  return (
    <>
      <AppBar title="Editar condición" subtitle={elder.name} backHref={`/app/${elderId}/salud`} />
      <Content>
        <CondicionForm action={editarCondicion.bind(null, elderId, condicionId)} defaults={condicion} submitLabel="Guardar cambios" />
        <form action={eliminarCondicion.bind(null, elderId, condicionId)} className="mt-8 border-t border-linea pt-5">
          <ConfirmSubmit confirmText={`Sí, eliminar ${condicion.name}`}>Eliminar</ConfirmSubmit>
        </form>
      </Content>
    </>
  );
}
