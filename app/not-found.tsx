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
        <div className="inline-flex p-5 rounded-full bg-destructive/10 text-destructive mb-2 animate-bounce">
          <Ban size={48} />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          404 — Page Not Found
        </h1>

        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
          Sorry, the page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
          >
            <ArrowLeft size={16} />
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
