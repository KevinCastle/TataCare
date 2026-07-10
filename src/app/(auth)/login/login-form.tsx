'use client';

import { useActionState, useState } from 'react';
import { iniciarSesion } from '@/lib/actions/auth';
import { Button, Field, Input } from '@/components/ui';
import { IconAlert } from '@/components/icons';

export function LoginForm() {
  const [state, formAction, pending] = useActionState(iniciarSesion, null);
  const [verClave, setVerClave] = useState(false);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-5">
      <Field label="Correo" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required inputMode="email" />
      </Field>
      <Field label="Contraseña" htmlFor="password">
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={verClave ? 'text' : 'password'}
            autoComplete="current-password"
            required
            className="pr-24"
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

      {state?.message ? (
        <p role="alert" className="flex items-center gap-2 rounded-xl border-2 border-alerta bg-alerta/5 px-4 py-3 font-bold text-alerta">
          <IconAlert size={18} /> {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="text-lg">
        {pending ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  );
}
