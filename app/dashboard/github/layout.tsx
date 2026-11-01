import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "GitHub Statistics",
  path: "/dashboard/github",
  description:
    "Live GitHub activity for Arghaneel Das: contribution calendar, activity graph, languages and recently pushed repositories.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
