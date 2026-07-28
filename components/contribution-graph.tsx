"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionGraphProps {
  days: ContributionDay[];
  totalContributions: number;
}

const levelColors = [
  "bg-secondary dark:bg-muted/40",
  "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300",
  "bg-emerald-300 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200",
  "bg-emerald-500 dark:bg-emerald-600 text-white",
  "bg-emerald-700 dark:bg-emerald-400 text-white dark:text-black",
];

export default function ContributionGraph({ days, totalContributions }: ContributionGraphProps) {
  // Take last 140 days to fit nicely on screens without wrapping
  const visibleDays = useMemo(() => {
    return days.slice(-147); // 21 weeks * 7 days
  }, [days]);

  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="font-bold text-foreground">Activity Calendar</h3>
          <p className="text-xs text-muted-foreground">Last 5 months of developer contributions</p>
        </div>
        <div className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-lg">
          {totalContributions} Total Actions
        </div>
      </div>

      {/* Grid */}
      <div className="relative overflow-x-auto pb-1 select-none scrollbar-thin">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[500px]">
          {visibleDays.map((day, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: (idx % 7) * 0.02 }}
              className={`w-3.5 h-3.5 rounded-sm ${levelColors[day.level]} relative group cursor-pointer transition-all duration-200 hover:ring-1 hover:ring-primary`}
              title={`${day.count} contributions on ${day.date}`}
            >
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-35 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                {day.count} contributions on {day.date}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/40">
        <span>Less</span>
        <div className="w-3.5 h-3.5 rounded-sm bg-secondary dark:bg-muted/40" />
        <div className="w-3.5 h-3.5 rounded-sm bg-emerald-100 dark:bg-emerald-950/40" />
        <div className="w-3.5 h-3.5 rounded-sm bg-emerald-300 dark:bg-emerald-800" />
        <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500 dark:bg-emerald-600" />
        <div className="w-3.5 h-3.5 rounded-sm bg-emerald-700 dark:bg-emerald-400" />
        <span>More</span>
      </div>
    </div>
  );
}
