# TataCare v2

> **Cuidar bajo un mismo techo.** Todo lo que una familia necesita saber sobre la persona que
> cuida — remedios, alergias, contactos de emergencia y cómo estuvo su día — en un solo lugar.

Esta rama (`v2`) es la reconstrucción real de TataCare: mobile-first, accesible (WCAG 2.2 AA como
piso) y con marca propia. Se construye **una feature por mes**, documentada en video.

- 📐 **Propuesta de diseño:** [docs/v2-propuesta-diseno.md](docs/v2-propuesta-diseno.md)
- 🗺️ **Implementación de referencia completa:** rama `guia/v2-referencia` (ver su `GUIA.md`)
- 🧓 **v1 (en producción):** rama `main` · [tata-care.vercel.app](https://tata-care.vercel.app)

## Estado actual — Mes 1: fundación

Incluye el design system completo y la PWA base, sin features todavía:

- **Tokens de marca** "papel, pino y copihue" en `src/app/globals.css` (Tailwind v4 `@theme`)
- **Atkinson Hyperlegible** — tipografía del Braille Institute, cuerpo base 17px, escala en `rem`
- **Primitivas UI accesibles** en `src/components/` — touch targets ≥48px, focus visible, errores anunciados
- **PWA**: manifest + iconos (regenerables con `npm run icons`)
- **`/cocina`** — styleguide vivo de todos los componentes

## Correr

```bash
npm install
npm run dev   # → localhost:3000  ·  /cocina para el design system
```

## Stack

Next.js 15 (App Router) · TypeScript estricto · Tailwind CSS v4. La base de datos (Prisma +
PostgreSQL) y la autenticación llegan en los Meses 2–3 del roadmap.
