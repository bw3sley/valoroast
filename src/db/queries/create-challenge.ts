import "server-only";

import { db } from "@/db/client";

import { roast_challenges } from "@/db/schema/roast-challenges";

export async function createChallenge(
  challenge: Omit<typeof roast_challenges.$inferInsert, "id" | "created_at">,
) {
  const [created] = await db
    .insert(roast_challenges)
    .values(challenge)
    .returning();

  return created;
}
