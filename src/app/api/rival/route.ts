import { createChallenge } from "@/db/queries/create-challenge";
import { findRoastById } from "@/db/queries/find-roast-by-id";
import { errorResponse } from "@/http/error-response";
import { InvalidRequestError } from "@/http/errors/invalid-request-error";
import { buildCompare } from "@/http/functions/build-compare";
import { getPlayerStats } from "@/http/functions/get-player-stats";
import { rivalRequestSchema } from "@/http/schemas/riot-id";

export async function POST(request: Request) {
  try {
    const body = rivalRequestSchema.safeParse(
      await request.json().catch(() => null),
    );

    if (!body.success) {
      throw new InvalidRequestError("Use Username#TAG");
    }

    const { name, tag, roastId } = body.data;

    const roast = await findRoastById(roastId);

    if (!roast) {
      throw new InvalidRequestError("Roast not found");
    }

    const { stats, account } = await getPlayerStats(name, tag);

    const comparison = buildCompare(
      {
        name: `${roast.riot_game_name}#${roast.riot_tag_line}`,
        hs: roast.headshot_percentage,
        wr: roast.winrate_percentage,
        acs: roast.average_combat_score,
      },
      { name: `${account.name}#${account.tag}`, ...stats },
    );

    await createChallenge({
      roast_id: roast.id,
      opponent_riot_game_name: account.name,
      opponent_riot_tag_line: account.tag,
      challenge_text: comparison.outcome.taunt,
    });

    return Response.json(comparison);
  } catch (error) {
    return errorResponse(error);
  }
}
