import { z } from "zod";

export const riotIdSchema = z
  .string()
  .trim()
  .regex(/^[^#\s][^#]*#[A-Za-z0-9]+$/, "Use the format Username#TAG");

export const riotIdRequestSchema = z.object({ riotId: riotIdSchema });
