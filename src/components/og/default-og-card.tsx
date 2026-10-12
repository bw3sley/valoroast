import { OG_COLORS, OG_FONT_CONDENSED, OG_FONT_DISPLAY } from "@/constants/og";

import { OgFrame } from "./og-frame";

export function DefaultOgCard() {
  return (
    <OgFrame footer="Public stats only - no login">
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            gap: 40,
            fontFamily: OG_FONT_DISPLAY,
            fontSize: 168,
            lineHeight: 1,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>Get</span>
          <span style={{ color: OG_COLORS.primary }}>roasted.</span>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: OG_FONT_CONDENSED,
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: OG_COLORS.mutedForeground,
          }}
        >
          Your Valorant stats. Our verdict.
        </div>
      </div>
    </OgFrame>
  );
}
