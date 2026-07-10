'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconTel, LogoMark } from '@/components/icons';

type Remedio = { id: string; nombre: string; dose: string; cadaHoras: number };
type Contacto = { nombre: string; rol: string; telefono: string };

const fechaLarga = new Intl.DateTimeFormat('es-CL', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

function claveEspejo(elderId: string) {
  return `tatacare-espejo-pin-${elderId}`;
}

/** Teclado numérico grande para definir o pedir el PIN del cuidador. */
function TecladoPin({
  titulo,
  subtitulo,
  onCompleto,
  error,
}: {
  titulo: string;
  subtitulo: string;
  onCompleto: (pin: string) => void;
  error?: string | null;
}) {
  const [pin, setPin] = useState('');

  function agregar(digito: string) {
    const nuevo = pin + digito;
    setPin(nuevo);
    if (nuevo.length === 4) {
      onCompleto(nuevo);
      setPin('');
    }
  }

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{titulo}</h1>
        <p className="mt-1 text-niebla">{subtitulo}</p>
      </div>
      <div className="flex gap-3" aria-label={`PIN: ${pin.length} de 4 dígitos`} role="status">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`size-4 rounded-full ${i < pin.length ? 'bg-pino' : 'bg-linea'}`} aria-hidden />
        ))}
      </div>
      {error ? (
        <p className="font-bold text-alerta" role="alert">
          {error}
        </p>
      ) : null}
      <div className="grid w-full grid-cols-3 gap-2.5">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((tecla, i) =>
          tecla === '' ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => (tecla === '⌫' ? setPin((p) => p.slice(0, -1)) : agregar(tecla))}
              aria-label={tecla === '⌫' ? 'Borrar' : tecla}
              className="flex min-h-16 items-center justify-center rounded-2xl border border-linea bg-crema text-2xl font-bold hover:border-pino"
            >
              {tecla}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

export function EspejoView({
  elderId,
  nombre,
  cuidadorHoy,
  remedios,
  contacto,
}: {
  elderId: string;
  nombre: string;
  cuidadorHoy: string | null;
  remedios: Remedio[];
  contacto: Contacto | null;
}) {
  const router = useRouter();
  const [fase, setFase] = useState<'cargando' | 'definir-pin' | 'espejo' | 'pedir-pin'>('cargando');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFase(localStorage.getItem(claveEspejo(elderId)) ? 'espejo' : 'definir-pin');
  }, [elderId]);

  if (fase === 'cargando') return null;

  if (fase === 'definir-pin') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5">
        <TecladoPin
          titulo="Define un PIN de salida"
          subtitulo="Solo el cuidador podrá salir del modo espejo con este PIN de 4 dígitos"
          onCompleto={(pin) => {
            localStorage.setItem(claveEspejo(elderId), pin);
            setFase('espejo');
          }}
        />
      </div>
    );
  }

  if (fase === 'pedir-pin') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5">
        <TecladoPin
          titulo="PIN del cuidador"
          subtitulo="Para salir del modo espejo"
          error={error}
          onCompleto={(pin) => {
            if (pin === localStorage.getItem(claveEspejo(elderId))) {
              localStorage.removeItem(claveEspejo(elderId));
              router.push(`/app/${elderId}/mas`);
            } else {
              setError('Ese PIN no es — intenta de nuevo');
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            setError(null);
            setFase('espejo');
          }}
          className="mt-6 min-h-12 rounded-xl px-4 font-bold text-niebla"
        >
          Volver al espejo
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-6 px-6 py-8">
      <header className="text-center">
        <p className="text-xl capitalize text-niebla">{fechaLarga.format(new Date())}</p>
        <h1 className="mt-1 text-4xl font-bold leading-tight">Hola, {nombre} 👋</h1>
        {cuidadorHoy ? (
          <p className="mt-3 rounded-2xl bg-pino/10 px-4 py-3 text-2xl text-pino-oscuro">
            Hoy te acompaña <span className="font-bold">{cuidadorHoy}</span>
          </p>
        ) : null}
      </header>

      {remedios.length > 0 ? (
        <section aria-labelledby="tus-remedios" className="flex flex-col gap-3">
          <h2 id="tus-remedios" className="text-center text-lg font-bold uppercase tracking-[0.14em] text-niebla">
            Tus remedios de hoy
          </h2>
          {remedios.map((r) => (
            <div key={r.id} className="rounded-2xl border border-linea bg-crema px-5 py-4">
              <p className="text-2xl font-bold leading-tight">
                {r.nombre} <span className="text-pino-oscuro">{r.dose}</span>
              </p>
              <p className="text-xl text-niebla">cada {r.cadaHoras} horas</p>
            </div>
          ))}
        </section>
      ) : null}

      <div className="mt-auto flex flex-col gap-4 pb-2">
        {contacto ? (
          <a
            href={`tel:${contacto.telefono.replace(/\s/g, '')}`}
            className="flex min-h-20 items-center justify-center gap-3 rounded-3xl bg-pino px-6 text-2xl font-bold text-white"
          >
            <IconTel size={28} /> Llamar a {contacto.nombre}
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => setFase('pedir-pin')}
          className="mx-auto flex min-h-12 items-center gap-2 rounded-xl px-4 text-[0.9rem] font-bold text-niebla/70 hover:text-tinta"
        >
          <LogoMark size={16} /> Soy el cuidador
        </button>
      </div>
    </div>
  );
}
