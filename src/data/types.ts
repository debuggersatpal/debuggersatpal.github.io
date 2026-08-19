// src/data/types.ts

// Media reference (e.g., /media/avatar.png). 
// Note: This TypeScript type enforces the clean path structure in the codebase.
// It does NOT provide security or magically mask URLs. Actual URL masking 
// is provided exclusively by the edge-proxy architecture at runtime.
export type MediaReference = string;

export interface Profile {
  name: string;
  role: string;
  location: string;
  tagline?: string;
  bio: string;
  focusAreas: { title: string; description: string }[];
  avatarUrl: MediaReference;
  resumeUrl?: MediaReference;
  stats?: { projects: number; experience: number; techStack: number };
  socials?: { platform: string; url: string }[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  technologies?: string[];
  order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  order: number;
}

export interface ProjectSummary {
  slug: string;
  title: string;
  categories: string[];
  thumbnail: MediaReference;
  icon?: MediaReference; // For Home page cards
  description: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  order: number;
}

export interface ProjectDetail {
  slug: string;
  content: string; // rich text or markdown content
  techStack: string[];
  gallery: MediaReference[];
  demoUrl?: string;
  githubUrl?: string;
}

export interface Capability {
  id: string;
  category: string;
  skills: string[];
  order: number;
}

export interface Contact {
  email: string;
  socials: { platform: string; url: string; handle: string; description: string }[];
}

/**
 * The exact JSON contract of the Firebase Realtime Database `/published` node.
 */
export interface PublishedPortfolio {
  profile: Profile;
  experience: Record<string, Omit<Experience, 'id'>>;
  education: Record<string, Omit<Education, 'id'>>;
  projects: {
    summary: Record<string, Omit<ProjectSummary, 'slug'>>;
    details: Record<string, Omit<ProjectDetail, 'slug'>>;
  };
  capabilities: Record<string, Omit<Capability, 'id'>>;
  contact: Contact;
}

/**
 * Visitor-side fetching and rendering states
 */
export type DataState<T> = 
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; message: string };

/**
 * Stale-While-Revalidate caching interface
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface CacheStrategy {
  ttlMs: number;
  keyPrefix: string;
}
