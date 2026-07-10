# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TataCare** is a caregiver coordination web app for families and professional caregivers managing elderly relatives ("abuelitos"). The core problem it solves: when multiple people share care responsibilities for an elderly person, critical information gets scattered or lost. TataCare centralizes everything — medical history, medications, emergency contacts, daily wellbeing logs — in a single profile per elder that any authorized caregiver can consult or update.

The app started as an academic project targeting Chilean families. It is fully in Spanish (UI, routes, field names) and uses Chilean-specific values (health insurance system called "previsión": Fonasa, Isapre, etc.). It is live at [tata-care.vercel.app](https://tata-care.vercel.app).

The central user journey is:
1. A caregiver registers and creates a profile for an elder
2. They fill in the elder's health details, medications, emergency contacts, and personal preferences
3. They share the elder's profile with other caregivers using a one-time link
4. All caregivers can leave daily comments about how the elder's day went
5. Anyone who needs to act urgently can open the elder's profile and immediately see medications, conditions, and emergency contacts without having to ask anyone

## Feature Modules

### Elder Profile ("Ficha") — `/app/[elderId]`

The overview page for an elder. Acts as a quick-reference dashboard containing:
- **Personal data**: name, sex, birthdate (with auto-calculated age), blood type, and which blood types the elder can receive as a donor
- **Health summary**: diagnosed diseases, "favorited" medications (most critical ones), known allergies, and flags for the 4 boolean conditions tracked per elder (diabetes, hypertension, kidney failure, urinary incontinence) — shown as two lists: conditions present and conditions absent
- **Legal info**: nationality, ID number, and health insurance plan ("previsión")
- **Priority emergency contact**: whichever contact was marked as `favorite_contact` on the elder record, shown inline with name, phone, and address
- **Last comment**: the most recent daily log entry, rendered at the bottom so caregivers can see how the elder was doing last time someone checked in

### Medications ("Medicamentos") — `/app/[elderId]/medicamentos`

Each medication record stores: name, dose quantity + unit (weight), schedule in hours between doses, pharmacy where it can be purchased, start and end dates (remaining time is auto-calculated), and an optional link to the disease or allergy it treats. Medications can be marked as "favorite" to surface them on the overview. The condition link shows a disease icon (red) or allergy icon (green) depending on the type.

### Health Conditions ("Condiciones de Salud") — `/app/[elderId]/condiciones`

A combined view of two separate tables: `diseases` (diagnoses, long-term conditions) and `allergies`. Both share the same shape: name + detail text. They are merged and sorted alphabetically in the UI, distinguished by icon color. Conditions are referenced by medications — a medication can point to the disease or allergy it is prescribed for.

Note: in addition to the `diseases`/`allergies` tables, the `elders` table itself stores 4 boolean flags for common conditions (diabetic, hypertensive, kidney_failure, urinary_incontinence). These are edited on the elder form directly, not on the conditions page.

### Emergency Contacts ("Contactos") — `/app/[elderId]/contactos`

Stores people and places to call in an emergency: name, role (e.g. "Doctor de cabecera", "Clínica", "Hija"), phone number, and address. One contact can be designated as the `favorite_contact` on the elder record, which causes it to appear on the overview page. The "like" button on a contact card sets it as the elder's favorite.

### Preferences ("Gustos") — `/app/[elderId]/gustos`

Tracks what an elder likes, dislikes, and what they should avoid. Each taste record has a `detail` text and three boolean flags: `pleasure` (le gusta), `displeasure` (no le gusta), `avoid` (le hace mal). A single record can belong to multiple categories simultaneously. The page renders three columns, one per category. This section is useful for caregivers who don't know the elder well — e.g. a hired caregiver can check what foods to avoid before preparing a meal.

### Daily Comments ("Comentarios") — `/app/[elderId]/comentarios`

The main communication channel between caregivers. Each comment is attributed to the caregiver who wrote it (shown with their avatar) and records:
- `day_rating`: overall quality of the day, 1–5 stars
- `emotion_rating`: emotional state, 1–5 mapped to five emoji icons (sad → happy)
- `digestion_rating`: digestive health, 1–5 stars
- `physical_activity`: boolean, whether the elder exercised or moved around
- `note`: free-text observation

Comments are sorted newest-first. The most recent one is also pulled and displayed on the overview page via a separate `?latest=true` query param. This lets a caregiver taking over a shift see the previous caregiver's notes at a glance.

### Caregiver Sharing (`/app/shared`)

Allows an existing caregiver to invite another person to access an elder's profile. They generate a `shared` record that contains a UUID, the elder's ID, an expiry date, and a `used` flag. The shareable URL is `/app/shared?sharedId=<uuid>`. When the recipient (who must already have an account) visits the URL:
1. The app validates the link is not expired and not already used
2. Marks the link as `used: true` (one-time use)
3. Adds a row to `elder_user` linking the new user to the elder

This means a link can only be used once. If a caregiver needs to invite multiple people, they generate a new link each time.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm start        # Run production server
npm run lint     # ESLint (airbnb config)
```

No test suite is configured yet.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14.2.2 (App Router) |
| Language | TypeScript 5.4.5 |
| Styling | Tailwind CSS 3.4.3 + NextUI 2.3.5 |
| State | Zustand 4.5.2 |
| Auth | NextAuth.js v5 beta (Credentials provider) |
| Database | PostgreSQL via `@vercel/postgres` (Neon/Vercel) |
| File storage | Vercel Blob |
| Icons | Phosphor Icons |
| Validation | Zod |
| Animation | Framer Motion |

## Architecture

### Route Structure

```
/                          → Public landing page
/login                     → Login form
/login/signup              → Registration
/app                       → Elder list dashboard (protected)
/app/[elderId]             → Elder profile overview ("Ficha")
/app/[elderId]/comentarios → Daily comments/ratings
/app/[elderId]/condiciones → Health conditions (diseases + allergies)
/app/[elderId]/contactos   → Emergency contacts
/app/[elderId]/gustos      → Preferences (likes/dislikes/avoid)
/app/[elderId]/medicamentos → Medications
/app/shared                → Accept a shared elder link (public)
```

All `/app/*` routes are protected via NextAuth middleware (`src/middleware.ts`). Authenticated users visiting `/login` are redirected to `/app`.

### Authentication Flow

- `src/auth.config.ts` — route protection rules (middleware-safe, no Node.js APIs)
- `src/auth.ts` — full NextAuth config with Credentials provider (bcrypt password comparison, PostgreSQL user lookup)
- `src/middleware.ts` — wraps `auth` from `auth.config.ts` and applies to all non-static routes

Session is JWT-based. `await auth()` in API routes retrieves the session server-side.

### Data Flow Pattern

Every entity follows the same pattern:

1. **Zustand store** (`src/app/store/*Store.ts`) holds state and exposes async methods that call fetch
2. **Client components** call store methods directly — no React Query, no SWR
3. **API routes** (`src/app/api/[resource]/route.ts`) perform auth check via `await auth()`, then raw SQL via `@vercel/postgres`

HTTP method conventions used in this codebase (non-standard — do not change without updating both routes and stores):
- `GET` → fetch / read
- `PUT` → create / insert
- `POST` → update / edit
- `DELETE` → delete

### Database Schema

```
users          (id, name, surname, email, password, avatar)
elders         (id, name, surname, sex, blood_type, insurance, diabetic, hypertensive,
                birthdate, nationality, identification_number, kidney_failure,
                urinary_incontinence, avatar, favorite_contact)
elder_user     (elder_id, user_id)  ← many-to-many, caregivers ↔ elders
medications    (id, elder_id, name, quantity, schedule, pharmacy, initial_date,
                end_date, weight, disease_id, favorite)
comment        (id, caregiver_id, elder_id, day_rating, emotion_rating,
                physical_activity, digestion_rating, note, date)
contacts       (id, elder_id, name, phone, address, role)
tastes         (id, elder_id, detail, pleasure, displeasure, activity, avoid)
diseases       (id, elder_id, name, detail)
allergies      (id, elder_id, name, detail)
shared         (id, date, elder_id, used)  ← one-time-use sharing tokens
```

DB columns use `snake_case`; TypeScript types mirror this (e.g. `elder_id`, `blood_type`).

### Image Uploads

Avatar images (for both elders and users) are uploaded to Vercel Blob via `/api/avatar`. The returned blob URL is stored in the `avatar` column of `elders` or `users`.

## Key Conventions

**Tailwind dynamic classes**: Color classes used with dynamic values (`text-green-400`, `text-yellow-300`, `text-red-400`, etc.) are safelisted in `tailwind.config.ts` because Tailwind can't detect them statically. Add new dynamic color classes to the safelist.

**Custom breakpoints**: `xs: 425px`, `sm: 576px` (overrides Tailwind's default `sm`). Standard Tailwind breakpoints `md`/`lg`/`xl`/`2xl` are unchanged.

**NextUI theme**: Locked to `light` theme. Dark mode is configured but not active. Locale is `es-CL`.

**Path alias**: `@/*` maps to `./src/*` (configured in `tsconfig.json`).

**`noStore()`**: All API routes call `unstable_noStore()` to opt out of Next.js caching.

**API queries**: Raw SQL template literals via `sql` from `@vercel/postgres`. No ORM. Dynamic queries (insert/update with variable fields) use `sql.query()` with parameterized placeholders built from `Object.keys()`/`Object.values()`.

## Environment Variables

```
AUTH_SECRET=
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_URL_NO_SSL=
POSTGRES_DATABASE=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
BLOB_READ_WRITE_TOKEN=
```

Requires a Vercel Postgres database and a Vercel Blob store. Can be linked via `vercel env pull .env.local` if the project is connected to a Vercel project.
