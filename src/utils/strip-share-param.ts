import type { CaptureResult } from "posthog-js";

import { ANALYTICS_STRIPPED_PARAMS } from "@/constants/analytics-events";

const URL_KEYS = ["$current_url", "$initial_current_url"];

function stripUrl(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }
  try {
    const url = new URL(value);
    for (const param of ANALYTICS_STRIPPED_PARAMS) {
      url.searchParams.delete(param);
    }
    return url.toString();
  } catch {
    return value;
  }
}

function stripKeys(bag: Record<string, unknown> | undefined) {
  if (!bag) {
    return;
  }
  for (const key of URL_KEYS) {
    if (key in bag) {
      bag[key] = stripUrl(bag[key]);
    }
  }
}

/** PostHog `before_send` hook: the `?r=<roast id>` share param never leaves the browser. */
export function stripShareParam(event: CaptureResult | null) {
  if (event) {
    stripKeys(event.properties);
    stripKeys(event.$set);
    stripKeys(event.$set_once);
  }
  return event;
}
