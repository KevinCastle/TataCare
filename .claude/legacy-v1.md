# TataCare — Documentación del Legacy v1

> Contexto completo de la **primera versión** de TataCare, preservada en la rama
> `legacy/v1` (idéntica a `main` al momento de escribir este documento).
> Este archivo existe para que cualquier sesión futura de Claude entienda
> **todo lo que ya se construyó** antes de empezar el proyecto v2 desde cero.
>
> - **Repo:** https://github.com/KevinCastle/TataCare
> - **Deploy en producción (v1):** https://tata-care.vercel.app/
> - **Rama del código v1:** `legacy/v1` (también `origin/development`)
> - **Historia:** ~131 commits, desde `2024-04-18` (Initial commit) hasta `2025-01-24` (`chore: maintance advice`)
> - **Origen:** rehechura de un proyecto de grado universitario.

---

## 1. Qué es TataCare v1

Una **aplicación web** (no app nativa) para que familiares y cuidadores lleven
el registro de salud y del día a día de **adultos mayores**. La idea central es
descargar la carga mental del cuidador: tener en un solo lugar medicamentos,
contactos, condiciones médicas, gustos y un registro diario, de modo que el
traspaso de cuidados entre cuidadores sea sencillo y siempre quede constancia.

Funcionalidades reales implementadas en v1:

1. **Fichas de adulto mayor** ("elders") con datos personales, médicos y legales.
2. **Medicamentos** con dosis, horario (`schedule`), farmacia, fechas, peso y
   vínculo a una enfermedad; flag `favorite` para destacarlos en la ficha.
3. **Contactos** (doctor, clínica, familiares) con rol; uno se marca como
   contacto de emergencia favorito de la ficha (`elder.favorite_contact`).
4. **Condiciones / enfermedades** (`disease`) y **alergias** (`allergy`).
5. **Gustos** (`taste`): qué le gusta, qué le disgusta, actividades, qué evitar.
6. **Comentarios diarios** calificando el día (ratings de día, emoción,
   digestión, actividad física + nota libre).
7. **Compartir ficha** mediante un **link temporal de un solo uso con fecha de
   expiración** (tabla `shared`) — el germen del "acceso temporal" del roadmap v2.
8. **Avatares** subidos a Vercel Blob (foto del adulto mayor / usuario).
9. **Autenticación** por credenciales (email + password) con NextAuth v5.

> Nota: v1 **no** tiene el sistema de roles granulares (admin/editor/lector),
> ni notificaciones push, ni acceso específico para médicos con notas clínicas.
> Eso es alcance nuevo del roadmap v2.

---

## 2. Stack técnico (v1)

| Capa | Tecnología |
|------|-----------|
| Framework | **Next.js 14.2.2** (App Router) |
| UI | **React 18**, **NextUI 2** (`@nextui-org/react`), **Tailwind CSS 3** |
| Iconos | `@phosphor-icons/react` |
| Animación | `framer-motion` |
| Estado cliente | **Zustand 4** |
| Auth | **NextAuth 5 (beta)** — provider Credentials |
| Base de datos | **Vercel Postgres** (`@vercel/postgres`), **SQL crudo** (sin ORM) |
| Storage de archivos | **Vercel Blob** (`@vercel/blob`) |
| Validación | **Zod** (solo en login) |
| Hash de password | **bcrypt** / **bcrypt-ts** |
| IDs | **uuid** (generados en cliente) |
| Lenguaje | **TypeScript** (strict) |
| Lint | ESLint + **eslint-config-airbnb** + next |
| Hosting | **Vercel** |

**No hay**: monorepo, backend separado, ORM/Prisma, migraciones, tests, CI,
app móvil, i18n. Todo vive en un único proyecto Next.js.

---

## 3. Arquitectura

v1 es un **Next.js monolítico full-stack**. No hay un BFF separado: las
**Route Handlers** de Next (`src/app/api/**/route.ts`) actúan como backend y
hablan **directamente** con Postgres vía SQL crudo. El cliente (componentes
`'use client'`) llama a esos endpoints a través de **stores de Zustand** que
encapsulan los `fetch`.

```
Componente React ('use client')
        │  (acción de store)
        ▼
Zustand store (src/app/store/*)
        │  fetch('/api/...')
        ▼
Route Handler (src/app/api/**/route.ts)
        │  sql`...`  (@vercel/postgres)
        ▼
Vercel Postgres
```

