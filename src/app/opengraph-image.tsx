import { OG_DEFAULT_ALT } from "@/constants/og";
import { createDefaultOgResponse } from "@/utils/create-default-og-response";

export const alt = OG_DEFAULT_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createDefaultOgResponse();
}
