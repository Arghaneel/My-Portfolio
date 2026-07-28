"use client";

import { useState, useEffect } from "react";
import { LeetCodeStats } from "@/lib/leetcode";

export function useLeetcodeStats() {
  const [data, setData] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getStats() {
      try {
        const res = await fetch("/api/leetcode");
        if (!res.ok) {
          throw new Error("Failed to load LeetCode stats");
        }
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    getStats();
  }, []);

  return { data, loading, error };
}
