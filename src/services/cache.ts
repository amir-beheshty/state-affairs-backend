import { NewsQuery, NewsRow } from 'interfaces';

// This is a very simple cache just for demo
export const cache = new Map();

// Set cache duration to 5mins
const CACHE_DURATION = 5 * 60 * 1000;

// Helper to generate cache key from query parameters
const generateCacheKey = (query: NewsQuery): string => {
  return JSON.stringify({
    state: query.state?.toLowerCase(),
    topic: query.topic?.toLowerCase(),
    search: query.search?.toLowerCase(),
  });
};

const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

export const getCachedData = (query: NewsQuery): NewsRow[] | null => {
  const key = generateCacheKey(query);
  const cached = cache.get(key);

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  // Remove stale data
  if (cached) {
    cache.delete(key);
  }

  return null;
};

export const setCacheData = (query: NewsQuery, data: NewsRow[]): void => {
  const key = generateCacheKey(query);
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};
