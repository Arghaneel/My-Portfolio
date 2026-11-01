"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Download, Target, Rocket, FileText, Users, GraduationCap } from "lucide-react";
import { siteConfig } from "@/lib/data/site-config";
import { siteStats } from "@/lib/data/site-stats";
import { experiences } from "@/lib/data/experience";
import { educationList } from "@/lib/data/education";
import SectionHeading, { Eyebrow } from "@/components/section-heading";
import CenterTimeline from "@/components/center-timeline";

const principles = [
  {
    icon: <Target size={18} />,
    title: "Problem first",
    text: "I start by understanding who the problem affects and what success looks like, then choose the technology.",
  },
  {
    icon: <Rocket size={18} />,
    title: "Build, then refine",
    text: "A rough working version teaches more than a perfect plan. I ship early, test, and iterate on what works.",
  },
  {
    icon: <FileText size={18} />,
    title: "Write it down",
    text: "Readable code, clear commits and documentation, so teammates and future me can pick up where I left off.",
  },
  {
    icon: <Users size={18} />,
    title: "Grow together",
    text: "I learn best with others: pairing, organising sessions and helping newer students get comfortable with tools.",
  },
];

const exploring = ["Agentic AI workflows", "Next.js & React", "Python for data", "SQL & database design"];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5 },
} as const;

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-16 space-y-28">
      {/* ── Intro ─────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 lg:sticky lg:top-24"
        >
          <figure className="mx-auto w-full max-w-sm rounded-3xl border border-border bg-card p-3 glow-frame">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/images/Profile.png"
                alt={`Portrait of ${siteConfig.name}`}
                fill
                sizes="(max-width: 1024px) 384px, 40vw"
                className="object-cover object-top"
                priority
              />
            </div>
            <figcaption className="flex items-center justify-between gap-3 px-2 pt-3 pb-1">
              <div>
                <p className="text-sm font-semibold text-foreground">{siteConfig.name}</p>
                <p className="text-xs text-muted-foreground">{siteConfig.shortRole}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={12} /> {siteConfig.location}
              </span>
            </figcaption>
          </figure>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <Eyebrow>About Me</Eyebrow>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-foreground">
            Turning ideas into <span className="text-gradient">practical, working software.</span>
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              I&apos;m Arghaneel, a computer science student in Bangalore. I&apos;m most interested in where software meets
              the real world: AI that people can actually use, devices that respond to their surroundings, and systems that
              quietly make someone&apos;s day easier.
            </p>
            <p>
              I&apos;m curious by default and comfortable being the person who asks &ldquo;why&rdquo; before
              &ldquo;how&rdquo;. I enjoy the whole journey of a project, from a rough idea on paper to something tested,
              documented and in someone&apos;s hands.
            </p>
            <p>
              I&apos;m looking for teams where I can learn from experienced engineers, take ownership of meaningful work and
              keep growing into a well-rounded software engineer.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Exploring</span>
            {exploring.map((e) => (
              <span key={e} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">
                {e}
              </span>
            ))}
          </div>

          <h2 className="mt-10 text-lg font-semibold text-foreground">Core Philosophy</h2>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {principles.map((p) => (
              <li key={p.title} className="flex gap-3.5 rounded-2xl border border-border bg-card p-4">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                  {p.icon}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              See my work <ArrowRight size={16} />
            </Link>
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              Download CV <Download size={16} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── At a glance ───────────────────────────────────── */}
      <section aria-label="At a glance" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {siteStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            {...fadeUp}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="rounded-2xl border border-border bg-card p-5 sm:p-6"
          >
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient">{stat.value}</div>
            <div className="mt-2 text-sm font-semibold text-foreground">{stat.label}</div>
            <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{stat.description}</div>
          </motion.div>
        ))}
      </section>

      {/* ── Experience ────────────────────────────────────── */}
      <section id="experience" className="scroll-mt-24">
        <motion.div {...fadeUp}>
          <SectionHeading
            align="center"
            eyebrow="Career"
            title="Professional"
            highlight="Experience."
            description="My internship, leadership roles and club work."
          />
        </motion.div>
        <div className="mt-14">
          <CenterTimeline items={experiences} />
        </div>
      </section>

      {/* ── Education ─────────────────────────────────────── */}
      <section id="education" className="scroll-mt-24">
        <motion.div {...fadeUp}>
          <SectionHeading align="center" title="Academic" highlight="Background." />
        </motion.div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {educationList.map((edu, i) => (
            <motion.article
              key={edu.degree}
              {...fadeUp}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <GraduationCap size={18} />
                </span>
                <span className="text-xs font-medium text-muted-foreground">{edu.period}</span>
              </div>
              <h3 className="mt-5 font-semibold leading-snug text-foreground">
                {edu.fieldOfStudy ? `${edu.degree} in ${edu.fieldOfStudy}` : edu.degree}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {edu.institution}
                {edu.location ? `, ${edu.location}` : ""}
              </p>
              <p className="mt-4 inline-flex self-start rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {edu.grade}
              </p>
              {edu.details.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  {edu.details.map((d) => (
                    <li key={d} className="flex gap-2.5 leading-relaxed">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-primary/70" />
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
