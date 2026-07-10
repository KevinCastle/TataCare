import type { Metadata } from 'next';
import { accesoAlTata } from '@/lib/access';
import { crearCondicion } from '@/lib/actions/conditions';
import { CondicionForm } from '@/components/condicion-form';
import { AppBar, Content } from '@/components/shell';

export const metadata: Metadata = { title: 'Nueva condición' };

export default async function NuevaCondicionPage({
  params,
  searchParams,
}: {
  params: Promise<{ elderId: string }>;
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { elderId } = await params;
  const { tipo } = await searchParams;
  const { elder } = await accesoAlTata(elderId, 'EDITOR');

  return (
    <>
      <AppBar title="Nueva condición" subtitle={elder.name} backHref={`/app/${elderId}/salud`} />
      <Content>
        <CondicionForm
          action={crearCondicion.bind(null, elderId)}
          tipoInicial={tipo === 'alergia' ? 'ALLERGY' : undefined}
          submitLabel="Guardar"
        />
      </Content>
    </>
  );
}
