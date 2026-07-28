"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, GraduationCap } from "lucide-react";

interface TimelineItem {
  roleOrDegree: string;
  organizationOrInstitution: string;
  period: string;
  description: string;
  details?: string[];
  type: "experience" | "education";
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative border-l-2 border-border/80 ml-4 md:ml-6 pl-6 md:pl-8 space-y-12">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className="relative group"
        >
          {/* Node Icon */}
          <div className="absolute -left-[45px] md:-left-[53px] top-1.5 p-2 rounded-full border-2 border-background bg-card text-primary group-hover:bg-primary group-hover:text-primary-foreground shadow-sm transition-all duration-300">
            {item.type === "experience" ? <Briefcase size={16} /> : <GraduationCap size={16} />}
          </div>

          {/* Details Card */}
          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/20 shadow-sm transition-all duration-300">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg mb-3">
              <Calendar size={12} />
              {item.period}
            </span>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {item.roleOrDegree}
            </h3>
            <h4 className="text-sm font-semibold text-muted-foreground mt-1">
              {item.organizationOrInstitution}
            </h4>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              {item.description}
            </p>

            {item.details && item.details.length > 0 && (
              <ul className="mt-4 space-y-2 list-disc pl-5 text-xs sm:text-sm text-muted-foreground/90">
                {item.details.map((detail, dIdx) => (
                  <li key={dIdx} className="leading-relaxed">
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
