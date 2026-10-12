import { SITE_DEFAULT_URL } from "@/constants/site";

export function getSiteUrl() {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || SITE_DEFAULT_URL);
}
