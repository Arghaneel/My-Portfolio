"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data/projects";
import ProjectCover from "@/components/project-cover";

/**
 * "Sliding folders" showcase: sheared, overlapping project panels that drift
 * sideways in an endless loop. Hovering pauses the slide and swings the panel
 * forward; clicking opens the case study. Styles live in globals.css
 * (.folders-stage / .folders-track / .folder-card).
 */
export default function ProjectFolders({ projects }: { projects: Project[] }) {
  // Repeat the list so one half of the track is always wider than the screen,
  // then render it twice so translating by -50% loops seamlessly.
  const base: Project[] = [];
  while (projects.length > 0 && base.length < 8) base.push(...projects);
  const track = [...base, ...base];

  return (
    <div className="folders-stage relative">
      <div className="folders-viewport overflow-hidden pt-36 pb-28 sm:pt-44 sm:pb-36">
        <div className="folders-track flex w-max items-center pl-[200px] max-sm:pl-[130px]">
          {track.map((project, i) => {
            const isCopy = i >= projects.length;
            return (
              <Link
                key={`${project.slug}-${i}`}
                href={`/projects/${project.slug}`}
                aria-hidden={isCopy || undefined}
                tabIndex={isCopy ? -1 : undefined}
                aria-label={isCopy ? undefined : `${project.title} – open case study`}
                className="folder-card group relative flex-none flex flex-col w-[480px] h-[320px] -ml-[200px] max-sm:w-[300px] max-sm:h-[210px] max-sm:-ml-[130px] rounded-xl overflow-hidden border border-white/15 bg-[#0b0f19] text-white shadow-[0_40px_80px_rgba(0,0,0,0.65)] outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                style={{ zIndex: i + 1 }}
              >
                <div className="relative flex-[1_1_64%]">
                  <ProjectCover project={project} sizes="480px" />
                </div>
                <div className="flex-[1_1_36%] px-4 py-3 flex flex-col justify-between gap-2 bg-[#0b0f19]">
                  <p className="text-[13px] leading-snug text-white/75 line-clamp-2 max-sm:text-[11px]">{project.tagline}</p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5 max-sm:hidden">
                      {project.techStack.slice(0, 3).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-semibold text-white/80">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-sky-300 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                      Case study <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* soft fade at both edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-40 bg-gradient-to-r from-[#020712] to-transparent z-[60]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-40 bg-gradient-to-l from-[#020712] to-transparent z-[60]" />
    </div>
  );
}
