"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { SCAN_LINE_INTERVAL_MS, SCAN_LINES } from "@/constants/scan-lines";
import { RequestError } from "@/http/functions/post-riot-id";
import { requestRival } from "@/http/functions/request-rival";
import {
  requestRoast,
  requestSharedRoast,
} from "@/http/functions/request-roast";
import { useRoastFlowStore } from "@/store/roast-flow-store";
import type { AnalyticsSurface } from "@/types/analytics";
import { downloadRoastCard } from "@/utils/download-roast-card";
import { trackEvent } from "@/utils/track-event";

const GENERIC_ERROR = "Something went wrong. Try again.";

function errorMessage(error: unknown) {
  return error instanceof RequestError ? error.message : GENERIC_ERROR;
}

function errorCode(error: unknown) {
  return error instanceof RequestError ? error.code : "server_error";
}

export function useRoastFlowState() {
  const store = useRoastFlowStore();
  const { roast, scanIndex, startScan, tickScan, showResult, failScan } = store;

  const roastMutation = useMutation({
    mutationFn: (riotId: string) => requestRoast(riotId),
    onSuccess: (data) => {
      trackEvent(ANALYTICS_EVENTS.ROAST_SUCCEEDED, {
        verdict: data.verdict,
        badge: data.badge.name,
        agent: data.agent,
      });
      showResult(data);
    },
    onError: (error) => {
      trackEvent(ANALYTICS_EVENTS.ROAST_FAILED, {
        error_code: errorCode(error),
      });
      failScan(errorMessage(error));
    },
  });

  const rivalMutation = useMutation({
    mutationFn: (riotId: string) => requestRival(riotId, roast?.id ?? ""),
    onSuccess: (data) => {
      trackEvent(ANALYTICS_EVENTS.RIVAL_SUCCEEDED);
      store.setRival(data);
    },
    onError: (error) => {
      trackEvent(ANALYTICS_EVENTS.RIVAL_FAILED, {
        error_code: errorCode(error),
      });
      toast.error(errorMessage(error));
    },
  });

  // Open a shared roast (`?r=<id>`) on first load.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("r");
    if (!id) {
      return;
    }
    requestSharedRoast(id).then(
      (shared) => {
        trackEvent(ANALYTICS_EVENTS.SHARED_ROAST_OPENED, { success: true });
        showResult(shared);
      },
      (error) => {
        trackEvent(ANALYTICS_EVENTS.SHARED_ROAST_OPENED, { success: false });
        toast.error(errorMessage(error));
      },
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
    trackEvent(ANALYTICS_EVENTS.ROAST_SUBMITTED);
    startScan();
    roastMutation.mutate(id);
  }

  function challenge(name: string) {
    if (!roast) {
      return;
    }
    trackEvent(ANALYTICS_EVENTS.RIVAL_SUBMITTED);
    rivalMutation.mutate(name);
  }

  function openCompare(surface: AnalyticsSurface) {
    trackEvent(ANALYTICS_EVENTS.RIVAL_DIALOG_OPENED, { surface });
    store.setCompareOpen(true);
  }

  function remove() {
    trackEvent(ANALYTICS_EVENTS.ROAST_DELETED);
    roastMutation.reset();
    rivalMutation.reset();
    store.reset();
    toast("Roast deleted permanently");
  }

  async function copyLink(surface: AnalyticsSurface) {
    trackEvent(ANALYTICS_EVENTS.ROAST_LINK_COPIED, { surface });
    const url = `${location.origin}${location.pathname}?r=${encodeURIComponent(roast?.id ?? "")}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
    toast("Share link copied");
  }

  async function downloadCard(surface: AnalyticsSurface) {
    if (!roast) {
      return;
    }
    trackEvent(ANALYTICS_EVENTS.ROAST_CARD_DOWNLOADED, { surface });
    await downloadRoastCard(roast);
    toast("Card downloaded");
  }

  return {
    view: store.view,
    roast,
    rival: store.rival,
    error: store.error,
    rivalPending: rivalMutation.isPending,
    scanLine: SCAN_LINES[scanIndex % SCAN_LINES.length],
    compareOpen: store.compareOpen,
    deleteOpen: store.deleteOpen,
    setCompareOpen: store.setCompareOpen,
    openCompare,
    setDeleteOpen: store.setDeleteOpen,
    scan,
    clearError: store.clearError,
    challenge,
    remove,
    copyLink,
    downloadCard,
  };
}

export type RoastFlow = ReturnType<typeof useRoastFlowState>;
