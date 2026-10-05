export function buildCaseNumber(id: string) {
  let h = 7;
  for (const char of id.toLowerCase()) {
    h = (h * 31 + char.charCodeAt(0)) >>> 0;
  }
  return `CASE #${String(h % 99999).padStart(5, "0")}`;
}
