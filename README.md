<div align="center">

# TataCare

**Collaborative health records for caregivers of older adults and people with disabilities.**

Mobile-first care coordination: track medications, daily logs, conditions and
emergency contacts, and share records securely between caregivers and doctors.

</div>

---

> 🚧 **v2 — work in progress.** This branch is being rebuilt from scratch.
> The complete first version (a web app built with Next.js) lives, intact, in
> the [`legacy/v1`](https://github.com/KevinCastle/TataCare/tree/legacy/v1)
> branch. A full write-up of v1 — architecture, data model, API and lessons
> learned — is kept in [`.claude/legacy-v1.md`](.claude/legacy-v1.md).

## What's coming in v2

A TypeScript monorepo with a shared backend:

- **Mobile** — Expo (React Native), distributed via EAS
- **Web** — Next.js (App Router), tailored for doctors on desktop
- **Backend** — Node.js BFF, PostgreSQL + Prisma, deployed on Vercel
- **Shared** — strict TypeScript types and business logic across clients

Planned core features: granular per-record roles (admin / editor / reader),
time-limited read access for doctors with clinical notes, medication reminders
via push notifications, and a daily care log.

## Status

Setting up the architecture and month-1 foundation. Built in public.

## License

TBD
