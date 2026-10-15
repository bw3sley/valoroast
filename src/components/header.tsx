"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useRoastFlow } from "@/contexts/roast-flow-context";

export function Header() {
  const { openCompare } = useRoastFlow();

  return (
    <header className="sticky top-0 z-40 flex items-center gap-5 border-border border-b bg-background/90 px-4 py-3.5 backdrop-blur-sm md:px-8 lg:px-12">
      <Logo />

      <Button
        className="ml-auto flex-none"
        data-testid="challenge-rival-button"
        onClick={() => openCompare("header")}
      >
        Challenge a rival
      </Button>
    </header>
  );
}
