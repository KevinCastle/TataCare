import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';

const MIME: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.heic': 'image/heic',
};

/** Sirve los archivos de desarrollo guardados en .uploads/ (en prod se usa Vercel Blob). */
export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const session = await auth();
  if (!session?.user) return new Response('No autorizado', { status: 401 });

  const { key } = await params;
  const base = path.join(process.cwd(), '.uploads');
  const destino = path.join(base, ...key);

  // Nunca salir de .uploads
  if (!destino.startsWith(base)) notFound();

  try {
    const contenido = await readFile(destino);
    const tipo = MIME[path.extname(destino).toLowerCase()] ?? 'application/octet-stream';
    return new Response(new Uint8Array(contenido), { headers: { 'Content-Type': tipo } });
  } catch {
    notFound();
  }
}
