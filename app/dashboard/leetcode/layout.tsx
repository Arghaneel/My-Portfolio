import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "LeetCode Statistics",
  path: "/dashboard/leetcode",
  description:
    "Live LeetCode progress for Arghaneel Das: problems solved by difficulty, submission calendar, streaks and recent solutions.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
