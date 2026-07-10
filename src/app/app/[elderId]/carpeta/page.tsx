import type { Metadata } from 'next';
import { accesoAlTata, puedeEditar } from '@/lib/access';
import { db } from '@/lib/db';
import { formatoFechaCorta } from '@/lib/utils';
import { eliminarDocumento } from '@/lib/actions/documents';
import { AppBar, Content } from '@/components/shell';
import { Card, Chip, EmptyState, Fab } from '@/components/ui';
import { ConfirmSubmit } from '@/components/ui-client';
import { IconDoc, IconFolder } from '@/components/icons';

export const metadata: Metadata = { title: 'Carpeta médica' };

const TIPOS: Record<string, { texto: string; tone: 'pino' | 'aviso' | 'copihue' | 'niebla' }> = {
  examen: { texto: 'Examen', tone: 'pino' },
  receta: { texto: 'Receta', tone: 'aviso' },
  epicrisis: { texto: 'Epicrisis', tone: 'copihue' },
  otro: { texto: 'Otro', tone: 'niebla' },
};

export default async function CarpetaPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder, role } = await accesoAlTata(elderId);

  const documentos = await db.document.findMany({
    where: { elderId },
    orderBy: { date: 'desc' },
    include: { uploader: { select: { name: true } } },
  });

  const editor = puedeEditar(role);

  return (
    <>
      <AppBar
        title="Carpeta médica"
        subtitle={`${elder.name} · ${documentos.length} ${documentos.length === 1 ? 'documento' : 'documentos'}`}
        backHref={`/app/${elderId}/mas`}
      />
      <Content>
        <div className="flex flex-col gap-3">
          {documentos.length === 0 ? (
            <EmptyState icon={<IconFolder size={34} />} title="La carpeta está vacía">
              Sube fotos de exámenes, recetas y epicrisis. Se acabó buscar ese papel en el cajón antes de cada
              consulta.
            </EmptyState>
          ) : (
            documentos.map((d) => (
              <Card key={d.id} className="p-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pino/10 text-pino-oscuro">
                    <IconDoc size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <a
                      href={d.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate font-bold underline-offset-4 hover:underline"
                    >
                      {d.title}
                    </a>
                    <p className="text-[0.85rem] text-niebla">
                      {formatoFechaCorta(d.date)} · subido por {d.uploader.name}
                    </p>
                  </div>
                  <Chip tone={TIPOS[d.type]?.tone ?? 'niebla'}>{TIPOS[d.type]?.texto ?? d.type}</Chip>
                </div>
                {editor ? (
                  <form action={eliminarDocumento.bind(null, elderId, d.id)} className="mt-1 text-right">
                    <ConfirmSubmit confirmText="Sí, eliminar">Eliminar</ConfirmSubmit>
                  </form>
                ) : null}
              </Card>
            ))
          )}
        </div>
        {editor ? <Fab href={`/app/${elderId}/carpeta/nuevo`} label="Subir documento" /> : null}
      </Content>
    </>
  );
}
