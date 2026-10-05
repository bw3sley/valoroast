import { MatchForm } from "@/components/match-form";
import { ResultActions } from "@/components/result-actions";
import { StatTile } from "@/components/stat-tile";
import { Eyebrow } from "@/components/ui/eyebrow";
import { VerdictCard } from "@/components/verdict-card";
import type { Roast } from "@/types/roast";

export function RoastResult({ roast }: { roast: Roast }) {
  return (
    <section className="mb-13 animate-in">
      <div className="mb-3.5 flex flex-wrap items-baseline gap-3.5">
        <Eyebrow>Case file</Eyebrow>
        <span className="font-display text-xl uppercase tracking-wide">
          {roast.id}
        </span>
        <Eyebrow className="ml-auto">{roast.caseNo}</Eyebrow>
      </div>
      <VerdictCard roast={roast} />
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatTile label="Headshot %" value={`${roast.hs}%`} />
        <StatTile label="Winrate" value={`${roast.wr}%`} />
        <StatTile label="Avg combat score" value={roast.acs} />
        <StatTile
          className="uppercase"
          label="Most used agent"
          value={roast.agent}
        />
        <MatchForm form={roast.form} />
      </div>
      <ResultActions />
    </section>
  );
}
