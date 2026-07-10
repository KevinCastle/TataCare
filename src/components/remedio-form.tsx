'use client';

import { useActionState, useState } from 'react';
import type { Condition, Medication } from '@prisma/client';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { HeartToggle, Stepper } from '@/components/ui-client';
import type { FormState } from '@/lib/form-state';
import { cn } from '@/lib/utils';

export function RemedioForm({
  action,
  defaults,
  condiciones,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaults?: Medication;
  condiciones: Condition[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [sos, setSos] = useState(defaults ? defaults.intervalHours === null : false);
  const [conditionId, setConditionId] = useState(defaults?.conditionId ?? '');
  const err = state?.errors;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label="Nombre" htmlFor="name" error={err?.name}>
        <Input id="name" name="name" required placeholder="Losartán" defaultValue={defaults?.name} aria-invalid={Boolean(err?.name)} />
      </Field>

      <Field label="Dosis" htmlFor="dose" error={err?.dose}>
        <Input id="dose" name="dose" required placeholder="Por ejemplo: 50 mg" defaultValue={defaults?.dose} aria-invalid={Boolean(err?.dose)} />
      </Field>

      <div className={cn(sos && 'pointer-events-none opacity-40')} aria-hidden={sos}>
        <Stepper name="intervalHours" label="Cada cuántas horas" unit="h" min={1} max={48} defaultValue={defaults?.intervalHours ?? 12} />
      </div>

      <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-(--radius-control) border-[1.5px] border-linea bg-crema px-3.5 py-3">
        <span className="flex-1">
          <span className="font-bold">Solo cuando lo necesite</span>
          <span className="block text-[0.85rem] text-niebla">Sin horario fijo, como analgésicos ocasionales</span>
        </span>
        <input type="checkbox" name="sos" value="1" checked={sos} onChange={(e) => setSos(e.target.checked)} className="peer sr-only" />
        <span
          aria-hidden
          className={cn(
            'relative h-7 w-12 shrink-0 rounded-full transition-colors after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:transition-transform',
            sos ? 'bg-pino after:translate-x-5' : 'bg-niebla/40',
          )}
        />
      </label>

      {condiciones.length > 0 ? (
        <fieldset>
          <legend className="mb-1.5 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-niebla">
            ¿Para qué condición?
          </legend>
          <div className="flex flex-wrap gap-2">
            {condiciones.map((c) => (
              <label
                key={c.id}
                className={cn(
                  'cursor-pointer rounded-full border-[1.5px] px-4 py-2 text-[0.9rem] font-bold has-focus-visible:outline-3 has-focus-visible:outline-pino',
                  conditionId === c.id ? 'border-pino bg-pino/10 text-pino-oscuro' : 'border-linea bg-crema',
                )}
              >
                <input
                  type="radio"
                  name="conditionId"
                  value={c.id}
                  checked={conditionId === c.id}
                  onChange={() => setConditionId(c.id)}
                  className="sr-only"
                />
                {c.name}
                {conditionId === c.id ? ' ✓' : ''}
              </label>
            ))}
            <label
              className={cn(
                'cursor-pointer rounded-full border-[1.5px] px-4 py-2 text-[0.9rem] font-bold has-focus-visible:outline-3 has-focus-visible:outline-pino',
                conditionId === '' ? 'border-pino bg-pino/10 text-pino-oscuro' : 'border-linea bg-crema',
              )}
            >
              <input type="radio" name="conditionId" value="" checked={conditionId === ''} onChange={() => setConditionId('')} className="sr-only" />
              Ninguna
            </label>
          </div>
        </fieldset>
      ) : null}

      <Field label="Farmacia donde se compra" htmlFor="pharmacy" error={err?.pharmacy}>
        <Input id="pharmacy" name="pharmacy" placeholder="Cruz Verde de la plaza" defaultValue={defaults?.pharmacy ?? ''} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Inicio" htmlFor="startDate" error={err?.startDate}>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={defaults?.startDate ? defaults.startDate.toISOString().slice(0, 10) : undefined}
          />
        </Field>
        <Field label="Fin del tratamiento" htmlFor="endDate" error={err?.endDate} hint="Con esto avisamos cuando quede poco">
          <Input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={defaults?.endDate ? defaults.endDate.toISOString().slice(0, 10) : undefined}
            aria-invalid={Boolean(err?.endDate)}
          />
        </Field>
      </div>

      <Field label="Indicaciones" htmlFor="instructions" error={err?.instructions}>
        <Textarea
          id="instructions"
          name="instructions"
          placeholder="Después del desayuno, con agua"
          className="min-h-20"
          defaultValue={defaults?.instructions ?? ''}
        />
      </Field>

      <HeartToggle name="favorite" label="Destacar en la ficha" defaultChecked={defaults?.favorite} />

      <Button type="submit" disabled={pending} className="mt-2 text-lg">
        {pending ? 'Guardando…' : submitLabel}
      </Button>
    </form>
  );
}
