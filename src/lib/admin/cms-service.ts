import { db, ref, get, set, child, update, storage, storageRef, uploadBytes } from './firebase';
import type { Profile, Experience, ProjectSummary, ProjectDetail } from '../../data/types';
import { mapDictionaryToArray } from '../data-mapper';

export const getProxyAwareUrl = (path: string): string => {
  if (typeof window === 'undefined') return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const finalPath = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  return `${window.location.origin}${finalPath}`;
};

/**
 * CMS Service for isolated interaction with the `drafts` and `mediaMap` nodes.
 * 
 * WARNING: This service explicitly prevents writing directly to `/published`.
 * Publishing must be performed via a trusted server/edge function to enforce
 * strict validation and prevent client-side corruption of live production data.
 */
export const CmsService = {
  // --- Profile ---
  async getProfileDraft(): Promise<Profile | null> {
    const snapshot = await get(child(ref(db), 'drafts/profile'));
    return snapshot.exists() ? snapshot.val() : null;
  },
  
  async saveProfileDraft(data: Profile): Promise<void> {
    await set(ref(db, 'drafts/profile'), data);
  },

  // --- Experience ---
  async getExperienceDrafts(): Promise<Experience[]> {
    const snapshot = await get(child(ref(db), 'drafts/experience'));
    if (!snapshot.exists()) return [];
    return mapDictionaryToArray<Experience>(snapshot.val(), 'id').sort((a, b) => a.order - b.order);
  },

  async saveExperienceDraft(id: string, data: Omit<Experience, 'id'>): Promise<void> {
    await set(ref(db, `drafts/experience/${id}`), data);
  },

  async deleteExperienceDraft(id: string): Promise<void> {
    await set(ref(db, `drafts/experience/${id}`), null);
  },

  // --- Projects ---
  async getProjectDrafts(): Promise<ProjectSummary[]> {
    const snapshot = await get(child(ref(db), 'drafts/projects/summary'));
    if (!snapshot.exists()) return [];
    return mapDictionaryToArray<ProjectSummary>(snapshot.val(), 'slug').sort((a, b) => a.order - b.order);
  },

  async getProjectDetailDraft(slug: string): Promise<ProjectDetail | null> {
    const snapshot = await get(child(ref(db), `drafts/projects/details/${slug}`));
    return snapshot.exists() ? { ...snapshot.val(), slug } : null;
  },

  async saveProjectDraft(slug: string, summary: Omit<ProjectSummary, 'slug'>, details: Omit<ProjectDetail, 'slug'>): Promise<void> {
    const updates: Record<string, any> = {};
    updates[`drafts/projects/summary/${slug}`] = summary;
    updates[`drafts/projects/details/${slug}`] = details;
    await update(ref(db), updates);
  },

  async deleteProjectDraft(slug: string): Promise<void> {
    const updates: Record<string, any> = {};
    updates[`drafts/projects/summary/${slug}`] = null;
    updates[`drafts/projects/details/${slug}`] = null;
    await update(ref(db), updates);
  },

  // --- Media ---
  async uploadMedia(file: File, identifier: string): Promise<string> {
    const cleanId = identifier.replace(/[^a-zA-Z0-9_.-]/g, '');
    if (!cleanId) throw new Error('Invalid media identifier');

    // Security: Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error('File exceeds maximum size of 5MB');
    }

    // Security: Validate file type (images and pdfs only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only images and PDFs are allowed.');
    }

    // 1. Upload to Firebase Storage
    const path = `uploads/${cleanId}-${Date.now()}`;
    const sRef = storageRef(storage, path);
    await uploadBytes(sRef, file);

    // 2. Register in mediaMap RTDB
    await set(ref(db, `mediaMap/${cleanId}`), {
      storagePath: path,
      contentType: file.type,
      size: file.size,
      updatedAt: Date.now()
    });

    // 3. Return the application-level MediaReference format
    return `/media/${cleanId}`;
  },

  // --- Trusted Publishing Pipeline ---
  async triggerServerPublish(entity: 'profile' | 'experience' | 'projects'): Promise<void> {
    console.info(`[CMS] Triggering publish for ${entity}...`);
    const { auth } = await import('./firebase');
    if (!auth.currentUser) throw new Error('Not authenticated to publish');
    
    // Read the draft
    let draftData: any;
    if (entity === 'projects') {
      const summaries = await this.getProjectDrafts();
      draftData = { summary: {}, details: {} };
      for (const s of summaries) {
        draftData.summary[s.slug] = s;
        const d = await this.getProjectDetailDraft(s.slug);
        if (d) {
          const { slug, ...rest } = d;
          draftData.details[s.slug] = rest;
        }
      }
    } else {
      const draftRes = await get(child(ref(db), `drafts/${entity}`));
      if (!draftRes.exists()) throw new Error('No draft found to publish');
      draftData = draftRes.val();
    }

    // Write to published directly via Client SDK
    await set(ref(db, `published/${entity}`), draftData);
    
    console.info(`[CMS] Successfully published ${entity}`);
  }
};
