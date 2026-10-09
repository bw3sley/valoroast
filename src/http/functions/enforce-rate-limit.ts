import "server-only";

import { RateLimiterMemory, type RateLimiterRes } from "rate-limiter-flexible";

import type { RateLimitRule } from "@/constants/rate-limits";
import { RateLimitedError } from "@/http/errors/rate-limited-error";

// One limiter per rule, shared by every route and kept across dev hot reloads.
// Counters live in this process: fine for a single container, reset on restart.
const globalForLimiters = globalThis as unknown as {
  limiters?: Map<string, RateLimiterMemory>;
};
const limiters = (globalForLimiters.limiters ??= new Map());

function getLimiter({ limit, windowSeconds }: RateLimitRule) {
  const id = `${limit}:${windowSeconds}`;
  let limiter = limiters.get(id);

  if (!limiter) {
    limiter = new RateLimiterMemory({ points: limit, duration: windowSeconds });
    limiters.set(id, limiter);
  }

  return limiter;
}

/**
 * Behind a reverse proxy (Coolify/Traefik) the proxy appends the real client IP
 * to `x-forwarded-for`, so the last entry is the one a client cannot spoof.
 */
export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",");

  return forwarded?.at(-1)?.trim() ?? "unknown";
}

export async function enforceRateLimit(key: string, rule: RateLimitRule) {
  try {
    await getLimiter(rule).consume(key);
  } catch (rejection) {
    // `consume` rejects with a RateLimiterRes once the points are used up.
    const { msBeforeNext } = rejection as RateLimiterRes;

    throw new RateLimitedError(Math.ceil(msBeforeNext / 1000));
  }
}
