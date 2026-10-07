/**
 * `icon` is a skillicons.dev id (https://github.com/tandpfun/skill-icons).
 * Skills without one get a matching line icon on the Skills page.
 */
export interface Skill {
  name: string;
  icon?: string;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: Skill[];
}

/** Shown large at the top of the Skills page. */
export const coreStack: Skill[] = [
  { name: "Python", icon: "py" },
  { name: "Java", icon: "java" },
  { name: "C++", icon: "cpp" },
  { name: "MySQL", icon: "mysql" },
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextjs" },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    description: "What I write code in day to day.",
    skills: [
      { name: "Python", icon: "py" },
      { name: "Java", icon: "java" },
      { name: "C", icon: "c" },
      { name: "C++", icon: "cpp" },
      { name: "JavaScript", icon: "js" },
      { name: "TypeScript", icon: "ts" },
      { name: "SQL" },
    ],
  },
  {
    title: "Web",
    description: "Building interfaces and full-stack apps.",
    skills: [
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Tailwind CSS", icon: "tailwind" },
    ],
  },
  {
    title: "Data",
    description: "Storing and querying data reliably.",
    skills: [
      { name: "MySQL", icon: "mysql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "JDBC" },
    ],
  },
  {
    title: "AI & IoT",
    description: "Where software meets models and hardware.",
    skills: [
      { name: "Applied AI" },
      { name: "Agentic Systems" },
      { name: "ESP32" },
      { name: "Arduino", icon: "arduino" },
    ],
  },
  {
    title: "Tools",
    description: "My everyday workflow.",
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "VS Code", icon: "vscode" },
      { name: "PyCharm", icon: "pycharm" },
      { name: "Jupyter" },
      { name: "Excel" },
      { name: "Canva" },
    ],
  },
];

export const concepts = ["Object-Oriented Programming", "Database Management", "Data Structures", "Problem Solving"];

export const softSkills = [
  "Leadership",
  "Event Management",
  "Public Speaking",
  "Teamwork",
  "Communication",
  "Networking",
  "Time Management",
];
