import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { roasts } from "@/db/schema/roasts";

export async function findRoastById(id: string) {
  const [roast] = await db.select().from(roasts).where(eq(roasts.id, id));
  return roast ?? null;
}
