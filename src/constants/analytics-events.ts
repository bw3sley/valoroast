/** PostHog event names. Names stay static; variable data goes in event properties. */
export const ANALYTICS_EVENTS = {
  ROAST_SUBMITTED: "roast_submitted",
  ROAST_FORM_INVALID: "roast_form_invalid",
  ROAST_SUCCEEDED: "roast_succeeded",
  ROAST_FAILED: "roast_failed",
  SHARED_ROAST_OPENED: "shared_roast_opened",
  ROAST_LINK_COPIED: "roast_link_copied",
  ROAST_CARD_DOWNLOADED: "roast_card_downloaded",
  RIVAL_DIALOG_OPENED: "rival_dialog_opened",
  RIVAL_SUBMITTED: "rival_submitted",
  RIVAL_SUCCEEDED: "rival_succeeded",
  RIVAL_FAILED: "rival_failed",
  ROAST_DELETED: "roast_deleted",
} as const;

/** Query params that identify a roast; stripped from the URLs PostHog stores. */
export const ANALYTICS_STRIPPED_PARAMS = ["r"] as const;
