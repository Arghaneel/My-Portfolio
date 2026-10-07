"use client";

import { useState, type ReactElement } from "react";
import { motion } from "framer-motion";
import { coreStack, skillCategories, concepts, softSkills, type Skill } from "@/lib/data/skills";
import { BrainCircuit, Bot, Cpu, Database, NotebookPen, Sheet, Palette, Check, Code } from "lucide-react";

// Line icons for skills that don't have a brand logo.
const fallbackIcons: Record<string, ReactElement> = {
  SQL: <Database size={20} />,
  JDBC: <Database size={20} />,
  "Applied AI": <BrainCircuit size={20} />,
  "Agentic Systems": <Bot size={20} />,
  ESP32: <Cpu size={20} />,
  Jupyter: <NotebookPen size={20} />,
  Excel: <Sheet size={20} />,
  Canva: <Palette size={20} />,
};

function SkillIcon({ skill, size = 28 }: { skill: Skill; size?: number }) {
  // If the logo service can't be reached, fall back to a line icon instead of a broken image.
  const [failed, setFailed] = useState(false);
  if (skill.icon && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://skillicons.dev/icons?i=${skill.icon}`}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        className="rounded-[22%]"
      />
    );
  }
  return (
    <span
      className="flex items-center justify-center rounded-[22%] bg-primary/10 text-primary"
      style={{ width: size, height: size }}
    >
      {fallbackIcons[skill.name] ?? <Code size={18} />}
    </span>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Skills() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-2xl mb-12">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-bold uppercase tracking-[0.25em] text-primary"
        >
          Skills
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground"
        >
          My toolkit
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          The languages, frameworks and tools I use to take ideas from a sketch to something that works.
        </motion.p>
      </div>

      {/* Core stack */}
      <motion.section {...fadeUp} transition={{ duration: 0.5 }} className="mb-14">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Core stack</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {coreStack.map((s, i) => (
            <motion.div
              key={s.name}
              {...fadeUp}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group flex flex-col items-center gap-3 py-5 rounded-2xl bg-card border border-border shadow-sm hover:-translate-y-1 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <span className="group-hover:scale-110 transition-transform">
                <SkillIcon skill={s} size={48} />
              </span>
              <span className="text-sm font-semibold text-foreground">{s.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Categories */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {skillCategories.map((cat, i) => (
          <motion.div
            key={cat.title}
            {...fadeUp}
            transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
            className={`p-6 rounded-2xl bg-card border border-border shadow-sm ${
              i === skillCategories.length - 1 && skillCategories.length % 2 === 1 ? "md:col-span-2" : ""
            }`}
          >
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h3 className="text-lg font-bold text-foreground">{cat.title}</h3>
              <p className="text-xs text-muted-foreground text-right">{cat.description}</p>
            </div>
            <ul
              className={`grid gap-2 ${
                i === skillCategories.length - 1 && skillCategories.length % 2 === 1
                  ? "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"
                  : "grid-cols-2 sm:grid-cols-3"
              }`}
            >
              {cat.skills.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <SkillIcon skill={s} size={24} />
                  <span className="text-sm font-medium text-foreground leading-tight">{s.name}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </section>

      {/* Concepts & soft skills */}
      <section className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { title: "Concepts", items: concepts },
          { title: "Soft skills", items: softSkills },
        ].map((block, i) => (
          <motion.div
            key={block.title}
            {...fadeUp}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="p-6 rounded-2xl bg-card border border-border shadow-sm"
          >
            <h3 className="text-lg font-bold text-foreground mb-4">{block.title}</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {block.items.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Check size={16} className="text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
