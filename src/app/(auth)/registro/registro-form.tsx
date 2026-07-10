'use client';

import { useActionState, useState } from 'react';
import { registrar } from '@/lib/actions/auth';
import { Button, Field, Input } from '@/components/ui';

export function RegistroForm() {
  const [state, formAction, pending] = useActionState(registrar, null);
  const [verClave, setVerClave] = useState(false);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nombre" htmlFor="name" error={state?.errors?.name}>
          <Input id="name" name="name" autoComplete="given-name" required aria-invalid={Boolean(state?.errors?.name)} />
        </Field>
        <Field label="Apellido" htmlFor="surname" error={state?.errors?.surname}>
          <Input id="surname" name="surname" autoComplete="family-name" required aria-invalid={Boolean(state?.errors?.surname)} />
        </Field>
      </div>
      <Field label="Correo" htmlFor="email" error={state?.errors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required inputMode="email" aria-invalid={Boolean(state?.errors?.email)} />
      </Field>
      <Field
        label="Contraseña"
        htmlFor="password"
        error={state?.errors?.password}
        hint="Mínimo 8 caracteres"
      >
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={verClave ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={8}
            className="pr-24"
            aria-invalid={Boolean(state?.errors?.password)}
          />
          <button
            type="button"
            onClick={() => setVerClave((v) => !v)}
            className="absolute inset-y-1 right-1 rounded-lg px-3 text-[0.9rem] font-bold text-pino-oscuro hover:bg-pino/10"
          >
            {verClave ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </Field>

      <Button type="submit" disabled={pending} className="text-lg">
        {pending ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>
    </form>
  );
}
