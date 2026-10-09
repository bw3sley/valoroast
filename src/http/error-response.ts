import "server-only";

import { AppError } from "@/http/errors/app-error";

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    return Response.json(
      { code: error.code, message: error.message },
      { status: error.status },
    );
  }
  console.error(error);
  return Response.json(
    { code: "server_error", message: "Something went wrong" },
    { status: 500 },
  );
}
