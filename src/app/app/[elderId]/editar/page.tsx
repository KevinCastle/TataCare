import type { Metadata } from 'next';
import { accesoAlTata } from '@/lib/access';
import { editarTata, eliminarTata } from '@/lib/actions/elders';
import { TataForm } from '@/components/tata-form';
import { AppBar, Content } from '@/components/shell';
import { ConfirmSubmit } from '@/components/ui-client';
import { SectionLabel } from '@/components/ui';

export const metadata: Metadata = { title: 'Editar ficha' };

export default async function EditarTataPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder, role } = await accesoAlTata(elderId, 'EDITOR');

  return (
    <>
      <AppBar title="Editar ficha" subtitle={`${elder.name} ${elder.surname}`} backHref={`/app/${elderId}`} />
      <Content>
        <TataForm action={editarTata.bind(null, elderId)} defaults={elder} submitLabel="Guardar cambios" />

        {role === 'OWNER' ? (
          <section className="mt-10 border-t border-linea pt-6">
            <SectionLabel>Zona delicada</SectionLabel>
            <p className="mb-3 mt-2 text-[0.9rem] text-niebla">
              Eliminar la ficha borra sus remedios, bitácora y documentos para todos los cuidadores. No se puede
              deshacer.
            </p>
            <form action={eliminarTata.bind(null, elderId)}>
              <ConfirmSubmit confirmText={`Sí, eliminar a ${elder.name}`}>Eliminar esta ficha</ConfirmSubmit>
            </form>
          </section>
        ) : null}
      </Content>
    </>
  );
}
