export interface Experience {
  role: string;
  organization: string;
  period: string;
  kind: "Internship" | "Leadership" | "Club";
  location?: string;
  description: string;
  details: string[];
}

export const experiences: Experience[] = [
  {
    role: "Applied AI Intern",
    organization: "DeepAgentLabs – Cloud Daemon LLC",
    period: "Sep 2026 – Present",
    kind: "Internship",
    location: "Remote",
    description: "Working on applied AI projects involving agentic systems.",
    details: [
      "Contribute to applied AI projects spanning research, prototyping, evaluation, documentation and responsible engineering practices.",
      "Complete assigned research, engineering, evaluation, documentation and product tasks while communicating progress clearly.",
      "Collaborate with a distributed team on applied AI initiatives, following approved repositories, data, accounts and AI tools.",
    ],
  },
  {
    role: "Vice-President",
    organization: "OSCode Club, Atria Institute of Technology",
    period: "2026 – Present",
    kind: "Leadership",
    description: "Leading the college's student developer club.",
    details: [
      "Lead and coordinate club initiatives, technical activities and student-focused programs.",
      "Collaborate with student teams, faculty coordinators and club members to plan and run technical events and community activities.",
    ],
  },
  {
    role: "Event Coordinator",
    organization: "OSCode Club, Atria Institute of Technology",
    period: "2025 – Jul 2026",
    kind: "Leadership",
    description: "Planned and ran the club's technical events.",
    details: [
      "Led a team of 10 members in planning and executing club events, from ideation through post-event feedback.",
      "Organised Tech Talks and Seminars that attracted 60+ participants and supported technical learning in the student community.",
      "Coordinated with faculty, student volunteers and external industry speakers to keep event logistics running smoothly.",
    ],
  },
  {
    role: "Student Coordinator",
    organization: "Atria Career Development Centre (CDC)",
    period: "2025 – Present",
    kind: "Leadership",
    description: "Link between students and the placement department.",
    details: [
      "Coordinate placement-related activities including Group Discussions, placement seminars and aptitude tests.",
      "Serve as a communication link between students and the placement department.",
    ],
  },
  {
    role: "Technical Team Member",
    organization: "Atria Code Club",
    period: "2026 – Present",
    kind: "Club",
    description: "Member of the coding club's technical team.",
    details: [],
  },
];

export interface Achievement {
  title: string;
  result?: string;
  organizer?: string;
  project: string;
  details: string[];
}

export const achievements: Achievement[] = [
  {
    title: "CODE RED ’25 Hackathon",
    result: "Finalist",
    organizer: "BMSIT&M",
    project: "Carbon Grove",
    details: [
      "Qualified for and competed in the final round of a national-level 25-hour hackathon.",
      "Developed “Carbon Grove”, a gamified mobile application, as the hackathon project.",
    ],
  },
  {
    title: "GDG on Campus Solution Challenge",
    project: "Amrita Krishi",
    details: [
      "Contributed to “Amrita Krishi”, an AI-powered mobile app with computer vision for crop grading and a “Doctor AI” module.",
    ],
  },
  {
    title: "IIC Ideathon – Business Plan Competition",
    project: "SmartAgriChain",
    details: [
      "Contributed to the “SmartAgriChain” business plan, proposing a unified platform to support agricultural activities.",
    ],
  },
  {
    title: "Eureka! Pitching Competition",
    project: "Jeevandhara",
    details: [
      "Pitched “Jeevandhara”, a platform giving farmers real-time insights and market access, with AI-based crop quality analysis.",
    ],
  },
];

export interface Certification {
  title: string;
  issuer: string;
  year: string;
  description?: string;
  credentialUrl?: string;
}

export const certifications: Certification[] = [
  {
    title: "Python Foundation Certification",
    issuer: "Infosys Springboard",
    year: "June 2025",
    description: "Data structures, control flow and Object-Oriented Programming in Python.",
  },
];

export const seminars = [
  {
    title: "Seminar on Space Science and Exploration",
    organizer: "ISRO, with Soundarya Institute of Management and Science",
    description: "One-day seminar organised in association with the Indian Space Research Organisation.",
  },
];
