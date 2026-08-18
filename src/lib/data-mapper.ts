// src/lib/data-mapper.ts
import type { 
  Experience, 
  Education, 
  ProjectSummary, 
  Capability 
} from '../data/types';

/**
 * Clean mapping layer to convert raw Firebase RTDB dictionary responses 
 * (which use keys instead of arrays) into strictly typed, ordered arrays 
 * expected by the visitor UI components.
 */
export function mapDictionaryToArray<T extends { order?: number }>(
  dict: Record<string, Omit<T, 'id' | 'slug'>>,
  keyName: 'id' | 'slug' = 'id'
): T[] {
  if (!dict) return [];
  
  return Object.entries(dict)
    .map(([key, value]) => ({
      ...value,
      [keyName]: key
    } as unknown as T))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
