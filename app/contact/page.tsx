"use client";

import { motion } from "framer-motion";
import { Mail, Globe, MapPin } from "lucide-react";
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
          Have a question, feedback, or a project in mind? Reach out!
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
            <h2 className="text-2xl font-bold text-foreground">Let's Connect</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              If you are interested in collaborating on web applications, or community developer workshops, my inbox is always open. I will do my best to respond within 24 hours.
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
                <span className="block text-xs uppercase font-semibold text-muted-foreground">Current Residence</span>
                <span className="font-bold text-foreground">{siteConfig.location}</span>
              </div>
            </div>
          </div>

          {/* Social Row */}
          <div className="space-y-3 pt-4">
            <span className="text-xs uppercase font-semibold text-muted-foreground block">Follow my updates</span>
            <div className="flex gap-3">
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:scale-105 transition-all"
                aria-label="GitHub"
              >
                <Globe size={18} />
              </a>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:scale-105 transition-all"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="fill-current" style={{ width: 18, height: 18 }} xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:scale-105 transition-all"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" className="fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }} xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
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
