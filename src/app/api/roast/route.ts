import { BADGES } from "@/constants/badges";
import { buildDedupeKey, createRoast } from "@/db/queries/create-roast";
import { findRecentRoastByDedupeKey } from "@/db/queries/find-recent-roast-by-dedupe-key";
import { errorResponse } from "@/http/error-response";
import { InvalidRequestError } from "@/http/errors/invalid-request-error";
import { generateRoast } from "@/http/functions/generate-roast";
import { getPlayerStats } from "@/http/functions/get-player-stats";
import { toRoastResponse } from "@/http/functions/to-roast-response";
import { riotIdRequestSchema } from "@/http/schemas/riot-id";

export async function POST(request: Request) {
  try {
    const body = riotIdRequestSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!body.success) throw new InvalidRequestError("Use Username#TAG");

    const { name, tag } = body.data;

    // Cached roasts skip HenrikDev (30 req/min) and OpenAI entirely.
    const cached = await findRecentRoastByDedupeKey(
      buildDedupeKey({ riot_game_name: name, riot_tag_line: tag }),
    );
    if (cached) return Response.json(toRoastResponse(cached));

    const { stats, account } = await getPlayerStats(name, tag);
    const output = await generateRoast(`${account.name}#${account.tag}`, stats);
    const badge = BADGES[output.badge];

    const { roast } = await createRoast({
      riot_game_name: account.name,
      riot_tag_line: account.tag,
      region: account.region,
      case_no: output.caseNo,
      headshot_percentage: stats.hs,
      winrate_percentage: stats.wr,
      average_combat_score: stats.acs,
      kd: stats.kd,
      most_used_agent: stats.agent,
      last_match_results: stats.form,
      verdict: output.verdict,
      roast_text: output.roast,
      badge_name: badge.name,
      badge_glyph: output.badge,
      badge_description: badge.description,
      stats_source_provider: "henrikdev",
    });

    return Response.json(toRoastResponse(roast));
  } catch (error) {
    return errorResponse(error);
  }
}
