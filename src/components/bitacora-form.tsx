'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Button, Card, CheckRow, Field, Textarea } from '@/components/ui';
import { EmojiInput, StarsInput } from '@/components/ui-client';
import { IconAlert } from '@/components/icons';
import type { FormState } from '@/lib/form-state';

export function BitacoraForm({
  action,
  nombreTata,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  nombreTata: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Al guardar con éxito, limpiar el formulario para el próximo registro
  useEffect(() => {
    if (state?.message === 'ok') formRef.current?.reset();
  }, [state]);

  const err = state?.errors;

  return (
    <Card>
      <h2 className="mb-4 text-lg font-bold">¿Cómo estuvo el día de {nombreTata}?</h2>
      <form ref={formRef} action={formAction} className="flex flex-col gap-5">
        <div>
          <StarsInput name="dayRating" label="El día en general" />
          {err?.dayRating ? (
            <p className="mt-1 flex items-center gap-1.5 text-[0.9rem] font-bold text-alerta" role="alert">
              <IconAlert size={15} /> {err.dayRating}
            </p>
          ) : null}
        </div>

        <div>
          <EmojiInput name="emotionRating" label="Ánimo" />
          {err?.emotionRating ? (
            <p className="mt-1 flex items-center gap-1.5 text-[0.9rem] font-bold text-alerta" role="alert">
              <IconAlert size={15} /> {err.emotionRating}
            </p>
          ) : null}
        </div>

        <div>
          <StarsInput name="digestionRating" label="Digestión" />
          {err?.digestionRating ? (
            <p className="mt-1 flex items-center gap-1.5 text-[0.9rem] font-bold text-alerta" role="alert">
              <IconAlert size={15} /> {err.digestionRating}
            </p>
          ) : null}
        </div>

        <CheckRow name="physicalActivity" label="Hizo actividad física" description="Caminó, se movió, salió" />

        <Field label="Nota para el próximo turno" htmlFor="note" error={err?.note}>
          <Textarea id="note" name="note" className="min-h-24" placeholder="Almorzó completo, caminamos a la plaza. En la tarde estaba con sueño…" />
        </Field>

        {state?.message === 'ok' ? (
          <p className="rounded-xl bg-bien/10 px-4 py-3 font-bold text-bien" role="status">
            ✓ Registro guardado — gracias por dejar el dato
          </p>
        ) : null}

        <Button type="submit" disabled={pending}>
          {pending ? 'Guardando…' : 'Guardar registro'}
        </Button>
      </form>
    </Card>
  );
}
