"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import type { Experience } from "@/lib/data/experience";

const kindTone: Record<Experience["kind"], string> = {
  Internship: "border-primary/30 bg-primary/10 text-primary",
  Leadership: "border-border bg-secondary text-muted-foreground",
  Club: "border-border bg-secondary text-muted-foreground",
};

function Meta({ item }: { item: Experience }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">
        <Calendar size={12} className="text-primary" />
        {item.period}
      </span>
      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${kindTone[item.kind]}`}>{item.kind}</span>
    </div>
  );
}

/**
 * Vertical timeline with the line down the middle on large screens: cards
 * alternate left/right in a zigzag. On small screens the line moves to the
 * left and the cards stack.
 */
export default function CenterTimeline({ items }: { items: Experience[] }) {
  return (
    <ol className="relative">
      <span aria-hidden="true" className="absolute left-[7px] top-2 bottom-2 w-px bg-border lg:left-1/2 lg:-translate-x-1/2" />
      {items.map((item, i) => {
        const cardLeft = i % 2 === 0;
        return (
          <motion.li
            key={`${item.role}-${item.organization}`}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
            className={`relative grid grid-cols-1 pb-8 pl-9 last:pb-0 lg:grid-cols-2 lg:gap-x-16 lg:pl-0 ${i > 0 ? "lg:-mt-20" : ""}`}
          >
            {/* node */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-6 h-[15px] w-[15px] rounded-full border-4 border-background bg-primary shadow-[0_0_0_1px_var(--border)] lg:left-1/2 lg:-translate-x-1/2"
            />

            <article
              className={`rounded-2xl border border-border bg-card p-5 sm:p-6 transition-colors hover:border-primary/35 lg:row-start-1 ${
                cardLeft ? "lg:col-start-1" : "lg:col-start-2"
              }`}
            >
              <div className="mb-3">
                <Meta item={item} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{item.role}</h3>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm font-medium text-primary">
                {item.organization}
                {item.location && (
                  <span className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
                    <MapPin size={11} /> {item.location}
                  </span>
                )}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              {item.details.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {item.details.map((d) => (
                    <li key={d} className="flex gap-2.5 leading-relaxed">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-primary/70" />
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </motion.li>
        );
      })}
    </ol>
  );
}
