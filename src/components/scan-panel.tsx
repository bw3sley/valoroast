import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Progress } from "@/components/ui/progress";

export function ScanPanel({ line }: { line: string }) {
  return (
    <Card aria-live="polite" role="status" variant="accent">
      <Eyebrow variant="primary">Pulling the case file</Eyebrow>

      <div className="mt-2.5 font-display text-2xl uppercase tracking-wide md:text-3xl">
        {line}
        <span className="animate-blink">_</span>
      </div>

      <Progress className="mt-5" size="sm" />
    </Card>
  );
}
