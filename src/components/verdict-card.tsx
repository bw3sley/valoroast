import { BadgeEmblem } from "@/components/badge-emblem";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Separator } from "@/components/ui/separator";
import { VerdictStamp } from "@/components/verdict-stamp";
import type { Roast } from "@/types/roast";

export function VerdictCard({ roast }: { roast: Roast }) {
  const { badge } = roast;
  return (
    <Card size="lg" variant="feature">
      <VerdictStamp word={roast.verdict} />
      <Eyebrow variant="primary">Verdict</Eyebrow>
      <p className="mt-3.5 max-w-3xl text-pretty font-display text-xl leading-tight tracking-wide md:text-3xl lg:text-4xl">
        {roast.roast}
      </p>
      <Separator className="mt-8" />
      <div className="flex flex-wrap items-center gap-4 pt-6">
        <BadgeEmblem icon={badge.icon} />
        <div>
          <Eyebrow size="sm" variant="success">
            Badge unlocked
          </Eyebrow>
          <div className="font-display text-lg uppercase md:text-2xl">
            {badge.name}
          </div>
          <p className="text-muted-foreground text-sm">{badge.description}</p>
        </div>
      </div>
    </Card>
  );
}
