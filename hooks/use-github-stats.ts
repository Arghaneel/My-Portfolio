"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GithubStats } from "@/lib/github";

const AUTO_REFRESH_MS = 5 * 60 * 1000; // re-sync every 5 minutes while the tab is open

export function useGithubStats() {
  const [data, setData] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const load = useCallback(async (isBackground = false) => {
    if (inFlight.current) return;
    inFlight.current = true;
    if (isBackground) setRefreshing(true);
    try {
      // Cache-buster + no-store so neither the browser nor a CDN serves an old copy.
      const res = await fetch(`/api/github?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load GitHub stats");
      const json: GithubStats = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error(err);
      // Keep showing the previous data if we already have some.
      setError((err as Error).message || "An error occurred");
    } finally {
      inFlight.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();

    const onVisible = () => {
      if (document.visibilityState === "visible") load(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    const interval = window.setInterval(() => load(true), AUTO_REFRESH_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      window.clearInterval(interval);
    };
  }, [load]);

  const refresh = useCallback(() => load(true), [load]);

  return { data, loading, refreshing, error, refresh };
}
