"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, BadgeCheck, Mic, ExternalLink } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import { achievements, certifications, seminars } from "@/lib/data/experience";

type Kind = "Competition" | "Certification" | "Seminar";

interface Item {
  kind: Kind;
  title: string;
  /** Organiser or issuer. */
  source?: string;
  date?: string;
  badge?: string;
  /** Big text on the cover, e.g. the project name. */
  cover: string;
  points: string[];
  link?: string;
}

const items: Item[] = [
  ...achievements.map<Item>((a) => ({
    kind: "Competition",
    title: a.title,
    source: a.organizer,
    badge: a.result,
    cover: a.project,
    points: a.details,
  })),
  ...certifications.map<Item>((c) => ({
    kind: "Certification",
    title: c.title,
    source: c.issuer,
    date: c.year,
    cover: c.issuer,
    points: c.description ? [c.description] : [],
    link: c.credentialUrl,
  })),
  ...seminars.map<Item>((s) => ({
    kind: "Seminar",
    title: s.title,
    source: s.organizer,
    cover: s.organizer.split(",")[0],
    points: [s.description],
  })),
];

const kindStyle: Record<Kind, { gradient: string; icon: React.ReactNode; plural: string }> = {
  Competition: { gradient: "from-amber-500 via-orange-800 to-zinc-950", icon: <Trophy strokeWidth={1.5} />, plural: "Competitions" },
  Certification: { gradient: "from-emerald-500 via-teal-800 to-zinc-950", icon: <BadgeCheck strokeWidth={1.5} />, plural: "Certifications" },
  Seminar: { gradient: "from-sky-500 via-indigo-800 to-zinc-950", icon: <Mic strokeWidth={1.5} />, plural: "Seminars" },
};

const filters: ("All" | Kind)[] = ["All", "Competition", "Certification", "Seminar"];

function Cover({ item }: { item: Item }) {
  const s = kindStyle[item.kind];
  return (
    <div className={`relative aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br ${s.gradient} text-white`} aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "16px 16px" }}
      />
      <div className="absolute -right-6 -bottom-8 h-40 w-40 opacity-20 [&>svg]:h-full [&>svg]:w-full">{s.icon}</div>
      <div className="relative flex h-full flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm [&>svg]:h-5 [&>svg]:w-5">
            {s.icon}
          </span>
          {item.badge && (
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-zinc-900">{item.badge}</span>
          )}
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">{item.kind}</div>
          <div className="mt-0.5 text-xl font-bold leading-tight tracking-tight line-clamp-2">{item.cover}</div>
        </div>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visible = filter === "All" ? items : items.filter((i) => i.kind === filter);
  const count = (f: (typeof filters)[number]) => (f === "All" ? items.length : items.filter((i) => i.kind === f).length);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <SectionHeading
          as="h1"
          eyebrow="Recognition"
          title="My"
          highlight="Achievements."
          description="Hackathons, pitching competitions, certifications and seminars I've taken part in."
        />
      </motion.div>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter achievements">
        {filters.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "All" ? "All" : kindStyle[f].plural}
              <span className={`text-xs tabular-nums ${active ? "opacity-70" : "opacity-60"}`}>{count(f)}</span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {visible.map((item) => (
            <motion.article
              layout
              key={`${item.kind}-${item.title}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-3 transition-colors hover:border-primary/35"
            >
              <Cover item={item} />
              <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
                <h2 className="font-semibold leading-snug text-foreground">{item.title}</h2>
                {(item.source || item.date) && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[item.source, item.date].filter(Boolean).join(" · ")}
                  </p>
                )}
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {item.points.map((p) => (
                    <li key={p} className="flex gap-2.5 leading-relaxed">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-primary/70" />
                      {p}
                    </li>
                  ))}
                </ul>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-medium text-primary hover:underline"
                  >
                    View credential <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