Decisiones/patrones clave:

- **`unstable_noStore()`** al inicio de casi todos los handlers para desactivar
  el caché de Next y forzar datos frescos.
- **SQL construido dinámicamente** a partir de `Object.keys()` / `Object.values()`
  del body para INSERT/UPDATE genéricos (ver §6, también §9 riesgos).
- **uuid generado en el cliente** y enviado en el body; el INSERT usa ese `id`.
- **Autorización mínima**: solo `GET /api/elders` cruza la sesión con la tabla
  `elder_user`. La mayoría de endpoints no verifican que el usuario pueda tocar
  ese recurso (ver §9).

---

## 4. Estructura de carpetas

```
src/
├── auth.ts                 # NextAuth: provider Credentials + getUser por email
├── auth.config.ts          # callbacks (authorized), pages.signIn = /login
├── middleware.ts           # protege rutas con authConfig (matcher global)
├── app/
│   ├── layout.tsx          # layout raíz
│   ├── page.tsx            # landing
│   ├── providers.tsx       # NextUIProvider, etc.
│   ├── globals.css
│   ├── login/
│   │   ├── page.tsx        # login
│   │   ├── layout.tsx
│   │   └── signup/page.tsx # registro
│   ├── app/                # zona autenticada (dashboard)
│   │   ├── layout.tsx
│   │   ├── page.tsx        # lista de fichas (elders) del usuario
│   │   ├── shared/page.tsx # entrada por link compartido
│   │   └── [id]/           # ficha de un elder concreto
│   │       ├── layout.tsx
│   │       ├── page.tsx        # vista resumen de la ficha
│   │       ├── medicamentos/page.tsx
│   │       ├── condiciones/page.tsx   # enfermedades + alergias
│   │       ├── contactos/page.tsx
│   │       ├── gustos/page.tsx
│   │       └── comentarios/page.tsx
│   ├── api/                # "backend" (Route Handlers)
│   │   ├── user/           # route.ts, types.ts, actions.ts (authenticate)
│   │   ├── elders/         # route.ts, [id]/route.ts, shared/route.ts, types.ts
│   │   ├── medications/    # route.ts + types.ts
│   │   ├── diseases/       # route.ts + types.ts
│   │   ├── allergies/      # route.ts + types.ts
│   │   ├── contacts/       # route.ts + types.ts
│   │   ├── tastes/         # route.ts + types.ts
│   │   ├── comments/       # route.ts + types.ts
│   │   └── avatar/route.ts # subida a Vercel Blob
│   ├── store/              # Zustand (uno por dominio) + index.ts
│   ├── components/         # UI reutilizable (cards, forms, modales, nav)
│   └── utils/              # bloodTypeUtils, dateUtils, PrevisionsUtils, index
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. Modelo de datos (reconstruido del SQL)

No hay un schema declarado en el repo (no usa ORM ni archivos de migración).
Las tablas se infieren de las queries y de los `types.ts`. **Ojo con la
inconsistencia de nombres**: los SELECT/INSERT/UPDATE usan tablas en
**singular**, pero varios DELETE usan **plural** (bug, ver §9).

### `users`
`id, name, surname, email, password (hash), avatar`

### `elders` (ficha del adulto mayor)
`id, name, surname, sex, blood_type, insurance, diabetic (bool),
hypertensive (bool), birthdate, nationality, identification_number,
kidney_failure (bool), urinary_incontinence (bool), avatar, favorite_contact`

### `elder_user` (join — multi-cuidador / compartir)
`elder_id, user_id` — relación N:M entre usuarios y fichas. Es lo que permite
que varios cuidadores vean la misma ficha. **Sin columna de rol** (todos los
vinculados tienen el mismo acceso).

### `shared` (link temporal para compartir ficha)
`id, date (expiración), elder_id, used (bool)`
Lógica (en `elderStore.addElderShared`): se busca el link por `id`; si está
`used` o su `date` ya pasó, se marca como no disponible; si es válido se marca
`used = true`, se obtiene el elder y se crea un vínculo `elder_user` para el
usuario que lo abrió. → **link de un solo uso con expiración por fecha.**

### `medication`
`id, elder_id, name, quantity, schedule, pharmacy, initial_date, end_date,
weight, disease_id, favorite (bool)`

### `disease`
`id, elder_id, name, detail`

### `allergy`
`id, elder_id, name, detail`

### `contact`
`id, elder_id, name, phone, address, role`

### `taste`
`id, elder_id, detail, pleasure (bool), displeasure (bool), activity (bool), avoid (bool)`

### `comment` (registro diario)
`id, caregiver_id, elder_id, day_rating, emotion_rating, physical_activity (bool),
digestion_rating, note, date`

---

## 6. API (Route Handlers)

Patrón CRUD repetido en casi todos los dominios:

- **GET** — lista por `elderId` (query param) o lee uno por `id`. `comments`
  acepta `?latest=true` para el último comentario.
- **PUT** — **crear** (INSERT). Construye columnas/placeholders dinámicamente
  desde las keys del body.
- **POST** — **editar** (UPDATE ... SET ... WHERE id). Igual de dinámico.
- **DELETE** — borra por `id` (query param o route param).

Endpoints principales:

| Ruta | Métodos | Notas |
|------|---------|-------|
| `/api/user` | GET, (POST/PUT) | usuario actual; `actions.ts` tiene `authenticate()` server action para login |
| `/api/elders` | GET, PUT | GET filtra por sesión vía `elder_user`; PUT crea elder + vínculo `elder_user` |
| `/api/elders/[id]` | GET, POST, DELETE | leer/editar/borrar ficha por id |
| `/api/elders/shared` | GET, PUT, POST, DELETE | gestiona links `shared` |
| `/api/medications` | GET, PUT, POST, DELETE | |
| `/api/diseases` | GET, PUT, POST, DELETE | |
| `/api/allergies` | GET, PUT, POST, DELETE | |
| `/api/contacts` | GET, PUT, POST, DELETE | |
| `/api/tastes` | GET, PUT, POST, DELETE | |
| `/api/comments` | GET, PUT, POST, DELETE | `?latest=true` para el último |
| `/api/avatar` | POST | sube archivo a Vercel Blob, devuelve la URL |

Convención de métodos no estándar: **PUT = crear**, **POST = editar** (al revés
de lo habitual). Tenerlo presente al leer el código v1.

---

## 7. Autenticación

- **NextAuth v5 (beta)** con provider **Credentials** (`src/auth.ts`).
- `authorize` valida con **Zod** (`email` válido, `password >= 6`), busca el
  usuario por email (`SELECT * FROM users WHERE email=...`) y compara el hash con
  `bcrypt-ts` (`compare`).
- `src/auth.config.ts` define el callback `authorized`: rutas bajo `/app`
  requieren sesión; si estás logueado y vas a otra ruta te redirige a `/app`;
  la raíz `/` es pública. `pages.signIn = '/login'`.
- `src/middleware.ts` aplica `authConfig.auth` con un matcher que excluye
  `api`, assets de `_next` y `.png`.
- El registro inserta el usuario en `users` (con password hasheada).
- `src/app/api/user/actions.ts` expone el server action `authenticate()` usado
  por el formulario de login, que mapea `CredentialsSignin` a "Credenciales
  incorrectas".

---

## 8. Estado en el cliente (Zustand)

Un store por dominio en `src/app/store/`, reexportados desde `index.ts`:
`useElderStore, useAllergyStore, useDiseaseStore, useTasteStore,
useCommentStore, useContactStore, useMedicationStore, useUserStore`.

Cada store sigue el mismo molde: estado (`items`, `selected`, `loading`) +
acciones (`get/getAll`, `add`, `edit`, `remove`) que hacen `fetch` a `/api/*`.

`useElderStore` es el más rico e incluye la **lógica de compartir**:
`addSharedLink`, `editSharedLink`, `addElderShared` (valida expiración/uso del
link y crea el vínculo), `uploadImage` (sube avatar a `/api/avatar`). Las páginas
disparan los `get*` en `useEffect` al montar.

---

## 9. Problemas conocidos / deuda técnica (para no repetir en v2)

Estos son hallazgos reales del código v1. Son oro para el roadmap v2 porque
varios ya están contemplados como mejoras.

1. **DELETE apunta a tablas en plural inexistentes.** SELECT/INSERT/UPDATE usan
   singular (`comment`, `contact`, `allergy`, `taste`, `medication`) pero los
   DELETE usan plural (`comments`, `contacts`, `allergies`, `tastes`,
   `medications`). → el borrado de esos dominios **probablemente falla**.
   (`disease` y `shared` sí borran con el nombre correcto.)
2. **Autorización casi inexistente.** Solo `GET /api/elders` cruza la sesión con
   `elder_user`. `GET/POST/DELETE /api/elders/[id]`, y todos los CRUD de
   medications/diseases/allergies/contacts/tastes/comments **no verifican** que
   el usuario tenga acceso a ese `elder`. Cualquier usuario autenticado con un
   `id` puede leer/editar/borrar datos ajenos. → v2 necesita **middleware de
   autorización por recurso** (roadmap Mes 4).
3. **`/api/avatar` y `/api/elders/shared` no comprueban sesión.** Subida de
   blobs y creación/edición de links abiertos a cualquiera.
4. **SQL con identificadores dinámicos.** Las columnas vienen de `Object.keys()`
   del body e interpoladas en el string del query (los *valores* sí van
   parametrizados con `$n`, pero los *nombres de columna* no). Riesgo si el body
   no está bien tipado/validado. v2 debería usar **Prisma** (ya en el roadmap).
5. **Sin validación de input** salvo en login. Los endpoints confían en el body.
6. **Sin tests, sin CI, sin migraciones.** El schema solo existe en la DB de
   Vercel, no versionado. v2 lo resuelve con Prisma + migraciones + Vitest +
   GitHub Actions (roadmap Mes 10).
7. **`PUT /api/elders` devuelve `existingElderData.rows[0]`** que está vacío
   cuando el elder es nuevo (recién insertado), no el registro creado.
8. **Modelo de compartir sin roles.** `elder_user` no distingue admin/editor/
   lector; el link `shared` da acceso de edición completo, no de solo lectura.
   v2 introduce roles granulares y acceso de solo lectura para médicos.
9. **Convención PUT=crear / POST=editar** poco idiomática (ver §6).
10. **`'use server'` en `src/auth.ts`** junto con `bcrypt-ts/browser` — mezcla
    poco clara de fronteras server/client.

---

## 10. Configuración y tooling

- **`tsconfig.json`**: `strict: true`, `target: es5`, alias `@/* → ./src/*`.
- **`tailwind.config.ts`**: integra NextUI, breakpoints custom (`xs: 425px`,
  `sm: 576px`), `darkMode: 'class'`, y un `safelist` de colores de texto
  (verde/amarillo/rojo) usados dinámicamente en ratings.
- **ESLint**: `eslint-config-airbnb` + `eslint-config-next` + plugins de React,
  hooks, jsx-a11y, import.
- **Scripts**: `dev`, `build`, `start`, `lint` (Next estándar).
- **Variables de entorno** (de README): `POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN`
  (+ las de NextAuth). `.env` está en `.gitignore`.

---

## 11. Cómo se relaciona v1 con el roadmap v2

| Concepto v1 | Evolución en v2 |
|-------------|-----------------|
| Next.js full-stack monolítico | **Monorepo**: Expo (mobile) + Next.js (web) + backend Node/BFF compartido |
| Route Handlers hablando con SQL crudo | **BFF real** + **Prisma** sobre PostgreSQL |
| Solo web | **Mobile-first** (Expo/EAS) + web para médicos |
| `elder_user` sin roles | **Roles granulares**: admin, editor, lector por ficha |
| Link `shared` de un solo uso | **Acceso temporal para médicos** con expiración configurable + notas clínicas |
| Sin notificaciones | **Push notifications** (recordatorio de medicamentos) |
| Sin tests/CI | **Vitest + GitHub Actions + ADRs** |
| Sin i18n | **i18n** (es/en) en año 2 |
| Sin monetización | **Freemium + Stripe** en año 2 |
| Datos médicos en claro | **Encriptación de campos sensibles, rate limiting, sanitización** |

**Qué se conserva conceptualmente:** el dominio (fichas, medicamentos,
contactos, condiciones, gustos, registro diario), el criterio de producto ya
validado en el proyecto de grado, y el deploy en Vercel. **Qué cambia:** la
arquitectura completa, el stack móvil, el modelo de permisos y la calidad
(tests, tipos compartidos, migraciones, seguridad).

---

## 12. Cómo levantar v1 (referencia)

```sh
git checkout legacy/v1
npm install
# crear .env con POSTGRES_URL y BLOB_READ_WRITE_TOKEN (+ secrets de NextAuth)
npm run dev
```

Requiere una base PostgreSQL y un store Blob creados en Vercel.

---

*Documento generado al iniciar el reset hacia TataCare v2. El código completo
de v1 vive intacto en la rama `legacy/v1`.*
