import "server-only";

import { AppError } from "./app-error";

export class PlayerNotFoundError extends AppError {
  constructor() {
    super("player_not_found", 404, "Player not found");
  }
}
