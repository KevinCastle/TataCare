'use client';

import { useState, type ReactNode } from 'react';
import { IconHeart, IconStar } from '@/components/icons';
import { cn } from '@/lib/utils';

/** Rating de estrellas accesible: radiogroup nativo con estrellas visibles. */
export function StarsInput({
  name,
  label,
  defaultValue = 0,
}: {
  name: string;
  label: string;
  defaultValue?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <fieldset>
      <legend className="mb-1.5 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-niebla">{label}</legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className={cn(
              'flex size-12 cursor-pointer items-center justify-center rounded-xl has-focus-visible:outline-3 has-focus-visible:outline-pino',
              n <= value ? 'text-aviso' : 'text-linea',
            )}
          >
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => setValue(n)}
              className="sr-only"
              aria-label={`${n} de 5`}
            />
            <IconStar size={30} filled={n <= value} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const EMOCIONES = [
  { valor: 1, emoji: '😞', texto: 'Muy decaído' },
  { valor: 2, emoji: '😕', texto: 'Decaído' },
  { valor: 3, emoji: '😐', texto: 'Normal' },
  { valor: 4, emoji: '🙂', texto: 'Contento' },
  { valor: 5, emoji: '😄', texto: 'Muy contento' },
];

export function EmojiInput({
  name,
  label,
  defaultValue = 0,
}: {
  name: string;
  label: string;
  defaultValue?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const actual = EMOCIONES.find((e) => e.valor === value);
  return (
    <fieldset>
      <legend className="mb-1.5 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-niebla">{label}</legend>
      <div className="flex justify-between">
        {EMOCIONES.map((e) => (
          <label
            key={e.valor}
            className={cn(
              'flex size-12 cursor-pointer items-center justify-center rounded-full border-2 text-2xl has-focus-visible:outline-3 has-focus-visible:outline-pino',
              value === e.valor ? 'border-pino bg-pino/10' : 'border-linea bg-crema',
            )}
            title={e.texto}
          >
            <input
              type="radio"
              name={name}
              value={e.valor}
              checked={value === e.valor}
              onChange={() => setValue(e.valor)}
              className="sr-only"
              aria-label={e.texto}
            />
            <span aria-hidden>{e.emoji}</span>
          </label>
        ))}
      </div>
      <p className="mt-1.5 min-h-5 text-[0.85rem] text-niebla" aria-live="polite">
        {actual?.texto ?? ''}
      </p>
    </fieldset>
  );
}

/** Stepper numérico: evita el teclado para valores como "cada N horas". */
export function Stepper({
  name,
  label,
  unit,
  min = 1,
  max = 48,
  step = 1,
  defaultValue,
}: {
  name: string;
  label: string;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div>
      <span className="mb-1.5 block text-[0.8rem] font-bold uppercase tracking-[0.12em] text-niebla">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setValue((v) => Math.max(min, v - step))}
          className="flex size-12 items-center justify-center rounded-full border-2 border-pino text-xl font-bold text-pino-oscuro"
          aria-label={`Disminuir ${label.toLowerCase()}`}
        >
          −
        </button>
        <output name={`${name}-visible`} className="min-w-16 text-center text-xl font-bold" aria-live="polite">
          {value} {unit}
        </output>
        <button
          type="button"
          onClick={() => setValue((v) => Math.min(max, v + step))}
          className="flex size-12 items-center justify-center rounded-full border-2 border-pino text-xl font-bold text-pino-oscuro"
          aria-label={`Aumentar ${label.toLowerCase()}`}
        >
          +
        </button>
        <input type="hidden" name={name} value={value} />
      </div>
    </div>
  );
}

/** Botón de favorito (corazón copihue) que envía el form que lo contiene. */
export function HeartToggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(Boolean(defaultChecked));
  return (
    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-(--radius-control) border-[1.5px] border-linea bg-crema px-3.5 py-3">
      <span className={checked ? 'text-copihue' : 'text-linea'}>
        <IconHeart size={22} filled={checked} />
      </span>
      <span className="flex-1 font-bold">{label}</span>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:transition-transform',
          checked ? 'bg-pino after:translate-x-5' : 'bg-niebla/40',
        )}
      />
    </label>
  );
}

/** Submit destructivo con confirmación en dos pasos (sin dialog nativo). */
export function ConfirmSubmit({ children, confirmText }: { children: ReactNode; confirmText: string }) {
  const [arming, setArming] = useState(false);
  if (!arming) {
    return (
      <button
        type="button"
        onClick={() => setArming(true)}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-(--radius-control) px-5 font-bold text-alerta hover:bg-alerta/10"
      >
        {children}
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center rounded-(--radius-control) bg-alerta px-5 font-bold text-white"
      >
        {confirmText}
      </button>
      <button
        type="button"
        onClick={() => setArming(false)}
        className="inline-flex min-h-12 items-center justify-center rounded-(--radius-control) px-4 font-bold text-niebla"
      >
        Cancelar
      </button>
    </span>
  );
}

/** Copiar texto (links de invitación) con feedback accesible. Si recibe `path`, copia origin + path. */
export function CopyButton({ text, path, label = 'Copiar enlace' }: { text?: string; path?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const valor = path ? `${window.location.origin}${path}` : (text ?? '');
        await navigator.clipboard.writeText(valor);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-(--radius-control) border-2 border-pino px-5 font-bold text-pino-oscuro hover:bg-pino/10"
      aria-live="polite"
    >
      {copied ? '✓ Copiado' : label}
    </button>
  );
}
