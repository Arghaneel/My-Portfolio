"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ProjectCard from "@/components/project-card";
import SectionHeading from "@/components/section-heading";
import { projects } from "@/lib/data/projects";
import { siteConfig } from "@/lib/data/site-config";
import { GitHubIcon } from "@/components/social-icons";

export default function Projects() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <SectionHeading
          as="h1"
          eyebrow="Portfolio"
          title="My Recent"
          highlight="Works."
          description="Projects that blend hardware, code and impact: wearable IoT, desktop software, hackathon apps and AgriTech. Open any card for the full case study."
        />
      </motion.div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-14 flex flex-col items-center justify-between gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:p-8"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary text-foreground">
            <GitHubIcon size={20} />
          </span>
          <div>
            <h2 className="font-semibold text-foreground">More on GitHub</h2>
            <p className="text-sm text-muted-foreground">Coursework, experiments and everything else I&apos;m building.</p>
          </div>
        </div>
        <a
          href={siteConfig.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          @{siteConfig.githubUsername} <ArrowUpRight size={16} />
        </a>
      </motion.div>
    </div>
  );
}
