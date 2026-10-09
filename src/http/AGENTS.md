# HTTP layer

Everything that talks to or about HTTP: error classes, zod schemas, external API calls and the browser helpers that call our own `/api/*`.

## Layout

- `error-response.ts` - server-only `errorResponse(error)`. An `AppError` becomes `{ code, message }` with its status; anything else is logged and returned as 500 `server_error`.
- `errors/` - one server-only error class per file, all extending `AppError`.
- `schemas/` - zod schemas for requests (`riot-id`) and external payloads (`henrik-account`, `henrik-match`, `roast-output`). Not server-only.
- `functions/` - three kinds of file (see below).

## functions/ is mixed: respect the boundary

- **Server-only (`import "server-only"`):** `henrik-fetch`, `get-henrik-account`, `get-henrik-matches`, `get-player-stats`, `generate-roast`, `to-roast-response`.
- **Pure logic (no server-only, no I/O):** `calculate-player-stats`, `build-compare`.
- **Browser helpers:** `post-riot-id` (`RequestError`, `requestJson`), `request-roast`, `request-rival`. They must never import a server-only module, and must not import `server-only` themselves.

## Errors

| Class | code | status |
|---|---|---|
| `InvalidRequestError` | `invalid_request` | 400 |
| `PlayerNotFoundError` | `player_not_found` | 404 |
| `NoMatchesError` | `no_matches` | 422 |
| `RateLimitedError` | `rate_limited` | 429 |
| `UpstreamError` | `upstream_error` | 502 |

`server_error` (500) is produced only by `errorResponse`.

Adding an error: new subclass of `AppError` in `errors/`, a new member of `ApiErrorCode` in `src/types/roast.ts`, and a user-facing message in `API_ERROR_MESSAGES` (`src/constants/api-errors.ts`). The browser shows only those constant messages, never the server's `message`.

## Henrik

- `henrik-fetch` is the only gateway to Henrik. Auth is `HENRIKDEV_API_KEY` in the `Authorization` header (missing key -> `UpstreamError`). Responses are unwrapped via `body.data` and parsed with a zod schema.
- Status mapping: 404 -> `PlayerNotFoundError`, 429 -> `RateLimitedError`, other non-OK -> `UpstreamError`, schema mismatch -> `UpstreamError("Unexpected Henrik response")`. Keep schemas to fields actually used, since a too-strict schema turns a harmless shape change into a 502.
- Rate limit is 30 req/min. A stats lookup is 2 calls plus 1 per uncached match. Keep `MATCH_COUNT` at 5 and do not raise it casually.
- Always `cache: "no-store"`. Match payloads exceed Next's 2 MB data cache; the real cache is the roast dedupe row in Neon (`DEDUPE_WINDOW_DAYS`).
- The matches endpoint only accepts `na|eu|ap|kr`; `HENRIK_AFFINITY_OVERRIDES` in `src/constants/henrik.ts` maps `latam`/`br` to `na`.

## OpenAI

`generate-roast` uses the AI SDK `Output.object` with `roastOutputSchema`. Model comes from `OPENAI_MODEL` (default in `constants/openai.ts`). Failures are logged and rethrown as `UpstreamError("Roast generation failed")`; do not leak the original error to the client.

## Conventions

- One primary export per file, kebab-case filename matching the export, named exports, `function` declarations. Exceptions already in the tree: `schemas/riot-id.ts` (several schemas) and `functions/post-riot-id.ts` (`RequestError`, `postRiotId`, `requestJson`).
- Use `@/` aliases; `./` only for same-folder siblings.
- Shared literals (URLs, limits, prompts, messages) live in `src/constants/`, not inline.
