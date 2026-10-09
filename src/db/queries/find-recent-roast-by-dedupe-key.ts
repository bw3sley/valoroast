import "server-only";

import { subDays } from "date-fns";
import { and, desc, eq, gte } from "drizzle-orm";

import { DEDUPE_WINDOW_DAYS } from "@/constants/roast-storage";
import { db } from "@/db/client";
import { roasts } from "@/db/schema/roasts";

export async function findRecentRoastByDedupeKey(dedupe_key: string) {
  const [roast] = await db
    .select()
    .from(roasts)
    .where(
      and(
        eq(roasts.dedupe_key, dedupe_key),
        gte(roasts.created_at, subDays(new Date(), DEDUPE_WINDOW_DAYS)),
      ),
    )
    .orderBy(desc(roasts.created_at))
    .limit(1);

  return roast ?? null;
}
