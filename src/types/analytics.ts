import type { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import type { ApiErrorCode } from "@/types/roast";

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/** Where in the UI an action was triggered. */
export type AnalyticsSurface = "header" | "result_actions" | "compare_dialog";

/** Properties per event. Never add Riot IDs, player names or free text here. */
export interface AnalyticsEventProperties {
  roast_submitted: undefined;
  roast_form_invalid: undefined;
  roast_succeeded: { verdict: string; badge: string; agent: string };
  roast_failed: { error_code: ApiErrorCode | "network_error" };
  shared_roast_opened: { success: boolean };
  roast_link_copied: { surface: AnalyticsSurface };
  roast_card_downloaded: { surface: AnalyticsSurface };
  rival_dialog_opened: { surface: AnalyticsSurface };
  rival_submitted: undefined;
  rival_succeeded: undefined;
  rival_failed: { error_code: ApiErrorCode | "network_error" };
  roast_deleted: undefined;
}
