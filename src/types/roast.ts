import type { LucideIcon } from "lucide-react";

import type { BADGE_KEYS } from "@/constants/badges";
import type { VERDICTS } from "@/constants/verdicts";

export type MatchResult = "W" | "L";

export type BadgeKey = (typeof BADGE_KEYS)[number];

export type Verdict = (typeof VERDICTS)[number];

export type ApiErrorCode =
  | "invalid_request"
  | "player_not_found"
  | "no_matches"
  | "rate_limited"
  | "upstream_error"
  | "server_error";

export interface RoastBadge {
  name: string;
  icon: LucideIcon;
  description: string;
}

export interface PlayerStats {
  hs: number;
  wr: number;
  acs: number;
  kd: number;
  agent: string;
  form: MatchResult[];
}

export interface Roast extends PlayerStats {
  id: string;
  /** Riot ID, `Name#TAG`. */
  name: string;
  badge: RoastBadge;
  verdict: string;
  roast: string;
  caseNo: string;
}

/** Shape returned by `POST /api/roast`: icons aren't serializable, so the badge is a key. */
export interface RoastResponse extends Omit<Roast, "badge"> {
  badge: BadgeKey;
}

export interface Rival {
  name: string;
  hs: number;
  wr: number;
  acs: number;
}

export interface CompareRow {
  label: string;
  you: string | number;
  rival: string | number;
  youPct: number;
  rivalPct: number;
}

export interface CompareOutcome {
  winner: string;
  taunt: string;
}

/** Shape returned by `POST /api/rival`: the server does the comparison. */
export interface RivalComparison {
  rival: Rival;
  rows: CompareRow[];
  outcome: CompareOutcome;
}
