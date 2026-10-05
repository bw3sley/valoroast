import "server-only";

import { AppError } from "./app-error";

export class RateLimitedError extends AppError {
  constructor() {
    super("rate_limited", 429, "Rate limited");
  }
}
