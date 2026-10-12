import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { OG_FONT_CONDENSED, OG_FONT_DISPLAY } from "@/constants/og";

const FONTS_DIR = join(process.cwd(), "assets", "fonts");

async function readFonts() {
  const [display, condensed] = await Promise.all([
    readFile(join(FONTS_DIR, "Anton-Regular.ttf")),
    readFile(join(FONTS_DIR, "BarlowCondensed-Bold.ttf")),
  ]);

  return [
    { name: OG_FONT_DISPLAY, data: display, weight: 400 as const },
    { name: OG_FONT_CONDENSED, data: condensed, weight: 700 as const },
  ];
}

let fontsPromise: ReturnType<typeof readFonts> | undefined;

/** Reads the share-image fonts once per server process. */
export function loadOgFonts() {
  fontsPromise ??= readFonts();
  return fontsPromise;
}
