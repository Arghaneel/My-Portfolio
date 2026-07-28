"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Download, Terminal, Cpu, Database, Layout } from "lucide-react";
import { siteConfig } from "@/lib/data/site-config";
import { siteStats } from "@/lib/data/site-stats";

const floatingBadges = [
  { icon: <Terminal className="text-yellow-500" size={18} />, label: "Python", x: "-20%", y: "-10%" },
  { icon: <Layout className="text-sky-400" size={18} />, label: "React", x: "85%", y: "20%" },
  { icon: <Cpu className="text-emerald-500" size={18} />, label: "IoT", x: "-10%", y: "75%" },
  { icon: <Database className="text-purple-500" size={18} />, label: "SQL", x: "75%", y: "-15%" },
];

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl dark:bg-primary/5" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-100 h-100 bg-sky-500/10 rounded-full blur-3xl dark:bg-sky-500/5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              Available for Internships & Projects
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
            >
              Hi, I&apos;m{" "}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-blue-500 to-sky-400">
                {siteConfig.name}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl font-medium text-muted-foreground"
            >
              {siteConfig.role}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              {siteConfig.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:bg-primary/95 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-200"
              >
                View Projects
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border/80 hover:bg-secondary/80 font-semibold hover:-translate-y-0.5 transition-all duration-200"
              >
                Download Resume
                <Download size={18} />
              </a>
            </motion.div>

            {/* Social Links Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start gap-5 pt-4"
            >
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="fill-current" style={{ width: 24, height: 24 }} xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" className="fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }} xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a
                href={siteConfig.socials.email}
                className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
            </motion.div>
          </div>

          {/* Profile Photo & Floating Stack Column */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-64 h-64 sm:w-80 sm:h-80"
            >
              {/* Outer glowing border */}
              <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary to-sky-400 blur-md opacity-40 animate-pulse" />
              
              {/* Image Frame */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl z-10">
                <Image
                  src="/images/Profile.png"
                  alt={siteConfig.name}
                  fill
                  sizes="(max-width: 768px) 256px, 320px"
                  priority
                  className="object-cover"
                />
              </div>

              {/* Floating Badges */}
              {floatingBadges.map((badge, idx) => (
                <motion.div
                  key={idx}
                  style={{ top: badge.y, left: badge.x }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: idx * 0.7,
                    ease: "easeInOut",
                  }}
                  className="absolute z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/90 dark:bg-secondary/90 border border-border shadow-md backdrop-blur-sm pointer-events-none hover:scale-105 transition-transform"
                >
                  {badge.icon}
                  <span className="text-xs font-semibold text-foreground">{badge.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stat strip (4 stat cards) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 sm:mt-24"
        >
          {siteStats.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-primary mb-1 group-hover:scale-105 transition-transform origin-left">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground leading-normal">
                {stat.description}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
