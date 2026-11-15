/**
 * TERRALIGN — In-Memory Scientific Cache with TTL
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  storedAt: number;
}

class ScientificCache {
  private store: Map<string, CacheEntry<unknown>> = new Map();
  private maxEntries: number = 200;

  get<T>(key: string): { hit: true; value: T; ageMs: number } | { hit: false } {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return { hit: false };

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return { hit: false };
    }

    return {
      hit: true,
      value: entry.value,
      ageMs: Date.now() - entry.storedAt,
    };
  }

  set<T>(key: string, value: T, ttlSeconds: number = 900): void {
    // Evict oldest if reaching capacity
    if (this.store.size >= this.maxEntries) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }

    const now = Date.now();
    this.store.set(key, {
      value,
      expiresAt: now + ttlSeconds * 1000,
      storedAt: now,
    });
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

// Global singleton cache instance attached to globalThis to survive Next.js HMR
const globalForCache = globalThis as unknown as { scientificCache?: ScientificCache };
export const scientificCache = globalForCache.scientificCache ?? new ScientificCache();
if (process.env.NODE_ENV !== 'production') {
  globalForCache.scientificCache = scientificCache;
}
