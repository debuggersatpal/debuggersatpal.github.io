import type { Profile, SkillCategory } from '../types';

export const profile: Profile = {
  name: "SATPAL",
  role: "Developer",
  location: "India",
  email: "hellow.satpal@gmail.com",
  introduction: "I build clean, efficient and impactful digital products that solve real-world problems.",
  biography: [
    "Passionate about Web, Mobile, AI and Systems. Love turning ideas into products.",
    "I focus on creating high-quality, performant, and accessible applications with a strong emphasis on clean architecture and minimal design."
  ],
  focusAreas: [
    "Frontend Architecture & Performance",
    "Mobile App Development",
    "System Design & Cloud Integrations"
  ],
  socials: [
    {
      platform: "GitHub",
      url: "https://github.com/satpalkumarofficial",
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/debuggersatpal",
    },
  ]
};

export const skills: SkillCategory[] = [
  {
    category: "Frontend",
    skills: ["TypeScript", "React", "Next.js", "Astro", "Tailwind CSS"]
  },
  {
    category: "Mobile & Backend",
    skills: ["Flutter", "Kotlin", "Android", "Firebase", "Node.js"]
  },
  {
    category: "Tools & Systems",
    skills: ["Git", "Figma", "REST APIs", "Cloud Architecture"]
  }
];