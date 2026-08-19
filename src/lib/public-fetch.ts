export type FetchStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface DataState<T> {
  status: FetchStatus;
  data?: T;
  message?: string;
}

class PublicDataClient {
  private databaseUrl: string;

  constructor(databaseUrl: string) {
    this.databaseUrl = (databaseUrl || '').replace(/\/$/, '');
  }

  async fetchNode<T>(path: string, onRevalidated?: (data: T) => void): Promise<DataState<T>> {
    try {
      if (!this.databaseUrl) return { status: 'error', message: 'Database URL not configured' };
      
      // cache: 'no-store' ensures the browser always fetches from the network
      const response = await fetch(`${this.databaseUrl}/${path}.json`, {
        cache: 'no-store'
      });
      
      if (!response.ok) return { status: 'error', message: `HTTP Error: ${response.status}` };
      
      const data = await response.json();
      if (data === null) return { status: 'empty' };
      
      if (onRevalidated) {
        onRevalidated(data);
      }
      
      return { status: 'success', data };
    } catch (err) {
      return { status: 'error', message: err instanceof Error ? err.message : 'Unknown network error' };
    }
  }
}

export const publicClient = new PublicDataClient(import.meta.env.PUBLIC_FIREBASE_DATABASE_URL || '');

import { mapDictionaryToArray } from './data-mapper';
import type { Profile, Experience, ProjectSummary, Capability, Contact, ProjectDetail } from '../data/types';


export const PublicDataService = {
  async getProfile(onUpdate?: (data: Profile) => void): Promise<DataState<Profile>> {
    return publicClient.fetchNode<Profile>('published/profile', onUpdate);
  },
  async getExperience(onUpdate?: (data: Experience[]) => void): Promise<DataState<Experience[]>> {
    const res = await publicClient.fetchNode<Record<string, Omit<Experience, 'id'>>>('published/experience', (dict) => {
      if (onUpdate && dict) onUpdate(mapDictionaryToArray(dict, 'id'));
    });
    if (res.status === 'success') return { status: 'success', data: mapDictionaryToArray(res.data || {}, 'id') as Experience[] };
    return res as unknown as DataState<Experience[]>;
  },
  async getProjects(onUpdate?: (data: ProjectSummary[]) => void): Promise<DataState<ProjectSummary[]>> {
    const res = await publicClient.fetchNode<Record<string, Omit<ProjectSummary, 'slug'>>>('published/projects/summary', (dict) => {
      if (onUpdate && dict) onUpdate(mapDictionaryToArray(dict, 'slug'));
    });
    if (res.status === 'success') return { status: 'success', data: mapDictionaryToArray(res.data || {}, 'slug') as ProjectSummary[] };
    return res as unknown as DataState<ProjectSummary[]>;
  },
  async getProjectDetail(slug: string, onUpdate?: (data: ProjectDetail) => void): Promise<DataState<ProjectDetail>> {
    const res = await publicClient.fetchNode<Omit<ProjectDetail, 'slug'>>(`published/projects/details/${slug}`, (data) => {
      if (onUpdate && data) onUpdate({ ...data, slug } as ProjectDetail);
    });
    if (res.status === 'success') return { status: 'success', data: { ...res.data, slug } as ProjectDetail };
    return res as unknown as DataState<ProjectDetail>;
  },
  async getCapabilities(onUpdate?: (data: Capability[]) => void): Promise<DataState<Capability[]>> {
    const res = await publicClient.fetchNode<Record<string, Omit<Capability, 'id'>>>('published/capabilities', (dict) => {
      if (onUpdate && dict) onUpdate(mapDictionaryToArray(dict, 'id'));
    });
    if (res.status === 'success') return { status: 'success', data: mapDictionaryToArray(res.data || {}, 'id') as Capability[] };
    return res as unknown as DataState<Capability[]>;
  },
  async getContact(onUpdate?: (data: Contact) => void): Promise<DataState<Contact>> {
    return publicClient.fetchNode<Contact>('published/contact', onUpdate);
  },
  async resolveMediaUrl(path: string): Promise<string> {
    return path; 
  }
};
