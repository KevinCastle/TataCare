import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

/**
 * Guarda un archivo y devuelve su URL pública.
 * En producción usa Vercel Blob; en desarrollo escribe en .uploads/
 * (servido por /api/archivos/[...key]).
 */
export async function guardarArchivo(file: File, carpeta: string): Promise<string> {
  const extension = path.extname(file.name) || '';
  const nombre = `${carpeta}/${Date.now()}-${randomBytes(4).toString('hex')}${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob');
    const blob = await put(nombre, file, { access: 'public' });
    return blob.url;
  }

  const destino = path.join(process.cwd(), '.uploads', nombre);
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, Buffer.from(await file.arrayBuffer()));
  return `/api/archivos/${nombre}`;
}
