import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Button, Card, Field, Input } from '@/components/ui';
import { LogoMark } from '@/components/icons';

export const metadata: Metadata = { title: 'Acceso médico' };

async function irAlCodigo(formData: FormData) {
  'use server';
  const code = String(formData.get('code') ?? '')
    .trim()
    .toUpperCase();
  redirect(`/dr/${encodeURIComponent(code)}`);
}

export default function AccesoMedicoPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center gap-6 px-5">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-pino text-papel">
        <LogoMark size={32} />
      </span>
      <Card className="w-full">
        <h1 className="text-xl font-bold">Acceso para profesionales</h1>
        <p className="mt-1 text-[0.95rem] text-niebla">
          La familia le compartió un código temporal para consultar la ficha del paciente.
        </p>
        <form action={irAlCodigo} className="mt-5 flex flex-col gap-4">
          <Field label="Código" htmlFor="code">
            <Input
              id="code"
              name="code"
              required
              placeholder="TATA-4F9K"
              autoComplete="off"
              className="text-center font-mono text-xl uppercase tracking-widest"
            />
          </Field>
          <Button type="submit">Ver ficha</Button>
        </form>
      </Card>
    </div>
  );
}
