"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useLeetcodeStats } from "@/hooks/use-leetcode-stats";
import { Flame, Award, Globe, CheckCircle, ExternalLink, CalendarDays } from "lucide-react";
import ContributionGraph, { ContributionDay } from "@/components/contribution-graph";

function timeAgo(unixSeconds: number) {
  const s = Math.max(0, Date.now() / 1000 - unixSeconds);
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  const d = Math.round(s / 86400);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

/** LeetCode's calendar uses UTC-midnight unix timestamps → one entry per day for the last year. */
function toDays(calendar: Record<string, number>): ContributionDay[] {
  const byDay = new Map<number, number>();
  for (const [ts, count] of Object.entries(calendar)) {
    const day = Math.floor(Number(ts) / 86400);
    byDay.set(day, (byDay.get(day) ?? 0) + count);
  }
  const today = Math.floor(Date.now() / 86400000);
  const out: ContributionDay[] = [];
  for (let d = today - 364; d <= today; d++) {
    const count = byDay.get(d) ?? 0;
    const level = (count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4) as ContributionDay["level"];
    out.push({ date: new Date(d * 86400000).toISOString().slice(0, 10), count, level });
  }
  return out;
}

const pct = (a: number, b: number) => (b > 0 ? Math.min(100, (a / b) * 100) : 0);

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

  const days = useMemo(() => (leetcode ? toDays(leetcode.submissionCalendar) : []), [leetcode]);
  const yearTotal = useMemo(() => days.reduce((s, d) => s + d.count, 0), [days]);

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
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center space-y-3">
        <p className="text-muted-foreground font-semibold">LeetCode stats are temporarily unavailable.</p>
        <a
          href="https://leetcode.com/u/arghaneel_das/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-sm hover:underline inline-flex items-center gap-1"
        >
          View my LeetCode profile <ExternalLink size={12} />
        </a>
        <Link href="/dashboard" className="text-primary text-sm hover:underline block">
          Back to Overview
        </Link>
      </div>
    );
  }

  const rows = [
    { label: "Easy", solved: leetcode.easySolved, total: leetcode.totalEasy, color: "emerald" },
    { label: "Medium", solved: leetcode.mediumSolved, total: leetcode.totalMedium, color: "amber" },
    { label: "Hard", solved: leetcode.hardSolved, total: leetcode.totalHard, color: "red" },
  ] as const;
  const barColor = { emerald: "bg-emerald-500", amber: "bg-amber-500", red: "bg-red-500" };
  const textColor = { emerald: "text-emerald-500", amber: "text-amber-500", red: "text-red-500" };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-extrabold text-foreground">LeetCode Statistics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Live data from{" "}
          <a href={leetcode.profileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            leetcode.com/u/{leetcode.username}
          </a>
        </p>
      </div>

      <div className="mt-8">{dashboardNav}</div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
            <div className="flex items-end justify-between">
              <h2 className="text-lg font-bold text-foreground">Problems Solved</h2>
              <span className="text-3xl font-extrabold text-foreground">{leetcode.totalSolved}</span>
            </div>
            <div className="space-y-4">
              {rows.map((r) => (
                <div key={r.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className={textColor[r.color]}>{r.label}</span>
                    <span>
                      {r.solved} / {r.total}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${barColor[r.color]}`} style={{ width: `${pct(r.solved, r.total)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border/40 grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-xs text-muted-foreground block">Global Rank</span>
                <span className="text-base font-extrabold text-foreground flex items-center justify-center gap-1 mt-0.5">
                  <Globe size={14} className="text-muted-foreground" />
                  {leetcode.ranking ? leetcode.ranking.toLocaleString() : "—"}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Contest Rating</span>
                <span className="text-base font-extrabold text-foreground flex items-center justify-center gap-1 mt-0.5">
                  <Award size={14} className="text-amber-500" />
                  {leetcode.contestRating ?? "No contests yet"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
              <Flame size={28} className="text-orange-500" />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider block">Current Streak</span>
                <span className="text-xl font-extrabold">
                  {leetcode.streak} day{leetcode.streak === 1 ? "" : "s"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-secondary/50">
                <span className="text-[11px] text-muted-foreground block">Longest streak</span>
                <span className="font-bold">{leetcode.maxStreak} days</span>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50">
                <span className="text-[11px] text-muted-foreground block">Active days</span>
                <span className="font-bold">{leetcode.totalActiveDays}</span>
              </div>
            </div>

            {leetcode.badges.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <span className="text-sm font-bold text-foreground block">Badges</span>
                <div className="flex flex-wrap gap-2">
                  {leetcode.badges.map((b) => (
                    <span key={b.name} className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold">
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-8 space-y-6">
          <ContributionGraph
            days={days}
            totalContributions={yearTotal}
            platform="LeetCode"
            profileUrl={leetcode.profileUrl}
            unit="submission"
            title="Submission Calendar"
            fetchedAt={leetcode.fetchedAt}
          />

          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground">Recently Solved</h3>
            {leetcode.submissions.length === 0 ? (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CalendarDays size={16} /> No recent accepted submissions.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-xs text-muted-foreground uppercase font-semibold">
                      <th className="pb-3 pr-4">Problem</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 px-4">Difficulty</th>
                      <th className="pb-3 px-4">Language</th>
                      <th className="pb-3 pl-4">When</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {leetcode.submissions.map((sub) => (
                      <tr key={`${sub.url}-${sub.timestamp}`} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-3.5 pr-4 font-semibold text-foreground truncate max-w-[220px]">
                          <a href={sub.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                            {sub.title}
                          </a>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold text-xs">
                            <CheckCircle size={14} /> Accepted
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-xs font-semibold ${
                              sub.difficulty === "Easy"
                                ? "text-emerald-500"
                                : sub.difficulty === "Medium"
                                ? "text-amber-500"
                                : sub.difficulty === "Hard"
                                ? "text-red-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            {sub.difficulty ?? "—"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono">{sub.language}</td>
                        <td className="py-3.5 pl-4 text-xs text-muted-foreground whitespace-nowrap">{timeAgo(sub.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
