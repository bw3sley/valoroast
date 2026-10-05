<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project Context

Valoroast is being migrated from a plain-HTML prototype (`valoroast/index.html`, mocked data) to this Next.js app. The HTML prototype is the visual and behavioral reference: sizing, surfaces, spacing, colors, copy and interaction states come from it unless `DESIGN.md` says otherwise.

## Package Manager

**Always use `npm`.** Never use `pnpm` or `yarn`.

```bash
npm install           # install deps
npm run dev           # start Next dev server
npm run build         # production build (includes type-check)
npm run start         # serve the production build
npm run lint          # lint + format check via Biome
npm run format        # format via Biome
npm run db:generate   # generate a SQL migration from src/db/schema
npm run db:migrate    # apply migrations to DATABASE_URL (Neon)
npm run db:studio     # Drizzle Studio
```

## Stack

- **Framework** - Next.js 16, App Router, React 19 with the React Compiler enabled
- **Styling** - Tailwind CSS v4 + CSS variable theme tokens
- **UI primitives** - local components in `src/components/ui/` built with Radix UI (`radix-ui`) where needed
- **Variants** - `tailwind-variants` + `cn()` (`clsx` + `tailwind-merge`)
- **Fonts** - `next/font/google`: Anton (display), Barlow Condensed (labels/actions), Barlow (body)
- **Icons** - Lucide React
- **AI** - Vercel `ai` SDK + `@ai-sdk/openai` (server-only, `src/http/functions/generate-roast.ts`)
- **Data fetching** - `@tanstack/react-query` mutations calling our own `/api/*` route handlers
- **State** - Zustand + Immer stores in `src/store/`
- **Database** - Neon Postgres via Drizzle ORM (`pg` driver), Zod validators from `drizzle-zod`; tables are plural and every column is snake_case in SQL and in the TS schema
- **Player data** - HenrikDev unofficial Valorant API, called server-side only
- **Notifications** - Sonner
- **Linting / formatting** - Biome
- **Language** - TypeScript 5

## Project Structure

```
public/               # static assets served from `/`
src/
  app/
    layout.tsx        # root layout, fonts, metadata, QueryProvider, Toaster
    api/
      roast/route.ts  # POST { riotId } -> real stats + OpenAI roast
      rival/route.ts  # POST { riotId } -> rival stats only
    globals.css       # global styles and theme tokens
    (roasts)/         # pathless route group for the app, serves `/`
      layout.tsx      # header, footer, dialogs, RoastFlowProvider
      page.tsx        # home screen (hero, scan, result)
  components/
    AGENTS.md         # source of truth for UI component rules
    ui/               # reusable UI primitives
    *.tsx             # Valoroast feature components (header, roast-form, verdict-card, dialogs...)
  contexts/           # providers + consumer hooks (query-provider, roast-flow-context)
  hooks/              # reusable hooks (use-roast-flow-state)
  db/
    client.ts         # server-only pg Pool + drizzle instance
    schema/           # one file per table (roasts, roast-challenges)
    validators/       # drizzle-zod insert/select schemas
    queries/          # one query helper per file (create-roast, find-roast-by-id, ...)
  constants/          # static values: badges, verdicts, scan lines, Henrik/OpenAI config, error messages
  http/
    errors/           # one server-only error class per file (app-error, player-not-found-error, ...)
    functions/        # every function that makes an HTTP/API call (Henrik + OpenAI server-only, request-* client)
    schemas/          # zod schemas for requests and external API responses
  lib/
    utils.ts          # `cn()` - the only file allowed in lib/
  store/              # zustand + immer stores (roast-flow-store)
  types/              # shared TypeScript types (roast)
  utils/              # pure helpers (compare, player stats calculation, case number, error-response, canvas card download)
drizzle/               # generated SQL migrations (commit them)
drizzle.config.ts     # drizzle-kit config, reads DATABASE_URL from `.env.local`
.env.example          # required env vars; copy to `.env.local`
README.md             # project overview
DESIGN.md             # product and design system guidance
CLAUDE.md             # points agents back to this file
```

## Environment

Copy `.env.example` to `.env.local` and fill in `OPENAI_API_KEY`, `OPENAI_MODEL` (optional) and
`DATABASE_URL` (Neon connection string with `?sslmode=require`), `HENRIKDEV_API_KEY` (free Basic key, 30 req/min, from https://api.henrikdev.xyz/dashboard/). Keys
are read only on the server; server API functions in `http/functions/` and every file in `http/errors/` import `server-only`.

## Path Aliases

`@/*` maps to `./src/*` (set in `tsconfig.json`).

## Design Reference

For UI, layout, styling, and visual refinement work, read and follow `@DESIGN.md` before making changes.

## Migrating the HTML Prototype

- Translate repeated patterns from `valoroast/index.html` into `src/components/ui/` primitives; translate one-off markup into page-local JSX that composes those primitives.
- Create a shared `/ui` component only when the pattern is generic (no Valoroast business meaning) **and** the live UI renders it. Do not add primitives speculatively.
- Keep Valoroast-specific pieces (logo, verdict stamp, rank emblem, stat tile, compare row) local to the page or in feature components above the `/ui` layer, not inside it.
- Inline `style` values from the prototype become semantic token utilities; never copy hex values into components.
- Unicode glyphs from the prototype (`✕ ◆ ⚑ ☠ ★ ✷`) become Lucide icons (`X`, `Diamond`, `Flag`, `Skull`, `Star`, `Sparkle`).
- Verify new primitives on a temporary catalog route or the first migrated screen; delete temporary routes before committing.

## Server & Client Components

- Components are Server Components by default.
- Add `"use client"` only to files that need browser interactivity, state, effects, or Radix primitives with internal state (dialogs, progress, toaster).
- Static primitives (`button`, `input`, `badge`, `eyebrow`, `card`, `separator`) stay server-compatible; pass event handlers to them from a client parent.
- Keep browser-only logic (timers, clipboard, canvas, `window`) in client components.

## Key Conventions

- `src/lib/` holds only `utils.ts`; new code goes in `constants/`, `http/`, `store/`, `types/` or `utils/`.
- Reusable UI belongs in `src/components/ui/`.
- Component rules for `src/components/ui/` live in `src/components/AGENTS.md` and must be followed.
- Use `cn()` from `src/lib/utils.ts` for class merging.
- Use semantic Tailwind tokens like `bg-background`, `text-foreground`, `border-border`, and `ring-ring` instead of hardcoded colors in components.
- Prefer Radix primitives for accessibility-sensitive controls such as dialogs, menus, popovers, and selects.
- Use named exports only. No default exports in shared components (Next.js route files like `page.tsx` and `layout.tsx` are the exception).
- Write functions as `function fn() {}` declarations, not `const fn = () => {}`. Applies to
  components, hooks, and standalone utilities. Inline one-off callbacks
  (e.g. `array.map((x) => ...)`, `onClick={() => ...}`) are unaffected — this rule targets named
  function definitions, not throwaway callback expressions.
- Biome is the linter and formatter. Do not add ESLint, oxlint or Prettier config.

## Documentation Rules

- Keep `DESIGN.md` updated when product visual language, layout rules, or token strategy changes.
- Keep this file updated when stack, scripts, or folder structure changes.
- Keep `CLAUDE.md` as a pointer file only.
- Keep the `nextjs-agent-rules` block at the top of this file; `next dev` re-adds it if removed.
