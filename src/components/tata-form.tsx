'use client';

import { useActionState } from 'react';
import type { Elder } from '@prisma/client';
import { Button, Field, Input, Select } from '@/components/ui';
import type { FormState } from '@/lib/form-state';

const SANGRE = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const PREVISION = ['Fonasa', 'Isapre', 'Capredena', 'Dipreca', 'Ninguna', 'Otra'];

export function TataForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaults?: Elder;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const err = state?.errors;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field
        label="Foto (opcional)"
        htmlFor="avatar"
        error={err?.avatar}
        hint="Ayuda a reconocer la ficha de un vistazo — las iniciales funcionan igual de bien"
      >
        <input
          id="avatar"
          name="avatar"
          type="file"
          accept="image/*"
          className="w-full rounded-(--radius-control) border-[1.5px] border-dashed border-linea bg-crema px-3.5 py-3 file:mr-3 file:rounded-lg file:border-0 file:bg-pino file:px-4 file:py-2 file:font-bold file:text-white"
          aria-invalid={Boolean(err?.avatar)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Nombre" htmlFor="name" error={err?.name}>
          <Input id="name" name="name" required defaultValue={defaults?.name} aria-invalid={Boolean(err?.name)} />
        </Field>
        <Field label="Apellido" htmlFor="surname" error={err?.surname}>
          <Input id="surname" name="surname" required defaultValue={defaults?.surname} aria-invalid={Boolean(err?.surname)} />
        </Field>
      </div>

      <Field label="Sexo" htmlFor="sex" error={err?.sex}>
        <Select id="sex" name="sex" required defaultValue={defaults?.sex ?? ''}>
          <option value="" disabled>
            Elegir…
          </option>
          <option value="femenino">Femenino</option>
          <option value="masculino">Masculino</option>
        </Select>
      </Field>

      <Field
        label="Fecha de nacimiento"
        htmlFor="birthdate"
        error={err?.birthdate}
        hint="Con esto calculamos su edad automáticamente"
      >
        <Input
          id="birthdate"
          name="birthdate"
          type="date"
          required
          defaultValue={defaults ? defaults.birthdate.toISOString().slice(0, 10) : undefined}
          aria-invalid={Boolean(err?.birthdate)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Tipo de sangre" htmlFor="bloodType" error={err?.bloodType} hint="Puede salvar una vida">
          <Select id="bloodType" name="bloodType" defaultValue={defaults?.bloodType ?? ''}>
            <option value="">No lo sé aún</option>
            {SANGRE.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Peso (kg)" htmlFor="weightKg" error={err?.weightKg}>
          <Input
            id="weightKg"
            name="weightKg"
            inputMode="numeric"
            placeholder="68"
            defaultValue={defaults?.weightKg ?? ''}
            aria-invalid={Boolean(err?.weightKg)}
          />
        </Field>
      </div>

      <Field label="Previsión" htmlFor="insurance" error={err?.insurance}>
        <Select id="insurance" name="insurance" defaultValue={defaults?.insurance ?? ''}>
          <option value="">Elegir…</option>
          {PREVISION.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="RUT o documento" htmlFor="identificationNumber" error={err?.identificationNumber}>
          <Input
            id="identificationNumber"
            name="identificationNumber"
            placeholder="12.345.678-9"
            defaultValue={defaults?.identificationNumber ?? ''}
          />
        </Field>
        <Field label="Nacionalidad" htmlFor="nationality" error={err?.nationality}>
          <Input id="nationality" name="nationality" placeholder="Chilena" defaultValue={defaults?.nationality ?? ''} />
        </Field>
      </div>

      <Button type="submit" disabled={pending} className="mt-2 text-lg">
        {pending ? 'Guardando…' : submitLabel}
      </Button>
    </form>
  );
}
