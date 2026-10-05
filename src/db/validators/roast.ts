import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { roasts } from "@/db/schema/roasts";

export const insertRoastSchema = createInsertSchema(roasts);
export const selectRoastSchema = createSelectSchema(roasts);
