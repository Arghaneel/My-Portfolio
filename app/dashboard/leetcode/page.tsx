"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useLeetcodeStats } from "@/hooks/use-leetcode-stats";
import { Code, Flame, Award, Globe, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import ContributionGraph from "@/components/contribution-graph";

export default function LeetCodeDashboard() {
  const { data: leetcode, loading, error } = useLeetcodeStats();

  const dashboardNav = (
    <div className="flex gap-2 border-b border-border/40 pb-4 mb-8">
      <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        Overview
      </Link>
      <Link href="/dashboard/github" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        GitHub
      </Link>
      <Link href="/dashboard/leetcode" className="px-4 py-2 text-sm font-bold text-primary border-b-2 border-primary">
        LeetCode
      </Link>
    </div>
  );

  // Convert LeetCode submissionCalendar (Record<string, number>) to ContributionGraph format
  const processedCalendarDays = useMemo(() => {
    if (!leetcode?.submissionCalendar) return [];

    const daysList: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }> = [];
    const now = new Date();
    
    // Create contiguous 180 days list
    for (let i = 179; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      
      // Look up if this date exists in the API submissionCalendar (which is in UNIX epoch seconds)
      // Note: LeetCode API dates are typically local midnights or UTC, let's scan for any match within the day
      let count = 0;
      const dStart = Math.floor(new Date(dateStr).getTime() / 1000);
      const dEnd = dStart + 24 * 60 * 60;

      Object.entries(leetcode.submissionCalendar).forEach(([timestamp, val]) => {
        const ts = parseInt(timestamp);
        if (ts >= dStart && ts < dEnd) {
          count += val;
        }
      });

      const level = count === 0 ? 0 : count === 1 ? 1 : count <= 2 ? 2 : count <= 3 ? 3 : 4;
      daysList.push({
        date: dateStr,
        count,
        level,
      });
    }

    return daysList;
  }, [leetcode]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-10 w-48 bg-secondary animate-pulse rounded-lg mb-6" />
        <div className="h-64 bg-secondary animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (error || !leetcode) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <p className="text-destructive font-semibold">Failed to load LeetCode stats.</p>
        <Link href="/dashboard" className="text-primary text-sm hover:underline mt-4 block">
          Back to Overview
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-extrabold text-foreground">LeetCode Statistics</h1>
        <p className="text-muted-foreground text-sm mt-1">Live metrics from problem solving progress</p>
      </div>

      <div className="mt-8">{dashboardNav}</div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Solved Breakdown & Streaks */}
        <div className="lg:col-span-4 space-y-6">
          {/* Solved Stats Card */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-foreground">Solved Questions</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-500">Easy Solved</span>
                  <span>{leetcode.easySolved} / {leetcode.totalEasy}</span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(leetcode.easySolved / leetcode.totalEasy) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-amber-500">Medium Solved</span>
                  <span>{leetcode.mediumSolved} / {leetcode.totalMedium}</span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${(leetcode.mediumSolved / leetcode.totalMedium) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-red-500">Hard Solved</span>
                  <span>{leetcode.hardSolved} / {leetcode.totalHard}</span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${(leetcode.hardSolved / leetcode.totalHard) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40 grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-xs text-muted-foreground block">Global Rank</span>
                <span className="text-base font-extrabold text-foreground flex items-center justify-center gap-1 mt-0.5">
                  <Globe size={14} className="text-muted-foreground" />
                  {leetcode.ranking.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Contest Rating</span>
                <span className="text-base font-extrabold text-foreground flex items-center justify-center gap-1 mt-0.5">
                  <Award size={14} className="text-amber-500" />
                  {leetcode.contestRating}
                </span>
              </div>
            </div>
          </div>

          {/* Current Streak & Badges */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
              <Flame size={32} className="fill-orange-500 text-orange-500 animate-pulse" />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider block">Current Daily Streak</span>
                <span className="text-xl font-extrabold">{leetcode.streak} Days Active</span>
              </div>
            </div>

            <div className="space-y-3.5">
              <span className="text-sm font-bold text-foreground block">Earned Badges</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:scale-105 transition-transform cursor-default">
                  50 Days Badge 2025
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:scale-105 transition-transform cursor-default">
                  Knight Rating Badge
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:scale-105 transition-transform cursor-default">
                  LeetCode Active User
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Heatmap & Recent Submissions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Calendar */}
          <ContributionGraph days={processedCalendarDays} totalContributions={leetcode.totalSolved} />

          {/* Recent Submissions */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground">Recent Submissions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-xs text-muted-foreground uppercase font-semibold">
                    <th className="pb-3 pr-4">Problem</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4">Difficulty</th>
                    <th className="pb-3 px-4">Language</th>
                    <th className="pb-3 pl-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {leetcode.submissions.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-foreground truncate max-w-[200px]">
                        {sub.title}
                      </td>
                      <td className="py-3.5 px-4">
                        {sub.status === "Accepted" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold text-xs">
                            <CheckCircle size={14} /> Accepted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-500 font-semibold text-xs">
                            <XCircle size={14} /> Failed
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-semibold ${
                            sub.difficulty === "Easy"
                              ? "text-emerald-500"
                              : sub.difficulty === "Medium"
                              ? "text-amber-500"
                              : "text-red-500"
                          }`}
                        >
                          {sub.difficulty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono">{sub.language}</td>
                      <td className="py-3.5 pl-4 text-xs text-muted-foreground">{sub.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
