import "server-only";

import { HENRIK_AFFINITY_OVERRIDES } from "@/constants/henrik";
import { NoMatchesError } from "@/http/errors/no-matches-error";

import { calculatePlayerStats } from "./calculate-player-stats";
import { getHenrikAccount } from "./get-henrik-account";
import { getHenrikMatches } from "./get-henrik-matches";

export async function getPlayerStats(name: string, tag: string) {
  const account = await getHenrikAccount(name, tag);
  const affinity = HENRIK_AFFINITY_OVERRIDES[account.region] ?? account.region;
  const matches = await getHenrikMatches(affinity, name, tag);

  const stats = calculatePlayerStats(account.puuid, matches);
  if (!stats) throw new NoMatchesError();
  return { stats, account };
}
