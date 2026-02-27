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
- **Tailwind CSS v4** — no `tailwind.config.js`; all theme tokens live in `app/globals.css` inside `@theme inline {}`
- **shadcn/ui** pattern — `Button` (CVA) and `Card` primitives in `components/ui/`
- **lucide-react** for icons

## Architecture

### Theming

Design tokens are CSS variables defined in `app/globals.css` (`:root {}`), then mapped to Tailwind utilities in the `@theme inline {}` block. Use `hsl(var(--primary))` for the brand rose-pink. Never hardcode color values that already have a token.

Structural colors not in the token system (dark backgrounds, off-whites) are centralized in **`lib/constants.ts`**:

```ts
DARK_BG   // "#393b4f" — dark sections + waves, matches the header gradient start
CREAM_BG  // "#fff1f2" — Story section background
GRAY_50   // "#f9fafb" — alternating light sections
```

When adding a new dark or cream section, import from `lib/constants.ts` and apply via `style={{ background: DARK_BG }}` (not a Tailwind class) so that `WaveDivider` colors stay in sync automatically.

### Wave Dividers

`components/wave-divider.tsx` renders SVG waves between sections. The `from`/`to` props must be **solid hex colors** — gradient sections will cause a visible color mismatch at the edges. This is why dark sections use a solid `DARK_BG` rather than the `bg-gradient-to-r` used in the Hero.

The Hero is the only exception: it uses a CSS gradient and embeds its own wave internally (absolutely positioned SVG at the bottom of the section). It exports `WAVE_PATH_INV` for reuse.

### Component conventions

- `"use client"` only when state or browser APIs are needed — currently only `components/header.tsx`
- New shared UI primitives go in `components/ui/` following the CVA + `cn()` pattern
- Page-specific data arrays (e.g. `ACTIONS`) live at the top of `app/page.tsx`

### CMS (pending)

Cat cards and blog articles are placeholders. They will be fetched from **Strapi**. Keep placeholder markup structurally identical to what the real data will produce to ease the migration.

### Public assets

Only two images: `public/logo.png` and `public/paw.png`. Both are used via `next/image`.
