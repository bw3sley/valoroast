import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { roasts } from "./roasts";

export const roast_challenges = pgTable(
  "roast_challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roast_id: uuid("roast_id")
      .notNull()
      .references(() => roasts.id, { onDelete: "cascade" }),
    opponent_riot_game_name: text("opponent_riot_game_name").notNull(),
    opponent_riot_tag_line: text("opponent_riot_tag_line").notNull(),
    challenge_text: text("challenge_text").notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("roast_challenges_roast_id_idx").on(table.roast_id)],
);
