"use client";

import { useState, useEffect } from "react";
import { GithubStats } from "@/lib/github";

export function useGithubStats() {
  const [data, setData] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getStats() {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) {
          throw new Error("Failed to load GitHub stats");
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
