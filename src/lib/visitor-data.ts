// src/lib/visitor-data.ts
import type { 
  Profile, 
  Experience, 
  ProjectSummary, 
  DataState 
} from '../data/types';
import mockDb from '../../database.json';

/**
 * Temporary mock data service layer for UI/UX development.
 * Bypasses Firebase completely and serves from database.json.
 */
export const VisitorDataService = {
  getProfile(onUpdate?: (data: Profile) => void): Promise<DataState<Profile>> {
    return Promise.resolve({ status: 'success', data: mockDb.profile as any });
  },
  
  getExperience(onUpdate?: (data: Experience[]) => void): Promise<DataState<Experience[]>> {
    const exp = Object.values(mockDb.experience).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    return Promise.resolve({ status: 'success', data: exp as any });
  },

  getProjects(onUpdate?: (data: ProjectSummary[]) => void): Promise<DataState<ProjectSummary[]>> {
    // Sort projects by order if available, or fallback
    const projects = Object.values(mockDb.projects.summary).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    return Promise.resolve({ status: 'success', data: projects as any });
  },

  getProjectDetail(slug: string, onUpdate?: (data: import('../data/types').ProjectDetail) => void): Promise<DataState<import('../data/types').ProjectDetail>> {
    const detail = mockDb.projects.details.find((p: any) => p.slug === slug);
    if (detail) {
      return Promise.resolve({ status: 'success', data: detail as any });
    }
    return Promise.resolve({ status: 'empty' });
  },

  getCapabilities(onUpdate?: (data: import('../data/types').Capability[]) => void): Promise<DataState<import('../data/types').Capability[]>> {
    const caps = Object.values(mockDb.capabilities).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    return Promise.resolve({ status: 'success', data: caps as any });
  },

  getContact(onUpdate?: (data: import('../data/types').Contact) => void): Promise<DataState<import('../data/types').Contact>> {
    return Promise.resolve({ status: 'success', data: mockDb.contact as any });
  },

  async resolveMediaUrl(path: string): Promise<string> {
    if (!path || !path.startsWith('/media/')) return path;
    const id = path.replace('/media/', '');
    
    // Look up the media record in database.json
    const mediaRecord = mockDb.media.find(m => m.id === id);
    if (mediaRecord && mediaRecord.url) {
      return mediaRecord.url;
    }
    return path; // Fallback to raw string if not found
  }
};
