import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const roasts = pgTable(
  "roasts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    delete_token_hash: text("delete_token_hash").notNull(),
    request_idempotency_key_hash: text("request_idempotency_key_hash"),
    dedupe_key: text("dedupe_key").notNull(),
    riot_game_name: text("riot_game_name").notNull(),
    riot_tag_line: text("riot_tag_line").notNull(),
    region: text("region"),
    case_no: text("case_no").notNull(),
    headshot_percentage: integer("headshot_percentage").notNull(),
    winrate_percentage: integer("winrate_percentage").notNull(),
    average_combat_score: integer("average_combat_score").notNull(),
    most_used_agent: text("most_used_agent").notNull(),
    last_match_results: text("last_match_results").array().notNull(),
    verdict: text("verdict").notNull(),
    roast_text: text("roast_text").notNull(),
    badge_name: text("badge_name").notNull(),
    badge_glyph: text("badge_glyph").notNull(),
    badge_description: text("badge_description").notNull(),
    roast_intensity: text("roast_intensity"),
    stats_source_provider: text("stats_source_provider").notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("roasts_request_idempotency_key_hash_idx").on(
      table.request_idempotency_key_hash,
    ),
    index("roasts_dedupe_key_created_at_idx").on(
      table.dedupe_key,
      table.created_at.desc(),
    ),
    index("roasts_created_at_idx").on(table.created_at),
    check(
      "roasts_headshot_percentage_range",
      sql`${table.headshot_percentage} between 0 and 100`,
    ),
    check(
      "roasts_winrate_percentage_range",
      sql`${table.winrate_percentage} between 0 and 100`,
    ),
    check(
      "roasts_last_match_results_valid",
      sql`cardinality(${table.last_match_results}) <= 5 and ${table.last_match_results} <@ array['W', 'L']::text[]`,
    ),
  ],
);
