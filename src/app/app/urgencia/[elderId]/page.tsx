import type { Metadata } from 'next';
import Link from 'next/link';
import { accesoAlTata } from '@/lib/access';
import { db } from '@/lib/db';
import { edad } from '@/lib/utils';
import { IconTel } from '@/components/icons';

export const metadata: Metadata = { title: 'Urgencia' };

/**
 * Modo urgencia: para entregar el teléfono al equipo médico.
 * Tipografía gigante, solo lo vital, sin navegación que estorbe.
 */
export default async function UrgenciaPage({ params }: { params: Promise<{ elderId: string }> }) {
  const { elderId } = await params;
  const { elder } = await accesoAlTata(elderId);

  const [conditions, favoritos, contactos] = await Promise.all([
    db.condition.findMany({ where: { elderId }, orderBy: { name: 'asc' } }),
    db.medication.findMany({ where: { elderId, favorite: true } }),
    db.contact.findMany({ where: { elderId } }),
  ]);

  const alergias = conditions.filter((c) => c.type === 'ALLERGY');
  const diagnosticos = conditions.filter((c) => c.type === 'DISEASE');
  const contacto = contactos.find((c) => c.id === elder.favoriteContactId) ?? contactos[0];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-4 px-5 py-6 shadow-[inset_0_0_0_5px_var(--color-alerta)]">
      <p className="text-center text-[0.85rem] font-bold uppercase tracking-[0.25em] text-alerta">· Urgencia ·</p>

      <div className="text-center">
        <h1 className="text-3xl font-bold leading-tight">
          {elder.name} {elder.surname}
        </h1>
        <p className="text-niebla">
          {edad(elder.birthdate)} años
          {elder.insurance ? ` · ${elder.insurance}` : ''}
          {elder.identificationNumber ? ` · RUT ${elder.identificationNumber}` : ''}
        </p>
      </div>

      <div className="rounded-2xl border border-linea bg-crema p-4 text-center">
        <p className="text-6xl font-bold leading-none text-alerta">{elder.bloodType ?? '—'}</p>
        <p className="mt-2 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-niebla">Grupo sanguíneo</p>
      </div>

      {alergias.length > 0 ? (
        <div className="rounded-2xl bg-alerta p-4 text-center text-white" role="alert">
          <p className="text-xl font-bold">⚠ ALERGIA: {alergias.map((a) => a.name).join(', ').toUpperCase()}</p>
          {alergias.some((a) => a.detail) ? (
            <p className="mt-1 text-[0.95rem] opacity-95">{alergias.map((a) => a.detail).filter(Boolean).join(' · ')}</p>
          ) : null}
        </div>
      ) : (
        <p className="text-center text-lg font-bold text-bien">Sin alergias conocidas</p>
      )}

      {diagnosticos.length > 0 ? (
        <p className="text-center text-xl font-bold">{diagnosticos.map((d) => d.name).join(' · ')}</p>
      ) : null}

      {favoritos.length > 0 ? (
        <p className="text-center text-niebla">
          Toma {favoritos.map((m) => `${m.name} ${m.dose}`).join(' y ')}
        </p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 pb-2">
        {contacto ? (
          <a
            href={`tel:${contacto.phone.replace(/\s/g, '')}`}
            className="flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-alerta px-5 text-xl font-bold text-white"
          >
            <IconTel size={22} /> Llamar a {contacto.name} · {contacto.role.toLowerCase()}
          </a>
        ) : null}
        <p className="text-center text-[0.9rem] text-niebla">Muéstrale esta pantalla al equipo médico</p>
        <Link
          href={`/app/${elderId}`}
          className="mx-auto flex min-h-12 items-center rounded-xl px-4 font-bold text-niebla hover:text-tinta"
        >
          ← Volver a la ficha
        </Link>
      </div>
    </div>
  );
}
