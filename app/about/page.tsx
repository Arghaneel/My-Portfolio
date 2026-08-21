"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { User, MapPin, Mail, GraduationCap, Calendar, Award } from "lucide-react";
import { siteConfig } from "@/lib/data/site-config";

const infoCards = [
  { icon: <User className="text-primary" size={20} />, label: "Full Name", value: siteConfig.name },
  { icon: <MapPin className="text-primary" size={20} />, label: "Location", value: siteConfig.location },
  { icon: <Mail className="text-primary" size={20} />, label: "Email Address", value: siteConfig.email, href: siteConfig.socials.email },
  { icon: <GraduationCap className="text-primary" size={20} />, label: "Education", value: "B.E. Computer Science" },
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold sm:text-5xl"
        >
          About Me
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          Get to know the developer, leader, and student coordinator.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Profile Image Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border-2 border-border shadow-lg group">
            <Image
              src="/images/Profile.png"
              alt={siteConfig.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute bottom-6 left-6 z-10">
              <span className="px-3 py-1 rounded-full bg-primary/95 text-primary-foreground text-xs font-semibold shadow-sm">
                President, OSCode Atria
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bio Column */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-7 space-y-6"
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            My Journey & Aspirations
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              I am a dedicated Computer Science and Engineering student at Atria Institute of Technology, Bangalore. As a developer, I focus on the intersection of modern Web Applications, Artificial Intelligence, and IoT systems. I enjoy translating complex technical challenges into practical, user-focused digital solutions.
            </p>
            <p>
              Leadership and community are core parts of my student life. As the **President of OSCode Atria**, I guide a dynamic team of young developers to coordinate hackathons, technical meetups, and open-source contributions. I believe in peer-learning, mentorship, and building spaces that enable technical innovation.
            </p>
            <p>
              Furthermore, my role as the **Placement Coordinator** for the Computer Science department has honed my communication, logistics coordination, and database management capabilities. When I am not writing code or managing community events, I study cloud architectures, research IoT sensor nodes, and solve algorithm challenges.
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {infoCards.map((card, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/20 transition-all duration-200"
              >
                <div className="p-3 rounded-lg bg-secondary">
                  {card.icon}
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium uppercase tracking-wider">
                    {card.label}
                  </span>
                  {card.href ? (
                    <a
                      href={card.href}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {card.value}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-foreground">
                      {card.value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
