import "server-only";

import type { roasts } from "@/db/schema/roasts";
import type { BadgeKey, MatchResult, RoastResponse } from "@/types/roast";

/** Maps a stored roast row to the API shape. `badge_glyph` holds the badge key. */
export function toRoastResponse(
  row: typeof roasts.$inferSelect,
): RoastResponse {
  return {
    id: row.id,
    name: `${row.riot_game_name}#${row.riot_tag_line}`,
    caseNo: row.case_no,
    hs: row.headshot_percentage,
    wr: row.winrate_percentage,
    acs: row.average_combat_score,
    kd: row.kd ?? 0,
    agent: row.most_used_agent,
    form: row.last_match_results as MatchResult[],
    verdict: row.verdict,
    roast: row.roast_text,
    badge: row.badge_glyph as BadgeKey,
  };
}
