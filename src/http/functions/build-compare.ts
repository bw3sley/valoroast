import type { CompareRow, PlayerStats, RivalComparison } from "@/types/roast";

type Fighter = Pick<PlayerStats, "acs" | "wr" | "hs"> & { name: string };

function buildRows(you: Fighter, rival: Fighter): CompareRow[] {
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

export function buildCompare(you: Fighter, rival: Fighter): RivalComparison {
  const diffs = [rival.acs - you.acs, rival.wr - you.wr, rival.hs - you.hs];
  const rivalWins = diffs.filter((diff) => diff > 0).length >= 2;
  const [acs, wr] = diffs;

  const outcome = rivalWins
    ? {
        winner: rival.name,
        taunt: `${Math.max(0, acs)} more ACS and ${Math.max(0, wr)}% more wins. Maybe let them hold the site next time.`,
      }
    : {
        winner: you.name,
        taunt: `${Math.max(0, -acs)} more ACS and ${Math.max(0, -wr)}% more wins. Your rival has some homework to do.`,
      };

  return {
    rival: { name: rival.name, hs: rival.hs, wr: rival.wr, acs: rival.acs },
    rows: buildRows(you, rival),
    outcome,
  };
}
