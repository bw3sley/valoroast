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

## Stack notes

Stack and file layout live in `package.json` and the tree; only the non-obvious parts are listed here.

- Next.js 16 App Router with the React Compiler enabled; Tailwind v4 with CSS variable theme tokens.
- Database tables are plural and every column is snake_case in SQL and in the TS schema (Neon via Drizzle `neon-http`).
- HenrikDev and OpenAI are called server-side only; `takumi-js` has a native binding, so `serverExternalPackages` and font tracing are set in `next.config.ts`.
- Share-image fonts live in `assets/fonts/` and are read at runtime.

## Environment

Copy `.env.example` to `.env.local` and fill in `OPENAI_API_KEY`, `OPENAI_MODEL` (optional) and
`DATABASE_URL` (Neon connection string with `?sslmode=require`), `HENRIKDEV_API_KEY` (free Basic key, 30 req/min, from https://api.henrikdev.xyz/dashboard/). Keys
are read only on the server. `NEXT_PUBLIC_SITE_URL` (optional, defaults to `https://valoroast.com`) feeds `metadataBase`, canonical URLs, `robots.txt` and `sitemap.xml`; it is inlined at build time, so the Dockerfile takes it as a build arg. `server-only` is imported by `db/client.ts`, every file in `db/queries/` and `http/errors/`, `http/error-response.ts`, and the Henrik/OpenAI/DB-mapping files in `http/functions/` (`get-player-stats`, `get-henrik-*`, `henrik-fetch`, `generate-roast`, `to-roast-response`). The browser helpers (`post-riot-id`, `request-*`) and pure logic must not import it or any server-only module.

## Analytics (PostHog)

- PostHog (US cloud) is initialized in `src/instrumentation-client.ts` only when `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` is set (inlined at build time, so the Dockerfile takes it as a build arg). Requests go through the `/ingest` reverse proxy defined in `next.config.ts` (`rewrites` + `skipTrailingSlashRedirect`).
- Autocapture and session replay are off. Never send Riot IDs, rival IDs, `roast.name` or free text to PostHog, and never call `identify` with them. `stripShareParam` (`src/utils/strip-share-param.ts`) removes `?r=` from tracked URLs.
- Add events through `trackEvent()` (`src/utils/track-event.ts`) with a name from `ANALYTICS_EVENTS` (`src/constants/analytics-events.ts`) and typed properties in `AnalyticsEventProperties` (`src/types/analytics.ts`). Call it from `useRoastFlowState()` handlers; names stay static, variable data goes in properties.

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
- Keep this file updated when scripts, conventions, or folder rules change.
- Keep the folder-level AGENTS.md files updated when their folder's rules or files change.
- Keep `CLAUDE.md` as a pointer file only.
- Keep the `nextjs-agent-rules` block at the top of this file; `next dev` re-adds it if removed.
