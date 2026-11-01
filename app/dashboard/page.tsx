"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useGithubStats } from "@/hooks/use-github-stats";
import { useLeetcodeStats } from "@/hooks/use-leetcode-stats";
import ContributionGraph from "@/components/contribution-graph";
import SectionHeading from "@/components/section-heading";
import DashboardTabs from "@/components/dashboard-tabs";
import { GitHubCard, LeetCodeCard } from "@/components/dev-stats";

export default function DashboardOverview() {
  const { data: github, loading: githubLoading, refreshing, refresh } = useGithubStats();
  const { data: leetcode, loading: leetcodeLoading } = useLeetcodeStats();

  const isStale = github?.stale || leetcode?.stale;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <SectionHeading
          as="h1"
          eyebrow="Dashboard"
          title="Developer"
          highlight="Dashboard."
          description="Live updates from my GitHub and LeetCode profiles, re-synced every few minutes."
        />
      </motion.div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DashboardTabs active="overview" />
        {isStale && (
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <AlertTriangle size={13} />
            Some data couldn&apos;t be refreshed – showing the last synced values
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 min-w-0">
          <GitHubCard data={github} loading={githubLoading} refreshing={refreshing} onRefresh={refresh} showHeatmap={false} showRepos />
        </div>
        <div className="lg:col-span-5 min-w-0">
          <LeetCodeCard data={leetcode} loading={leetcodeLoading} />
        </div>
      </div>

      {github && (
        <div className="mt-5">
          <ContributionGraph
            days={github.contributions.calendar}
            totalContributions={github.contributions.total}
            username={github.profile.login}
            fetchedAt={github.fetchedAt}
            source={github.contributions.source}
            refreshing={refreshing}
            onRefresh={refresh}
          />
        </div>
      )}
    </div>
  );
}
