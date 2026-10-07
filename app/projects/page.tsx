"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ProjectFolders from "@/components/project-folders";
import { projects } from "@/lib/data/projects";
import { siteConfig } from "@/lib/data/site-config";
import { GitHubIcon } from "@/components/social-icons";

export default function Projects() {
  return (
    <section className="relative min-h-screen overflow-hidden py-14 text-white">
      {/* Solid backdrop sits below the fluid canvas so the cursor smoke shows here too */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[#020712]" />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-4 text-center"
      >
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/45">Featured Work</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
          Projects that blend hardware, code and impact.
        </h1>
      </motion.div>

      {/* Sliding folders */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.15 }}>
        <ProjectFolders projects={projects} />
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Hint bar */}
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70 backdrop-blur-sm sm:text-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
              <span>{projects.length} selected projects</span>
            </div>
            <span className="hidden text-white/45 sm:inline">Hover a folder to pause · click to open the case study</span>
          </div>
        </div>

        {/* Plain index – quick to scan and works without hover */}
        <div className="mt-14">
          <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-white/45 mb-4">All projects</h2>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 py-5 hover:bg-white/[0.03] transition-colors px-2 -mx-2 rounded-lg"
                >
                  <span className="sm:w-60 flex-shrink-0 text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    {p.title.split(" – ")[0]}
                  </span>
                  <span className="flex-1 text-sm text-white/60">{p.tagline}</span>
                  <span className="flex items-center gap-3 text-xs text-white/45">
                    <span className="uppercase tracking-wider">{p.category}</span>
                    <ArrowUpRight size={16} className="text-white/40 group-hover:text-sky-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 text-center">
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-semibold transition-colors"
          >
            <GitHubIcon size={16} />
            More on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
