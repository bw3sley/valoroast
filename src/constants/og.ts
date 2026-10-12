export const OG_SIZE = { width: 1200, height: 630 } as const;

export const OG_CONTENT_TYPE = "image/png";

export const OG_DEFAULT_ALT =
  "Valoroast: drop your Riot ID and get roasted on your Valorant stats.";

/**
 * Same values as the tokens in `globals.css`. The image renderer cannot read
 * CSS variables or Tailwind tokens, so the hex values are repeated here.
 */
export const OG_COLORS = {
  background: "#0F1923",
  card: "#111E29",
  foreground: "#ECE8E1",
  mutedForeground: "#8B99A6",
  primary: "#FF4655",
  success: "#00E0B0",
} as const;

export const OG_FONT_DISPLAY = "Anton";

export const OG_FONT_CONDENSED = "Barlow Condensed";

/** One year; roasts are immutable so the image for an id never changes. */
export const OG_CACHE_CONTROL = "public, max-age=31536000, immutable";
