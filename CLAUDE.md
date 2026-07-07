# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint (Next.js flat config, eslint.config.mjs)
```

No test runner is configured. `npm run build` runs `tsc` — treat a green build as the bar.

## Stack

- **Next.js 16** — App Router (Turbopack), all pages are Server Components by default
- **React 19** + **TypeScript** (strict mode, `@/*` alias maps to repo root)
- **Tailwind CSS v4** — no `tailwind.config.js`; theme tokens in `app/globals.css` (`@theme inline {}`)
- **shadcn/ui** pattern — primitives in `components/ui/` (CVA + `cn()`)
- **zustand** for client auth state, **lucide-react** for icons
- Fonts: Geist Sans (body), Geist Mono, Nunito (buttons) — loaded via `next/font/google`

## Architecture

### Design system — one palette, two consumers

**Single source of truth: `app/design-variables.css`.** Every brand colour hex is defined once there as a `--scf-*` custom property on `:root`. Add a new colour there first, then wire it into the two consumers below.

1. **Tailwind utilities (public site).** `app/globals.css` `@theme inline {}` maps the palette onto utilities: `--color-bg: var(--scf-bg)`, `--color-ink: var(--scf-ink)`, etc. Use classes like `bg-bg`, `text-ink`, `text-ink-muted`, `border-border-strong`, `from-coral`. shadcn tokens (`--primary`, `--border`, …) are separate hsl values in `:root {}` / `.dark {}`; use them via `hsl(var(--primary))` or their utilities (`bg-primary`).
2. **TS tokens (admin only).** `lib/admin-tokens.ts` exports `AD` and `TINT`, whose values are `var(--scf-*)` references (not hex). Use them in inline `style={{}}` props on admin screens (e.g. `style={{ color: AD.ink }}`). `STATUS_META` in the same file is the single source for **status** colours (available/pending/…) and legitimately keeps its own hex. Shared admin inline-style objects (`fieldStyle`, `labelStyle`, `cardStyle`, `MONO`) live in `lib/admin-styles.ts`.

Because `AD`/`TINT` and the Tailwind `--color-*` tokens both resolve to the same `--scf-*` variables, there is exactly one place to change a colour.

### Styling convention

- **Public pages** (`app/(home)`, `about-us`, `donate`, auth, `adopt-pet`) use **Tailwind utility classes** on the palette. Occasional inline `style={{}}` may reference `var(--scf-*)` directly.
- **Admin** (`app/admin/**`, `components/admin/**`) uses **inline `style={{}}` with `AD`/`TINT` tokens**. This is a deliberate, separate convention — don't mix Tailwind palette classes into admin screens.
- Don't hardcode hex in components; reach for a token. (A few one-off SVG/gradient stops remain — migrate opportunistically.)

### Wave Dividers

`components/wave-divider.tsx` renders SVG waves between sections. The `from`/`to` props must be **solid hex colours**. `WAVE_PATH_INV` is exported for embedding a wave inside a section (see `about-us` hero).

### Component conventions

- `"use client"` only when state/browser APIs are needed (auth forms, admin forms, `header`, `animated-counter`, carousels, dialogs, …). Server Components stay the default.
- Route-scoped components go in `app/<route>/_components/`; shared primitives in `components/ui/`; shared admin UI in `components/admin/`.
- Page-level data arrays (e.g. `ACTIONS`) live at the top of the page file, not a separate data file.

## Strapi integration

### Config — always via `lib/config.ts`

`lib/config.ts` is the **single source of truth** for the backend connection. It is dependency-free (no `next/headers`) so it is safe to import from `middleware.ts` (Edge runtime).

```ts
import { STRAPI_URL, STRAPI_TOKEN, AUTH_COOKIE, strapiAuthHeaders } from '@/lib/config'
```

- Env vars: **`STRAPI_URL`** and **`STRAPI_TOKEN`** (see `.env.example`). These are the only names read anywhere — never re-read `process.env.STRAPI_*` in a component/action/route; import from `lib/config` instead.
- `STRAPI_TOKEN` is server-only (never `NEXT_PUBLIC_*`). Empty token ⇒ requests fall back to the public role's permissions.
- `strapiAuthHeaders()` returns the `Authorization` header (empty object when no token).

### Data access — `lib/strapi.ts`

Typed Strapi v5 REST client. Prefer these helpers over raw `fetch`:

- Reads: `strapiGet<T>(path)` (`next: { revalidate: 60 }`). Domain fetchers wrap it: `fetchAnimals`, `fetchAnnouncements`, `fetchFosterFamilies`, `fetchAdoptionRequests`, `fetchUsers`, `fetchResource<T>`.
- Writes: `strapiPost` / `strapiPut` / `strapiDelete` (via `strapiMutate`, which wraps the body in `{ data }` as Strapi expects).
- `toCardAnimal()` maps `StrapiAnimalRaw` → the UI-facing `CardAnimal` (derives tag, age/sex labels, cover photo URL, tones).
- Query params follow Strapi v5 REST: `populate[...]`, `filters[status][$ne]=...`, `pagination[pageSize]=...`.

**Exception:** `app/admin/animals/actions.ts` uses raw `fetch` for multipart `/api/upload` (media), which the JSON helpers don't cover — but it still pulls `STRAPI_URL`/`strapiAuthHeaders()` from `lib/config`.

### Auth

- `lib/auth.ts` — `getCurrentUser()` reads the JWT from the `AUTH_COOKIE` httpOnly cookie and calls `/api/users/me?populate=role`; `isAdmin(user)`; `loginWithStrapi` / `registerWithStrapi`.
- `app/api/auth/{login,register,logout,me}/route.ts` — set/clear the cookie and proxy Strapi's `users-permissions` endpoints.
- `middleware.ts` guards `/admin/:path*` (redirects non-admins). Server Actions under `app/admin/**/actions.ts` currently trust the middleware + API token and do **not** re-check admin — see the refactor backlog.
- Client auth state lives in `lib/stores/user-store.ts` (zustand), hydrated by `components/auth-hydrator.tsx` via `/api/auth/me`.

### CMS status

The public cat listing and admin CRUD are wired to Strapi (`fetchAnimals`, admin actions). `lib/placeholder-cats.ts` (`PLACEHOLDER_CATS`, `PlaceholderCat`, `CAT_TINT`) is **still** used by the `adopt-pet` detail/related views and the adoption modal — this dual model (`PlaceholderCat` vs `CardAnimal`) currently breaks `npm run build`; unifying it is item 1 in `docs/REFACTORING.md`.

### Public assets

`public/logo.png` and `public/paw.png` — used via `next/image`.

## Refactoring backlog

`docs/REFACTORING.md` tracks known code-quality debt (auth-in-actions, input validation, form boilerplate, large components, dual cat models, scattered colour maps, missing loading/error states, full admin→Tailwind migration).
