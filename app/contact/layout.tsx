import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  path: "/contact",
  description:
    "Get in touch with Arghaneel Das about internships, collaborations or questions. Email, resume and a contact form.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
