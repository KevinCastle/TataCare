'use client';

import { useActionState } from 'react';
import { Button, Field } from '@/components/ui';
import type { FormState } from '@/lib/form-state';

export function PerfilForm({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Cambiar foto" htmlFor="avatar" error={state?.errors?.avatar} hint="Tu foto aparece en la bitácora y en los turnos">
        <input
          id="avatar"
          name="avatar"
          type="file"
          accept="image/*"
          required
          className="w-full rounded-(--radius-control) border-[1.5px] border-dashed border-linea bg-crema px-3.5 py-3 file:mr-3 file:rounded-lg file:border-0 file:bg-pino file:px-4 file:py-2 file:font-bold file:text-white"
          aria-invalid={Boolean(state?.errors?.avatar)}
        />
      </Field>
      {state?.message === 'ok' ? (
        <p className="rounded-xl bg-bien/10 px-4 py-3 font-bold text-bien" role="status">
          ✓ Foto actualizada
        </p>
      ) : null}
      <Button type="submit" variant="ghost" disabled={pending}>
        {pending ? 'Subiendo…' : 'Guardar foto'}
      </Button>
    </form>
  );
}
