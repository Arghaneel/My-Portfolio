import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Achievements",
  path: "/achievements",
  description:
    "Hackathons, pitching competitions, certifications and seminars, including CODE RED ’25 (finalist), the GDG on Campus Solution Challenge, the IIC Ideathon and Eureka!",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
