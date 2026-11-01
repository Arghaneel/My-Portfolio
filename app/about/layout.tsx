import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  path: "/about",
  description:
    "About Arghaneel Das: Computer Science student at Atria Institute of Technology (CGPA 9.28), Applied AI Intern at DeepAgentLabs and Vice-President of OSCode. Experience, education and how I work.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
