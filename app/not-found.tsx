"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Ban } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 max-w-md"
      >
        {/* Visual Badge Icon */}
        <div className="inline-flex p-5 rounded-full border border-border bg-card text-primary mb-2">
          <Ban size={48} />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          404 — Page <span className="text-gradient">Not Found.</span>
        </h1>

        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
          Sorry, the page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={16} />
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
