"use client";

import { Button } from "@/components/ui/button";
import { useRoastFlow } from "@/contexts/roast-flow-context";

export function Footer() {
  const { setDeleteOpen } = useRoastFlow();

  return (
    <footer className="flex flex-wrap items-center justify-between gap-3.5 border-t border-border px-4 md:px-8 lg:px-12 py-6">
      <p className="max-w-2xl text-sm leading-relaxed text-faint-foreground">
        We store your Riot ID, the fetched stats and the generated roast so your
        share link keeps working. Request deletion any time — it removes the
        roast and its link permanently and cannot be undone.
      </p>
      <div className="flex items-center gap-4">
        <Button
          className="text-muted-foreground hover:bg-primary hover:text-primary-foreground"
          data-testid="footer-delete-button"
          onClick={() => setDeleteOpen(true)}
          size="sm"
          variant="secondary"
        >
          Delete my roast
        </Button>
        <span className="font-condensed text-sm tracking-wider text-faint-foreground uppercase">
          Not affiliated with Riot Games
        </span>
      </div>
    </footer>
  );
}
