import "server-only";

import { AppError } from "./app-error";

export class UpstreamError extends AppError {
  constructor(message = "Upstream error") {
    super("upstream_error", 502, message);
  }
}
