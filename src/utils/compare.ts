import type { CompareRow, Rival, Roast } from "@/types/roast";

export function buildCompareRows(you: Roast, rival: Rival): CompareRow[] {
  const rows = [
    { label: "ACS", you: you.acs, rival: rival.acs, suffix: "" },
    { label: "WINRATE", you: you.wr, rival: rival.wr, suffix: "%" },
    { label: "HEADSHOT %", you: you.hs, rival: rival.hs, suffix: "%" },
  ];

  return rows.map((row) => {
    const max = Math.max(row.you, row.rival) || 1;
    return {
      label: row.label,
      you: `${row.you}${row.suffix}`,
      rival: `${row.rival}${row.suffix}`,
      youPct: Math.round((row.you / max) * 100),
      rivalPct: Math.round((row.rival / max) * 100),
    };
  });
}

export function buildCompareOutcome(you: Roast, rival: Rival) {
  const checks = [rival.acs - you.acs, rival.wr - you.wr, rival.hs - you.hs];
  const rivalWins = checks.filter((diff) => diff > 0).length >= 2;

  if (rivalWins) {
    return {
      winner: rival.name,
      taunt: `${Math.max(0, rival.acs - you.acs)} more ACS and ${Math.max(0, rival.wr - you.wr)}% more wins. Maybe let them hold the site next time.`,
    };
  }

  return {
    winner: you.id,
    taunt: `${Math.max(0, you.acs - rival.acs)} more ACS and ${Math.max(0, you.wr - rival.wr)}% more wins. Your rival has some homework to do.`,
  };
}
