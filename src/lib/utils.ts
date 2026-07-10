export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function edad(birthdate: Date): number {
  const hoy = new Date();
  let años = hoy.getFullYear() - birthdate.getFullYear();
  const m = hoy.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < birthdate.getDate())) años -= 1;
  return años;
}

export function iniciales(name: string, surname?: string | null) {
  return `${name.charAt(0)}${surname?.charAt(0) ?? ''}`.toUpperCase();
}

const fechaLarga = new Intl.DateTimeFormat('es-CL', {
  day: 'numeric',
  month: 'long',
  timeZone: 'America/Santiago',
});

const fechaCompleta = new Intl.DateTimeFormat('es-CL', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'America/Santiago',
});

const fechaCorta = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'America/Santiago',
});

export function formatoFechaLarga(d: Date) {
  return fechaLarga.format(d);
}

export function formatoFechaCompleta(d: Date) {
  return fechaCompleta.format(d);
}

export function formatoFechaCorta(d: Date) {
  return fechaCorta.format(d);
}

/** Días que faltan hasta `end` (negativo si ya pasó). */
export function diasRestantes(end: Date): number {
  const msPorDia = 24 * 60 * 60 * 1000;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fin = new Date(end);
  fin.setHours(0, 0, 0, 0);
  return Math.round((fin.getTime() - hoy.getTime()) / msPorDia);
}

export function saludo(): string {
  const hora = Number(
    new Intl.DateTimeFormat('es-CL', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'America/Santiago',
    }).format(new Date()),
  );
  if (hora < 12) return 'Buenos días';
  if (hora < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

const fechaHora = new Intl.DateTimeFormat('es-CL', {
  weekday: 'long',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Santiago',
});

export function formatoFechaHora(d: Date) {
  return fechaHora.format(d);
}

/** YYYY-MM-DD local (America/Santiago) para inputs date y claves de turno. */
export function fechaISO(d: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' }).format(d);
}
