import type { Metadata } from 'next';
import { accesoAlTata } from '@/lib/access';
import { crearContacto } from '@/lib/actions/contacts';
import { ContactoForm } from '@/components/contacto-form';
import { AppBar, Content } from '@/components/shell';

export const metadata: Metadata = { title: 'Nuevo contacto' };

export default async function NuevoContactoPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder } = await accesoAlTata(elderId, 'EDITOR');

  return (
    <>
      <AppBar title="Nuevo contacto" subtitle={elder.name} backHref={`/app/${elderId}/contactos`} />
      <Content>
        <ContactoForm action={crearContacto.bind(null, elderId)} submitLabel="Guardar contacto" />
      </Content>
    </>
  );
}
