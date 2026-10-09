import "server-only";

import { nanoid } from "nanoid";
import { hash } from "ohash";
import { digest } from "ohash/crypto";

import { DELETE_TOKEN_LENGTH } from "@/constants/roast-storage";
import { db } from "@/db/client";
import { roasts } from "@/db/schema/roasts";

/** Same key for the same Riot ID (case-insensitive) and intensity, so repeats reuse the stored roast. */
export function buildDedupeKey({
  riot_game_name,
  riot_tag_line,
  roast_intensity,
}: {
  riot_game_name: string;
  riot_tag_line: string;
  roast_intensity?: string | null;
}) {
  return hash({
    riot_id: `${riot_game_name}#${riot_tag_line}`.trim().toLowerCase(),
    roast_intensity: roast_intensity ?? null,
  });
}

type RoastSnapshot = Omit<
  typeof roasts.$inferInsert,
  | "id"
  | "created_at"
  | "delete_token_hash"
  | "dedupe_key"
  | "request_idempotency_key_hash"
>;

interface CreateRoastInput extends RoastSnapshot {
  idempotency_key?: string;
}

/** Stores an immutable roast snapshot. The plain delete token is returned once and never stored. */
export async function createRoast({
  idempotency_key,
  ...snapshot
}: CreateRoastInput) {
  const delete_token = nanoid(DELETE_TOKEN_LENGTH);

  const [roast] = await db
    .insert(roasts)
    .values({
      ...snapshot,
      delete_token_hash: digest(delete_token),
      dedupe_key: buildDedupeKey(snapshot),
      request_idempotency_key_hash: idempotency_key
        ? digest(idempotency_key)
        : null,
    })
    .returning();

  return { roast, delete_token };
}
