export type ProjectCategory = "IoT" | "Desktop App" | "AI / AgriTech" | "Mobile App";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  /** Short context line, e.g. "Hackathon project" or "Course project". */
  context?: string;
  techStack: string[];
  keyFeatures: string[];
  /** Real screenshots/photos only. Leave empty to show a generated cover. */
  images: string[];
  liveDemoUrl?: string;
  githubUrl?: string;
}

// Only real projects with claims that match the resume.
export const projects: Project[] = [
  {
    slug: "sixthsense",
    title: "SixthSense",
    tagline: "Wearable smart navigation device for real-time obstacle detection",
    description:
      "A wearable navigation aid that detects head-level obstacles in real time. Ultrasonic sensors feed an ESP32 microcontroller, which warns the wearer through LED and audio alerts as soon as something is in the way.",
    category: "IoT",
    techStack: ["ESP32", "C++", "Arduino", "Ultrasonic sensors"],
    keyFeatures: [
      "Real-time, head-level obstacle detection using ultrasonic sensors and an ESP32.",
      "LED and audio alert mechanisms that notify the user when an obstacle is detected.",
      "Wearable form factor designed for hands-free use.",
    ],
    images: [],
  },
  {
    slug: "electricity-bill-generator",
    title: "ElectriFlow – Electricity Bill Generator",
    tagline: "Desktop app that digitises electricity billing, from meter reading to invoice",
    description:
      "A Java Swing desktop application that digitises an electricity utility's workflow: customer registration, meter-reading entry, slab-based bill calculation, payment collection and invoice generation, with role-based access control. Data lives in MySQL via JDBC, organised with Object-Oriented models and DAOs.",
    category: "Desktop App",
    context: "Team project",
    techStack: ["Java 17", "Swing", "FlatLaf", "JDBC", "MySQL"],
    keyFeatures: [
      "Role-based logins: Admin, Employee and Viewer portals, plus a separate Customer portal.",
      "Slab-based billing engine with separate rules for Domestic and Commercial customers.",
      "Admin control room with KPI stats, configurable slab and tax rates, JSON backup/restore and CSV export.",
      "Usage analytics with custom line, bar and donut charts for bill trends and consumption.",
      "Invoice generation with print-to-PDF and HTML export.",
      "Demo mode that runs without MySQL using in-memory data.",
    ],
    images: [],
    githubUrl: "https://github.com/Arghaneel/ELECTRICITY_BILL_GENERATOR-1AT24CS025-1AT24CS029-",
  },
  {
    slug: "carbon-grove",
    title: "Carbon Grove",
    tagline: "Gamified mobile app — CODE RED ’25 hackathon finalist",
    description:
      "A gamified mobile application built during CODE RED ’25, a national-level 25-hour hackathon at BMSIT&M, where the team qualified for and competed in the final round.",
    category: "Mobile App",
    context: "Hackathon project · Finalist",
    techStack: ["Mobile app", "Gamification"],
    keyFeatures: [
      "Built within a 25-hour national-level hackathon.",
      "Qualified for the final round of CODE RED ’25 (BMSIT&M).",
    ],
    images: [],
  },
  {
    slug: "jeevandhara",
    title: "Jeevandhara",
    tagline: "Platform giving farmers real-time insights and market access",
    description:
      "A platform concept that gives farmers real-time insights and market access, with AI-based crop quality analysis. Pitched at the Eureka! pitching competition; the repository contains the project's data-scraping component.",
    category: "AI / AgriTech",
    context: "Pitched at Eureka!",
    techStack: ["Python", "Web scraping"],
    keyFeatures: [
      "Real-time insights for farmers.",
      "Market access for agricultural produce.",
      "AI-based crop quality analysis (proposed in the pitch).",
    ],
    images: [],
    githubUrl: "https://github.com/Arghaneel/jeevandhara",
  },
];
