"use client";

import Link from "next/link";
import Image from "next/image";
import { useGithubStats } from "@/hooks/use-github-stats";
import { Globe, Star, GitFork, Users, BookOpen, ExternalLink, Calendar } from "lucide-react";
import ContributionGraph from "@/components/contribution-graph";

export default function GitHubDashboard() {
  const { data: github, loading, error } = useGithubStats();

  const dashboardNav = (
    <div className="flex gap-2 border-b border-border/40 pb-4 mb-8">
      <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        Overview
      </Link>
      <Link href="/dashboard/github" className="px-4 py-2 text-sm font-bold text-primary border-b-2 border-primary">
        GitHub
      </Link>
      <Link href="/dashboard/leetcode" className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        LeetCode
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-10 w-48 bg-secondary animate-pulse rounded-lg mb-6" />
        <div className="h-64 bg-secondary animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (error || !github) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <p className="text-destructive font-semibold">Failed to load GitHub stats.</p>
        <Link href="/dashboard" className="text-primary text-sm hover:underline mt-4 block">
          Back to Overview
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-extrabold text-foreground">GitHub Statistics</h1>
        <p className="text-muted-foreground text-sm mt-1">Live metrics from repository activity</p>
      </div>

      <div className="mt-8">{dashboardNav}</div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Profile Summary & Languages */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-primary">
              <Image
                src={github.profile.avatarUrl}
                alt={github.profile.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{github.profile.name}</h2>
              <a
                href={github.profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 mt-1"
              >
                @arghaneel-das <ExternalLink size={10} />
              </a>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-normal px-2">
              {github.profile.bio}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs border-t border-border/40">
              <div>
                <span className="text-muted-foreground block">Followers</span>
                <span className="text-base font-bold text-foreground">{github.profile.followers}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Following</span>
                <span className="text-base font-bold text-foreground">{github.profile.following}</span>
              </div>
            </div>

            <a
              href={github.profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all shadow-sm"
            >
              View GitHub Profile
              <Globe size={16} />
            </a>
          </div>

          {/* Languages Breakdown */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <h3 className="font-bold text-foreground">Language Percentages</h3>
            <div className="space-y-3.5">
              {github.languages.map((lang, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{lang.name}</span>
                    <span>{lang.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${lang.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Contribution graph & Recent repos */}
        <div className="lg:col-span-8 space-y-6">
          {/* Calendar */}
          <ContributionGraph days={github.contributions.calendar} totalContributions={github.contributions.total} />

          {/* Recent Repos */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Recent Repositories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {github.repos.map((repo, idx) => (
                <a
                  key={idx}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground hover:text-primary transition-colors block truncate max-w-[180px]">
                        {repo.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                        {repo.language}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {repo.description || "No repository description provided."}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 mt-3 border-t border-border/30">
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={14} />
                      {repo.forks}
                    </span>
                    <span className="text-[10px] ml-auto">
                      Updated {new Date(repo.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
