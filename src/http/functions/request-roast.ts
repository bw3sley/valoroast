import { BADGES } from "@/constants/badges";
import type { Roast, RoastResponse } from "@/types/roast";

import { postRiotId } from "./post-riot-id";

export async function requestRoast(riotId: string): Promise<Roast> {
  const data = await postRiotId<RoastResponse>("/api/roast", riotId);
  return { ...data, badge: BADGES[data.badge] };
}
