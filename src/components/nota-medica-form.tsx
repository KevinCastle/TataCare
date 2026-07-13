'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Button, Card, Field, Input, Textarea } from '@/components/ui';
import { IconAlert } from '@/components/icons';
import type { FormState } from '@/lib/form-state';

export function NotaMedicaForm({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message === 'ok') formRef.current?.reset();
  }, [state]);

  return (
    <Card>
      <h2 className="text-lg font-bold">Dejar una nota clínica</h2>
      <p className="mt-1 text-[0.9rem] text-niebla">
        Quedará visible para todos los cuidadores en la bitácora de la persona.
      </p>
      <form ref={formRef} action={formAction} className="mt-4 flex flex-col gap-4">
        <Field label="Su nombre" htmlFor="doctorName" error={state?.errors?.doctorName}>
          <Input
            id="doctorName"
            name="doctorName"
            required
            placeholder="Dra. María Pérez — Medicina Interna"
            aria-invalid={Boolean(state?.errors?.doctorName)}
          />
        </Field>
        <Field label="Indicación u observación" htmlFor="note" error={state?.errors?.note}>
          <Textarea
            id="note"
            name="note"
            required
            className="min-h-28"
            placeholder="Controlar presión 2 veces al día esta semana. Volver a control en 1 mes con exámenes."
            aria-invalid={Boolean(state?.errors?.note)}
          />
        </Field>

        {state?.message && state.message !== 'ok' ? (
          <p role="alert" className="flex items-center gap-2 rounded-xl border-2 border-alerta bg-alerta/5 px-4 py-3 font-bold text-alerta">
            <IconAlert size={18} /> {state.message}
          </p>
        ) : null}
        {state?.message === 'ok' ? (
          <p className="rounded-xl bg-bien/10 px-4 py-3 font-bold text-bien" role="status">
            ✓ Nota guardada — la familia la verá en la bitácora
          </p>
        ) : null}

        <Button type="submit" disabled={pending}>
          {pending ? 'Guardando…' : 'Guardar nota'}
        </Button>
      </form>
    </Card>
  );
}
