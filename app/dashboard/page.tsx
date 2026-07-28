"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useGithubStats } from "@/hooks/use-github-stats";
import { useLeetcodeStats } from "@/hooks/use-leetcode-stats";
import { Globe, Code, Users, Award, Zap, AlertTriangle, ArrowRight } from "lucide-react";
import ContributionGraph from "@/components/contribution-graph";

export default function DashboardOverview() {
  const { data: github, loading: githubLoading, error: githubError } = useGithubStats();
  const { data: leetcode, loading: leetcodeLoading, error: leetcodeError } = useLeetcodeStats();

  const isStale = github?.stale || leetcode?.stale;

  const dashboardNav = (
    <div className="flex gap-2 border-b border-border/40 pb-4 mb-8">
      <Link href="/dashboard" className="px-4 py-2 text-sm font-bold text-primary border-b-2 border-primary">
        Overview
      </Link>
      <Link href="/dashboard/github" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        GitHub
      </Link>
      <Link href="/dashboard/leetcode" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        LeetCode
      </Link>
    </div>
  );

  if (githubLoading || leetcodeLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-10 w-48 bg-secondary animate-pulse rounded-lg" />
          <div className="h-12 w-full bg-secondary animate-pulse rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 bg-secondary animate-pulse rounded-2xl" />
            <div className="h-64 bg-secondary animate-pulse rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground">Developer Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Live updates from my development profiles</p>
        </div>

        {isStale && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
            <AlertTriangle size={14} />
            <span>Using fallback snapshot data</span>
          </div>
        )}
      </div>

      {dashboardNav}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: GitHub Overview */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-black text-white dark:bg-white dark:text-black">
                  <Globe size={20} />
                </div>
                <h2 className="text-lg font-bold text-foreground">GitHub Profile</h2>
              </div>
              <Link href="/dashboard/github" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                Detailed stats <ArrowRight size={14} />
              </Link>
            </div>

            {github && (
              <>
                {/* Micro metrics Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <span className="text-xs text-muted-foreground block font-medium">Followers</span>
                    <span className="text-xl font-bold text-foreground">{github.profile.followers}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <span className="text-xs text-muted-foreground block font-medium">Total Repos</span>
                    <span className="text-xl font-bold text-foreground">{github.profile.reposCount}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <span className="text-xs text-muted-foreground block font-medium">Actions</span>
                    <span className="text-xl font-bold text-foreground">{github.contributions.total}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-sm font-semibold text-foreground block">Languages Distribution</span>
                  <div className="space-y-2">
                    {github.languages.slice(0, 3).map((lang, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{lang.name}</span>
                          <span>{lang.percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${lang.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: LeetCode Overview */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500 text-white">
                  <Code size={20} />
                </div>
                <h2 className="text-lg font-bold text-foreground">LeetCode Stats</h2>
              </div>
              <Link href="/dashboard/leetcode" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                Detailed stats <ArrowRight size={14} />
              </Link>
            </div>

            {leetcode && (
              <>
                {/* Problems Solved Progress Circle */}
                <div className="flex items-center gap-6 p-4 rounded-xl bg-secondary/50">
                  <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center border-4 border-primary rounded-full">
                    <div className="text-center">
                      <span className="text-lg font-extrabold text-foreground block leading-none">{leetcode.totalSolved}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">Solved</span>
                    </div>
                  </div>
                  <div className="flex-grow space-y-2.5">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-emerald-500">Easy</span>
                        <span className="font-semibold">{leetcode.easySolved} / {leetcode.totalEasy}</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(leetcode.easySolved / leetcode.totalEasy) * 100}%` }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-amber-500">Medium</span>
                        <span className="font-semibold">{leetcode.mediumSolved} / {leetcode.totalMedium}</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${(leetcode.mediumSolved / leetcode.totalMedium) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/50 flex items-center gap-3">
                    <Award className="text-amber-500" size={20} />
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium uppercase">Rating</span>
                      <span className="text-sm font-bold text-foreground">{leetcode.contestRating}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 flex items-center gap-3">
                    <Zap className="text-orange-500" size={20} />
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium uppercase">Streak</span>
                      <span className="text-sm font-bold text-foreground">{leetcode.streak} Days</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {github && (
        <div className="mt-8">
          <ContributionGraph days={github.contributions.calendar} totalContributions={github.contributions.total} />
        </div>
      )}
    </div>
  );
}
