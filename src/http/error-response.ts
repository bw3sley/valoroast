import "server-only";

import { AppError } from "@/http/errors/app-error";
import { RateLimitedError } from "@/http/errors/rate-limited-error";

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    const retryAfter =
      error instanceof RateLimitedError ? error.retryAfterSeconds : undefined;

    return Response.json(
      { code: error.code, message: error.message },
      {
        status: error.status,
        headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined,
      },
    );
  }
  console.error(error);
  return Response.json(
    { code: "server_error", message: "Something went wrong" },
    { status: 500 },
  );
}
