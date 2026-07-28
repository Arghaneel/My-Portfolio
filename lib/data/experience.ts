export interface Experience {
  role: string;
  organization: string;
  period: string;
  description: string;
  details: string[];
}

export const experiences: Experience[] = [
  {
    role: "President",
    organization: "OSCode Atria",
    period: "2026 – Present",
    description: "Leading the premier student developer community of Atria Institute of Technology.",
    details: [
      "Mentored a team of 20+ core committee members in organizing tech hackathons, workshops, and bootcamps.",
      "Grew the developer community to 500+ active student members across various engineering branches.",
      "Initiated collaborative open-source projects, training students in Git, GitHub, and professional coding practices.",
      "Facilitated industry-academic partnerships for tech talks, panels, and networking opportunities.",
    ],
  },
  {
    role: "Event Management Lead",
    organization: "OSCode Atria",
    period: "2025 – 2026",
    description: "Coordinating technical meetups, hands-on workshops, and developer bootcamps.",
    details: [
      "Managed logistics, scheduling, and promotions for over 10+ major coding events, attracting 200+ students per event.",
      "Hosted hands-on workshops on Web Development, IoT integration, and Artificial Intelligence basics.",
      "Collaborated with cross-functional student bodies to drive inter-college hackathon engagement.",
      "Handled event budgeting and resource allocation efficiently.",
    ],
  },
  {
    role: "Placement Coordinator",
    organization: "Computer Science Department, Atria Institute of Technology",
    period: "2024 – Present",
    description: "Liaison between the college placement cell, recruiting companies, and students.",
    details: [
      "Streamlined candidate databases and automated resume submission processing for 120+ computer science graduates.",
      "Organized mock interviews, coding tests, and technical review sessions to enhance student placement readiness.",
      "Coordinated campus recruitment drives with corporate recruiters, ensuring seamless communication and logistics.",
      "Analyzed placement performance metrics and reported insights to department heads.",
    ],
  },
];

export interface Certification {
  title: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
}

export const certifications: Certification[] = [
  {
    title: "Google IT Automation with Python",
    issuer: "Google",
    year: "2025",
  },
  {
    title: "Cisco Networking Essentials",
    issuer: "Cisco",
    year: "2025",
  },
  {
    title: "NPTEL Data Structures and Algorithms in Java",
    issuer: "NPTEL / IIT Madras",
    year: "2024",
  },
  {
    title: "IBM Python for Data Science",
    issuer: "IBM",
    year: "2024",
  },
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    year: "2026",
  },
];
