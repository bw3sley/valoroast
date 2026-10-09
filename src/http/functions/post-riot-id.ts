import {
  API_ERROR_MESSAGES,
  NETWORK_ERROR_MESSAGE,
} from "@/constants/api-errors";
import type { ApiErrorCode } from "@/types/roast";

export class RequestError extends Error {}

export async function postRiotId<T>(
  url: string,
  riotId: string,
  extra?: Record<string, string>,
) {
  return requestJson<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ riotId, ...extra }),
  });
}

export async function requestJson<T>(url: string, init?: RequestInit) {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new RequestError(NETWORK_ERROR_MESSAGE);
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      code?: ApiErrorCode;
    } | null;
    throw new RequestError(API_ERROR_MESSAGES[body?.code ?? "server_error"]);
  }
  return (await response.json()) as T;
}
