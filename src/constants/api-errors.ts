import type { ApiErrorCode } from "@/types/roast";

export const API_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  invalid_request: "Use the format Username#TAG",
  player_not_found: "Player not found. Check the Riot ID and try again.",
  no_matches: "No recent competitive matches to roast.",
  rate_limited: "Too many requests. Wait a minute and try again.",
  upstream_error: "The stats service is down. Try again soon.",
  server_error: "Something went wrong. Try again.",
};

export const NETWORK_ERROR_MESSAGE = "Network error. Check your connection.";
