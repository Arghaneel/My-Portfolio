"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Flame, Trophy, CalendarCheck, TrendingUp } from "lucide-react";

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionGraphProps {
  days: ContributionDay[];
  totalContributions: number;
  /** GitHub username – used for the "View on GitHub" link. */
  username?: string;
  /** ISO timestamp of the last successful sync. */
  fetchedAt?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Where the numbers came from (shown as a small hint). */
  source?: string;
  /** Platform name shown in the header, e.g. "GitHub" or "LeetCode". */
  platform?: string;
  /** Profile link for the platform (defaults to the GitHub profile of `username`). */
  profileUrl?: string;
  /** Singular noun for one activity, e.g. "contribution" or "submission". */
  unit?: string;
  title?: string;
}

// Opacity steps of one green, so the scale reads correctly on light and dark
// backgrounds without relying on `dark:` variants.
const levelColors = [
  "bg-muted-foreground/15",
  "bg-emerald-500/30",
  "bg-emerald-500/55",
  "bg-emerald-500/80",
  "bg-emerald-500",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CELL = 12; // px
const GAP = 3; // px

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const parseDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

const formatLong = (s: string) =>
  parseDate(s).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

const formatShort = (s: string) =>
  parseDate(s).toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function timeAgo(iso?: string, now = Date.now()) {
  if (!iso) return "";
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}

function computeStats(days: ContributionDay[]) {
  let longest = 0;
  let run = 0;
  let best: ContributionDay | null = null;
  let active = 0;
  for (const d of days) {
    if (d.count > 0) {
      run++;
      active++;
      longest = Math.max(longest, run);
      if (!best || d.count > best.count) best = d;
    } else {
      run = 0;
    }
  }
  // Current streak: today with 0 contributions doesn't break it yet (same as GitHub).
  let current = 0;
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  for (; i >= 0 && days[i].count > 0; i--) current++;
  return { longest, current, best, active };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function ContributionGraph({
  days,
  totalContributions,
  username = "Arghaneel",
  fetchedAt,
  refreshing,
  onRefresh,
  source,
  platform = "GitHub",
  profileUrl,
  unit = "contribution",
  title = "Activity Calendar",
}: ContributionGraphProps) {
  const sorted = useMemo(() => [...days].sort((a, b) => (a.date < b.date ? -1 : 1)).slice(-371), [days]);
  const stats = useMemo(() => computeStats(sorted), [sorted]);

  // Re-render the "synced x ago" label every 30s.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{totalContributions.toLocaleString()}</span> {unit}s
            in the last year on{" "}
            <a
              href={profileUrl ?? `https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {platform}
            </a>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {fetchedAt && (
            <span
              className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground"
              title={source ? `Source: ${source}` : undefined}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  source === "cached" || source === "sample" ? "bg-amber-500" : "bg-emerald-500"
                }`}
              />
              Synced {timeAgo(fetchedAt, now)}
            </span>
          )}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              aria-label={`Refresh ${platform} stats`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors disabled:opacity-60"
            >
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Syncing" : "Refresh"}
            </button>
          )}
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile icon={<Flame size={16} className="text-orange-500" />} label="Current streak" value={plural(stats.current, "day")} />
        <StatTile icon={<Trophy size={16} className="text-amber-500" />} label="Longest streak" value={plural(stats.longest, "day")} />
        <StatTile icon={<CalendarCheck size={16} className="text-emerald-500" />} label="Active days" value={`${stats.active} / ${sorted.length}`} />
        <StatTile
          icon={<TrendingUp size={16} className="text-primary" />}
          label="Best day"
          value={stats.best ? `${stats.best.count} on ${formatShort(stats.best.date)}` : "—"}
        />
      </div>

      {/* Contribution graph (heatmap) */}
      <section aria-label="Contribution graph" className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">Contribution Graph</h4>
        <Heatmap days={sorted} unit={unit} />
      </section>

      {/* Activity graph (line chart) */}
      <section aria-label="Activity graph" className="space-y-2 pt-4 border-t border-border/40">
        <ActivityGraph days={sorted} unit={unit} platform={platform} />
      </section>
    </div>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-secondary/50">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-bold text-foreground truncate">{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Heatmap                                                             */
/* ------------------------------------------------------------------ */
function Heatmap({ days, unit }: { days: ContributionDay[]; unit: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; day: ContributionDay } | null>(null);

  const { weeks, monthLabels } = useMemo(() => {
    if (days.length === 0) return { weeks: [] as (ContributionDay | null)[][], monthLabels: [] as { col: number; label: string }[] };
    const cells: (ContributionDay | null)[] = [];
    const firstDow = parseDate(days[0].date).getUTCDay(); // 0 = Sunday
    for (let i = 0; i < firstDow; i++) cells.push(null);
    cells.push(...days);
    const weeks: (ContributionDay | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    const monthLabels: { col: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, col) => {
      const firstReal = week.find((d) => d) as ContributionDay | undefined;
      if (!firstReal) return;
      const m = parseDate(firstReal.date).getUTCMonth();
      if (m !== lastMonth) {
        const prev = monthLabels[monthLabels.length - 1];
        if (!prev || col - prev.col >= 3) monthLabels.push({ col, label: MONTHS[m] });
        lastMonth = m;
      }
    });
    return { weeks, monthLabels };
  }, [days]);

  // Start scrolled to the most recent weeks on small screens.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [weeks.length]);

  const gridWidth = weeks.length * (CELL + GAP) - GAP;

  const showTip = (e: React.MouseEvent<HTMLDivElement>, day: ContributionDay) => {
    const container = scrollRef.current;
    if (!container) return;
    const cell = e.currentTarget.getBoundingClientRect();
    const box = container.getBoundingClientRect();
    setTip({
      x: cell.left - box.left + container.scrollLeft + CELL / 2,
      y: cell.top - box.top,
      day,
    });
  };

  return (
    <div>
      <div ref={scrollRef} className="relative overflow-x-auto pb-2 select-none" onMouseLeave={() => setTip(null)}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex gap-2"
          style={{ minWidth: gridWidth + 32 }}
        >
          {/* Weekday labels */}
          <div className="flex flex-col pt-5 text-[10px] text-muted-foreground" style={{ gap: GAP }}>
            {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
              <div key={i} style={{ height: CELL, lineHeight: `${CELL}px` }} className="w-6">
                {d}
              </div>
            ))}
          </div>

          <div>
            {/* Month labels */}
            <div className="relative h-4 mb-1 text-[10px] text-muted-foreground" style={{ width: gridWidth }}>
              {monthLabels.map((m) => (
                <span key={`${m.col}-${m.label}`} className="absolute" style={{ left: m.col * (CELL + GAP) }}>
                  {m.label}
                </span>
              ))}
            </div>

            {/* Cells */}
            <div className="flex" style={{ gap: GAP }}>
              {weeks.map((week, col) => (
                <div key={col} className="flex flex-col" style={{ gap: GAP }}>
                  {Array.from({ length: 7 }).map((_, row) => {
                    const day = week[row];
                    if (!day) return <div key={row} style={{ width: CELL, height: CELL }} />;
                    return (
                      <div
                        key={row}
                        role="img"
                        aria-label={`${day.count} ${unit}s on ${day.date}`}
                        onMouseEnter={(e) => showTip(e, day)}
                        className={`rounded-[3px] ${levelColors[day.level]} outline-offset-1 hover:outline hover:outline-1 hover:outline-primary transition-colors`}
                        style={{ width: CELL, height: CELL }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {tip && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-semibold text-background shadow-md"
            style={{ left: tip.x, top: tip.y - 6 }}
          >
            {tip.day.count === 0 ? "No" : tip.day.count} {unit}{tip.day.count === 1 ? "" : "s"} on{" "}
            {formatLong(tip.day.date)}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground pt-1">
        <span>Less</span>
        {levelColors.map((c, i) => (
          <div key={i} className={`rounded-[3px] ${c}`} style={{ width: CELL, height: CELL }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Activity graph                                                      */
/* ------------------------------------------------------------------ */
type Range = "30d" | "90d" | "1y";
const RANGES: { key: Range; label: string }[] = [
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "1y", label: "1Y" },
];

function ActivityGraph({ days, unit, platform }: { days: ContributionDay[]; unit: string; platform: string }) {
  const [range, setRange] = useState<Range>("30d");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Points: daily for 30D/90D, weekly totals for 1Y.
  const points = useMemo(() => {
    if (range === "30d") return days.slice(-30).map((d) => ({ label: d.date, value: d.count, weekly: false }));
    if (range === "90d") return days.slice(-90).map((d) => ({ label: d.date, value: d.count, weekly: false }));
    const out: { label: string; value: number; weekly: boolean }[] = [];
    const last = days.slice(-364);
    for (let i = 0; i < last.length; i += 7) {
      const chunk = last.slice(i, i + 7);
      out.push({ label: chunk[0].date, value: chunk.reduce((s, d) => s + d.count, 0), weekly: true });
    }
    return out;
  }, [days, range]);

  const periodTotal = points.reduce((s, p) => s + p.value, 0);

  const H = 200;
  const pad = { top: 16, right: 12, bottom: 26, left: 30 };
  const innerW = width - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const max = Math.max(4, ...points.map((p) => p.value));
  const niceMax = Math.ceil(max / 4) * 4;
  const x = (i: number) => pad.left + (points.length <= 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  const y = (v: number) => pad.top + innerH - (v / niceMax) * innerH;

  // Smooth path (monotone-ish cubic using midpoints).
  const linePath = useMemo(() => {
    if (points.length === 0) return "";
    let d = `M ${x(0)} ${y(points[0].value)}`;
    for (let i = 1; i < points.length; i++) {
      const x0 = x(i - 1), y0 = y(points[i - 1].value);
      const x1 = x(i), y1 = y(points[i].value);
      const cx = (x0 + x1) / 2;
      d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
    }
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, width, niceMax]);

  const areaPath = points.length
    ? `${linePath} L ${x(points.length - 1)} ${pad.top + innerH} L ${x(0)} ${pad.top + innerH} Z`
    : "";

  const yTicks = [0, niceMax / 4, niceMax / 2, (3 * niceMax) / 4, niceMax];
  const xTickEvery = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor(innerW / 70))));

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const i = Math.round(((px - pad.left) / innerW) * (points.length - 1));
    setHover(Math.max(0, Math.min(points.length - 1, i)));
  };

  const hp = hover != null ? points[hover] : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Activity Graph</h4>
          <p className="text-[11px] text-muted-foreground">
            {periodTotal} {unit}s in the last {range === "30d" ? "30 days" : range === "90d" ? "90 days" : "year"}
            {range === "1y" && " · weekly totals"}
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-border p-0.5 text-[11px] font-semibold">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => {
                setRange(r.key);
                setHover(null);
              }}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                range === r.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={wrapRef} className="relative w-full text-primary">
        <svg
          width={width}
          height={H}
          className="block touch-none"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          role="img"
          aria-label={`Line chart of ${platform} ${unit}s, ${periodTotal} in the selected period`}
        >
          <defs>
            <linearGradient id="activity-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.35} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Grid + y labels */}
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y(t)}
                y2={y(t)}
                className="stroke-border"
                strokeDasharray={t === 0 ? undefined : "3 4"}
              />
              <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted-foreground text-[10px]">
                {t}
              </text>
            </g>
          ))}

          {/* X labels */}
          {points.map((p, i) =>
            i % xTickEvery === 0 ? (
              <text
                key={p.label}
                x={x(i)}
                y={H - 8}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {formatShort(p.label)}
              </text>
            ) : null
          )}

          <motion.path
            key={`area-${range}`}
            d={areaPath}
            fill="url(#activity-fill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            key={`line-${range}`}
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Points (only when few enough to be readable) */}
          {points.length <= 31 &&
            points.map((p, i) => (
              <circle key={p.label} cx={x(i)} cy={y(p.value)} r={2.5} className="fill-card" stroke="currentColor" strokeWidth={1.5} />
            ))}

          {/* Hover crosshair */}
          {hp && hover != null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + innerH} stroke="currentColor" strokeOpacity={0.35} />
              <circle cx={x(hover)} cy={y(hp.value)} r={4.5} fill="currentColor" className="stroke-card" strokeWidth={2} />
            </g>
          )}
        </svg>

        {hp && hover != null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-semibold text-background shadow-md"
            style={{ left: Math.min(Math.max(x(hover), 60), width - 60), top: y(hp.value) - 10 }}
          >
            {hp.value} {unit}{hp.value === 1 ? "" : "s"} · {hp.weekly ? `week of ${formatShort(hp.label)}` : formatLong(hp.label)}
          </div>
        )}
      </div>
    </div>
  );
}
