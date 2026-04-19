# CortesIA Academy

Plataforma premium para alumnos · 20€/mes · videollamadas + cursos + comunidad.

## Stack

- **Next.js 15** App Router · React 19 · TypeScript · Tailwind 4
- **Supabase** compartida con agental-ia-web (tabla `academy_users` independiente)
- **Stripe Subscriptions** — checkout + webhooks
- **LiveKit Cloud** (F2 pendiente) — videollamadas + screen share
- **Resend** (F1.5 pendiente) — email transaccional con credenciales

## Fases

| Fase | Alcance | Estado |
|---|---|---|
| F1 | Login + pago Stripe + /app placeholder | ✅ scaffold inicial |
| F2 | Videollamadas LiveKit + screen share | ⏳ |
| F3 | Cursos (vídeos protegidos, progreso) | ⏳ |
| F4 | Billing portal + launch | ⏳ |

## Setup local

```bash
npm install
cp .env.example .env.local   # rellenar con credenciales
npm run dev
```

## Deploy

Proyecto Vercel separado. Dominio custom: `academy.cortesia.ai`.

## SQL inicial

Ejecutar `scripts/academy-migration.sql` en Supabase SQL Editor antes del primer deploy.
