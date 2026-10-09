import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { RivalComparison, Roast } from "@/types/roast";

export type RoastView = "idle" | "scanning" | "result";

interface RoastFlowState {
  view: RoastView;
  roast: Roast | null;
  rival: RivalComparison | null;
  scanIndex: number;
  compareOpen: boolean;
  deleteOpen: boolean;
}

interface RoastFlowActions {
  startScan: () => void;
  tickScan: () => void;
  showResult: (roast: Roast) => void;
  failScan: () => void;
  setRival: (rival: RivalComparison | null) => void;
  setCompareOpen: (open: boolean) => void;
  setDeleteOpen: (open: boolean) => void;
  reset: () => void;
}

const initialState: RoastFlowState = {
  view: "idle",
  roast: null,
  rival: null,
  scanIndex: 0,
  compareOpen: false,
  deleteOpen: false,
};

export const useRoastFlowStore = create<RoastFlowState & RoastFlowActions>()(
  immer((set) => ({
    ...initialState,
    startScan: () =>
      set((state) => {
        state.view = "scanning";
        state.scanIndex = 0;
      }),
    tickScan: () =>
      set((state) => {
        state.scanIndex += 1;
      }),
    showResult: (roast) =>
      set((state) => {
        state.roast = roast;
        state.rival = null;
        state.view = "result";
      }),
    failScan: () =>
      set((state) => {
        state.view = state.roast ? "result" : "idle";
      }),
    setRival: (rival) =>
      set((state) => {
        state.rival = rival;
      }),
    setCompareOpen: (open) =>
      set((state) => {
        state.compareOpen = open;
      }),
    setDeleteOpen: (open) =>
      set((state) => {
        state.deleteOpen = open;
      }),
    reset: () => set(() => ({ ...initialState })),
  })),
);
