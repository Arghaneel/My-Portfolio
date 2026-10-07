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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="group relative flex flex-col rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-[2/1] overflow-hidden">
        <ProjectCover project={project} sizes="(max-width: 768px) 100vw, 50vw" />
      </div>

      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase tracking-wider">
            {project.category}
          </span>
          {project.context && <span className="text-muted-foreground">{project.context}</span>}
        </div>

        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          {/* Stretched link makes the whole card clickable */}
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{project.tagline}</p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.techStack.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[11px] font-semibold">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/50">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Case study <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
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
