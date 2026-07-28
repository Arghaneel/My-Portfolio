export interface Skill {
  name: string;
  level: number; // percentage (optional visual aid)
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    skills: [
      { name: "Python", level: 90 },
      { name: "C", level: 80 },
      { name: "C++", level: 85 },
      { name: "JavaScript", level: 88 },
      { name: "SQL", level: 82 },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "HTML", level: 95 },
      { name: "CSS", level: 90 },
      { name: "React", level: 88 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Bootstrap", level: 85 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Express.js", level: 83 },
      { name: "Flask", level: 80 },
      { name: "REST API", level: 90 },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "MongoDB", level: 85 },
      { name: "Firebase", level: 80 },
      { name: "MySQL", level: 82 },
    ],
  },
  {
    title: "Tools & Others",
    skills: [
      { name: "Git", level: 90 },
      { name: "GitHub", level: 92 },
      { name: "VS Code", level: 95 },
      { name: "Postman", level: 88 },
      { name: "Figma", level: 75 },
      { name: "Arduino IDE", level: 85 },
      { name: "Linux", level: 80 },
    ],
  },
];
