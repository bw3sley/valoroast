import "server-only";

import type { z } from "zod";

import { HENRIK_BASE_URL, HENRIK_REVALIDATE_SECONDS } from "@/constants/henrik";
import { PlayerNotFoundError } from "@/http/errors/player-not-found-error";
import { RateLimitedError } from "@/http/errors/rate-limited-error";
import { UpstreamError } from "@/http/errors/upstream-error";

export async function henrikFetch<T extends z.ZodType>(
  path: string,
  schema: T,
  params?: Record<string, string | number>,
): Promise<z.infer<T>> {
  const key = process.env.HENRIKDEV_API_KEY;
  if (!key) throw new UpstreamError("HENRIKDEV_API_KEY is not set");

  const url = new URL(`${HENRIK_BASE_URL}${path}`);
  for (const [name, value] of Object.entries(params ?? {})) {
    url.searchParams.set(name, String(value));
  }

  const response = await fetch(url, {
    headers: { Authorization: key },
    next: { revalidate: HENRIK_REVALIDATE_SECONDS },
  });

  if (response.status === 404) throw new PlayerNotFoundError();
  if (response.status === 429) throw new RateLimitedError();
  if (!response.ok) throw new UpstreamError(`Henrik API ${response.status}`);

  const body = (await response.json()) as { data: unknown };
  const parsed = schema.safeParse(body.data);
  if (!parsed.success) throw new UpstreamError("Unexpected Henrik response");
  return parsed.data;
}
