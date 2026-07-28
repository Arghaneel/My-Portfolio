export interface Education {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location: string;
  period: string;
  gpa: string;
  details: string[];
}

export const educationList: Education[] = [
  {
    degree: "Bachelor of Engineering (B.E.)",
    fieldOfStudy: "Computer Science & Engineering",
    institution: "Atria Institute of Technology",
    location: "Bangalore, India",
    period: "2024 – 2026 (Expected)",
    gpa: "8.85 / 10.0 CGPA",
    details: [
      "Specialized in Software Engineering, Advanced Database Systems, and Intelligent Systems.",
      "Active member and lead in OSCode, the core developer community.",
      "Engaged in student-led IoT projects, AI research seminars, and community technical bootcamps.",
    ],
  },
];
