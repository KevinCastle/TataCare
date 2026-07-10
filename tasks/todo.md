# TataCare v2 — Plan de construcción (one-shot)

Spec: `docs/v2-propuesta-diseno.md` · Rama: `feat/v2-design` · Kevin commitea entre bloques.

## Bloques

- [x] **1. Fundación** — Next.js 15 + TS estricto, Tailwind v4 con tokens papel/pino/copihue, Atkinson Hyperlegible, primitivas UI accesibles, PWA base (manifest + iconos)
- [x] **2. Marca** — logo techo+corazón SVG, app icon, landing pública
- [x] **3. Datos + Auth** — schema Prisma completo, DB local (`prisma dev`), Auth.js v5 (registro + login + sesión JWT)
- [x] **4. Tatas** — Mis tatas (home), crear/editar ficha, Ficha de urgencia, Modo urgencia
- [x] **5. Dominios** — Remedios, Salud (condiciones+alergias), Contactos, Gustos
- [x] **6. Bitácora** — registro diario con ratings + historial
- [x] **7. Compartir** — roles owner/editor/viewer, invitación cuidador, acceso temporal médico (código + /dr)
- [x] **8. Carpeta médica** — subida (Blob en prod, .uploads en dev), tipos, listado por fecha
- [x] **9. Turnos + Modo espejo** — calendario de turnos, "quién cuida hoy" en home/ficha, vista espejo con PIN
- [x] **10. Cierre** — tsc limpio, build de producción OK, smoke test completo en browser (mobile + desktop)

## Review

**Verificado en browser (mobile 375px y desktop):** landing, login (cuenta seed), Mis tatas con chips
de estado, Ficha (alergias en rojo, remedios destacados, llamada directa, turno de hoy), Remedios con
semáforo de vigencia, Modo urgencia, Modo espejo con PIN. `npx tsc --noEmit` y `npm run build` en verde.

**Cómo correr en dev:**
1. `npm run db:dev` (Prisma Postgres local) — la URL ya está en `.env`
2. `npx prisma db push` + `npx tsx prisma/seed.ts` (si la DB está vacía)
3. `npm run dev` → cuenta demo: `demo@tatacare.cl` / `tatacare123` (también `carmen@tatacare.cl`)

**Pendientes conocidos (no bloqueantes):**
- [ ] Subida de avatares (elder/user) — v2 usa iniciales por diseño; el campo `avatarUrl` ya existe
- [ ] Nota clínica del médico desde /dr (roadmap Mes 10) — hoy /dr es solo lectura
- [ ] Deploy a Vercel: crear DB Neon + Blob store, setear `DATABASE_URL`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN`
- [ ] Reescribir README y CLAUDE.md para la arquitectura v2 (aún describen v1)
- [ ] Auditoría Lighthouse formal (axe) — a11y aplicada por diseño, falta el número
- [ ] Migración de datos reales de v1 (schema mapping directo, decidir cuándo)

## Reglas
- Accesibilidad transversal: targets ≥48px, rem, focus visible, aria, es-CL
- Server Components + Server Actions (nada de Zustand ni API routes con verbos raros)
- La v1 viva no se toca (branch `legacy/v1` la conserva; DB de prod intacta)
