import type { Metadata } from 'next';
import { accesoAlTata } from '@/lib/access';
import { crearGusto } from '@/lib/actions/tastes';
import { GustoForm } from '@/components/gusto-form';
import { AppBar, Content } from '@/components/shell';

export const metadata: Metadata = { title: 'Nuevo gusto' };

export default async function NuevoGustoPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder } = await accesoAlTata(elderId, 'EDITOR');

  return (
    <>
      <AppBar title="Nuevo gusto o maña" subtitle={elder.name} backHref={`/app/${elderId}/gustos`} />
      <Content>
        <GustoForm action={crearGusto.bind(null, elderId)} submitLabel="Guardar" />
      </Content>
    </>
  );
}
