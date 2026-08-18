// src/data/types.ts

// Media reference (e.g., /media/avatar.png). 
// Note: This TypeScript type enforces the clean path structure in the codebase.
// It does NOT provide security or magically mask URLs. Actual URL masking 
// is provided exclusively by the edge-proxy architecture at runtime.
export type MediaReference = string;

export interface Profile {
  bio: string;
  focusAreas: string[];
  avatarUrl: MediaReference;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
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
  category: string;
  thumbnail: MediaReference;
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
  socials: { platform: string; url: string }[];
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
