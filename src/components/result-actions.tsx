"use client";

import { Button } from "@/components/ui/button";
import { useRoastFlow } from "@/contexts/roast-flow-context";

export function ResultActions() {
  const { downloadCard, copyLink, openCompare, setDeleteOpen } = useRoastFlow();

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2.5">
      <Button
        data-testid="download-card-button"
        onClick={() => downloadCard("result_actions")}
        variant="inverse"
      >
        Download roast card
      </Button>
      <Button
        data-testid="copy-link-button"
        onClick={() => copyLink("result_actions")}
        variant="secondary"
      >
        Copy share link
      </Button>
      <Button
        data-testid="challenge-rival-action"
        onClick={() => openCompare("result_actions")}
        variant="soft"
      >
        Challenge a rival
      </Button>
      <Button
        className="ml-auto"
        data-testid="delete-roast-button"
        onClick={() => setDeleteOpen(true)}
        size="md"
        variant="link"
      >
        Delete this roast
      </Button>
    </div>
  );
}
