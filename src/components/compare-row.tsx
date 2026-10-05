import { Progress } from "@/components/ui/progress";
import type { CompareRow as CompareRowData } from "@/types/roast";

export interface CompareRowProps {
  row: CompareRowData;
}

export function CompareRow({ row }: CompareRowProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between font-condensed text-sm uppercase tracking-wider">
        <span className="text-foreground">{row.you}</span>
        <span className="text-faint-foreground">{row.label}</span>
        <span className="text-success">{row.rival}</span>
      </div>

      <div className="mt-1 flex gap-1">
        <Progress
          aria-label={`${row.label}: you`}
          value={row.youPct}
          size="md"
          className="flex-1 scale-x-[-1]"
        />

        <Progress
          aria-label={`${row.label}: rival`}
          value={row.rivalPct}
          variant="success"
          size="md"
          className="flex-1"
        />
      </div>
    </div>
  );
}
