'use client';

import {
  ChatCircle,
  Heart, Heartbeat, IdentificationCard, Pill, Siren,
} from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';
import { Link } from '@nextui-org/react';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();
  const id = pathname.split('/')[2];
  const splittedPathname = pathname.split('/');
  const route = `/${splittedPathname[splittedPathname.length - 1]}` === `/${id}` ? '/' : `/${splittedPathname[splittedPathname.length - 1]}`;

  const links = [
    { name: 'Ficha', href: '/', icon: IdentificationCard },
    { name: 'Medicamentos', href: '/medicamentos', icon: Pill },
    { name: 'Detalles de salud', href: '/salud', icon: Heartbeat },
    { name: 'Contactos de emergencia', href: '/contactos', icon: Siren },
    { name: 'Gustos', href: '/gustos', icon: Heart },
    { name: 'Comentarios', href: '/comentarios', icon: ChatCircle },
  ];

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
                'bg-sky-100': route === link.href,
              },
            )}
          >
            <LinkIcon size={24} className="lg:mr-2" color="#006FEE" />
            <p className={clsx('text-sm lg:text-lg font-medium text-center lg:text-start', { 'text-blue-600': route === link.href, 'text-zinc-900': route !== link.href })}>
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}
