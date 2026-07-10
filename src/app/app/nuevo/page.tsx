import type { Metadata } from 'next';
import { crearTata } from '@/lib/actions/elders';
import { TataForm } from '@/components/tata-form';
import { AppBar, Content } from '@/components/shell';

export const metadata: Metadata = { title: 'Nuevo tata' };

export default function NuevoTataPage() {
  return (
    <>
      <AppBar title="Nuevo tata" subtitle="Los datos que en una urgencia importan" backHref="/app" />
      <Content>
        <TataForm action={crearTata} submitLabel="Crear ficha" />
      </Content>
    </>
  );
}
