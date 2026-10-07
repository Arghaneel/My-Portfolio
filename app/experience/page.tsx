"use client";

import { motion } from "framer-motion";
import { experiences, certifications, achievements, seminars } from "@/lib/data/experience";
import { educationList } from "@/lib/data/education";
import { siteConfig } from "@/lib/data/site-config";
import Timeline from "@/components/timeline";
import { Award, Briefcase, GraduationCap, Trophy, Download, ExternalLink, Mic } from "lucide-react";

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-xl bg-primary/10 text-primary">{icon}</div>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    </div>
  );
}

export default function ExperiencePage() {
  const mappedExperiences = experiences.map((exp) => ({
    roleOrDegree: exp.role,
    organizationOrInstitution: exp.location ? `${exp.organization} · ${exp.location}` : exp.organization,
    period: exp.period,
    description: exp.description,
    details: exp.details,
    tag: exp.kind,
    type: "experience" as const,
  }));

  const mappedEducation = educationList.map((edu) => ({
    roleOrDegree: edu.fieldOfStudy ? `${edu.degree} in ${edu.fieldOfStudy}` : edu.degree,
    organizationOrInstitution: edu.location ? `${edu.institution}, ${edu.location}` : edu.institution,
    period: edu.period,
    description: edu.grade,
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
          Experience & Achievements
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          Internship, leadership roles, competitions and education.
        </motion.p>
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          href={siteConfig.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/10 hover:bg-primary/95 transition-all"
        >
          Download Resume (PDF)
          <Download size={16} />
        </motion.a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Experience Timeline Column */}
        <div className="lg:col-span-6 space-y-8">
          <SectionHeading icon={<Briefcase size={22} />} title="Experience & Leadership" />
          <Timeline items={mappedExperiences} />
        </div>

        {/* Right column */}
        <div className="lg:col-span-6 space-y-14">
          {/* Achievements */}
          <div className="space-y-6">
            <SectionHeading icon={<Trophy size={22} />} title="Achievements & Competitions" />
            <div className="space-y-4">
              {achievements.map((a, idx) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className="p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/20 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">{a.title}</h3>
                    {a.result && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        {a.result}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground mt-1">
                    Project: {a.project}
                    {a.organizer ? ` · ${a.organizer}` : ""}
                  </p>
                  <ul className="mt-3 space-y-1.5 list-disc pl-5 text-sm text-muted-foreground">
                    {a.details.map((d) => (
                      <li key={d} className="leading-relaxed">
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education Timeline */}
          <div className="space-y-8">
            <SectionHeading icon={<GraduationCap size={22} />} title="Education" />
            <Timeline items={mappedEducation} />
          </div>

          {/* Certifications */}
          <div className="space-y-6">
            <SectionHeading icon={<Award size={22} />} title="Certifications" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.title}
                  className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm flex items-start gap-4"
                >
                  <div className="p-2.5 rounded-lg bg-secondary text-primary">
                    <Award size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground leading-snug">{cert.title}</h4>
                    <span className="text-[11px] text-muted-foreground block font-medium">
                      {cert.issuer} • {cert.year}
                    </span>
                    {cert.description && <p className="text-xs text-muted-foreground">{cert.description}</p>}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        View credential <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seminars */}
          <div className="space-y-6">
            <SectionHeading icon={<Mic size={22} />} title="Seminars & Workshops" />
            {seminars.map((s) => (
              <div key={s.title} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm">
                <h4 className="text-sm font-bold text-foreground">{s.title}</h4>
                <span className="text-[11px] text-muted-foreground block font-medium mt-1">{s.organizer}</span>
                <p className="text-xs text-muted-foreground mt-2">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
