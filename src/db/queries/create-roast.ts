import "server-only";

import { nanoid } from "nanoid";
import { digest } from "ohash/crypto";

import { DELETE_TOKEN_LENGTH } from "@/constants/roast-storage";
import { db } from "@/db/client";
import { roasts } from "@/db/schema/roasts";
import { buildDedupeKey } from "@/utils/build-dedupe-key";

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
