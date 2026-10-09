import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";

export function StatTile({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className} size="sm">
      <Eyebrow size="sm">{label}</Eyebrow>
      <div className="mt-1 font-display text-4xl leading-none">{value}</div>
    </Card>
  );
}
