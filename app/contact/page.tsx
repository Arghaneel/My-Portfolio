"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, FileText, Clock } from "lucide-react";
import { GitHubIcon, LinkedInIcon, LeetCodeIcon, InstagramIcon } from "@/components/social-icons";
import { siteConfig } from "@/lib/data/site-config";
import ContactForm from "@/components/forms/contact-form";
import { Eyebrow } from "@/components/section-heading";

const details = [
  {
    icon: <Mail size={18} />,
    label: "Email",
    value: siteConfig.email,
    href: siteConfig.socials.email,
  },
  {
    icon: <MapPin size={18} />,
    label: "Location",
    value: siteConfig.location,
  },
  {
    icon: <FileText size={18} />,
    label: "Resume",
    value: "Download PDF",
    href: siteConfig.resumeUrl,
    external: true,
  },
  {
    icon: <Clock size={18} />,
    label: "Response time",
    value: "Usually within a day",
  },
];

const socials = [
  { label: "GitHub", href: siteConfig.socials.github, icon: <GitHubIcon size={18} /> },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, icon: <LinkedInIcon size={18} /> },
  { label: "LeetCode", href: siteConfig.socials.leetcode, icon: <LeetCodeIcon size={18} /> },
  { label: "Instagram", href: siteConfig.socials.instagram, icon: <InstagramIcon size={18} /> },
];

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <Eyebrow live>{siteConfig.availability}</Eyebrow>
        <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Let&apos;s Work <span className="text-gradient">Together.</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          Internship opportunities, collaborations or questions: whether you&apos;re a recruiter, a potential collaborator or
          a fellow student organising an event, my inbox is open.
        </p>
      </motion.div>

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Contact information */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>
          <p className="mt-1 text-sm text-muted-foreground">Prefer email? Reach me directly.</p>

          <ul className="mt-6 space-y-3">
            {details.map((d) => {
              const content = (
                <>
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                    {d.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">{d.label}</span>
                    <span className="block truncate text-sm font-semibold text-foreground">{d.value}</span>
                  </span>
                </>
              );
              return (
                <li key={d.label}>
                  {d.href ? (
                    <a
                      href={d.href}
                      {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex items-center gap-4 rounded-xl border border-border bg-secondary/50 p-3 transition-colors hover:border-primary/40"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/50 p-3">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-8 border-t border-border pt-6">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Find me online</span>
            <div className="mt-3 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <h2 className="mb-6 text-lg font-semibold text-foreground">Send a message</h2>
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
}
