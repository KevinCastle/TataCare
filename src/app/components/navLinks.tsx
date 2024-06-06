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
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100': pathname === link.href,
              },
            )}
          >
            <LinkIcon size={24} className="mr-2" color="#006FEE" />
            <p className={clsx('text-lg font-medium text-zinc-900', { 'text-blue-600': pathname === link.href })}>
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}
