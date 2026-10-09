"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

import { SCAN_LINE_INTERVAL_MS, SCAN_LINES } from "@/constants/scan-lines";
import { RequestError } from "@/http/functions/post-riot-id";
import { requestRival } from "@/http/functions/request-rival";
import {
  requestRoast,
  requestSharedRoast,
} from "@/http/functions/request-roast";
import { useRoastFlowStore } from "@/store/roast-flow-store";
import { downloadRoastCard } from "@/utils/download-roast-card";

const GENERIC_ERROR = "Something went wrong. Try again.";

function errorMessage(error: unknown) {
  return error instanceof RequestError ? error.message : GENERIC_ERROR;
}

export function useRoastFlowState() {
  const store = useRoastFlowStore();
  const { roast, scanIndex, startScan, tickScan, showResult, failScan } = store;

  const roastMutation = useMutation({
    mutationFn: (riotId: string) => requestRoast(riotId),
    onSuccess: showResult,
    onError: (error) => {
      failScan();
      toast.error(errorMessage(error));
    },
  });

  const rivalMutation = useMutation({
    mutationFn: (riotId: string) => requestRival(riotId, roast?.id ?? ""),
    onSuccess: store.setRival,
    onError: (error) => toast.error(errorMessage(error)),
  });

  // Open a shared roast (`?r=<id>`) on first load.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("r");
    if (!id) {
      return;
    }
    requestSharedRoast(id).then(showResult, (error) =>
      toast.error(errorMessage(error)),
    );
  }, []);

  const scanning = roastMutation.isPending;

  useEffect(() => {
    if (!scanning) {
      return;
    }
    const interval = setInterval(tickScan, SCAN_LINE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [scanning, tickScan]);

  function scan(id: string) {
    startScan();
    roastMutation.mutate(id);
  }

  function challenge(name: string) {
    if (!roast) {
      return;
    }
    rivalMutation.mutate(name);
  }

  function remove() {
    roastMutation.reset();
    rivalMutation.reset();
    store.reset();
    toast("Roast deleted permanently");
  }

  async function copyLink() {
    const url = `${location.origin}${location.pathname}?r=${encodeURIComponent(roast?.id ?? "")}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
    toast("Share link copied");
  }

  async function downloadCard() {
    if (!roast) {
      return;
    }
    await downloadRoastCard(roast);
    toast("Card downloaded");
  }

  return {
    view: store.view,
    roast,
    rival: store.rival,
    rivalPending: rivalMutation.isPending,
    scanLine: SCAN_LINES[scanIndex % SCAN_LINES.length],
    compareOpen: store.compareOpen,
    deleteOpen: store.deleteOpen,
    setCompareOpen: store.setCompareOpen,
    setDeleteOpen: store.setDeleteOpen,
    scan,
    challenge,
    remove,
    copyLink,
    downloadCard,
  };
}

export type RoastFlow = ReturnType<typeof useRoastFlowState>;
