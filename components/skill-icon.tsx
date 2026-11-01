"use client";

import { useState, type ReactElement } from "react";
import { BrainCircuit, Bot, Cpu, Database, NotebookPen, Sheet, Palette, Code } from "lucide-react";
import type { Skill } from "@/lib/data/skills";

// Line icons for skills that don't have a brand logo.
const fallbackIcons: Record<string, ReactElement> = {
  SQL: <Database size={16} />,
  JDBC: <Database size={16} />,
  "Applied AI": <BrainCircuit size={16} />,
  "Agentic Systems": <Bot size={16} />,
  ESP32: <Cpu size={16} />,
  Jupyter: <NotebookPen size={16} />,
  Excel: <Sheet size={16} />,
  Canva: <Palette size={16} />,
};

/** Brand logo from skillicons.dev, or a matching line icon if there isn't one (or it fails to load). */
export default function SkillIcon({ skill, size = 20, className = "" }: { skill: Skill; size?: number; className?: string }) {
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
        className={`rounded-[22%] ${className}`}
      />
    );
  }
  return (
    <span
      className={`flex items-center justify-center rounded-[22%] bg-primary/10 text-primary ${className}`}
      style={{ width: size, height: size }}
    >
      {fallbackIcons[skill.name] ?? <Code size={14} />}
    </span>
  );
}
