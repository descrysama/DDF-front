# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint (Next.js flat config, eslint.config.mjs)
```

No test runner is configured.

## Stack

- **Next.js 16** — App Router, all pages are Server Components by default
- **React 19** + **TypeScript** (strict mode, `@/*` alias maps to repo root)
- **Tailwind CSS v4** — no `tailwind.config.js`; theme tokens in `app/globals.css` (`@theme inline {}`)
- **shadcn/ui** pattern — `Button` (CVA) and `Card` primitives in `components/ui/`
- **lucide-react** for icons
- Fonts: Geist Sans (body), Geist Mono, Nunito (buttons) — loaded via `next/font/google`

## Architecture

### Design system — two layers

**Layer 1 — CSS variables** defined in `app/design-variables.css` (prefixed `--scf-*`) and shadcn tokens in `app/globals.css` (`:root {}`), then exposed to Tailwind via `@theme inline {}`. Use `hsl(var(--primary))` / Tailwind utilities for shadcn components.

**Layer 2 — TypeScript tokens** in `lib/design-tokens.ts`, exported as the `T` object (e.g. `T.coral`, `T.ink`, `T.bg`). Use these for inline `style={{}}` props. These mirror `app/design-variables.css` exactly — keep them in sync if you add a new color.

```ts
// lib/design-tokens.ts — key values
T.bg          // '#FBFAF7' — page background
T.ink         // '#252840' — primary text
T.coral       // '#F76C70' — brand accent
T.magenta     // '#E84A77' — gradient end
T.surfaceAlt  // '#F4F1EB' — alternating sections
```

`lib/constants.ts` (`DARK_BG`, `CREAM_BG`, `GRAY_50`) is **deprecated** — do not use for new pages. The `about-us` page still references it; migrate if touching that file.

### Styling convention

New pages (homepage `app/page.tsx`) use **inline `style={{}}` props with `T.*` tokens** exclusively — no Tailwind utility classes for colors or spacing. This keeps wave dividers and section transitions predictable.

Older pages (`app/about-us/page.tsx`) still use Tailwind classes with `hsl(var(--primary))`. Don't mix both approaches within a single new page.

### Wave Dividers

`components/wave-divider.tsx` renders SVG waves between sections. The `from`/`to` props must be **solid hex colors**. Export `WAVE_PATH_INV` is available for embedding a wave inside a section (see `about-us` hero for usage).

### Component conventions

- `"use client"` only when state or browser APIs are needed (currently only `components/header.tsx` and `components/animated-counter.tsx`)
- Route-scoped components go in `app/<route>/_components/` (see `app/about-us/_components/`)
- Shared primitives go in `components/ui/` following the CVA + `cn()` pattern
- Page-level data arrays (e.g. `ACTIONS`) live at the top of the page file, not in a separate data file

### CMS (pending)

Cat data lives in `lib/placeholder-cats.ts` (`PLACEHOLDER_CATS`, `PlaceholderCat` type, `CAT_TINT` map). These will be replaced by Strapi REST API calls (`http://localhost:1337/api`). Keep `CatCard` and related markup structurally identical to ease migration.

### Public assets

`public/logo.png` and `public/paw.png` — used via `next/image`.