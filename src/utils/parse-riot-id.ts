export function parseRiotId(riotId: string) {
  const index = riotId.lastIndexOf("#");
  return {
    name: riotId.slice(0, index).trim(),
    tag: riotId.slice(index + 1).trim(),
  };
}
