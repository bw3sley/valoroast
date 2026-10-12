import { OG_COLORS, OG_FONT_CONDENSED, OG_FONT_DISPLAY } from "@/constants/og";

import { OgFrame } from "./og-frame";

interface RoastOgCardProps {
  name: string;
  verdict: string;
  caseNo: string;
  badge: string;
  hs: number;
  wr: number;
  acs: number;
}

interface OgStatProps {
  label: string;
  value: string;
}

function OgStat({ label, value }: OgStatProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: 280,
        padding: "16px 24px",
        backgroundColor: OG_COLORS.card,
        borderLeft: `4px solid ${OG_COLORS.primary}`,
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: OG_FONT_CONDENSED,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: OG_COLORS.mutedForeground,
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "flex",
          fontFamily: OG_FONT_DISPLAY,
          fontSize: 64,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function RoastOgCard({
  name,
  verdict,
  caseNo,
  badge,
  hs,
  wr,
  acs,
}: RoastOgCardProps) {
  return (
    <OgFrame footer={`${caseNo} - ${badge}`}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontFamily: OG_FONT_CONDENSED,
              fontWeight: 700,
              fontSize: 44,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: OG_COLORS.mutedForeground,
            }}
          >
            {name}
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: OG_FONT_DISPLAY,
              fontSize: 200,
              lineHeight: 1,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: OG_COLORS.primary,
            }}
          >
            {verdict}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <OgStat label="HS%" value={`${Math.round(hs)}%`} />
          <OgStat label="Winrate" value={`${Math.round(wr)}%`} />
          <OgStat label="ACS" value={`${Math.round(acs)}`} />
        </div>
      </div>
    </OgFrame>
  );
}
