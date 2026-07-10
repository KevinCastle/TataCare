'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui';
import { CopyButton } from '@/components/ui-client';
import type { FormState } from '@/lib/form-state';
import { cn } from '@/lib/utils';

export function InvitarCuidadorForm({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [, formAction, pending] = useActionState(action, null);
  const [role, setRole] = useState<'EDITOR' | 'VIEWER'>('EDITOR');

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <fieldset>
        <legend className="mb-1.5 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-niebla">
          ¿Qué podrá hacer?
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <label
            className={cn(
              'flex min-h-12 cursor-pointer flex-col items-center justify-center rounded-(--radius-control) border-2 px-2 py-2 text-center has-focus-visible:outline-3 has-focus-visible:outline-pino',
              role === 'EDITOR' ? 'border-pino bg-pino/10' : 'border-linea bg-crema',
            )}
          >
            <input type="radio" name="role" value="EDITOR" checked={role === 'EDITOR'} onChange={() => setRole('EDITOR')} className="sr-only" />
            <span className="font-bold">Editar</span>
            <span className="text-[0.8rem] text-niebla">Familia y cuidadores de confianza</span>
          </label>
          <label
            className={cn(
              'flex min-h-12 cursor-pointer flex-col items-center justify-center rounded-(--radius-control) border-2 px-2 py-2 text-center has-focus-visible:outline-3 has-focus-visible:outline-pino',
              role === 'VIEWER' ? 'border-pino bg-pino/10' : 'border-linea bg-crema',
            )}
          >
            <input type="radio" name="role" value="VIEWER" checked={role === 'VIEWER'} onChange={() => setRole('VIEWER')} className="sr-only" />
            <span className="font-bold">Solo mirar</span>
            <span className="text-[0.8rem] text-niebla">Puede consultar, no cambiar</span>
          </label>
        </div>
      </fieldset>
      <Button type="submit" variant="ghost" disabled={pending}>
        {pending ? 'Generando…' : '+ Generar invitación'}
      </Button>
    </form>
  );
}

export function AccesoMedicoForm({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [, formAction, pending] = useActionState(action, null);
  const [horas, setHoras] = useState(24);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <fieldset>
        <legend className="mb-1.5 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-niebla">Duración</legend>
        <div className="flex gap-2">
          {[
            { h: 24, texto: '24 h' },
            { h: 48, texto: '48 h' },
            { h: 168, texto: '7 días' },
          ].map(({ h, texto }) => (
            <label
              key={h}
              className={cn(
                'flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-(--radius-control) border-2 font-bold has-focus-visible:outline-3 has-focus-visible:outline-pino',
                horas === h ? 'border-pino bg-pino/10 text-pino-oscuro' : 'border-linea bg-crema',
              )}
            >
              <input type="radio" name="horas" value={h} checked={horas === h} onChange={() => setHoras(h)} className="sr-only" />
              {texto}
              {horas === h ? ' ✓' : ''}
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit" variant="ghost" disabled={pending}>
        {pending ? 'Generando…' : '+ Generar código para el médico'}
      </Button>
    </form>
  );
}
