import { SearchX } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";

export function ScanErrorPanel({ message }: { message: string }) {
  return (
    <Card data-testid="scan-error-panel" role="alert" variant="accent">
      <Eyebrow className="flex items-center gap-2" variant="primary">
        <SearchX className="size-4" />
        No case file
      </Eyebrow>

      <div className="mt-2.5 font-display text-2xl uppercase tracking-wide md:text-3xl">
        {message}
      </div>
    </Card>
  );
}
