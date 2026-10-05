import { z } from "zod";

import { BADGE_KEYS } from "@/constants/badges";
import { VERDICTS } from "@/constants/verdicts";

export const roastOutputSchema = z.object({
  roast: z.string(),
  verdict: z.enum(VERDICTS),
  badge: z.enum(BADGE_KEYS),
});
