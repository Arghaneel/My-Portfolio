"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { LeetCodeStats } from "@/lib/leetcode";

const AUTO_REFRESH_MS = 10 * 60 * 1000;

export function useLeetcodeStats() {
  const [data, setData] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const load = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await fetch(`/api/leetcode?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("LeetCode stats are temporarily unavailable");
      setData(await res.json());
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    const id = window.setInterval(load, AUTO_REFRESH_MS);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(id);
    };
  }, [load]);

  return { data, loading, error, refresh: load };
}
