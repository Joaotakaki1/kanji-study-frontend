import { SWRConfiguration } from 'swr';
import { fetcher } from './fetcher';

export const swrConfig: SWRConfiguration = {
  fetcher,
  // Cache data for 5 minutes by default
  dedupingInterval: 5 * 60 * 1000,
  // Focus revalidation disabled to prevent unnecessary requests
  revalidateOnFocus: false,
  // Revalidate when reconnecting to network
  revalidateOnReconnect: true,
  // Error retry configuration
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  // Background refresh when data is stale
  refreshInterval: 0, // Disabled by default - can be enabled per-hook
  // Cache provider for better memory management
  provider: () => new Map(),
  // Keep previous data while revalidating
  keepPreviousData: true,
  // Fallback data when loading
  fallback: {},
  // Compare function to prevent unnecessary re-renders
  compare: (a, b) => {
    if (a === b) return true;
    if (!a || !b) return false;
    return JSON.stringify(a) === JSON.stringify(b);
  }
};

// Cache key generators for consistent caching
export const cacheKeys = {
  decks: '/api/v1/decks',
  deckTemplates: '/api/v1/decks/templates',
  deck: (id: string | number) => `/api/v1/decks/${id}`,
  deckStudy: (id: string | number) => `/api/v1/decks/${id}/study`,
  stats: '/api/v1/study/stats',
  kanjiSearch: (query: string) => `/api/v1/kanji/search?q=${encodeURIComponent(query)}`,
  allKanji: '/api/v1/kanji',
} as const;

// Revalidation strategies
export const revalidationStrategies = {
  // For frequently changing data
  realtime: {
    refreshInterval: 30 * 1000, // 30 seconds
    revalidateOnFocus: true,
  },
  // For data that changes occasionally
  moderate: {
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    revalidateOnFocus: false,
  },
  // For relatively static data
  static: {
    refreshInterval: 0, // No auto refresh
    revalidateOnFocus: false,
    dedupingInterval: 30 * 60 * 1000, // 30 minutes
  },
} as const;