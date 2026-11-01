"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download, Mail, MapPin, BrainCircuit, Cpu, Database, Users } from "lucide-react";
import { siteConfig } from "@/lib/data/site-config";
import { projects } from "@/lib/data/projects";
import { GitHubIcon, LinkedInIcon, LeetCodeIcon } from "@/components/social-icons";
import SectionHeading, { Eyebrow } from "@/components/section-heading";
import TechMarquee from "@/components/tech-marquee";
import ProjectCard from "@/components/project-card";
import { GitHubCard, LeetCodeCard } from "@/components/dev-stats";
import { useGithubStats } from "@/hooks/use-github-stats";
import { useLeetcodeStats } from "@/hooks/use-leetcode-stats";

const firstName = siteConfig.name.split(" ")[0];

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
} as const;

const tones = {
  blue: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  purple: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
} as const;

const services: {
  icon: React.ReactNode;
  tone: keyof typeof tones;
  title: string;
  text: string;
  wide?: boolean;
  chips?: string[];
}[] = [
  {
    icon: <BrainCircuit size={20} />,
    tone: "blue",
    title: "Applied AI & Agentic Systems",
    text: "Prototyping, evaluating and documenting agentic AI workflows as an Applied AI Intern at DeepAgentLabs, turning models into tools people actually use.",
    wide: true,
    chips: ["Research", "Prototype", "Evaluate", "Document"],
  },
  {
    icon: <Cpu size={20} />,
    tone: "purple",
    title: "IoT & Embedded",
    text: "ESP32 and Arduino builds that sense the physical world, like SixthSense, a wearable aid that detects head-level obstacles in real time.",
  },
  {
    icon: <Database size={20} />,
    tone: "orange",
    title: "Software & Databases",
    text: "Java, Python and SQL applications on well-designed databases, like ElectriFlow's slab-based billing engine with role-based access.",
  },
  {
    icon: <Users size={20} />,
    tone: "green",
    title: "Leadership & Community",
    text: "Vice-President of OSCode. As Event Coordinator I led a 10-member team and ran tech talks and seminars for 60+ students.",
    wide: true,
    chips: ["OSCode VP", "10-member team", "60+ attendees"],
  },
];

export default function Home() {
  const github = useGithubStats();
  const leetcode = useLeetcodeStats();

  return (
    <div className="relative">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section id="home" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-16 lg:pt-20 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Eyebrow live>{siteConfig.availability}</Eyebrow>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02] text-foreground"
            >
              Hi, I&apos;m
              <br />
              <span className="text-gradient">{firstName}.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground"
            >
              A <strong className="font-semibold text-foreground">Computer Science student</strong> and{" "}
              <strong className="font-semibold text-foreground">Applied AI Intern</strong> based in {siteConfig.location}. I
              build practical software (agentic AI tools, IoT devices and data-driven apps) that solves real problems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                Contact Me
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Download CV
                <Download size={16} />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-10 flex items-center gap-4 text-muted-foreground"
            >
              <span className="text-xs uppercase tracking-[0.2em]">Find me on</span>
              <span className="h-px w-8 bg-border" />
              {[
                { href: siteConfig.socials.github, label: "GitHub", icon: <GitHubIcon size={18} /> },
                { href: siteConfig.socials.linkedin, label: "LinkedIn", icon: <LinkedInIcon size={18} /> },
                { href: siteConfig.socials.leetcode, label: "LeetCode", icon: <LeetCodeIcon size={18} /> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="transition-colors hover:text-primary"
                >
                  {s.icon}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Photo card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto w-full max-w-[340px]">
              {/* offset glowing frame behind the card */}
              <div aria-hidden="true" className="absolute -inset-3 -rotate-3 rounded-[2rem] glow-frame opacity-70" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-card glow-frame">
                <Image
                  src="/images/Profile.png"
                  alt={`Portrait of ${siteConfig.name}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 340px, 30vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <Link
                  href="/about"
                  aria-label="More about me"
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                >
                  <ArrowUpRight size={18} />
                </Link>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
                  <div>
                    <p className="text-sm font-semibold">{siteConfig.name}</p>
                    <p className="text-xs text-white/70">Applied AI Intern · DeepAgentLabs</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] backdrop-blur-sm">
                    <MapPin size={11} /> {siteConfig.location.split(",")[0]}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Technological Foundation ─────────────────────────── */}
      <section id="stack" className="py-20 scroll-mt-20">
        <motion.div {...fadeUp} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            title="Technological Foundation"
            description="The languages, frameworks and tools I use to take ideas from a sketch to something that works."
          />
        </motion.div>
        <motion.div {...fadeUp} className="mx-auto mt-10 max-w-6xl">
          <TechMarquee />
        </motion.div>
      </section>

      {/* ── Beyond Just Coding ───────────────────────────────── */}
      <section id="services" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20">
        <motion.div {...fadeUp}>
          <SectionHeading
            align="center"
            title="Beyond Just Coding"
            description="I care about the whole journey of a project, from understanding who a problem affects to something tested, documented and in someone's hands."
          />
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              className={`group relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-7 transition-colors hover:border-primary/35 ${
                s.wide ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl border ${tones[s.tone]}`}>{s.icon}</span>
                {s.chips && (
                  <ul className="hidden sm:flex flex-wrap justify-end gap-1.5 max-w-[60%]">
                    {s.chips.map((c) => (
                      <li key={c} className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── Featured Projects ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div {...fadeUp}>
          <SectionHeading
            eyebrow="Portfolio"
            title="Featured"
            highlight="Projects."
            description="A few things I've built, from wearable hardware to hackathon apps."
            action={
              <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                View all projects <ArrowRight size={15} />
              </Link>
            }
          />
        </motion.div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.slice(0, 3).map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* ── Live developer dashboard ─────────────────────────── */}
      <section id="activity" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20">
        <motion.div {...fadeUp}>
          <SectionHeading
            eyebrow="Dashboard"
            title="Live Coding"
            highlight="Activity."
            description="Pulled live from my GitHub and LeetCode profiles and refreshed automatically."
            action={
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Open full dashboard <ArrowRight size={15} />
              </Link>
            }
          />
        </motion.div>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <motion.div {...fadeUp} className="lg:col-span-7 min-w-0">
            <GitHubCard data={github.data} loading={github.loading} refreshing={github.refreshing} onRefresh={github.refresh} />
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.08 }} className="lg:col-span-5 min-w-0">
            <LeetCodeCard data={leetcode.data} loading={leetcode.loading} />
          </motion.div>
        </div>
      </section>

      {/* ── Let's Work Together ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center sm:px-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: "var(--glow)" }}
          />
          <h2 className="relative text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Let&apos;s Work <span className="text-gradient">Together.</span>
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-muted-foreground">
            {siteConfig.availability}. If you&apos;re building something interesting, I&apos;d love to hear about it.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Contact Me <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={siteConfig.socials.email}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              <Mail size={16} /> {siteConfig.email}
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
