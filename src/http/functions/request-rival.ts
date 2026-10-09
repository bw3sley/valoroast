import type { RivalComparison } from "@/types/roast";

import { postRiotId } from "./post-riot-id";

export function requestRival(riotId: string, roastId: string) {
  return postRiotId<RivalComparison>("/api/rival", riotId, { roastId });
}
