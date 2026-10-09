import "server-only";

import { AppError } from "./app-error";

export class InvalidRequestError extends AppError {
  constructor(message = "Invalid request") {
    super("invalid_request", 400, message);
  }
}
