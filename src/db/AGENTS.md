# Database

Neon Postgres through Drizzle ORM over the Neon serverless HTTP driver (`drizzle-orm/neon-http` + `@neondatabase/serverless`). Validators come from `drizzle-zod`.

## Layout

- `client.ts` - server-only; exports `db` built from `DATABASE_URL` and the schema.
- `schema/` - one table per file, re-exported from `schema/index.ts` (drizzle-kit reads the barrel; a table not exported there is invisible).
- `validators/` - `insert<Entity>Schema` / `select<Entity>Schema` per table via `createInsertSchema` / `createSelectSchema`. No `server-only`, so client-safe.
- `queries/` - one helper per file, all `server-only`.

## Tables

- **`roasts`** - immutable snapshot of a roast: uuid `id`, `delete_token_hash`, `dedupe_key`, optional `request_idempotency_key_hash` (unique), Riot name/tag, `case_no`, stats (`headshot_percentage`, `winrate_percentage`, `average_combat_score`, nullable `kd`, `most_used_agent`, `last_match_results text[]`), `verdict`, `roast_text`, badge fields, `stats_source_provider`, `created_at`. Check constraints: percentages 0-100, `last_match_results` at most 5 entries of `W`/`L`. Indexes on `(dedupe_key, created_at desc)` and `created_at`.
- **`roast_challenges`** - `roast_id` (FK to `roasts.id`, `ON DELETE CASCADE`), opponent name/tag, `challenge_text`, `created_at`. Index on `roast_id`.

There are no `relations()` helpers, so `db.query` relational queries are not set up.

## Conventions

- Table names are plural snake_case; every column is snake_case in SQL and in the TS key, passed explicitly (`uuid("roast_id")`). No `casing` option.
- Timestamps are `timestamp(..., { withTimezone: true })`.
- Name indexes `<table>_<cols>_idx` and checks `<table>_<rule>`.
- Query helpers: filename is the kebab-case function name; inferred return types; single-row finders return `row ?? null`; creators use `.insert().values().returning()` and return the created row. Insert inputs are typed as `Omit<typeof table.$inferInsert, "id" | "created_at" ...>`.
- `createRoast` generates the delete token, stores only its hash, and returns the plain token once as `{ roast, delete_token }`. Never store or log the plain token. The idempotency key is hashed the same way. `buildDedupeKey` hashes lowercased, trimmed `name#tag` plus intensity.
- Roasts are immutable; there are no update helpers. Deleting a roast cascades to its challenges.
- Import schemas from `@/db/schema/<file>` in validators; use `@/db/...` aliases elsewhere.
- Only server code may import `client.ts` or `queries/*`.

## Pitfalls

- The Neon HTTP driver has no interactive transactions. Use single statements or `db.batch`.
- `DATABASE_URL` is not validated in `client.ts`; a missing value fails at the first query.
- `kd` is nullable; callers handle null (`to-roast-response` defaults to 0).
- A duplicate non-null `request_idempotency_key_hash` throws a unique violation; nulls are allowed many times.

## Migrations

1. Edit `schema/` (and export new tables from `schema/index.ts`).
2. `npm run db:generate` and review the generated SQL in `drizzle/`.
3. `npm run db:migrate` (applies to `DATABASE_URL`).
4. Commit the `.sql` file together with `drizzle/meta/` (snapshot and journal).

Never hand-edit generated SQL, snapshots or the journal. `drizzle.config.ts` loads only `.env.local`. There is no `push` script. Use `npm run db:studio` to inspect data.
