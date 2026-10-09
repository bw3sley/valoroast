import { BADGES } from "@/constants/badges";
import type { Roast, RoastResponse } from "@/types/roast";

import { postRiotId, requestJson } from "./post-riot-id";

function withBadge(data: RoastResponse): Roast {
  return { ...data, badge: BADGES[data.badge] };
}

export async function requestRoast(riotId: string): Promise<Roast> {
  return withBadge(await postRiotId<RoastResponse>("/api/roast", riotId));
}

export async function requestSharedRoast(id: string): Promise<Roast> {
  return withBadge(
    await requestJson<RoastResponse>(`/api/roast/${encodeURIComponent(id)}`),
  );
}
