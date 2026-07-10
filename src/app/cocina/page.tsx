'use client';

/**
 * La cocina: styleguide vivo del design system.
 * Todo lo que se ve aquí es el componente real que usará la app.
 */
import Link from 'next/link';
import {
  AlertCard,
  Avatar,
  Button,
  Card,
  Chip,
  CheckRow,
  EmptyState,
  Field,
  Input,
  SectionLabel,
  Select,
  Textarea,
} from '@/components/ui';
import { EmojiInput, HeartToggle, StarsInput, Stepper } from '@/components/ui-client';
import { IconFolder, IconHeart, IconPill, LogoMark } from '@/components/icons';

const COLORES = [
  { nombre: 'Papel', clase: 'bg-papel border border-linea', hex: '#FAF6EF', uso: 'Fondo global' },
  { nombre: 'Tinta', clase: 'bg-tinta', hex: '#22302C', uso: 'Texto · 12.8:1 AAA' },
  { nombre: 'Pino', clase: 'bg-pino', hex: '#14584E', uso: 'Acción · 7.7:1 AAA' },
  { nombre: 'Copihue', clase: 'bg-copihue', hex: '#C2455F', uso: 'Afecto · 4.5:1 AA' },
  { nombre: 'Alerta', clase: 'bg-alerta', hex: '#B3261E', uso: 'SOLO peligro · 6.1:1' },
  { nombre: 'Aviso', clase: 'bg-aviso', hex: '#8A5A00', uso: 'Por vencer · 5.5:1' },
  { nombre: 'Bien', clase: 'bg-bien', hex: '#2E7D32', uso: 'Al día · 4.8:1' },
  { nombre: 'Niebla', clase: 'bg-niebla', hex: '#5C6B66', uso: 'Secundario · 5.2:1' },
];

function Seccion({ id, titulo, children }: { id: string; titulo: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <h2 id={id} className="border-b border-linea pb-2 text-xl font-bold">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

export default function CocinaPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-5 pb-24 pt-8">
      <header className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-pino text-papel">
          <LogoMark size={26} />
        </span>
        <div className="flex-1">
          <h1 className="text-2xl font-bold leading-tight">La cocina</h1>
          <p className="text-niebla">El design system de TataCare, vivo y tocable</p>
        </div>
        <Link href="/" className="min-h-12 rounded-xl px-3 py-3 font-bold text-pino-oscuro hover:bg-pino/10">
          ← Inicio
        </Link>
      </header>

      <Seccion id="colores" titulo="Color — papel, pino y copihue">
        <p className="text-[0.95rem] text-niebla">
          Regla de oro: <strong className="text-tinta">si algo es rojo, puede hacer daño.</strong> El afecto usa
          copihue. Nunca color solo: siempre ícono + palabra.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLORES.map((c) => (
            <div key={c.nombre} className="overflow-hidden rounded-xl border border-linea bg-crema">
              <div className={`h-14 ${c.clase}`} />
              <div className="p-2.5">
                <p className="font-bold leading-tight">{c.nombre}</p>
                <p className="font-mono text-[0.72rem] text-niebla">{c.hex}</p>
                <p className="text-[0.75rem] text-niebla">{c.uso}</p>
              </div>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion id="tipografia" titulo="Tipografía — Atkinson Hyperlegible">
        <Card className="flex flex-col gap-3">
          <p className="text-3xl font-bold leading-tight">El tata Luis toma Losartán a las 10:00</p>
          <p className="text-xl font-bold">Sección · 22/700</p>
          <p>Cuerpo · 17/400 — el mínimo. Si el usuario agranda la letra del sistema, todo escala (rem).</p>
          <SectionLabel>Etiqueta · 13/700 mayúsculas</SectionLabel>
          <p className="border-t border-dashed border-linea pt-3 text-2xl tracking-wide text-pino-oscuro">
            Il1 · 0Oo · B8 <span className="text-[0.9rem] text-niebla">— cada glifo inconfundible (Braille Institute)</span>
          </p>
        </Card>
      </Seccion>

      <Seccion id="botones" titulo="Botones — mínimo 48px de alto">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primario</Button>
          <Button variant="ghost">Secundario</Button>
          <Button variant="quiet">Silencioso</Button>
          <Button variant="danger">Peligro</Button>
          <Button disabled>Deshabilitado</Button>
        </div>
      </Seccion>

      <Seccion id="chips" titulo="Chips de estado">
        <div className="flex flex-wrap gap-2">
          <Chip>3 remedios</Chip>
          <Chip tone="alerta">⚠ 2 alergias</Chip>
          <Chip tone="aviso">⏳ Quedan 6 días</Chip>
          <Chip tone="bien">✓ Al día</Chip>
          <Chip tone="copihue">
            <IconHeart size={13} /> Destacado
          </Chip>
          <Chip tone="niebla">Lector/a</Chip>
        </div>
      </Seccion>

      <Seccion id="formularios" titulo="Formularios — errores que explican el porqué">
        <Card className="flex flex-col gap-5">
          <Field label="Nombre del remedio" htmlFor="demo-nombre" hint="Como aparece en la caja">
            <Input id="demo-nombre" placeholder="Losartán" />
          </Field>
          <Field label="Dosis" htmlFor="demo-dosis" error="Escribe la dosis — la necesita quien reemplace tu turno">
            <Input id="demo-dosis" placeholder="50 mg" aria-invalid />
          </Field>
          <Field label="Previsión" htmlFor="demo-prev">
            <Select id="demo-prev" defaultValue="Fonasa">
              <option>Fonasa</option>
              <option>Isapre</option>
              <option>Otra</option>
            </Select>
          </Field>
          <Field label="Nota" htmlFor="demo-nota">
            <Textarea id="demo-nota" className="min-h-20" placeholder="Después del desayuno, con agua" />
          </Field>
          <Stepper name="demo-horas" label="Cada cuántas horas" unit="h" defaultValue={12} />
          <CheckRow name="demo-check" label="Hizo actividad física" description="Caminó, se movió, salió" defaultChecked />
          <HeartToggle name="demo-fav" label="Destacar en la ficha" defaultChecked />
        </Card>
      </Seccion>

      <Seccion id="ratings" titulo="Ratings de la bitácora — tocables con el pulgar">
        <Card className="flex flex-col gap-5">
          <StarsInput name="demo-dia" label="El día en general" defaultValue={4} />
          <EmojiInput name="demo-animo" label="Ánimo" defaultValue={4} />
        </Card>
      </Seccion>

      <Seccion id="superficies" titulo="Superficies y avisos">
        <AlertCard title="Alergia · Penicilina">Reacción grave — avisar siempre en urgencias.</AlertCard>
        <Card className="flex items-center gap-3 p-3.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-pino/10 text-pino-oscuro">
            <IconPill size={18} />
          </span>
          <span className="flex-1">
            <span className="block font-bold">Losartán 50 mg</span>
            <span className="block text-[0.85rem] text-niebla">Cada 12 h · Hipertensión</span>
          </span>
          <IconHeart size={18} className="text-copihue" />
        </Card>
        <EmptyState icon={<IconFolder size={34} />} title="La carpeta está vacía">
          Los estados vacíos enseñan qué va en cada sección, con calidez.
        </EmptyState>
        <div className="flex items-center gap-4">
          <Avatar initials="LS" size="lg" />
          <Avatar initials="CS" size="md" tone="copihue" />
          <Avatar initials="K" size="sm" tone="aviso" />
          <p className="text-[0.9rem] text-niebla">Avatares por iniciales — la foto es opcional, nunca requisito.</p>
        </div>
      </Seccion>
    </div>
  );
}
