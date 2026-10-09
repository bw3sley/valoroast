import "server-only";

import { AppError } from "./app-error";

export class RateLimitedError extends AppError {
  constructor(readonly retryAfterSeconds?: number) {
    super("rate_limited", 429, "Rate limited");
  }
}
