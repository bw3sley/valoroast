import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { MatchResult } from "@/types/roast";

export function MatchForm({ form }: { form: MatchResult[] }) {
  return (
    <Card size="sm">
      <Eyebrow size="sm">Last 5 matches</Eyebrow>
      <ul aria-label="Last 5 matches" className="mt-2 flex gap-1.5">
        {form.map((result, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: order is the identity
          <li key={i}>
            <Badge size="sm" variant={result === "W" ? "success" : "default"}>
              {result}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
