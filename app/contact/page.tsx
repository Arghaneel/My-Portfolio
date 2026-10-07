"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Download } from "lucide-react";
import { GitHubIcon, LinkedInIcon, LeetCodeIcon } from "@/components/social-icons";
import { siteConfig } from "@/lib/data/site-config";
import ContactForm from "@/components/forms/contact-form";

export default function Contact() {
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
          Contact Me
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          Internship opportunities, collaborations or questions – I&apos;d love to hear from you.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
        {/* Left Side: Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Let&apos;s Connect</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Whether you&apos;re a recruiter, a potential collaborator or a fellow student organising an event, my inbox is open. I usually reply within a day.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="p-3 rounded-lg bg-secondary text-primary">
                <Mail size={18} />
              </div>
              <div>
                <span className="block text-xs uppercase font-semibold text-muted-foreground">Send an Email</span>
                <a href={siteConfig.socials.email} className="font-bold text-foreground hover:text-primary transition-colors">
                  {siteConfig.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="p-3 rounded-lg bg-secondary text-primary">
                <MapPin size={18} />
              </div>
              <div>
                <span className="block text-xs uppercase font-semibold text-muted-foreground">Location</span>
                <span className="font-bold text-foreground">{siteConfig.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="p-3 rounded-lg bg-secondary text-primary">
                <Download size={18} />
              </div>
              <div>
                <span className="block text-xs uppercase font-semibold text-muted-foreground">Resume</span>
                <a
                  href={siteConfig.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-foreground hover:text-primary transition-colors"
                >
                  Download PDF
                </a>
              </div>
            </div>
          </div>

          {/* Social Row */}
          <div className="space-y-3 pt-4">
            <span className="text-xs uppercase font-semibold text-muted-foreground block">Find me online</span>
            <div className="flex gap-3">
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:scale-105 transition-all"
                aria-label="GitHub"
              >
                <GitHubIcon size={18} />
              </a>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:scale-105 transition-all"
                aria-label="LinkedIn"
              >
                <LinkedInIcon size={18} />
              </a>
              <a
                href={siteConfig.socials.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:scale-105 transition-all"
                aria-label="LeetCode"
              >
                <LeetCodeIcon size={18} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-card border border-border/80 shadow-sm"
        >
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
}
