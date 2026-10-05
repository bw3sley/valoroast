import "server-only";

import type { ApiErrorCode } from "@/types/roast";

export class AppError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
