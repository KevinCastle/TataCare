'use client';

import { useActionState } from 'react';
import type { Taste } from '@prisma/client';
import { Button, CheckRow, Field, Input } from '@/components/ui';
import { IconAlert } from '@/components/icons';
import type { FormState } from '@/lib/form-state';

export function GustoForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaults?: Taste;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const err = state?.errors;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label="Qué es" htmlFor="detail" error={err?.detail}>
        <Input
          id="detail"
          name="detail"
          required
          placeholder="El bolero — sobre todo Lucho Gatica"
          defaultValue={defaults?.detail}
          aria-invalid={Boolean(err?.detail)}
        />
      </Field>

      <Field label="Contexto" htmlFor="note" error={err?.note} hint='El "por qué" ayuda al cuidador nuevo'>
        <Input id="note" name="note" placeholder="Ponerle música mientras almuerza" defaultValue={defaults?.note ?? ''} />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-niebla">
          ¿Dónde va? Puede ir en varias
        </legend>
        <CheckRow name="pleasure" label="Le gusta" description="Cosas que le alegran el día" defaultChecked={defaults?.pleasure} />
        <CheckRow name="displeasure" label="No le gusta" description="Mejor evitárselas" defaultChecked={defaults?.displeasure} />
        <CheckRow name="avoid" label="Le hace mal" description="Prohibido o riesgoso para su salud" defaultChecked={defaults?.avoid} />
        <CheckRow name="activity" label="Actividad" description="Lo que disfruta hacer" defaultChecked={defaults?.activity} />
        {err?.pleasure ? (
          <p className="flex items-center gap-1.5 text-[0.9rem] font-bold text-alerta" role="alert">
            <IconAlert size={15} /> {err.pleasure}
          </p>
        ) : null}
      </fieldset>

      <Button type="submit" disabled={pending} className="mt-2 text-lg">
        {pending ? 'Guardando…' : submitLabel}
      </Button>
    </form>
  );
}
