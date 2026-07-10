import Link from 'next/link';
import type { ReactNode } from 'react';
import { IconChevron } from '@/components/icons';

/**
 * Barra superior de las vistas internas.
 * En desktop el contenido vive en una columna centrada (ver layouts).
 */
export function AppBar({
  title,
  subtitle,
  backHref,
  right,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  right?: ReactNode;
}) {
  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-linea bg-papel/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-xl items-center gap-3 px-4 py-2">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="Volver"
            className="flex size-12 shrink-0 items-center justify-center rounded-full border border-linea bg-crema text-tinta"
          >
            <IconChevron size={20} />
          </Link>
        ) : null}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold leading-tight">{title}</h1>
          {subtitle ? <p className="truncate text-[0.9rem] text-niebla">{subtitle}</p> : null}
        </div>
        {right}
      </div>
    </header>
  );
}

/** Columna de contenido: ancho de teléfono, centrada en pantallas grandes. */
export function Content({ children }: { children: ReactNode }) {
  return (
    <main id="contenido" className="mx-auto w-full max-w-xl flex-1 px-4 pb-32 pt-4 lg:pb-10">
      {children}
    </main>
  );
}
