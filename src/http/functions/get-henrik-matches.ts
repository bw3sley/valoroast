import "server-only";

import { MATCH_COUNT } from "@/constants/henrik";
import { henrikMatchesSchema } from "@/http/schemas/henrik-match";

import { henrikFetch } from "./henrik-fetch";

export function getHenrikMatches(affinity: string, name: string, tag: string) {
  return henrikFetch(
    `/v4/matches/${affinity}/pc/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
    henrikMatchesSchema,
    { mode: "competitive", size: MATCH_COUNT },
  );
}
