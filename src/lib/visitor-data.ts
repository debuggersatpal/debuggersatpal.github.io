// src/lib/visitor-data.ts
import { publicClient } from './public-fetch';
import { mapDictionaryToArray } from './data-mapper';
import type { 
  Profile, 
  Experience, 
  ProjectSummary, 
  DataState 
} from '../data/types';

/**
 * Clean data service layer for visitor-facing components.
 * Abstracts away the raw Firebase dictionary responses into strongly typed domain arrays.
 */
export const VisitorDataService = {
  getProfile(onUpdate?: (data: Profile) => void): Promise<DataState<Profile>> {
    return publicClient.fetchNode<Profile>('published/profile', onUpdate);
  },
  
  getExperience(onUpdate?: (data: Experience[]) => void): Promise<DataState<Experience[]>> {
    return publicClient.fetchNode<Record<string, Omit<Experience, 'id'>>>('published/experience', (raw) => {
      if (onUpdate && raw) onUpdate(mapDictionaryToArray<Experience>(raw, 'id'));
    }).then(res => {
      if (res.status === 'success') return { status: 'success', data: mapDictionaryToArray<Experience>(res.data, 'id') };
      return res as DataState<Experience[]>;
    });
  },

  getProjects(onUpdate?: (data: ProjectSummary[]) => void): Promise<DataState<ProjectSummary[]>> {
    return publicClient.fetchNode<Record<string, Omit<ProjectSummary, 'slug'>>>('published/projects/summary', (raw) => {
      if (onUpdate && raw) onUpdate(mapDictionaryToArray<ProjectSummary>(raw, 'slug'));
    }).then(res => {
      if (res.status === 'success') return { status: 'success', data: mapDictionaryToArray<ProjectSummary>(res.data, 'slug') };
      return res as DataState<ProjectSummary[]>;
    });
  },

  getProjectDetail(slug: string, onUpdate?: (data: import('../data/types').ProjectDetail) => void): Promise<DataState<import('../data/types').ProjectDetail>> {
    return publicClient.fetchNode<Omit<import('../data/types').ProjectDetail, 'slug'>>(`published/projects/details/${slug}`, (raw) => {
      if (onUpdate && raw) onUpdate({ ...raw, slug });
    }).then(res => {
      if (res.status === 'success') return { status: 'success', data: { ...res.data, slug } };
      return res as DataState<import('../data/types').ProjectDetail>;
    });
  }
};
