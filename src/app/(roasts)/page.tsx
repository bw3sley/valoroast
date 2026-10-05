"use client";

import { Hero } from "@/components/hero";
import { RoastResult } from "@/components/roast-result";
import { ScanPanel } from "@/components/scan-panel";
import { useRoastFlow } from "@/contexts/roast-flow-context";

export default function Home() {
  const { view, roast, scanLine } = useRoastFlow();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 md:px-8 lg:px-12 pb-24">
      <Hero />

      {view === "scanning" && <ScanPanel line={scanLine} />}

      {view === "result" && roast && <RoastResult roast={roast} />}
    </main>
  );
}
