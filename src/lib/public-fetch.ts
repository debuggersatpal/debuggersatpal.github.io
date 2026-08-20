export type FetchStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface DataState<T> {
  status: FetchStatus;
  data?: T;
  message?: string;
}

class PublicDataClient {
  private databaseUrl: string;
  private inflight: Map<string, Promise<any>> = new Map();
  private cache: Map<string, any> = new Map();

  constructor(databaseUrl: string) {
    this.databaseUrl = (databaseUrl || '').replace(/\/$/, '');
  }
  
  getCachedNode<T>(path: string): DataState<T> | undefined {
    if (!this.databaseUrl) return undefined;
    const fullUrl = `${this.databaseUrl}/${path}.json`;
    const data = this.cache.get(fullUrl);
    if (data !== undefined) {
      if (data === null) return { status: 'empty' };
      return { status: 'success', data };
    }
    return undefined;
  }

  async fetchNode<T>(path: string, onRevalidated?: (data: T) => void): Promise<DataState<T>> {
    try {
      if (!this.databaseUrl) return { status: 'error', message: 'Database URL not configured' };
      
      const fullUrl = `${this.databaseUrl}/${path}.json`;
      
      const cachedData = this.cache.get(fullUrl);
      
      let fetchPromise = this.inflight.get(fullUrl);
      if (!fetchPromise) {
        fetchPromise = fetch(fullUrl, { cache: 'no-store' })
          .then(async (response) => {
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return await response.json();
          })
          .then((data) => {
            this.cache.set(fullUrl, data);
            return data;
          })
          .finally(() => {
            this.inflight.delete(fullUrl);
          });
        this.inflight.set(fullUrl, fetchPromise);
      }
      
      if (cachedData !== undefined) {
         fetchPromise.then(freshData => {
            if (onRevalidated && JSON.stringify(cachedData) !== JSON.stringify(freshData)) {
               onRevalidated(freshData);
            }
         }).catch(err => { console.error('Background revalidation failed:', err); });
         
         if (cachedData === null) return { status: 'empty' };
         return { status: 'success', data: cachedData };
      }
      
      const data = await fetchPromise;
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
  getCachedProfile(): DataState<Profile> | undefined {
    return publicClient.getCachedNode<Profile>('published/profile');
  },
  async getProfile(onUpdate?: (data: Profile) => void): Promise<DataState<Profile>> {
    return publicClient.fetchNode<Profile>('published/profile', onUpdate);
  },
  getCachedExperience(): DataState<Experience[]> | undefined {
    const res = publicClient.getCachedNode<Record<string, Omit<Experience, 'id'>>>('published/experience');
    if (res && res.status === 'success') return { status: 'success', data: mapDictionaryToArray(res.data || {}, 'id') as Experience[] };
    return res as unknown as DataState<Experience[]>;
  },
  async getExperience(onUpdate?: (data: Experience[]) => void): Promise<DataState<Experience[]>> {
    const res = await publicClient.fetchNode<Record<string, Omit<Experience, 'id'>>>('published/experience', (dict) => {
      if (onUpdate && dict) onUpdate(mapDictionaryToArray(dict, 'id'));
    });
    if (res.status === 'success') return { status: 'success', data: mapDictionaryToArray(res.data || {}, 'id') as Experience[] };
    return res as unknown as DataState<Experience[]>;
  },
  getCachedProjects(): DataState<ProjectSummary[]> | undefined {
    const res = publicClient.getCachedNode<Record<string, Omit<ProjectSummary, 'slug'>>>('published/projects/summary');
    if (res && res.status === 'success') return { status: 'success', data: mapDictionaryToArray(res.data || {}, 'slug') as ProjectSummary[] };
    return res as unknown as DataState<ProjectSummary[]>;
  },
  async getProjects(onUpdate?: (data: ProjectSummary[]) => void): Promise<DataState<ProjectSummary[]>> {
    const res = await publicClient.fetchNode<Record<string, Omit<ProjectSummary, 'slug'>>>('published/projects/summary', (dict) => {
      if (onUpdate && dict) onUpdate(mapDictionaryToArray(dict, 'slug'));
    });
    if (res.status === 'success') return { status: 'success', data: mapDictionaryToArray(res.data || {}, 'slug') as ProjectSummary[] };
    return res as unknown as DataState<ProjectSummary[]>;
  },
  getCachedProjectDetail(slug: string): DataState<ProjectDetail> | undefined {
    const res = publicClient.getCachedNode<Omit<ProjectDetail, 'slug'>>(`published/projects/details/${slug}`);
    if (res && res.status === 'success') return { status: 'success', data: { ...res.data, slug } as ProjectDetail };
    return res as unknown as DataState<ProjectDetail>;
  },
  async getProjectDetail(slug: string, onUpdate?: (data: ProjectDetail) => void): Promise<DataState<ProjectDetail>> {
    const res = await publicClient.fetchNode<Omit<ProjectDetail, 'slug'>>(`published/projects/details/${slug}`, (data) => {
      if (onUpdate && data) onUpdate({ ...data, slug } as ProjectDetail);
    });
    if (res.status === 'success') return { status: 'success', data: { ...res.data, slug } as ProjectDetail };
    return res as unknown as DataState<ProjectDetail>;
  },
  getCachedCapabilities(): DataState<Capability[]> | undefined {
    const res = publicClient.getCachedNode<Record<string, Omit<Capability, 'id'>>>('published/capabilities');
    if (res && res.status === 'success') return { status: 'success', data: mapDictionaryToArray(res.data || {}, 'id') as Capability[] };
    return res as unknown as DataState<Capability[]>;
  },
  async getCapabilities(onUpdate?: (data: Capability[]) => void): Promise<DataState<Capability[]>> {
    const res = await publicClient.fetchNode<Record<string, Omit<Capability, 'id'>>>('published/capabilities', (dict) => {
      if (onUpdate && dict) onUpdate(mapDictionaryToArray(dict, 'id'));
    });
    if (res.status === 'success') return { status: 'success', data: mapDictionaryToArray(res.data || {}, 'id') as Capability[] };
    return res as unknown as DataState<Capability[]>;
  },
  getCachedContact(): DataState<Contact> | undefined {
    return publicClient.getCachedNode<Contact>('published/contact');
  },
  async getContact(onUpdate?: (data: Contact) => void): Promise<DataState<Contact>> {
    return publicClient.fetchNode<Contact>('published/contact', onUpdate);
  },
  async resolveMediaUrl(path: string): Promise<string> {
    return path; 
  }
};
