import "server-only";

import { ImageResponse } from "takumi-js/response";

import { DefaultOgCard } from "@/components/og/default-og-card";
import { OG_SIZE } from "@/constants/og";
import { loadOgFonts } from "@/utils/load-og-fonts";

export async function createDefaultOgResponse(init?: ResponseInit) {
  return new ImageResponse(<DefaultOgCard />, {
    ...OG_SIZE,
    format: "png",
    fonts: await loadOgFonts(),
    ...init,
  });
}
