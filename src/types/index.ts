export interface SocialLink {
  platform: string;
  url: string;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  introduction: string;
  biography: string[];
  focusAreas: string[];
  email: string;
  socials: SocialLink[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
  techStack?: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
  brandColor?: string;
  icon?: string;
  fallbackText?: string;
}
