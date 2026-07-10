'use client';

import { useActionState } from 'react';
import type { Contact } from '@prisma/client';
import { Button, Field, Input } from '@/components/ui';
import type { FormState } from '@/lib/form-state';

export function ContactoForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaults?: Contact;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const err = state?.errors;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label="Nombre" htmlFor="name" error={err?.name}>
        <Input id="name" name="name" required placeholder="Carmen Soto" defaultValue={defaults?.name} aria-invalid={Boolean(err?.name)} />
      </Field>
      <Field label="Quién es" htmlFor="role" error={err?.role}>
        <Input id="role" name="role" required placeholder="Hija · Doctor de cabecera · Clínica" defaultValue={defaults?.role} aria-invalid={Boolean(err?.role)} />
      </Field>
      <Field label="Teléfono" htmlFor="phone" error={err?.phone}>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          required
          placeholder="+56 9 1234 5678"
          defaultValue={defaults?.phone}
          aria-invalid={Boolean(err?.phone)}
        />
      </Field>
      <Field label="Dirección" htmlFor="address" error={err?.address} hint="Útil para clínicas y consultas">
        <Input id="address" name="address" placeholder="Av. Providencia 1234" defaultValue={defaults?.address ?? ''} />
      </Field>
      <Button type="submit" disabled={pending} className="mt-2 text-lg">
        {pending ? 'Guardando…' : submitLabel}
      </Button>
    </form>
  );
}
