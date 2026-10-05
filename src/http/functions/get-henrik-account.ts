import "server-only";

import { henrikAccountSchema } from "@/http/schemas/henrik-account";

import { henrikFetch } from "./henrik-fetch";

export function getHenrikAccount(name: string, tag: string) {
  return henrikFetch(
    `/v2/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
    henrikAccountSchema,
  );
}
