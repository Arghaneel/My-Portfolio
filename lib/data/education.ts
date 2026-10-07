export interface Education {
  degree: string;
  fieldOfStudy?: string;
  institution: string;
  location?: string;
  period: string;
  grade: string;
  details: string[];
}

export const educationList: Education[] = [
  {
    degree: "Bachelor of Engineering (B.E.)",
    fieldOfStudy: "Computer Science & Engineering",
    institution: "Atria Institute of Technology",
    location: "Bangalore, India",
    period: "2024 – Present",
    grade: "CGPA: 9.28 / 10",
    details: [
      "Vice-President of OSCode, the college's developer club, and Technical Team Member of Atria Code Club.",
      "Student Coordinator at the Atria Career Development Centre (CDC).",
    ],
  },
  {
    degree: "Senior Secondary Examination (Class XII) – PCMC",
    institution: "Kendriya Vidyalaya No. 1",
    period: "2023 – 2024",
    grade: "Grade: 90.6%",
    details: [],
  },
  {
    degree: "Secondary Examination (Class X)",
    institution: "Kendriya Vidyalaya No. 1",
    period: "2021 – 2022",
    grade: "Grade: 89%",
    details: [],
  },
];
