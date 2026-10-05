export const HENRIK_BASE_URL = "https://api.henrikdev.xyz/valorant";
export const HENRIK_REVALIDATE_SECONDS = 300;

export const MATCH_COUNT = 10;
export const FORM_LENGTH = 5;

// Henrik's matches endpoint only takes na, eu, ap and kr.
export const HENRIK_AFFINITY_OVERRIDES: Record<string, string> = {
  latam: "na",
  br: "na",
};
