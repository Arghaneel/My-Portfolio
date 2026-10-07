// Every number here should be something you can back up in an interview.
export const siteStats = [
  {
    label: "CGPA",
    value: "9.28",
    description: "B.E. Computer Science, Atria Institute of Technology",
  },
  {
    label: "Competitions",
    value: "4",
    description: "Including CODE RED ’25 national hackathon finalist",
  },
  {
    label: "Leadership Roles",
    value: "3",
    description: "OSCode Vice-President, Event Coordinator & CDC Student Coordinator",
  },
  {
    label: "Event Participants",
    value: "60+",
    description: "At tech talks & seminars I organised for OSCode",
  },
];

export type SiteStat = (typeof siteStats)[number];
