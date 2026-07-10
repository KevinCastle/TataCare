import type { Metadata } from 'next';
import { accesoAlTata } from '@/lib/access';
import { db } from '@/lib/db';
import { crearRemedio } from '@/lib/actions/medications';
import { RemedioForm } from '@/components/remedio-form';
import { AppBar, Content } from '@/components/shell';

export const metadata: Metadata = { title: 'Nuevo remedio' };

export default async function NuevoRemedioPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder } = await accesoAlTata(elderId, 'EDITOR');
  const condiciones = await db.condition.findMany({ where: { elderId }, orderBy: { name: 'asc' } });

  return (
    <>
      <AppBar title="Nuevo remedio" subtitle={elder.name} backHref={`/app/${elderId}/remedios`} />
      <Content>
        <RemedioForm action={crearRemedio.bind(null, elderId)} condiciones={condiciones} submitLabel="Guardar remedio" />
      </Content>
    </>
  );
}
