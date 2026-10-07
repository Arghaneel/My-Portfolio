"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Mail, ArrowRight, BrainCircuit, Cpu, Database, Target, Rocket, FileText, Users } from "lucide-react";
import { siteConfig } from "@/lib/data/site-config";

const focusAreas = [
  {
    icon: <BrainCircuit size={22} />,
    title: "Applied AI",
    text: "Turning models into tools people actually use, with a growing focus on agentic systems and how to evaluate them honestly.",
  },
  {
    icon: <Cpu size={22} />,
    title: "IoT & Embedded",
    text: "Sensors and microcontrollers that react to the physical world, where software has to be reliable because someone depends on it.",
  },
  {
    icon: <Database size={22} />,
    title: "Software & Data",
    text: "Well-structured applications on top of well-designed databases, with data that helps someone make a better decision.",
  },
];

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
  viewport: { once: true },
};

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-24">
      {/* Intro */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex justify-center"
        >
          <figure className="relative w-full max-w-sm">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/25 via-transparent to-sky-400/20 blur-2xl" />
            <div className="relative aspect-[4/5] rounded-[1.75rem] overflow-hidden border border-border shadow-xl">
              <Image
                src="/images/Profile.png"
                alt={`Portrait of ${siteConfig.name}`}
                fill
                sizes="(max-width: 1024px) 384px, 40vw"
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="relative mt-4 flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">{siteConfig.name}</span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <MapPin size={14} /> {siteConfig.location}
              </span>
            </figcaption>
          </figure>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7 space-y-6"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">About me</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            I build practical software that solves real problems.
          </h1>
          <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            <p>
              I&apos;m Arghaneel, a computer science student in Bangalore. I&apos;m most interested in where software meets
              the real world: AI that people can actually use, devices that respond to their surroundings, and systems
              that quietly make someone&apos;s day easier.
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

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/10 hover:bg-primary/95 transition-colors"
            >
              See my work <ArrowRight size={16} />
            </Link>
            <a
              href={siteConfig.socials.email}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-secondary transition-colors"
            >
              <Mail size={16} /> {siteConfig.email}
            </a>
          </div>
        </motion.div>
      </section>

      {/* Focus areas */}
      <section className="space-y-8">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Focus</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">What I work on</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {focusAreas.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group p-6 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {f.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="lg:col-span-4">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Approach</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">How I work</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            A few habits I bring to every project, whether it&apos;s solo, in a team or against a hackathon clock.
          </p>
        </motion.div>
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
          {principles.map((p, i) => (
            <motion.div key={p.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.06 }} className="flex gap-4">
              <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg bg-secondary text-primary flex items-center justify-center">
                {p.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Currently exploring + CTA */}
      <motion.section
        {...fadeUp}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-10"
      >
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Right now</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Currently exploring</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {exploring.map((e) => (
                <span key={e} className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                  {e}
                </span>
              ))}
            </div>
          </div>
          <div className="md:text-right space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {siteConfig.availability}. If you&apos;re building something interesting, I&apos;d love to hear about it.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get in touch <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
