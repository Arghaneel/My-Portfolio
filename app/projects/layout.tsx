import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Projects",
  path: "/projects",
  description:
    "Projects by Arghaneel Das: SixthSense, a wearable obstacle-detection device; ElectriFlow, an electricity billing desktop app; Carbon Grove, a CODE RED ’25 finalist; and Jeevandhara.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
