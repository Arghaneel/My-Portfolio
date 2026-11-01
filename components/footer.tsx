import Link from "next/link";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon, LeetCodeIcon, InstagramIcon } from "@/components/social-icons";
import { siteConfig } from "@/lib/data/site-config";

const socials = [
  { label: "GitHub", href: siteConfig.socials.github, icon: <GitHubIcon size={16} /> },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, icon: <LinkedInIcon size={16} /> },
  { label: "LeetCode", href: siteConfig.socials.leetcode, icon: <LeetCodeIcon size={16} /> },
  { label: "Instagram", href: siteConfig.socials.instagram, icon: <InstagramIcon size={16} /> },
  { label: "Email", href: siteConfig.socials.email, icon: <Mail size={16} /> },
];

const links = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Achievements", href: "/achievements" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/70">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-2">
            <h3 className="text-base font-semibold tracking-tight text-foreground">{siteConfig.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CS student &amp; Applied AI Intern building practical software, IoT devices and AI-powered tools from{" "}
              {siteConfig.location}.
            </p>
          </div>

          <div className="flex flex-col gap-5 md:items-end">
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  {...(s.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              ))}
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Resume
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p>Built with Next.js, TypeScript &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
