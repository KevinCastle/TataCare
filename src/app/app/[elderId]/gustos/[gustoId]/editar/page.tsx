import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { accesoAlTata } from '@/lib/access';
import { db } from '@/lib/db';
import { editarGusto, eliminarGusto } from '@/lib/actions/tastes';
import { GustoForm } from '@/components/gusto-form';
import { AppBar, Content } from '@/components/shell';
import { ConfirmSubmit } from '@/components/ui-client';

export const metadata: Metadata = { title: 'Editar gusto' };

export default async function EditarGustoPage({
  params,
}: {
  params: Promise<{ elderId: string; gustoId: string }>;
}) {
  const { elderId, gustoId } = await params;
  const { elder } = await accesoAlTata(elderId, 'EDITOR');

  const gusto = await db.taste.findFirst({ where: { id: gustoId, elderId } });
  if (!gusto) notFound();

  return (
    <>
      <AppBar title="Editar gusto" subtitle={elder.name} backHref={`/app/${elderId}/gustos`} />
      <Content>
        <GustoForm action={editarGusto.bind(null, elderId, gustoId)} defaults={gusto} submitLabel="Guardar cambios" />
        <form action={eliminarGusto.bind(null, elderId, gustoId)} className="mt-8 border-t border-linea pt-5">
          <ConfirmSubmit confirmText="Sí, eliminar">Eliminar</ConfirmSubmit>
        </form>
      </Content>
    </>
  );
}
