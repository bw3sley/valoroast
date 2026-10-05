import "server-only";

import { HENRIK_AFFINITY_OVERRIDES } from "@/constants/henrik";
import { InvalidRequestError } from "@/http/errors/invalid-request-error";
import { NoMatchesError } from "@/http/errors/no-matches-error";
import { calculatePlayerStats } from "@/utils/calculate-player-stats";
import { parseRiotId } from "@/utils/parse-riot-id";

import { getHenrikAccount } from "./get-henrik-account";
import { getHenrikMatches } from "./get-henrik-matches";

export async function getPlayerStats(riotId: string) {
  const { name, tag } = parseRiotId(riotId);
  if (!name || !tag) throw new InvalidRequestError("Use Username#TAG");

  const account = await getHenrikAccount(name, tag);
  const affinity = HENRIK_AFFINITY_OVERRIDES[account.region] ?? account.region;
  const matches = await getHenrikMatches(affinity, name, tag);

  const stats = calculatePlayerStats(account.puuid, matches);
  if (!stats) throw new NoMatchesError();
  return stats;
}
