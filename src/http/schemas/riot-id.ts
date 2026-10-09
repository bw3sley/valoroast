import { z } from "zod";

export const riotIdSchema = z
  .string()
  .trim()
  .regex(/^[^#\s][^#]*#[A-Za-z0-9]+$/, "Use the format Username#TAG");

function splitRiotId(riotId: string) {
  const index = riotId.lastIndexOf("#");
  return {
    riotId,
    name: riotId.slice(0, index).trim(),
    tag: riotId.slice(index + 1).trim(),
  };
}

/** Validates a Riot ID and splits it into `name` and `tag`. */
export const riotIdRequestSchema = z
  .object({ riotId: riotIdSchema })
  .transform(({ riotId }) => splitRiotId(riotId));

export const rivalRequestSchema = z
  .object({ riotId: riotIdSchema, roastId: z.uuid() })
  .transform(({ riotId, roastId }) => ({ ...splitRiotId(riotId), roastId }));
