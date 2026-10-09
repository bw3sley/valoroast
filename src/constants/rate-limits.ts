const MINUTE = 60;

/**
 * Only requests that would cost an OpenAI or HenrikDev call are counted: cached
 * roasts are free. HenrikDev allows 30 req/min and one roast takes about 3.
 */
export const RATE_LIMITS = {
  roastPerIp: { limit: 5, windowSeconds: 10 * MINUTE },
  rivalPerIp: { limit: 10, windowSeconds: 10 * MINUTE },
  henrikGlobal: { limit: 8, windowSeconds: MINUTE },
} as const;

export type RateLimitRule = (typeof RATE_LIMITS)[keyof typeof RATE_LIMITS];
