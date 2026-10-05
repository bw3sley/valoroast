import "server-only";

import { AppError } from "./app-error";

export class NoMatchesError extends AppError {
  constructor() {
    super("no_matches", 422, "No recent competitive matches");
  }
}
