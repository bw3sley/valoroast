import "server-only";

import { ImageResponse } from "takumi-js/response";

import { OG_COLORS } from "@/constants/og";

/** Square app icon: red diamond on the dark canvas. */
export function createIconResponse(size: number) {
  const diamond = Math.round(size * 0.4);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        backgroundColor: OG_COLORS.background,
      }}
    >
      <div
        style={{
          width: diamond,
          height: diamond,
          backgroundColor: OG_COLORS.primary,
          transform: "rotate(45deg)",
        }}
      />
    </div>,
    { width: size, height: size, format: "png" },
  );
}
