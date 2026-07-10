'use client';

import { useActionState, useState } from 'react';
import type { Condition } from '@prisma/client';
import { Button, Field, Input, Textarea } from '@/components/ui';
import type { FormState } from '@/lib/form-state';
import { cn } from '@/lib/utils';

export function CondicionForm({
  action,
  defaults,
  tipoInicial,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaults?: Condition;
  tipoInicial?: 'ALLERGY' | 'DISEASE';
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [tipo, setTipo] = useState<'ALLERGY' | 'DISEASE'>(defaults?.type ?? tipoInicial ?? 'DISEASE');
  const err = state?.errors;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <fieldset>
        <legend className="mb-1.5 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-niebla">¿Qué es?</legend>
        <div className="grid grid-cols-2 gap-2">
          <label
            className={cn(
              'flex min-h-12 cursor-pointer items-center justify-center rounded-(--radius-control) border-2 font-bold has-focus-visible:outline-3 has-focus-visible:outline-pino',
              tipo === 'DISEASE' ? 'border-pino bg-pino/10 text-pino-oscuro' : 'border-linea bg-crema',
            )}
          >
            <input type="radio" name="type" value="DISEASE" checked={tipo === 'DISEASE'} onChange={() => setTipo('DISEASE')} className="sr-only" />
            Diagnóstico
          </label>
          <label
            className={cn(
              'flex min-h-12 cursor-pointer items-center justify-center rounded-(--radius-control) border-2 font-bold has-focus-visible:outline-3 has-focus-visible:outline-pino',
              tipo === 'ALLERGY' ? 'border-alerta bg-alerta/10 text-alerta' : 'border-linea bg-crema',
            )}
          >
            <input type="radio" name="type" value="ALLERGY" checked={tipo === 'ALLERGY'} onChange={() => setTipo('ALLERGY')} className="sr-only" />
            ⚠ Alergia
          </label>
        </div>
      </fieldset>

      <Field label="Nombre" htmlFor="name" error={err?.name}>
        <Input
          id="name"
          name="name"
          required
          placeholder={tipo === 'ALLERGY' ? 'Penicilina' : 'Hipertensión'}
          defaultValue={defaults?.name}
          aria-invalid={Boolean(err?.name)}
        />
      </Field>

      <Field
        label="Detalle"
        htmlFor="detail"
        error={err?.detail}
        hint={tipo === 'ALLERGY' ? 'Qué reacción le da y qué evitar' : 'Cómo se controla, exámenes, cuidados'}
      >
        <Textarea
          id="detail"
          name="detail"
          className="min-h-24"
          placeholder={tipo === 'ALLERGY' ? 'Reacción grave — avisar siempre en urgencias' : 'Controlada · examen cada 3 meses'}
          defaultValue={defaults?.detail ?? ''}
        />
      </Field>

      <Button type="submit" disabled={pending} className="mt-2 text-lg">
        {pending ? 'Guardando…' : submitLabel}
      </Button>
    </form>
  );
}
