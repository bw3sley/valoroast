import { InvalidRequestError } from "@/http/errors/invalid-request-error";
import { getPlayerStats } from "@/http/functions/get-player-stats";
import { riotIdRequestSchema } from "@/http/schemas/riot-id";
import type { Rival } from "@/types/roast";
import { errorResponse } from "@/utils/error-response";

export async function POST(request: Request) {
  try {
    const body = riotIdRequestSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!body.success) throw new InvalidRequestError("Use Username#TAG");

    const { riotId } = body.data;
    const { hs, wr, acs } = await getPlayerStats(riotId);
    const rival: Rival = { name: riotId, hs, wr, acs };
    return Response.json(rival);
  } catch (error) {
    return errorResponse(error);
  }
}
