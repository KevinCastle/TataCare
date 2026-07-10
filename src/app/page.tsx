import Link from 'next/link';
import { IconCalendar, IconFicha, IconNota, IconPill, IconSalud, IconUsers, LogoMark } from '@/components/icons';
import { ButtonLink } from '@/components/ui';

const FEATURES = [
  {
    Icon: IconFicha,
    titulo: 'La ficha de urgencia',
    texto: 'Tipo de sangre, alergias y el contacto prioritario en el primer vistazo, sin buscar.',
  },
  {
    Icon: IconPill,
    titulo: 'Sus remedios, claros',
    texto: 'Dosis, horarios, farmacia y cuántos días quedan de tratamiento — calculado solo.',
  },
  {
    Icon: IconSalud,
    titulo: 'Alergias y diagnósticos',
    texto: 'La respuesta a "¿es alérgico a algo?" cuando más se necesita.',
  },
  {
    Icon: IconNota,
    titulo: 'Bitácora compartida',
    texto: 'Cada cuidador deja cómo estuvo el día. El siguiente turno llega sabiendo.',
  },
  {
    Icon: IconUsers,
    titulo: 'Cuidar entre varios',
    texto: 'Invita a tu familia con distintos permisos, y dale acceso temporal al médico.',
  },
  {
    Icon: IconCalendar,
    titulo: 'Turnos sin enredos',
    texto: 'Quién cuida hoy, quién mañana — sin perseguir el grupo de WhatsApp.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-5 py-5">
        <p className="flex items-center gap-2 text-xl font-bold">
          <span className="flex size-10 items-center justify-center rounded-xl bg-pino text-papel">
            <LogoMark size={24} />
          </span>
          Tata<span className="-ml-1 text-pino-oscuro">Care</span>
        </p>
        <Link href="/login" className="flex min-h-12 items-center rounded-xl px-4 font-bold text-pino-oscuro hover:bg-pino/10">
          Iniciar sesión
        </Link>
      </header>

      <main id="contenido" className="mx-auto w-full max-w-4xl px-5">
        <section className="py-14 text-center lg:py-20">
          <h1 className="mx-auto max-w-[22ch] text-balance text-4xl font-bold leading-tight lg:text-5xl">
            Cuidar bajo un mismo techo
          </h1>
          <p className="mx-auto mt-5 max-w-[48ch] text-pretty text-lg text-niebla">
            Todo lo que tu familia necesita saber sobre la persona que cuida — remedios, alergias,
            contactos de emergencia y cómo estuvo su día — en un solo lugar, para todos los que cuidan.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/registro" className="px-8 text-lg">
              Crear cuenta gratis
            </ButtonLink>
            <ButtonLink href="/login" variant="ghost">
              Ya tengo cuenta
            </ButtonLink>
          </div>
        </section>

        <section aria-labelledby="que-hace" className="pb-16">
          <h2 id="que-hace" className="sr-only">
            Qué hace TataCare
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, titulo, texto }) => (
              <li key={titulo} className="rounded-2xl border border-linea bg-crema p-5">
                <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-pino/10 text-pino-oscuro">
                  <Icon size={24} />
                </span>
                <h3 className="font-bold">{titulo}</h3>
                <p className="mt-1 text-[0.95rem] text-niebla">{texto}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16 rounded-3xl bg-pino px-6 py-12 text-center text-white">
          <h2 className="text-balance text-2xl font-bold lg:text-3xl">
            Hecha para las manos y los ojos de toda la familia
          </h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-pretty text-white/85">
            Letra grande y legible, botones que se pueden tocar sin apuntar, y colores que avisan sin
            confundir. Diseñada primero para el teléfono — y para cuidadores de cualquier edad.
          </p>
          <div className="mt-7">
            <Link
              href="/registro"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-papel px-8 text-lg font-bold text-pino-oscuro hover:bg-white"
            >
              Empezar ahora
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-linea py-8 text-center text-[0.9rem] text-niebla">
        <p>TataCare · Cuidar a tus seres queridos nunca fue tan fácil</p>
      </footer>
    </div>
  );
}
