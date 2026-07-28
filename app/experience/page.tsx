"use client";

import { motion } from "framer-motion";
import { experiences, certifications } from "@/lib/data/experience";
import { educationList } from "@/lib/data/education";
import Timeline from "@/components/timeline";
import { Award, Briefcase, GraduationCap, ChevronRight } from "lucide-react";

export default function ExperiencePage() {
  const mappedExperiences = experiences.map((exp) => ({
    roleOrDegree: exp.role,
    organizationOrInstitution: exp.organization,
    period: exp.period,
    description: exp.description,
    details: exp.details,
    type: "experience" as const,
  }));

  const mappedEducation = educationList.map((edu) => ({
    roleOrDegree: `${edu.degree} in ${edu.fieldOfStudy}`,
    organizationOrInstitution: `${edu.institution}, ${edu.location}`,
    period: edu.period,
    description: edu.gpa,
    details: edu.details,
    type: "education" as const,
  }));

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
          Resume & Timeline
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          My leadership history, academic foundation, and certified credentials.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Experience Timeline Column */}
        <div className="lg:col-span-6 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Briefcase size={22} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Work & Leadership</h2>
          </div>
          <Timeline items={mappedExperiences} />
        </div>

        {/* Education & Certs Column */}
        <div className="lg:col-span-6 space-y-12">
          {/* Education Timeline */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <GraduationCap size={22} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Education</h2>
            </div>
            <Timeline items={mappedEducation} />
          </div>

          {/* Certifications Grid */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Award size={22} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Certifications</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300 group flex items-start gap-4"
                >
                  <div className="p-2.5 rounded-lg bg-secondary text-primary group-hover:scale-105 transition-transform">
                    <Award size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground leading-snug">
                      {cert.title}
                    </h4>
                    <span className="text-[11px] text-muted-foreground block font-medium">
                      {cert.issuer} • {cert.year}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-2 text-center sm:text-left">
              <a
                href="https://linkedin.com/in/arghaneel-das"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline group"
              >
                View All Certifications
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
