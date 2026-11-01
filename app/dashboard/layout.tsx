import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Developer Dashboard",
  path: "/dashboard",
  description:
    "Live GitHub and LeetCode stats for Arghaneel Das: contributions, repositories, languages, problems solved and streaks.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
