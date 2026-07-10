import type { Metadata } from 'next';
import Link from 'next/link';
import { accesoAlTata, puedeEditar } from '@/lib/access';
import { db } from '@/lib/db';
import { iniciales } from '@/lib/utils';
import { marcarPrioritario } from '@/lib/actions/contacts';
import { AppBar, Content } from '@/components/shell';
import { Avatar, Card, Chip, EmptyState, Fab } from '@/components/ui';
import { IconHeart, IconTel, IconUsers } from '@/components/icons';

export const metadata: Metadata = { title: 'Contactos' };

export default async function ContactosPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder, role } = await accesoAlTata(elderId);
  const contactos = await db.contact.findMany({ where: { elderId }, orderBy: { name: 'asc' } });
  const editor = puedeEditar(role);

  return (
    <>
      <AppBar title="Contactos" subtitle={`Emergencias de ${elder.name}`} backHref={`/app/${elderId}/mas`} />
      <Content>
        <div className="flex flex-col gap-3">
          {contactos.length === 0 ? (
            <EmptyState icon={<IconUsers size={34} />} title="Sin contactos de emergencia">
              Agrega a quién llamar si algo pasa: familiares, el doctor de cabecera, la clínica más cercana.
            </EmptyState>
          ) : (
            contactos.map((c) => {
              const prioritario = c.id === elder.favoriteContactId;
              return (
                <Card key={c.id} className="p-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar initials={iniciales(c.name)} size="md" tone={prioritario ? 'copihue' : 'niebla'} />
                    <div className="min-w-0 flex-1">
                      {editor ? (
                        <Link href={`/app/${elderId}/contactos/${c.id}/editar`} className="font-bold underline-offset-4 hover:underline">
                          {c.name}
                        </Link>
                      ) : (
                        <p className="font-bold">{c.name}</p>
                      )}
                      <p className="text-[0.85rem] text-niebla">
                        {c.role}
                        {c.address ? ` · ${c.address}` : ''}
                      </p>
                    </div>
                    {editor ? (
                      <form action={marcarPrioritario.bind(null, elderId, c.id)}>
                        <button
                          type="submit"
                          aria-label={prioritario ? `${c.name} es el contacto prioritario` : `Marcar a ${c.name} como prioritario`}
                          aria-pressed={prioritario}
                          className="flex size-12 items-center justify-center rounded-full hover:bg-copihue/10"
                        >
                          <IconHeart size={20} filled={prioritario} className={prioritario ? 'text-copihue' : 'text-niebla/50'} />
                        </button>
                      </form>
                    ) : prioritario ? (
                      <IconHeart size={20} className="text-copihue" />
                    ) : null}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href={`tel:${c.phone.replace(/\s/g, '')}`}
                      className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-(--radius-control) bg-pino font-bold text-white hover:bg-pino-oscuro"
                    >
                      <IconTel size={17} /> {c.phone}
                    </a>
                    {prioritario ? <Chip tone="copihue">Prioritario</Chip> : null}
                  </div>
                </Card>
              );
            })
          )}
          {contactos.length > 0 ? (
            <p className="text-[0.85rem] text-niebla">♥ = prioritario: aparece en la ficha y en el modo urgencia.</p>
          ) : null}
        </div>
        {editor ? <Fab href={`/app/${elderId}/contactos/nuevo`} label="Agregar contacto" /> : null}
      </Content>
    </>
  );
}
