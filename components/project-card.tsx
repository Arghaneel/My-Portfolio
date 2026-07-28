"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Globe, ExternalLink } from "lucide-react";
import { Project } from "@/lib/data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 overflow-hidden group transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-secondary">
        <Image
          src={project.images[0] || "/images/placeholder.png"}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="px-2.5 py-1 rounded-md bg-primary/90 text-primary-foreground text-xs font-semibold uppercase tracking-wider">
            {project.category}
          </span>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider md:hidden">
            {project.category}
          </span>
          <Link href={`/projects/${project.slug}`} className="block">
            <h3 className="text-xl font-bold leading-snug text-foreground hover:text-primary transition-colors">
              {project.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {project.tagline}
          </p>
        </div>

        {/* Tech Stack chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Buttons strip */}
        <div className="flex items-center gap-3 pt-3 mt-auto border-t border-border/40">
          <Link
            href={`/projects/${project.slug}`}
            className="flex-grow inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 shadow-sm transition-all"
          >
            Details
            <ExternalLink size={14} />
          </Link>
          
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
              aria-label="GitHub Repository"
            >
              <Globe size={18} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
