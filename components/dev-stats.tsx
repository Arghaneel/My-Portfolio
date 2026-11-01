"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Flame, Globe, Award, RefreshCw, GitFork, Users, Activity } from "lucide-react";
import type { GithubStats } from "@/lib/github";
import type { LeetCodeStats } from "@/lib/leetcode";
import { GitHubIcon, LeetCodeIcon } from "@/components/social-icons";
import { Heatmap } from "@/components/contribution-graph";
import { siteConfig } from "@/lib/data/site-config";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */
function CardShell({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 sm:p-6">{children}</div>;
}

function CardHeader({
  icon,
  title,
  handle,
  href,
  stale,
  refreshing,
  onRefresh,
}: {
  icon: React.ReactNode;
  title: string;
  handle: string;
  href: string;
  stale?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary text-foreground">
          {icon}
        </span>
        <div>
          <h3 className="font-semibold leading-tight text-foreground">{title}</h3>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            @{handle} <ExternalLink size={11} />
          </a>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
          title={stale ? "Couldn't refresh just now – showing the last synced values" : "Live data"}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${stale ? "bg-amber-500" : "bg-primary"}`} />
          {stale ? "Cached" : "Live"}
        </span>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label={`Refresh ${title} stats`}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          </button>
        )}
      </div>
    </div>
  );
}

function Tile({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/60 p-3.5">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-bold tabular-nums text-foreground">{value}</div>
    </div>
  );
}

function Skeleton() {
  return (
    <CardShell>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-secondary" />
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
          <div className="h-2.5 w-16 animate-pulse rounded bg-secondary" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[68px] animate-pulse rounded-xl bg-secondary" />
        ))}
      </div>
      <div className="mt-6 h-28 animate-pulse rounded-xl bg-secondary" />
    </CardShell>
  );
}

function DetailLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      {label} <ArrowRight size={14} />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* GitHub                                                              */
/* ------------------------------------------------------------------ */
// GitHub's own language colours, so the bar reads like the repo pages.
const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  Java: "#b07219",
  JavaScript: "#d4b830",
  TypeScript: "#3178c6",
  "C++": "#f34b7d",
  C: "#6e7681",
  "C#": "#178600",
  HTML: "#e34c26",
  CSS: "#663399",
  "Jupyter Notebook": "#DA5B0B",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Go: "#00ADD8",
  Shell: "#89e051",
  PHP: "#4F5D95",
};
const langColor = (name: string) => LANGUAGE_COLORS[name] ?? "#8b949e";

export function GitHubCard({
  data,
  loading,
  refreshing,
  onRefresh,
  showHeatmap = true,
  showRepos = false,
}: {
  data: GithubStats | null;
  loading: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  showHeatmap?: boolean;
  /** List the most recently pushed repositories (used when the heatmap is shown elsewhere). */
  showRepos?: boolean;
}) {
  if (loading) return <Skeleton />;
  if (!data) {
    return (
      <CardShell>
        <CardHeader icon={<GitHubIcon size={18} />} title="GitHub" handle={siteConfig.githubUsername} href={siteConfig.socials.github} stale />
        <p className="mt-6 text-sm text-muted-foreground">GitHub stats are temporarily unavailable.</p>
      </CardShell>
    );
  }

  const top = data.languages.slice(0, 5);
  const rest = 100 - top.reduce((sum, l) => sum + l.percentage, 0);
  const langs = rest > 0 ? [...top, { name: "Other", percentage: rest }] : top;

  return (
    <CardShell>
      <CardHeader
        icon={<GitHubIcon size={18} />}
        title="GitHub"
        handle={data.profile.login}
        href={data.profile.githubUrl}
        stale={data.stale}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Tile icon={<Activity size={13} />} label="Contributions" value={data.contributions.total.toLocaleString()} />
        <Tile icon={<GitFork size={13} />} label="Public repos" value={data.profile.reposCount} />
        <Tile icon={<Users size={13} />} label="Followers" value={data.profile.followers} />
      </div>

      {showHeatmap && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Contributions in the last year</p>
          <Heatmap days={data.contributions.calendar} unit="contribution" />
        </div>
      )}

      {top.length > 0 && (
        <div className="mt-5">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">Top languages · share of repositories</p>
          <div className="flex h-2 w-full gap-[2px] overflow-hidden rounded-full" role="img" aria-label={langs.map((l) => `${l.name} ${l.percentage}%`).join(", ")}>
            {langs.map((l) => (
              <div
                key={l.name}
                title={`${l.name}: ${l.percentage}%`}
                className="h-full"
                style={{ flex: `${l.percentage} 1 0%`, backgroundColor: langColor(l.name) }}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {langs.map((l) => (
              <li key={l.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: langColor(l.name) }} />
                <span className="text-foreground">{l.name}</span>
                <span className="tabular-nums">{l.percentage}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showRepos && data.repos.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Recently pushed</p>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {data.repos.slice(0, 3).map((repo) => (
              <li key={repo.url}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors hover:bg-secondary/60"
                >
                  <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: langColor(repo.language) }} title={repo.language} />
                  <span className="min-w-0 flex-1 truncate font-medium text-foreground">{repo.name}</span>
                  <span className="flex-shrink-0 text-xs text-muted-foreground">
                    {new Date(repo.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto">
        <DetailLink href="/dashboard/github" label="Repositories & activity" />
      </div>
    </CardShell>
  );
}

/* ------------------------------------------------------------------ */
/* LeetCode                                                            */
/* ------------------------------------------------------------------ */
const DIFFICULTIES = [
  { key: "Easy", color: "var(--easy)" },
  { key: "Medium", color: "var(--medium)" },
  { key: "Hard", color: "var(--hard)" },
] as const;

/** Ring split by how many Easy / Medium / Hard problems are solved, with a 2px gap between segments. */
function SolvedRing({ parts, total }: { parts: { key: string; value: number; color: string }[]; total: number }) {
  const size = 132;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const nonZero = parts.filter((p) => p.value > 0);
  const gap = nonZero.length > 1 ? 2.5 : 0;
  let offset = 0;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
        {total > 0 &&
          nonZero.map((p) => {
            const len = (p.value / total) * c;
            const dash = Math.max(0, len - gap);
            const el = (
              <circle
                key={p.key}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={p.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
              >
                <title>{`${p.key}: ${p.value}`}</title>
              </circle>
            );
            offset += len;
            return el;
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums text-foreground">{total}</span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Solved</span>
      </div>
    </div>
  );
}

function timeAgo(unixSeconds: number) {
  const s = Math.max(0, Date.now() / 1000 - unixSeconds);
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  const d = Math.round(s / 86400);
  if (d < 30) return `${d}d ago`;
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function LeetCodeCard({ data, loading }: { data: LeetCodeStats | null; loading: boolean }) {
  const fallbackHandle = siteConfig.socials.leetcode.split("/u/")[1]?.replace(/\/$/, "") ?? "leetcode";
  if (loading) return <Skeleton />;
  if (!data) {
    return (
      <CardShell>
        <CardHeader icon={<LeetCodeIcon size={18} />} title="LeetCode" handle={fallbackHandle} href={siteConfig.socials.leetcode} stale />
        <p className="mt-6 text-sm text-muted-foreground">LeetCode stats are temporarily unavailable.</p>
      </CardShell>
    );
  }

  const rows = [
    { ...DIFFICULTIES[0], solved: data.easySolved, total: data.totalEasy },
    { ...DIFFICULTIES[1], solved: data.mediumSolved, total: data.totalMedium },
    { ...DIFFICULTIES[2], solved: data.hardSolved, total: data.totalHard },
  ];

  return (
    <CardShell>
      <CardHeader
        icon={<LeetCodeIcon size={18} />}
        title="LeetCode"
        handle={data.username}
        href={data.profileUrl}
        stale={data.stale}
      />

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <SolvedRing parts={rows.map((r) => ({ key: r.key, value: r.solved, color: r.color }))} total={data.totalSolved} />
        <ul className="w-full space-y-3.5">
          {rows.map((r) => (
            <li key={r.key}>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.key}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  <span className="font-semibold text-foreground">{r.solved}</span> / {r.total}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${r.total ? Math.min(100, (r.solved / r.total) * 100) : 0}%`, backgroundColor: r.color }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Tile icon={<Flame size={13} />} label="Streak" value={`${data.streak}d`} />
        <Tile icon={<Globe size={13} />} label="Rank" value={data.ranking ? data.ranking.toLocaleString() : "—"} />
        <Tile icon={<Award size={13} />} label="Rating" value={data.contestRating ?? "—"} />
      </div>

      {data.submissions.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Recently solved</p>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {data.submissions.slice(0, 3).map((sub) => {
              const diff = DIFFICULTIES.find((d) => d.key === sub.difficulty);
              return (
                <li key={`${sub.url}-${sub.timestamp}`}>
                  <a
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors hover:bg-secondary/60"
                  >
                    <span
                      className="h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: diff?.color ?? "var(--muted-foreground)" }}
                      title={sub.difficulty ?? undefined}
                    />
                    <span className="min-w-0 flex-1 truncate font-medium text-foreground">{sub.title}</span>
                    <span className="flex-shrink-0 text-xs text-muted-foreground">{timeAgo(sub.timestamp)}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-auto">
        <DetailLink href="/dashboard/leetcode" label="Submissions & calendar" />
      </div>
    </CardShell>
  );
}
