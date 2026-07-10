'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconFicha, IconMas, IconNota, IconPill, IconSalud } from '@/components/icons';
import { cn } from '@/lib/utils';

const TABS = [
  { slug: '', nombre: 'Ficha', Icon: IconFicha },
  { slug: 'remedios', nombre: 'Remedios', Icon: IconPill },
  { slug: 'salud', nombre: 'Salud', Icon: IconSalud },
  { slug: 'bitacora', nombre: 'Bitácora', Icon: IconNota },
  { slug: 'mas', nombre: 'Más', Icon: IconMas },
];

/** Rutas que cuelgan de la pestaña "Más". */
const RUTAS_MAS = ['mas', 'contactos', 'gustos', 'carpeta', 'turnos', 'compartir'];

/**
 * Navegación del tata: pestañas inferiores en el teléfono,
 * riel lateral izquierdo en pantallas grandes.
 */
export function TabBar({ elderId }: { elderId: string }) {
  const pathname = usePathname();
  const seccion = pathname.split('/')[3] ?? '';

  function activa(slug: string) {
    if (slug === 'mas') return RUTAS_MAS.includes(seccion);
    if (slug === '') return seccion === '' || seccion === 'editar' || seccion === 'urgencia';
    return seccion === slug;
  }

  return (
    <nav
      aria-label="Secciones del tata"
      className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-linea bg-crema lg:inset-x-auto lg:left-0 lg:top-0 lg:h-full lg:w-52 lg:border-r lg:border-t-0 lg:pt-24"
    >
      <ul className="flex lg:flex-col lg:gap-1 lg:px-3">
        {TABS.map(({ slug, nombre, Icon }) => {
          const on = activa(slug);
          return (
            <li key={nombre} className="flex-1 lg:flex-none">
              <Link
                href={`/app/${elderId}${slug ? `/${slug}` : ''}`}
                aria-current={on ? 'page' : undefined}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl text-[0.72rem] font-bold lg:min-h-12 lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:text-base',
                  on ? 'text-pino-oscuro lg:bg-pino/10' : 'text-niebla hover:text-tinta',
                )}
              >
                <Icon size={22} />
                {nombre}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
