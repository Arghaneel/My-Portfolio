import Link from "next/link";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon, LeetCodeIcon, InstagramIcon } from "@/components/social-icons";
import { siteConfig } from "@/lib/data/site-config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-secondary/30 dark:bg-card/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              {siteConfig.name}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Computer Science student at Atria Institute of Technology and Applied AI Intern at DeepAgentLabs, building practical software, IoT devices and AI-powered tools.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
                aria-label="GitHub"
              >
                <GitHubIcon size={18} />
              </a>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
                aria-label="LinkedIn"
              >
                <LinkedInIcon size={18} />
              </a>
              <a
                href={siteConfig.socials.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
                aria-label="LeetCode"
              >
                <LeetCodeIcon size={18} />
              </a>
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={siteConfig.socials.email}
                className="p-2 rounded-full bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Me
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Projects Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/experience"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Experience & Achievements
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Stats Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Col */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={siteConfig.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Resume (PDF)
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  GitHub Profile
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Get In Touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            Designed & built by {siteConfig.name} with Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
