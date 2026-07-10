import type { Metadata } from 'next';
import { accesoAlTata } from '@/lib/access';
import { db } from '@/lib/db';
import { fechaISO } from '@/lib/utils';
import { EspejoView } from './espejo-view';

export const metadata: Metadata = { title: 'Modo espejo' };

/**
 * Modo espejo: la vista para el propio tata, en letra gigante.
 * Pensado para dejar una tablet fija en su casa; se bloquea con PIN del cuidador.
 */
export default async function EspejoPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder } = await accesoAlTata(elderId);

  const [remedios, turnoHoy, contactos] = await Promise.all([
    db.medication.findMany({
      where: { elderId, intervalHours: { not: null } },
      orderBy: [{ favorite: 'desc' }, { name: 'asc' }],
      take: 6,
    }),
    db.shift.findFirst({ where: { elderId, date: fechaISO() }, include: { user: { select: { name: true } } } }),
    db.contact.findMany({ where: { elderId } }),
  ]);

  const contacto = contactos.find((c) => c.id === elder.favoriteContactId) ?? contactos[0] ?? null;

  return (
    <EspejoView
      elderId={elderId}
      nombre={elder.name}
      cuidadorHoy={turnoHoy?.user.name ?? null}
      remedios={remedios.map((m) => ({
        id: m.id,
        nombre: m.name,
        dose: m.dose,
        cadaHoras: m.intervalHours as number,
      }))}
      contacto={contacto ? { nombre: contacto.name, rol: contacto.role, telefono: contacto.phone } : null}
    />
  );
}
