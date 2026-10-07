import Image from "next/image";
import { Cpu, Monitor, Sprout, Smartphone } from "lucide-react";
import type { Project, ProjectCategory } from "@/lib/data/projects";

const styles: Record<ProjectCategory, { gradient: string; icon: React.ReactNode }> = {
  IoT: { gradient: "from-emerald-600 via-teal-800 to-slate-950", icon: <Cpu strokeWidth={1.4} /> },
  "Desktop App": { gradient: "from-sky-600 via-blue-800 to-slate-950", icon: <Monitor strokeWidth={1.4} /> },
  "AI / AgriTech": { gradient: "from-lime-600 via-green-800 to-slate-950", icon: <Sprout strokeWidth={1.4} /> },
  "Mobile App": { gradient: "from-orange-500 via-rose-800 to-slate-950", icon: <Smartphone strokeWidth={1.4} /> },
};

/**
 * Shows the first real screenshot if the project has one; otherwise a designed
 * cover built from the project's name and category (no fake mockups).
 */
export default function ProjectCover({
  project,
  image,
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  project: Project;
  image?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const src = image ?? project.images[0];
  if (src) {
    return <Image src={src} alt={`${project.title} screenshot`} fill sizes={sizes} priority={priority} className="object-cover" />;
  }

  const s = styles[project.category];
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} text-white overflow-hidden`} aria-hidden="true">
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "18px 18px" }}
      />
      {/* large faded icon */}
      <div className="absolute -right-8 -bottom-10 w-52 h-52 opacity-15 [&>svg]:w-full [&>svg]:h-full">{s.icon}</div>
      <div className="relative h-full flex flex-col justify-between p-5">
        <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6">
          {s.icon}
        </div>
        <div className="max-w-[80%]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">{project.category}</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            {project.title.split(" – ")[0]}
          </div>
        </div>
      </div>
    </div>
  );
}
