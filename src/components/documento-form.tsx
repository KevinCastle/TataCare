'use client';

import { useActionState, useState } from 'react';
import { Button, Field, Input } from '@/components/ui';
import { IconAlert } from '@/components/icons';
import type { FormState } from '@/lib/form-state';
import { cn } from '@/lib/utils';

const TIPOS = [
  { valor: 'examen', texto: 'Examen' },
  { valor: 'receta', texto: 'Receta' },
  { valor: 'epicrisis', texto: 'Epicrisis' },
  { valor: 'otro', texto: 'Otro' },
];

export function DocumentoForm({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [tipo, setTipo] = useState('examen');
  const err = state?.errors;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="file"
          className="mb-1.5 block text-[0.8rem] font-bold uppercase tracking-[0.12em] text-niebla"
        >
          Archivo
        </label>
        <input
          id="file"
          name="file"
          type="file"
          required
          accept="image/*,application/pdf"
          className="w-full rounded-(--radius-control) border-[1.5px] border-dashed border-linea bg-crema px-3.5 py-4 file:mr-3 file:rounded-lg file:border-0 file:bg-pino file:px-4 file:py-2.5 file:font-bold file:text-white"
          aria-invalid={Boolean(err?.file)}
        />
        <p className="mt-1.5 text-[0.85rem] text-niebla">Foto o PDF, hasta 10 MB. La foto del examen con el teléfono sirve perfecto.</p>
        {err?.file ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-[0.9rem] font-bold text-alerta" role="alert">
            <IconAlert size={15} /> {err.file}
          </p>
        ) : null}
      </div>

      <Field label="Nombre" htmlFor="title" error={err?.title}>
        <Input id="title" name="title" required placeholder="Examen de sangre — marzo" aria-invalid={Boolean(err?.title)} />
      </Field>

      <fieldset>
        <legend className="mb-1.5 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-niebla">Tipo</legend>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <label
              key={t.valor}
              className={cn(
                'cursor-pointer rounded-full border-[1.5px] px-4 py-2.5 text-[0.9rem] font-bold has-focus-visible:outline-3 has-focus-visible:outline-pino',
                tipo === t.valor ? 'border-pino bg-pino/10 text-pino-oscuro' : 'border-linea bg-crema',
              )}
            >
              <input
                type="radio"
                name="type"
                value={t.valor}
                checked={tipo === t.valor}
                onChange={() => setTipo(t.valor)}
                className="sr-only"
              />
              {t.texto}
              {tipo === t.valor ? ' ✓' : ''}
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Fecha del documento" htmlFor="date" error={err?.date} hint="Si la dejas vacía usamos hoy">
        <Input id="date" name="date" type="date" />
      </Field>

      <Button type="submit" disabled={pending} className="mt-2 text-lg">
        {pending ? 'Subiendo…' : 'Guardar en la carpeta'}
      </Button>
    </form>
  );
}
