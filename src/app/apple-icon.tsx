import { createIconResponse } from "@/utils/create-icon-response";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return createIconResponse(180);
}
