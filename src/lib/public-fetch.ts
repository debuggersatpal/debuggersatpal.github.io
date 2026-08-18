// src/lib/public-fetch.ts
import type { 
  DataState, 
  CacheEntry, 
  CacheStrategy,
} from '../data/types';

const CACHE_CONFIG: CacheStrategy = {
  ttlMs: 5 * 60 * 1000, // 5 minutes TTL for Stale-While-Revalidate
  keyPrefix: 'portfolio_pub_'
};

/**
 * Lightweight vanilla fetch client for public RTDB endpoints.
 * ZERO Firebase SDK dependencies. Operates as GET-only.
 */
export class PublicDataClient {
  private databaseUrl: string;

  constructor(databaseUrl: string) {
    // Strip trailing slash if present
    this.databaseUrl = (databaseUrl || '').replace(/\/$/, '');
  }

  private getCacheKey(path: string): string {
    return `${CACHE_CONFIG.keyPrefix}${path}`;
  }

  private readCache<T>(path: string): { data: T; isStale: boolean } | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(this.getCacheKey(path));
      if (!cached) return null;
      
      const entry: CacheEntry<T> = JSON.parse(cached);
      const isStale = (Date.now() - entry.timestamp) > CACHE_CONFIG.ttlMs;
      
      return { data: entry.data, isStale };
    } catch {
      return null;
    }
  }

  private writeCache<T>(path: string, data: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(this.getCacheKey(path), JSON.stringify(entry));
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Fetches data from a specific RTDB node using Stale-While-Revalidate.
   * Path should be relative to the database root, without .json (e.g. "published/profile")
   * 
   * @param path The database path to fetch
   * @param onRevalidated Optional callback triggered if background revalidation yields new data
   */
  async fetchNode<T>(path: string, onRevalidated?: (data: T) => void): Promise<DataState<T>> {
    const cached = this.readCache<T>(path);
    
    const backgroundFetch = async () => {
      try {
        if (!this.databaseUrl) return;
        const response = await fetch(`${this.databaseUrl}/${path}.json`);
        if (!response.ok) return;
        const data = await response.json();
        
        // Only trigger update if data actually changed
        const isDifferent = JSON.stringify(cached?.data) !== JSON.stringify(data);
        this.writeCache(path, data);
        
        if (isDifferent && onRevalidated) {
          onRevalidated(data);
        }
      } catch (err) {
        // Silent failure for background revalidation
      }
    };
    
    if (cached) {
      if (cached.isStale) {
        // Return stale data immediately, but revalidate in background
        backgroundFetch();
      }
      return { status: 'success', data: cached.data };
    }

    try {
      if (!this.databaseUrl) {
         return { status: 'error', message: 'Database URL not configured' };
      }

      const response = await fetch(`${this.databaseUrl}/${path}.json`);
      
      if (!response.ok) {
        return { status: 'error', message: `HTTP Error: ${response.status}` };
      }

      const data = await response.json();
      
      if (data === null) {
        return { status: 'empty' };
      }

      this.writeCache(path, data);

      return { status: 'success', data };
    } catch (err) {
      return { status: 'error', message: err instanceof Error ? err.message : 'Unknown network error' };
    }
  }
}

// Global instance configured via build-time environment variable
export const publicClient = new PublicDataClient(
  import.meta.env.PUBLIC_FIREBASE_DATABASE_URL || ''
);
