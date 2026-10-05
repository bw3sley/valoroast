import { Diamond, Flag, Skull, Sparkle, Star, X } from "lucide-react";

import type { BadgeKey, RoastBadge } from "@/types/roast";

export const BADGE_KEYS = [
  "iron-will",
  "one-tap",
  "repeat-offender",
  "martyr",
  "bot-lobby",
  "util-magnet",
] as const;

export const BADGES: Record<BadgeKey, RoastBadge> = {
  "iron-will": {
    name: "Iron Will, Diamond Ego",
    icon: Diamond,
    description: "Talks like Radiant, plays like a bot lobby.",
  },
  "one-tap": {
    name: "One-Tap To The Foot",
    icon: X,
    description: "Crosshair placement: somewhere near the floor.",
  },
  "repeat-offender": {
    name: "Repeat Offender",
    icon: Flag,
    description: "Same mistake, five matches in a row.",
  },
  martyr: {
    name: "Solo Queue Martyr",
    icon: Skull,
    description: "Blames the team, tops the death chart.",
  },
  "bot-lobby": {
    name: "Bot Lobby Graduate",
    icon: Star,
    description: "Peaked in unrated. Never recovered.",
  },
  "util-magnet": {
    name: "Certified Util Magnet",
    icon: Sparkle,
    description: "Walks into every molly like it owes him money.",
  },
};
