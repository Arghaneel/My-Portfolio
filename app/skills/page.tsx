"use client";

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { skillCategories } from "@/lib/data/skills";
import { Code, Layout, Server, Database, Settings } from "lucide-react";

// Inline brand SVGs for pixel-perfect icons
const brandIcons: Record<string, ReactElement> = {
  Python: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.25.18c.9 0 1.66.08 2.3.26a4.2 4.2 0 0 1 2.36 1.83c.46.74.7 1.63.7 2.68v2.02H16.5V6.03c0-.62-.12-1.07-.36-1.34s-.63-.4-1.18-.4h-3.41c-.55 0-.96.12-1.22.37s-.4.66-.4 1.2v2.16c0 .54.12.92.36 1.15.24.23.63.34 1.16.34h4.43c1.07 0 1.93.26 2.59.77.66.51.99 1.27.99 2.28v3.42c0 1-.33 1.76-.99 2.27-.66.51-1.52.77-2.59.77h-4.43c-1.07 0-1.92-.26-2.58-.77s-.98-1.27-.98-2.27v-2.02H7.5v.94c0 .62.12 1.07.36 1.34s.63.4 1.18.4h3.41c.55 0 .96-.12 1.22-.37.26-.25.4-.66.4-1.2v-2.16c0-.54-.12-.92-.36-1.15s-.63-.34-1.16-.34H8.12c-1.07 0-1.93-.26-2.59-.77-.66-.51-.99-1.27-.99-2.28V7.52c0-1 .33-1.76.99-2.27.66-.51 1.52-.77 2.59-.77h4.43v.01z" />
    </svg>
  ),
  React: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 10.63a2.6 2.6 0 0 0-1.24-1.94 17.5 17.5 0 0 0-4.13-1.71 18.25 18.25 0 0 0-2.4-5.32A2.6 2.6 0 0 0 14.36.5a2.53 2.53 0 0 0-2 .88 17.65 17.65 0 0 0-2.53 3.73A17.65 17.65 0 0 0 7.3 1.38 2.53 2.53 0 0 0 5.27.5 2.6 2.6 0 0 0 3.4 1.66a18.25 18.25 0 0 0-2.4 5.32 17.5 17.5 0 0 0-4.13 1.71 2.6 2.6 0 0 0 0 3.88 17.5 17.5 0 0 0 4.13 1.71 18.25 18.25 0 0 0 2.4 5.32 2.6 2.6 0 0 0 1.87 1.16 2.53 2.53 0 0 0 2-.88 17.65 17.65 0 0 0 2.53-3.73A17.65 17.65 0 0 0 16.7 22.62a2.53 2.53 0 0 0 2 .88 2.6 2.6 0 0 0 1.87-1.16 18.25 18.25 0 0 0 2.4-5.32 17.5 17.5 0 0 0 4.13-1.71A2.6 2.6 0 0 0 24 10.63zm-12 4a2.65 2.65 0 1 1 2.65-2.63A2.64 2.64 0 0 1 12 14.63z" />
    </svg>
  ),
  MongoDB: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.043 23.957a.384.384 0 0 1-.362-.352c-.08-.857-.34-2.884-.34-4.22a9.387 9.387 0 0 1 2.378-6.19 12.095 12.095 0 0 0 2.825-7.514 1.144 1.144 0 0 0-.256-.838 1.173 1.173 0 0 0-.825-.386 9.4 9.4 0 0 1-3.218.895A9.43 9.43 0 0 1 9.028 4.45a1.173 1.173 0 0 0-.825.386 1.144 1.144 0 0 0-.256.838 12.095 12.095 0 0 0 2.825 7.514 9.387 9.387 0 0 1 2.378 6.19c0 1.336-.26 3.363-.34 4.22a.384.384 0 0 1-.362.352c-.102 0-.215-.052-.278-.15A17.9 17.9 0 0 1 9.946 16.7a10.978 10.978 0 0 1-1.393-5.26 13.9 13.9 0 0 1 1.776-6.758c.245-.44.757-.7 1.258-.69h.825c.502-.01 1.013.25 1.258.69A13.9 13.9 0 0 1 15.447 11.44a10.978 10.978 0 0 1-1.393 5.26 17.9 17.9 0 0 1-2.226 7.106c-.063.098-.176.15-.278.151z" />
    </svg>
  ),
};

const categoryIcons: Record<string, ReactElement> = {
  Languages: <Code className="text-primary" size={22} />,
  Frontend: <Layout className="text-sky-500" size={22} />,
  Backend: <Server className="text-emerald-500" size={22} />,
  Databases: <Database className="text-purple-500" size={22} />,
  "Tools & Others": <Settings className="text-amber-500" size={22} />,
};

export default function Skills() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold sm:text-5xl"
        >
          My Skills
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          A comprehensive view of my technical abilities and developer toolkit.
        </motion.p>
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillCategories.map((category, catIdx) => (
          <motion.div
            key={catIdx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-secondary">
                  {categoryIcons[category.title] || <Code size={22} />}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {category.title}
                </h3>
              </div>

              {/* Skills list */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIdx) => (
                  <div key={skillIdx} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                        {brandIcons[skill.name] && (
                          <span className="text-muted-foreground">{brandIcons[skill.name]}</span>
                        )}
                        {skill.name}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
