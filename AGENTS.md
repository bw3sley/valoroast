<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project Context

Valoroast was migrated from a plain-HTML prototype (`valoroast/index.html`, mocked data) to this Next.js app. The prototype is no longer in the repo; `DESIGN.md` and the existing components are now the visual and behavioral reference. Mentions of the prototype below are historical.

## Package Manager

**Always use `npm`.** Never use `pnpm` or `yarn`.

```bash
npm install           # install deps
npm run dev           # start Next dev server
npm run build         # production build (includes type-check)
npm run start         # serve the production build
npm run lint          # lint + format check via Biome
npm run format        # format via Biome
npm run lint:fix      # apply Biome fixes (check --write --unsafe)
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
- **Database** - Neon Postgres via Drizzle ORM (Neon serverless HTTP driver, `drizzle-orm/neon-http`), Zod validators from `drizzle-zod`; tables are plural and every column is snake_case in SQL and in the TS schema
- **Player data** - HenrikDev unofficial Valorant API, called server-side only
- **Share images** - `takumi-js/response` (`ImageResponse`, native binding; `serverExternalPackages` + font tracing set in `next.config.ts`)
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
      AGENTS.md       # route handler rules
      roast/route.ts  # POST { riotId } -> real stats + OpenAI roast (deduped, persisted)
      roast/[id]/route.ts # GET stored roast by uuid (share link `?r=<id>`)
      og/[id]/route.tsx   # GET 1200x630 PNG share image for a roast (takumi-js), falls back to the default card
      rival/route.ts  # POST { riotId, roastId } -> rival stats, comparison, persisted challenge
    globals.css       # global styles and theme tokens
    opengraph-image.tsx, twitter-image.tsx # default 1200x630 share cards (takumi-js)
    icon.tsx, apple-icon.tsx               # generated app icons (favicon.ico stays static)
    manifest.ts, robots.ts, sitemap.ts     # web manifest, robots.txt, sitemap.xml
    (roasts)/         # pathless route group for the app, serves `/`
      layout.tsx      # header, footer, dialogs, RoastFlowProvider
      page.tsx        # server page: `generateMetadata` for `?r=<id>` (title, OG/X tags, noindex) + <HomeScreen />
  components/
    AGENTS.md         # source of truth for UI component rules
    ui/               # reusable UI primitives
    *.tsx             # Valoroast feature components (header, roast-form, verdict-card, home-screen, dialogs...)
    og/               # share-image cards rendered by takumi-js (server-only, inline styles with hex from constants/og.ts)
  contexts/           # providers + consumer hooks (query-provider, roast-flow-context)
  hooks/              # reusable hooks (use-roast-flow-state)
  db/
    AGENTS.md         # database rules
    client.ts         # server-only neon-http drizzle instance
    schema/           # one file per table (roasts, roast-challenges)
    validators/       # drizzle-zod insert/select schemas
    queries/          # one query helper per file (create-roast, create-challenge, find-roast-by-id, find-recent-roast-by-dedupe-key)
  constants/          # static values: badges, verdicts, scan lines, Henrik/OpenAI config, roast storage, error messages (see constants/AGENTS.md)
  http/
    AGENTS.md         # HTTP layer rules
    error-response.ts # server-only errorResponse() used by every route handler
    errors/           # one server-only error class per file (app-error, player-not-found-error, ...)
    functions/        # Henrik/OpenAI calls and DB-row mapping (server-only), pure logic (build-compare, calculate-player-stats), browser fetch helpers (post-riot-id, request-roast, request-rival)
    schemas/          # zod schemas for requests and external API responses
  lib/
    utils.ts          # `cn()` - the only file allowed in lib/
  store/              # zustand + immer stores (roast-flow-store); see store/AGENTS.md
  types/              # shared TypeScript types (roast)
  utils/              # helpers: canvas card download, `getSiteUrl`, share-image/icon response builders and font loader (server-only)
assets/               # README cover and share-image fonts (`assets/fonts/`: Anton + Barlow Condensed Bold, OFL, read at runtime)
drizzle/               # generated SQL migrations (commit them)
drizzle.config.ts     # drizzle-kit config, reads DATABASE_URL from `.env.local`
neon.ts               # Neon project config
.env.example          # required env vars; copy to `.env.local`
README.md             # project overview
DESIGN.md             # product and design system guidance
CLAUDE.md             # points agents back to this file
```

## Environment

Copy `.env.example` to `.env.local` and fill in `OPENAI_API_KEY`, `OPENAI_MODEL` (optional) and
`DATABASE_URL` (Neon connection string with `?sslmode=require`), `HENRIKDEV_API_KEY` (free Basic key, 30 req/min, from https://api.henrikdev.xyz/dashboard/). Keys
are read only on the server. `NEXT_PUBLIC_SITE_URL` (optional, defaults to `https://valoroast.com`) feeds `metadataBase`, canonical URLs, `robots.txt` and `sitemap.xml`; it is inlined at build time, so the Dockerfile takes it as a build arg. `server-only` is imported by `db/client.ts`, every file in `db/queries/` and `http/errors/`, `http/error-response.ts`, and the Henrik/OpenAI/DB-mapping files in `http/functions/` (`get-player-stats`, `get-henrik-*`, `henrik-fetch`, `generate-roast`, `to-roast-response`). The browser helpers (`post-riot-id`, `request-*`) and pure logic must not import it or any server-only module.

## Path Aliases

`@/*` maps to `./src/*` (set in `tsconfig.json`).

## Design Reference

For UI, layout, styling, and visual refinement work, read and follow `@DESIGN.md` before making changes.

## Migrating the HTML Prototype (historical)

The prototype file is gone; these rules still describe how UI patterns were translated.

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

- `src/lib/` holds only `utils.ts`; new code goes in `constants/`, `db/`, `http/`, `store/`, `types/`, `hooks/`, `contexts/` or `utils/`.
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
- Exception: action members inside a zustand `immer((set) => ({...}))` object may be arrow functions (see `src/store/AGENTS.md`).
- Biome is the linter and formatter. Do not add ESLint, oxlint or Prettier config.

## Folder Rules

Each of these has its own AGENTS.md that must be followed when working there:

- `src/components/AGENTS.md` - UI primitives
- `src/app/api/AGENTS.md` - route handlers
- `src/http/AGENTS.md` - errors, schemas, Henrik/OpenAI functions, client request helpers
- `src/db/AGENTS.md` - schema, validators, queries, migrations
- `src/constants/AGENTS.md` - static values
- `src/store/AGENTS.md` - zustand stores

## Documentation Rules

- Keep `DESIGN.md` updated when product visual language, layout rules, or token strategy changes.
- Keep this file updated when stack, scripts, or folder structure changes.
- Keep the folder-level AGENTS.md files updated when their folder's rules or files change.
- Keep `CLAUDE.md` as a pointer file only.
- Keep the `nextjs-agent-rules` block at the top of this file; `next dev` re-adds it if removed.
