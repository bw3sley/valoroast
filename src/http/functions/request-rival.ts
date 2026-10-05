import type { Rival } from "@/types/roast";

import { postRiotId } from "./post-riot-id";

export function requestRival(riotId: string) {
  return postRiotId<Rival>("/api/rival", riotId);
}
