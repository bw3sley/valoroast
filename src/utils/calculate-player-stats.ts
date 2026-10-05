import { FORM_LENGTH } from "@/constants/henrik";
import type { HenrikMatch } from "@/http/schemas/henrik-match";
import type { MatchResult, PlayerStats } from "@/types/roast";

/** Returns null when none of the matches include the player. */
export function calculatePlayerStats(
  puuid: string,
  matches: HenrikMatch[],
): PlayerStats | null {
  let wins = 0;
  let score = 0;
  let rounds = 0;
  let headshots = 0;
  let shots = 0;
  const results: MatchResult[] = [];
  const agents = new Map<string, number>();

  for (const match of matches) {
    const player = match.players.find((entry) => entry.puuid === puuid);
    if (!player) continue;

    const won =
      match.teams.find((team) => team.team_id === player.team_id)?.won ?? false;
    if (won) wins++;
    results.push(won ? "W" : "L");

    score += player.stats.score;
    rounds += match.rounds.length;
    headshots += player.stats.headshots;
    shots +=
      player.stats.headshots + player.stats.bodyshots + player.stats.legshots;
    agents.set(player.agent.name, (agents.get(player.agent.name) ?? 0) + 1);
  }

  if (results.length === 0) return null;

  const [agent] = [...agents.entries()].sort((a, b) => b[1] - a[1])[0];

  return {
    hs: shots ? Math.round((headshots / shots) * 100) : 0,
    wr: Math.round((wins / results.length) * 100),
    acs: rounds ? Math.round(score / rounds) : 0,
    agent,
    form: results.slice(0, FORM_LENGTH),
  };
}
