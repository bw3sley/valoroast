"use client";

import { createContext, type ReactNode, use } from "react";

import {
  type RoastFlow,
  useRoastFlowState,
} from "@/hooks/use-roast-flow-state";

const RoastFlowContext = createContext<RoastFlow | null>(null);

export function RoastFlowProvider({ children }: { children: ReactNode }) {
  const flow = useRoastFlowState();

  return <RoastFlowContext value={flow}>{children}</RoastFlowContext>;
}

export function useRoastFlow() {
  const flow = use(RoastFlowContext);

  if (!flow) {
    throw new Error("useRoastFlow must be used inside RoastFlowProvider");
  }

  return flow;
}
