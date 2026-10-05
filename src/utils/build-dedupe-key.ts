import { hash } from "ohash";

interface DedupeKeyInput {
  riot_game_name: string;
  riot_tag_line: string;
  roast_intensity?: string | null;
}

export function buildDedupeKey({
  riot_game_name,
  riot_tag_line,
  roast_intensity,
}: DedupeKeyInput) {
  return hash({
    riot_id: `${riot_game_name}#${riot_tag_line}`.trim().toLowerCase(),
    roast_intensity: roast_intensity ?? null,
  });
}
