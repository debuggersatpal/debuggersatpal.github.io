import type { Experience } from '../types';

export const experience: Experience[] = [
  {
    id: "exp-1",
    role: "Senior Software Engineer",
    company: "Tech Solutions Inc.",
    location: "Remote",
    startDate: "2023",
    highlights: [
      "Architected and implemented a modern scalable frontend infrastructure.",
      "Mentored junior developers and improved code quality through reviews."
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind"]
  },
  {
    id: "exp-2",
    role: "Mobile Developer",
    company: "Creative App Studio",
    location: "India",
    startDate: "2021",
    endDate: "2023",
    highlights: [
      "Developed high-performance cross-platform mobile applications.",
      "Integrated complex Firebase backend systems and analytics."
    ],
    techStack: ["Flutter", "Firebase", "Android"]
  }
];
