import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { accesoAlTata } from '@/lib/access';
import { db } from '@/lib/db';
import { editarContacto, eliminarContacto } from '@/lib/actions/contacts';
import { ContactoForm } from '@/components/contacto-form';
import { AppBar, Content } from '@/components/shell';
import { ConfirmSubmit } from '@/components/ui-client';

export const metadata: Metadata = { title: 'Editar contacto' };

export default async function EditarContactoPage({
  params,
}: {
  params: Promise<{ elderId: string; contactoId: string }>;
}) {
  const { elderId, contactoId } = await params;
  const { elder } = await accesoAlTata(elderId, 'EDITOR');

  const contacto = await db.contact.findFirst({ where: { id: contactoId, elderId } });
  if (!contacto) notFound();

  return (
    <>
      <AppBar title="Editar contacto" subtitle={elder.name} backHref={`/app/${elderId}/contactos`} />
      <Content>
        <ContactoForm action={editarContacto.bind(null, elderId, contactoId)} defaults={contacto} submitLabel="Guardar cambios" />
        <form action={eliminarContacto.bind(null, elderId, contactoId)} className="mt-8 border-t border-linea pt-5">
          <ConfirmSubmit confirmText={`Sí, eliminar a ${contacto.name}`}>Eliminar contacto</ConfirmSubmit>
        </form>
      </Content>
    </>
  );
}
