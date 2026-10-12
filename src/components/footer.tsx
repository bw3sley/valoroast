"use client";

import { Button } from "@/components/ui/button";
import { useRoastFlow } from "@/contexts/roast-flow-context";

export function Footer() {
  const { setDeleteOpen } = useRoastFlow();

  return (
    <footer className="flex flex-wrap items-center justify-between gap-3.5 border-border border-t px-4 py-6 md:px-8 lg:px-12">
      <p className="max-w-2xl text-faint-foreground text-sm leading-relaxed">
        We store your Riot ID, the fetched stats and the generated roast so your
        share link keeps working. You can request deletion any time. It removes
        the roast and its link permanently and cannot be undone.
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
        <span className="font-condensed text-faint-foreground text-sm uppercase tracking-wider">
          Not affiliated with Riot Games
        </span>
      </div>
    </footer>
  );
}
