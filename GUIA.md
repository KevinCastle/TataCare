# TataCare v2 — Implementación de referencia (guía)

> **Qué es esta rama:** una construcción completa de TataCare v2 hecha en un one-shot (julio 2026)
> para servir de **guía** mientras construyes el v2 real mes a mes con tu roadmap.
> No es el producto final — es el mapa: cuando en el Mes N te toque una feature, aquí hay una
> versión funcionando de ella para consultar decisiones, patrones y trampas ya resueltas.
>
> - **Rama:** `guia/v2-referencia` · v1 vive en `main`/`legacy/v1` y su producción no fue tocada
> - **Diseño:** [docs/v2-propuesta-diseno.md](docs/v2-propuesta-diseno.md) (y `.html` para verlo visual)
> - **Preview desplegado:** proyecto `tata-care` en Vercel (deployment de preview, tras SSO)

## Correr en local

```bash
npm install
npm run db:dev          # Prisma Postgres local, sin Docker (deja la terminal abierta)
npx prisma db push      # crea las tablas (primera vez)
npx tsx prisma/seed.ts  # datos de demo
npm run dev             # → localhost:3000 · demo@tatacare.cl / tatacare123
```

⚠️ La `DATABASE_URL` local necesita `pgbouncer=true` (ya está en `.env`) — sin eso Prisma revienta
con `prepared statement "s0" already exists`, porque el Postgres local multiplexa conexiones.

## Mapa del código (dónde mirar cada cosa)

| Tema del roadmap | Dónde está la referencia |
|---|---|
| Design tokens y marca (Mes 1) | `src/app/globals.css` (@theme papel/pino/copihue), `src/components/icons.tsx` (logo + set de iconos) |
| Primitivas UI accesibles (Mes 1) | `src/components/ui.tsx` (server) y `ui-client.tsx` (ratings, stepper, PIN…) — targets 48px, focus visible, errores con `role="alert"` |
| PWA (Mes 1) | `src/app/manifest.ts`, `scripts/gen-icons.mjs`, `.pb-safe` para safe areas |
| Login/registro (Mes 2) | `src/auth.ts` + `auth.config.ts` + `middleware.ts` (Auth.js v5, JWT) · forms en `src/app/(auth)/` |
| Ficha del tata (Mes 3) | `src/app/app/[elderId]/page.tsx` · form compartido crear/editar en `src/components/tata-form.tsx` |
| Remedios (Mes 4) | `src/lib/actions/medications.ts` + `remedios/` — semáforo de vigencia en `diasRestantes()` |
| Condiciones y alergias (Mes 5) | `conditions` unifica diseases+allergies con `type` — los 4 booleanos de v1 son condiciones normales |
| Gustos (Mes 6) | `tastes/` — flags combinables, el "por qué" en `note` |
| Bitácora (Mes 7) | `logs.ts` + `bitacora-form.tsx` — la action devuelve `ok` y el form se resetea |
| Roles y compartir (Mes 9) | `src/lib/access.ts` (`accesoAlTata`, jerarquía VIEWER<EDITOR<OWNER) + `share.ts` (invitaciones de un solo uso) |
| Acceso médico (Mes 10) | `share.ts` (códigos TATA-XXXX con expiración) + `src/app/dr/` (vista pública) + `actions/doctor.ts` (nota clínica sin cuenta — la única escritura pública, autorizada por el código vigente) |
| Carpeta médica | `storage.ts` (Blob en prod, `.uploads/` en dev) + `documents.ts` |
| Turnos | `shifts.ts` — clave `YYYY-MM-DD` en zona America/Santiago (`fechaISO()`) |
| Modo urgencia | `src/app/app/urgencia/[elderId]/` — fuera del layout con tabs a propósito |
| Modo espejo | `src/app/app/espejo/[elderId]/` — bloqueo por PIN en localStorage, vista XXL |

## Decisiones de arquitectura que vale la pena copiar

1. **Server Components + Server Actions, cero client-state global.** Nada de Zustand ni fetch en
   stores: cada action valida con Zod, revalida rutas y redirige. Los formularios usan
   `useActionState` y devuelven errores por campo en español humano.
2. **Autorización en un solo lugar:** toda página/action de un tata pasa por `accesoAlTata(elderId, rolMínimo)`.
   Nunca se consulta un recurso sin verificar la relación caregiver.
3. **El rojo es solo para alertas.** En todo el design system, si algo es rojo es porque puede hacer daño.
   Favoritos y afecto usan copihue. Nunca color solo: siempre ícono + palabra.
4. **Errores de formulario que explican el porqué** ("la necesita quien reemplace tu turno") — patrón
   en todas las actions.
5. **Fechas siempre en `America/Santiago`** vía `Intl` (`src/lib/utils.ts`) — evita el clásico
   "el turno cambió de día a medianoche UTC".

| Avatares con foto | `procesarAvatar()` en `actions/elders.ts` (valida tipo/peso) — usado en ficha del tata y `/app/perfil` |

## Pendientes que quedaron anotados

Ver la sección Review de [tasks/todo.md](tasks/todo.md): avatares con foto, nota clínica del médico,
auditoría Lighthouse formal, migración de datos v1, y promoción a producción (decidiste dejarla
como guía, no reemplaza a v1).
