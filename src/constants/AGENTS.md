# Constants

Static values only: config numbers, copy, prompt text and key lists. Flat folder, no barrel, one concern per file.

## Files

| File | Holds |
|---|---|
| `api-errors.ts` | `API_ERROR_MESSAGES` (one user-facing message per `ApiErrorCode`), `NETWORK_ERROR_MESSAGE` |
| `badges.ts` | `BADGE_KEYS` (`as const`), `BADGES` (name, Lucide icon, description per key) |
| `henrik.ts` | `HENRIK_BASE_URL`, `MATCH_COUNT`, `FORM_LENGTH`, `HENRIK_AFFINITY_OVERRIDES` |
| `openai.ts` | `DEFAULT_OPENAI_MODEL`, `ROAST_MAX_OUTPUT_TOKENS`, `ROAST_SYSTEM_PROMPT` |
| `og.ts` | Share-image size, content type, cache header, font names and `OG_COLORS` (hex copies of the theme tokens; the image renderer cannot read CSS variables) |
| `roast-storage.ts` | `DEDUPE_WINDOW_DAYS`, `DELETE_TOKEN_LENGTH` |
| `scan-lines.ts` | `SCAN_LINES`, `SCAN_LINE_INTERVAL_MS` |
| `site.ts` | `SITE_NAME`, `SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_THEME_COLOR`, `SITE_DEFAULT_URL` (metadata, manifest) |
| `verdicts.ts` | `VERDICTS` (`as const`) |

## Rules

- Named exports, `UPPER_SNAKE_CASE`, kebab-case filenames.
- Lists that feed types or zod enums use `as const`. `BadgeKey` and `Verdict` in `src/types/roast.ts` are derived from `BADGE_KEYS` and `VERDICTS`, so the constants are the source of truth; adding a value there updates the types and the roast output schema.
- Lookup tables are `Record<Key, ...>` keyed by a type from `@/types/roast`, so a missing entry fails the type-check.
- Constants import only from `@/types` (type-only) and `lucide-react`. Never import from `http/`, `store/`, `hooks/` or `components/`.
- No `server-only` here; these files are used by both server and client code. No secrets and no env-derived values (read env vars where they are used).
- `badges.ts` holds Lucide components, which are not serializable. The API returns the badge key and the client maps it back with `BADGES[key]`.
- Give tunables a short "why" comment (see the Henrik rate-limit notes in `henrik.ts`). Do not raise `MATCH_COUNT` without checking the 30 req/min Henrik limit.
- Not for constants/: runtime state (`store/`), types (`types/`), functions (`utils/` or `http/functions/`).
- Known duplicate: `GENERIC_ERROR` in `src/hooks/use-roast-flow-state.ts` repeats `API_ERROR_MESSAGES.server_error`; prefer the constant in new code.
