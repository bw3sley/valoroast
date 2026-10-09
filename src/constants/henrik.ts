export const HENRIK_BASE_URL = "https://api.henrikdev.xyz/valorant";

// HenrikDev allows 30 req/min and bills 1 extra per uncached match, so keep this small.
export const MATCH_COUNT = 5;
export const FORM_LENGTH = 5;

// Henrik's matches endpoint only takes na, eu, ap and kr.
export const HENRIK_AFFINITY_OVERRIDES: Record<string, string> = {
  latam: "na",
  br: "na",
};
