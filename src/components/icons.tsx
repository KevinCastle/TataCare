import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true,
    ...props,
  } as const;
}

/** Marca: techo + corazón */
export function LogoMark({ size = 32, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <path d="M6 16 16 7l10 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M16 25.5s-5.5-3.6-5.5-7.4A3.1 3.1 0 0 1 16 15.9a3.1 3.1 0 0 1 5.5 2.2c0 3.8-5.5 7.4-5.5 7.4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconFicha(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="3.5" width="16" height="17" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="2" />
      <path d="M8 16.5c1-1.6 2.4-2.3 4-2.3s3 .7 4 2.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconPill(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.2" y="9" width="17.6" height="7.5" rx="3.75" stroke="currentColor" strokeWidth="2" transform="rotate(-32 12 12.75)" />
      <path d="M9.4 8.4l5 6.8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconSalud(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20s-7-4.4-7-9.3A3.9 3.9 0 0 1 12 8.4a3.9 3.9 0 0 1 7 2.3C19 15.6 12 20 12 20z" stroke="currentColor" strokeWidth="2" />
      <path d="M7.5 12h2.5l1.2-2.2 1.6 3.6 1.2-1.4h2.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function IconNota(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M9 9h6M9 12.5h6M9 16h3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconMas(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="5.5" cy="12" r="1.8" fill="currentColor" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <circle cx="18.5" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
}

export function IconTel(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M7.1 4.2 9 6.6a1.6 1.6 0 0 1-.2 2.2L7.6 10a12.3 12.3 0 0 0 6.4 6.4l1.2-1.2a1.6 1.6 0 0 1 2.2-.2l2.4 1.9a1.6 1.6 0 0 1 .2 2.4l-1.1 1.1c-1 1-2.6 1.4-4 .8A19.6 19.6 0 0 1 4.7 11c-.6-1.4-.2-3 .8-4l1.1-1.1a1.6 1.6 0 0 1 .5.3z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconStar({ filled = true, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(props)}>
      <path
        d="M12 3.6l2.5 5.1 5.6.8-4 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4-4 5.6-.8z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconHeart({ filled = true, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(props)}>
      <path
        d="M12 20.5s-7.5-4.8-7.5-10A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.5c0 5.2-7.5 10-7.5 10z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 2}
      />
    </svg>
  );
}

export function IconChevron(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 6 9 12l5.5 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12.5 10 18 19.5 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 2.5 20h19z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 9.5v4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function IconDrop(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5c3.2 4 6 7.2 6 10.5a6 6 0 1 1-12 0c0-3.3 2.8-6.5 6-10.5z" fill="currentColor" />
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconFolder(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M3.5 7A2.5 2.5 0 0 1 6 4.5h3.2c.7 0 1.4.3 1.9.9l1 1.1H18A2.5 2.5 0 0 1 20.5 9v8A2.5 2.5 0 0 1 18 19.5H6A2.5 2.5 0 0 1 3.5 17z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function IconShare(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="6" cy="12" r="2.6" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="5.5" r="2.6" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="18.5" r="2.6" stroke="currentColor" strokeWidth="2" />
      <path d="m8.4 10.7 6.8-4M8.4 13.3l6.8 4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8.5" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path d="M3.5 19.5c1.1-2.9 3.1-4.4 5.5-4.4s4.4 1.5 5.5 4.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15.5 5.6a2.9 2.9 0 1 1 1.8 5.4M17 15.2c1.9.4 3 1.7 3.6 3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconDoc(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 3.5V8h4.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconEdit(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m14.5 5.5 4 4L8 20H4v-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m12.5 7.5 4 4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 6.5h14M9.5 6V4.5h5V6M7 6.5l.8 13a1 1 0 0 0 1 .9h6.4a1 1 0 0 0 1-.9l.8-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10.5v6M14 10.5v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconEye(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
