import type { Metadata } from 'next';
import { accesoAlTata } from '@/lib/access';
import { subirDocumento } from '@/lib/actions/documents';
import { DocumentoForm } from '@/components/documento-form';
import { AppBar, Content } from '@/components/shell';

export const metadata: Metadata = { title: 'Subir documento' };

export default async function NuevoDocumentoPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder } = await accesoAlTata(elderId, 'EDITOR');

  return (
    <>
      <AppBar title="Subir documento" subtitle={`Carpeta de ${elder.name}`} backHref={`/app/${elderId}/carpeta`} />
      <Content>
        <DocumentoForm action={subirDocumento.bind(null, elderId)} />
      </Content>
    </>
  );
}
