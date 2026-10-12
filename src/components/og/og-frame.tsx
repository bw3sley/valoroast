import type { ReactNode } from "react";

import {
  OG_COLORS,
  OG_FONT_CONDENSED,
  OG_FONT_DISPLAY,
  OG_SIZE,
} from "@/constants/og";

interface OgFrameProps {
  children: ReactNode;
  /** Small label at the bottom-left, e.g. the case number. */
  footer: string;
}

/** Shared 1200x630 share-image shell: glow background, logo top-left, footer. */
export function OgFrame({ children, footer }: OgFrameProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        padding: 64,
        color: OG_COLORS.foreground,
        backgroundColor: OG_COLORS.background,
        backgroundImage: `radial-gradient(circle at 0% 0%, rgba(255,70,85,0.22), transparent 55%), radial-gradient(circle at 100% 100%, rgba(0,224,176,0.14), transparent 50%)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 22,
            height: 22,
            backgroundColor: OG_COLORS.primary,
            transform: "rotate(45deg)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontFamily: OG_FONT_DISPLAY,
            fontSize: 40,
            letterSpacing: 2,
          }}
        >
          VALO<span style={{ color: OG_COLORS.primary }}>ROAST</span>
        </div>
      </div>

      {children}

      <div
        style={{
          display: "flex",
          fontFamily: OG_FONT_CONDENSED,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: OG_COLORS.mutedForeground,
        }}
      >
        {footer}
      </div>
    </div>
  );
}
