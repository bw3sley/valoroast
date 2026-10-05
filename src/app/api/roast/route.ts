import { InvalidRequestError } from "@/http/errors/invalid-request-error";
import { generateRoast } from "@/http/functions/generate-roast";
import { getPlayerStats } from "@/http/functions/get-player-stats";
import { riotIdRequestSchema } from "@/http/schemas/riot-id";
import { errorResponse } from "@/utils/error-response";

export async function POST(request: Request) {
  try {
    const body = riotIdRequestSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!body.success) throw new InvalidRequestError("Use Username#TAG");

    const { riotId } = body.data;
    const stats = await getPlayerStats(riotId);
    return Response.json(await generateRoast(riotId, stats));
  } catch (error) {
    return errorResponse(error);
  }
}
