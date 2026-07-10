import type { Metadata } from 'next';
import Link from 'next/link';
import { accesoAlTata } from '@/lib/access';
import { cerrarSesion } from '@/lib/actions/auth';
import { AppBar, Content } from '@/components/shell';
import { Chip } from '@/components/ui';
import {
  IconCalendar,
  IconChevron,
  IconEdit,
  IconEye,
  IconFolder,
  IconHeart,
  IconShare,
  IconUsers,
} from '@/components/icons';

export const metadata: Metadata = { title: 'Más' };

const ROLES: Record<string, string> = { OWNER: 'Dueño/a', EDITOR: 'Editor/a', VIEWER: 'Lector/a' };

export default async function MasPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder, role } = await accesoAlTata(elderId);

  const items = [
    { href: `/app/${elderId}/contactos`, Icon: IconUsers, titulo: 'Contactos de emergencia', texto: 'A quién llamar y dónde' },
    { href: `/app/${elderId}/gustos`, Icon: IconHeart, titulo: 'Gustos y mañas', texto: `Para conocer a ${elder.name}` },
    { href: `/app/${elderId}/carpeta`, Icon: IconFolder, titulo: 'Carpeta médica', texto: 'Exámenes, recetas y epicrisis' },
    { href: `/app/${elderId}/turnos`, Icon: IconCalendar, titulo: 'Turnos', texto: 'Quién cuida cada día' },
    { href: `/app/${elderId}/compartir`, Icon: IconShare, titulo: 'Compartir', texto: 'Cuidadores y acceso médico' },
    { href: `/app/espejo/${elderId}`, Icon: IconEye, titulo: 'Modo espejo', texto: `La vista para ${elder.name}, en letra gigante` },
    { href: `/app/${elderId}/editar`, Icon: IconEdit, titulo: 'Editar ficha', texto: 'Datos personales y legales' },
  ];

  return (
    <>
      <AppBar
        title="Más"
        subtitle={`${elder.name} ${elder.surname}`}
        backHref={`/app/${elderId}`}
        right={<Chip tone="niebla">Eres {ROLES[role]}</Chip>}
      />
      <Content>
        <ul className="flex flex-col gap-2.5">
          {items.map(({ href, Icon, titulo, texto }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex min-h-16 items-center gap-3.5 rounded-(--radius-card) border border-linea bg-crema px-4 py-3 transition-colors hover:border-pino"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-pino/10 text-pino-oscuro">
                  <Icon size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{titulo}</span>
                  <span className="block text-[0.85rem] text-niebla">{texto}</span>
                </span>
                <IconChevron size={18} className="rotate-180 text-niebla" />
              </Link>
            </li>
          ))}
        </ul>
        <form action={cerrarSesion} className="mt-8 text-center">
          <button type="submit" className="min-h-12 rounded-xl px-5 font-bold text-niebla hover:bg-pino/10 hover:text-tinta">
            Cerrar sesión
          </button>
        </form>
      </Content>
    </>
  );
}
