"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/lib/data/projects";
import ProjectCover from "@/components/project-cover";
import { GitHubIcon } from "@/components/social-icons";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="group relative flex flex-col rounded-2xl border border-border bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
          <ProjectCover project={project} sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {/* Stretched link makes the whole card clickable */}
            <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
              {project.title}
            </Link>
          </h3>
          <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-primary/50 group-hover:text-primary">
            <ArrowUpRight size={16} />
          </span>
        </div>
        {project.context && <p className="mt-1 text-xs font-medium text-primary">{project.context}</p>}
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{project.tagline}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((t) => (
              <span key={t} className="rounded-md border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex flex-shrink-0 items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
              aria-label={`${project.title} source code on GitHub`}
            >
              <GitHubIcon size={14} /> Code
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
