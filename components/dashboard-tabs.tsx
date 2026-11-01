import Link from "next/link";

const tabs = [
  { key: "overview", label: "Overview", href: "/dashboard" },
  { key: "github", label: "GitHub", href: "/dashboard/github" },
  { key: "leetcode", label: "LeetCode", href: "/dashboard/leetcode" },
] as const;

export default function DashboardTabs({ active }: { active: (typeof tabs)[number]["key"] }) {
  return (
    <nav aria-label="Dashboard sections" className="inline-flex rounded-full border border-border bg-card p-1">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <Link
            key={t.key}
            href={t.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
