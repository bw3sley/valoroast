# API route handlers

Route handlers are thin orchestrators. Business logic lives in `src/http/functions/`, `src/db/queries/` and `src/utils/`; see `src/http/AGENTS.md` and `src/db/AGENTS.md`.

## Routes

| Route | Purpose |
|---|---|
| `POST /api/roast` (`roast/route.ts`) | `{ riotId }` -> roast. Checks the dedupe cache first, otherwise Henrik stats -> OpenAI -> persist. |
| `GET /api/roast/[id]` (`roast/[id]/route.ts`) | Stored roast by uuid. Backs the `?r=<id>` share link. |
| `POST /api/rival` (`rival/route.ts`) | `{ riotId, roastId }` -> `RivalComparison`, persists a `roast_challenges` row. |

## Flows

- **roast:** parse body -> `findRecentRoastByDedupeKey(buildDedupeKey(...))` (hit returns `toRoastResponse(cached)` and skips Henrik and OpenAI) -> `getPlayerStats` -> `generateRoast` -> `createRoast` -> `toRoastResponse`.
- **rival:** parse body -> `findRoastById` -> `getPlayerStats` (rival) -> `buildCompare` -> `createChallenge` -> return comparison. It is never cached, so each call costs 2 Henrik requests plus one per uncached match.

## Rules

- Export `async function POST|GET` declarations. Wrap the whole body in `try { ... } catch (error) { return errorResponse(error); }`. Never build error responses by hand.
- Validate input with the zod schemas in `src/http/schemas/` (`safeParse`, with `request.json().catch(() => null)`); on failure throw `InvalidRequestError`.
- Success returns `Response.json(...)`.
- Next.js 16: `params` is a `Promise` and must be awaited. Check `node_modules/next/dist/docs/` before using route handler APIs.
- `GET /api/roast/[id]` returns 400 `invalid_request` for both a malformed uuid and a missing roast. That is the current contract; the client has no 404 handling for it.
- Secrets (`OPENAI_API_KEY`, `HENRIKDEV_API_KEY`, `DATABASE_URL`) are read only on the server and never returned.
- Do not call Henrik or OpenAI from the browser. Client code calls these routes through `src/http/functions/request-*.ts`.
- Adding a route: validate with a schema in `http/schemas/`, reuse `errorResponse`, add a client helper in `http/functions/` if the UI calls it, and update this file and the root structure block.
