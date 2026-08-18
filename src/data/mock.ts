// src/data/mock.ts
import type { Profile, Experience, ProjectSummary } from './types';

export const mockProfile: Profile = {
  bio: 'A passionate software engineer building robust applications.',
  focusAreas: ['Frontend Architecture', 'Cloud Infrastructure'],
  avatarUrl: '/media/avatar.png'
};

export const mockExperience: Experience[] = [
  {
    id: 'job1',
    role: 'Senior Engineer',
    company: 'Tech Corp',
    period: '2020 — Present',
    description: 'Led development of modern web applications using Astro and Firebase.',
    order: 1
  }
];

export const mockProjects: ProjectSummary[] = [
  {
    slug: 'project-1',
    title: 'Sample Project',
    category: 'Web Development',
    thumbnail: '/media/placeholder.jpg',
    order: 1
  }
];
