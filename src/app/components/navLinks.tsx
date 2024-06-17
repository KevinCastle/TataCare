'use client';

import {
  Heart, Heartbeat, IdentificationCard, Siren,
} from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';
import { Link } from '@nextui-org/react';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Ficha', href: '/ficha', icon: IdentificationCard },
  { name: 'Detalles de salud', href: '/salud', icon: Heartbeat },
  { name: 'Contactos de emergencia', href: '/contactos', icon: Siren },
  { name: 'Gustos', href: '/gustos', icon: Heart },
];

export default function NavLinks({ id }: { id: string }) {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            isBlock
            key={link.name}
            href={`/app/${id}${link.href}`}
            className={clsx(
              'flex flex-col lg:flex-row lg:h-[48px] grow items-center justify-start gap-2 rounded-lg p-2 xs:p-3 hover:bg-sky-100 lg:flex-none lg:justify-start lg:p-2 lg:px-3',
              {
                'bg-sky-100': pathname === link.href,
              },
            )}
          >
            <LinkIcon size={24} className="lg:mr-2" color="#006FEE" />
            <p className={clsx('text-sm lg:text-lg font-medium text-center lg:text-start text-zinc-900', { 'text-blue-600': pathname === link.href })}>
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}
