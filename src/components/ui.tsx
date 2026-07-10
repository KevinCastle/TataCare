import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { IconAlert } from '@/components/icons';

/* ---------- Botones ---------- */

const btnBase =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-(--radius-control) px-5 font-bold transition-colors disabled:opacity-50';

const btnVariants = {
  primary: 'bg-pino text-white hover:bg-pino-oscuro',
  ghost: 'border-2 border-pino text-pino-oscuro hover:bg-pino/10',
  danger: 'bg-alerta text-white hover:opacity-90',
  quiet: 'text-pino-oscuro hover:bg-pino/10',
} as const;

type Variant = keyof typeof btnVariants;

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(btnBase, btnVariants[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = 'primary',
  className,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; href: string }) {
  return <Link href={href} className={cn(btnBase, btnVariants[variant], className)} {...props} />;
}

/* ---------- Superficies ---------- */

export function Card({ className, ...props }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-(--radius-card) border border-linea bg-crema p-4', className)} {...props} />;
}

export function CardLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        'block rounded-(--radius-card) border border-linea bg-crema p-4 transition-colors hover:border-pino focus-visible:border-pino',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function AlertCard({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-(--radius-card) border-2 border-alerta bg-alerta/5 p-4" role="alert">
      <IconAlert size={22} className="mt-0.5 shrink-0 text-alerta" />
      <div>
        <p className="font-bold text-alerta">{title}</p>
        {children ? <div className="text-[0.95rem]">{children}</div> : null}
      </div>
    </div>
  );
}

/* ---------- Texto y etiquetas ---------- */

export function SectionLabel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <h2 className={cn('text-[0.8rem] font-bold uppercase tracking-[0.12em] text-niebla', className)}>{children}</h2>
  );
}

const chipTones = {
  pino: 'bg-pino/10 text-pino-oscuro',
  alerta: 'bg-alerta/10 text-alerta',
  aviso: 'bg-aviso/10 text-aviso',
  bien: 'bg-bien/10 text-bien',
  niebla: 'bg-niebla/15 text-niebla',
  copihue: 'bg-copihue/10 text-copihue',
} as const;

export function Chip({
  tone = 'pino',
  className,
  children,
}: {
  tone?: keyof typeof chipTones;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.85rem] font-bold',
        chipTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Avatar ---------- */

const avatarSizes = {
  sm: 'size-8 text-[0.8rem]',
  md: 'size-11 text-base',
  lg: 'size-16 text-xl',
} as const;

export function Avatar({
  initials,
  imageUrl,
  size = 'md',
  tone = 'pino',
  className,
}: {
  initials: string;
  imageUrl?: string | null;
  size?: keyof typeof avatarSizes;
  tone?: 'pino' | 'copihue' | 'aviso' | 'niebla';
  className?: string;
}) {
  const tones = {
    pino: 'bg-pino',
    copihue: 'bg-copihue',
    aviso: 'bg-aviso',
    niebla: 'bg-niebla',
  };
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt=""
        className={cn('shrink-0 rounded-full object-cover', avatarSizes[size], className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-bold text-white',
        avatarSizes[size],
        tones[tone],
        className,
      )}
    >
      {initials}
    </span>
  );
}

/* ---------- Formularios ---------- */

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[0.8rem] font-bold uppercase tracking-[0.12em] text-niebla">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-[0.85rem] text-niebla">{hint}</p> : null}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-[0.9rem] font-bold text-alerta" role="alert">
          <IconAlert size={15} /> {error}
        </p>
      ) : null}
    </div>
  );
}

const controlBase =
  'w-full rounded-(--radius-control) border-[1.5px] border-linea bg-crema px-3.5 py-3 text-tinta placeholder:text-niebla/80 aria-invalid:border-alerta';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlBase, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlBase, 'min-h-28', className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(controlBase, 'min-h-12 appearance-none', className)} {...props}>
      {children}
    </select>
  );
}

/** Checkbox estilizado accesible (CSS puro, sin JS). */
export function CheckRow({
  name,
  label,
  description,
  defaultChecked,
  icon,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
  icon?: ReactNode;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-(--radius-control) border-[1.5px] border-linea bg-crema px-3.5 py-3 has-checked:border-pino has-checked:bg-pino/5">
      {icon}
      <span className="flex-1">
        <span className="font-bold">{label}</span>
        {description ? <span className="block text-[0.85rem] text-niebla">{description}</span> : null}
      </span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        aria-hidden
        className="relative h-7 w-12 shrink-0 rounded-full bg-niebla/40 transition-colors after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-pino peer-checked:after:translate-x-5"
      />
    </label>
  );
}

/* ---------- Estados vacíos ---------- */

export function EmptyState({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-(--radius-card) border-2 border-dashed border-linea px-6 py-10 text-center">
      <span className="text-niebla">{icon}</span>
      <p className="font-bold">{title}</p>
      {children ? <p className="max-w-[32ch] text-[0.95rem] text-niebla">{children}</p> : null}
    </div>
  );
}

/* ---------- FAB ---------- */

export function Fab({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="fixed bottom-24 right-5 z-40 flex size-14 items-center justify-center rounded-2xl bg-pino text-white shadow-lg shadow-pino/30 hover:bg-pino-oscuro lg:bottom-8"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </Link>
  );
}
