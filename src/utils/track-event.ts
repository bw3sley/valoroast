import posthog from "posthog-js";

import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
} from "@/types/analytics";

/** Capture a PostHog event. A no-op on the server or when PostHog was not initialized. */
export function trackEvent<E extends AnalyticsEventName>(
  event: E,
  properties?: AnalyticsEventProperties[E],
) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    posthog.capture(event, properties);
  } catch {}
}
