import { z } from "zod";

export const henrikMatchSchema = z.object({
  players: z.array(
    z.object({
      puuid: z.string(),
      team_id: z.string(),
      agent: z.object({ name: z.string() }),
      stats: z.object({
        score: z.number(),
        kills: z.number(),
        deaths: z.number(),
        headshots: z.number(),
        bodyshots: z.number(),
        legshots: z.number(),
      }),
    }),
  ),
  teams: z.array(z.object({ team_id: z.string(), won: z.boolean() })),
  rounds: z.array(z.unknown()),
});

export const henrikMatchesSchema = z.array(henrikMatchSchema);

export type HenrikMatch = z.infer<typeof henrikMatchSchema>;
