import type { ZodError } from 'zod';

export type FormState = {
  errors?: Record<string, string>;
  message?: string;
} | null;

export function erroresDeZod(error: ZodError): FormState {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const campo = String(issue.path[0] ?? '_');
    if (!errors[campo]) errors[campo] = issue.message;
  }
  return { errors };
}
