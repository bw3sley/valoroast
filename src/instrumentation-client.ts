import posthog from "posthog-js";

import { stripShareParam } from "@/utils/strip-share-param";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

// No token (local dev, CI) means analytics stays off.
if (token) {
  try {
    posthog.init(token, {
      // Same-origin reverse proxy (see `rewrites` in next.config.ts) to dodge ad-blockers.
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2026-05-30",
      capture_pageview: "history_change",
      capture_pageleave: "if_capture_pageview",
      person_profiles: "identified_only",
      // Riot IDs live in inputs and the result card; keep them out of PostHog.
      autocapture: false,
      disable_session_recording: true,
      before_send: stripShareParam,
    });
  } catch {}
}
