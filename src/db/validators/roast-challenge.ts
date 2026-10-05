import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { roast_challenges } from "@/db/schema/roast-challenges";

export const insertRoastChallengeSchema = createInsertSchema(roast_challenges);
export const selectRoastChallengeSchema = createSelectSchema(roast_challenges);
