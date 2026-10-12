import { ImageResponse } from "takumi-js/response";
import { z } from "zod";

import { RoastOgCard } from "@/components/og/roast-og-card";
import { BADGES } from "@/constants/badges";
import { OG_CACHE_CONTROL, OG_SIZE } from "@/constants/og";
import { findRoastById } from "@/db/queries/find-roast-by-id";
import { toRoastResponse } from "@/http/functions/to-roast-response";
import { createDefaultOgResponse } from "@/utils/create-default-og-response";
import { loadOgFonts } from "@/utils/load-og-fonts";

const FALLBACK_CACHE_CONTROL = "public, max-age=300";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = z.uuid().safeParse((await params).id);
    const row = id.success ? await findRoastById(id.data) : null;
    if (!row) {
      return await createDefaultOgResponse({
        headers: { "Cache-Control": FALLBACK_CACHE_CONTROL },
      });
    }

    const roast = toRoastResponse(row);
    const image = new ImageResponse(
      <RoastOgCard
        name={roast.name}
        verdict={roast.verdict}
        caseNo={roast.caseNo}
        badge={BADGES[roast.badge].name}
        hs={roast.hs}
        wr={roast.wr}
        acs={roast.acs}
      />,
      {
        ...OG_SIZE,
        format: "png",
        fonts: await loadOgFonts(),
        headers: { "Cache-Control": OG_CACHE_CONTROL },
      },
    );
    await image.ready;

    return image;
  } catch (error) {
    console.error("Failed to render share image", error);

    return createDefaultOgResponse({
      headers: { "Cache-Control": "no-store" },
    });
  }
}
