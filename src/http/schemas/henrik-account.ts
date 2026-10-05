import { z } from "zod";

export const henrikAccountSchema = z.object({
  puuid: z.string(),
  region: z.string(),
  name: z.string(),
  tag: z.string(),
});

export type HenrikAccount = z.infer<typeof henrikAccountSchema>;
