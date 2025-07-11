import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  type Query,
  type DocumentSnapshot
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import { z } from 'zod';

/**
 * Environment detection
 */
const env = {
  isDev: process.env.NODE_ENV === 'development',
  isServer: typeof window === 'undefined',
  isClient: typeof window !== 'undefined',
};

/**
 * App Error class
 */
class AppError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Safe async wrapper
 */
async function safeAsync<T>(
    fn: () => Promise<T>
): Promise<[Error | null, T | null]> {
  try {
    const result = await fn();
    return [null, result];
  } catch (error) {
    return [error as Error, null];
  }
}

/**
 * Simple storage utility for caching
 */
const storage = {
  set: (key: string, value: any): void => {
    if (env.isClient) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    }
  },
  get: <T>(key: string, defaultValue: T): T => {
    if (env.isClient) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
      }
    }
    return defaultValue;
  },
  remove: (key: string): void => {
    if (env.isClient) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Failed to remove from localStorage:', error);
      }
    }
  }
};

/**
 * Validation schemas using Zod (matching seed data structure)
 */
const LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const PlaceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  city: z.string().min(1),
  category: z.string().min(1),
  image: z.string().url(),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  history: z.string().min(1),
  highlights: z.array(z.string()),
  gallery: z.array(z.string().url()),
  tags: z.array(z.string()),
  location: LocationSchema,
});

const ItineraryDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1),
  activities: z.array(z.string()),
});

const PackageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  duration: z.string().min(1),
  cities: z.array(z.string()),
  image: z.string().url(),
  highlights: z.array(z.string()),
  itinerary: z.array(ItineraryDaySchema),
  inclusions: z.array(z.string()),
  gallery: z.array(z.string().url()),
  tags: z.array(z.string()),
});

export type Place = z.infer<typeof PlaceSchema>;
export type Package = z.infer<typeof PackageSchema>;

/**
 * API Response interfaces
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: number;
  cached?: boolean;
}

/**
 * Query options interface
 */
export interface QueryOptions {
  useCache?: boolean;
  cacheTTL?: number; // Time to live in milliseconds
}

export interface FilterOptions {
  city?: string;
  category?: string;
  tags?: string[];
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  startAfter?: any;
}

/**
 * Cache manager for data caching
 */
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    // Also persist to localStorage for offline access
    if (env.isClient) {
      storage.set(`cache_${key}`, { data, timestamp: Date.now(), ttl });
    }
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);

    if (cached) {
      const isValid = Date.now() - cached.timestamp < cached.ttl;
      if (isValid) {
        return cached.data;
      } else {
        this.cache.delete(key);
      }
    }

    // Try localStorage
    if (env.isClient) {
      const stored = storage.get<{ data: T; timestamp: number; ttl: number } | null>(`cache_${key}`, null);
      if (stored) {
        const isValid = Date.now() - stored.timestamp < stored.ttl;
        if (isValid) {
          // Restore to memory cache
          this.cache.set(key, stored);
          return stored.data;
        } else {
          storage.remove(`cache_${key}`);
        }
      }
    }

    return null;
  }

  clear(): void {
    this.cache.clear();

    if (env.isClient) {
      // Clear cache items from localStorage
      const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
      keys.forEach(key => localStorage.removeItem(key));
    }
  }
}

const cacheManager = new CacheManager();

/**
 * Data converters with validation (matching seed data structure)
 */
const placeConverter = (doc: QueryDocumentSnapshot | DocumentSnapshot): Place => {
  const data = doc.data();
  if (!data) {
    throw new AppError(`Document ${doc.id} has no data`, 'DOCUMENT_ERROR');
  }

  try {
    const place: Place = {
      id: doc.id,
      name: data.name || '',
      city: data.city || '',
      category: data.category || '',
      image: data.image || 'https://placehold.co/600x800.png',
      shortDescription: data.shortDescription || '',
      description: data.description || '',
      history: data.history || '',
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      gallery: Array.isArray(data.gallery) ? data.gallery : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      location: data.location || { lat: 0, lng: 0 },
    };

    // Validate the converted data
    return PlaceSchema.parse(place);
  } catch (error) {
    console.error(`Error converting place document ${doc.id}:`, error);
    throw new AppError(
        `Invalid place data for document ${doc.id}`,
        'VALIDATION_ERROR'
    );
  }
};

const packageConverter = (doc: QueryDocumentSnapshot | DocumentSnapshot): Package => {
  const data = doc.data();
  if (!data) {
    throw new AppError(`Document ${doc.id} has no data`, 'DOCUMENT_ERROR');
  }

  try {
    const pkg: Package = {
      id: doc.id,
      name: data.name || '',
      description: data.description || '',
      duration: data.duration || '',
      cities: Array.isArray(data.cities) ? data.cities : [],
      image: data.image || 'https://placehold.co/600x800.png',
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
      inclusions: Array.isArray(data.inclusions) ? data.inclusions : [],
      gallery: Array.isArray(data.gallery) ? data.gallery : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
    };

    // Validate the converted data
    return PackageSchema.parse(pkg);
  } catch (error) {
    console.error(`Error converting package document ${doc.id}:`, error);
    throw new AppError(
        `Invalid package data for document ${doc.id}`,
        'VALIDATION_ERROR'
    );
  }
};

/**
 * Generic fetch function with caching and error handling
 */
async function fetchCollection<T>(
    collectionName: string,
    converter: (doc: QueryDocumentSnapshot) => T,
    options: QueryOptions & FilterOptions = {}
): Promise<ApiResponse<T[]>> {
  const {
    useCache = true,
    cacheTTL = 5 * 60 * 1000,
    city,
    category,
    tags,
    limit: queryLimit,
    orderBy: orderField,
    orderDirection = 'asc',
    startAfter: startAfterDoc
  } = options;

  // Generate cache key
  const cacheKey = `${collectionName}_${JSON.stringify({
    city, category, tags, queryLimit, orderField, orderDirection
  })}`;

  // Try cache first
  if (useCache && !startAfterDoc) {
    const cached = cacheManager.get<T[]>(cacheKey);
    if (cached) {
      return {
        data: cached,
        success: true,
        timestamp: Date.now(),
        cached: true
      };
    }
  }

  const [error, result] = await safeAsync(async () => {
    const db = await getFirebaseDb();
    let q: Query = collection(db, collectionName);

    // Apply filters
    if (city) {
      q = query(q, where('city', '==', city));
    }

    if (category) {
      q = query(q, where('category', '==', category));
    }

    if (tags && tags.length > 0) {
      q = query(q, where('tags', 'array-contains-any', tags));
    }

    // Apply ordering
    if (orderField) {
      q = query(q, orderBy(orderField, orderDirection));
    }

    // Apply pagination
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    if (queryLimit) {
      q = query(q, limit(queryLimit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(converter);
  });

  if (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    throw new AppError(
        `Failed to fetch ${collectionName}`,
        'FETCH_ERROR'
    );
  }

  const data = result!;

  // Cache the results
  if (useCache && !startAfterDoc) {
    cacheManager.set(cacheKey, data, cacheTTL);
  }

  return {
    data,
    success: true,
    timestamp: Date.now(),
    cached: false
  };
}

/**
 * Generic fetch single document function
 */
async function fetchDocument<T>(
    collectionName: string,
    documentId: string,
    converter: (doc: DocumentSnapshot) => T,
    options: QueryOptions = {}
): Promise<ApiResponse<T | null>> {
  const { useCache = true, cacheTTL = 5 * 60 * 1000 } = options;

  const cacheKey = `${collectionName}_${documentId}`;

  // Try cache first
  if (useCache) {
    const cached = cacheManager.get<T>(cacheKey);
    if (cached) {
      return {
        data: cached,
        success: true,
        timestamp: Date.now(),
        cached: true
      };
    }
  }

  const [error, result] = await safeAsync(async () => {
    const db = await getFirebaseDb();
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return converter(docSnap);
  });

  if (error) {
    console.error(`Error fetching ${collectionName}/${documentId}:`, error);
    throw new AppError(
        `Failed to fetch document ${documentId}`,
        'FETCH_ERROR'
    );
  }

  const data = result!;

  // Cache the result
  if (useCache && data) {
    cacheManager.set(cacheKey, data, cacheTTL);
  }

  return {
    data,
    success: true,
    timestamp: Date.now(),
    cached: false
  };
}

/**
 * Places API
 */
export const placesApi = {
  /**
   * Get all places with optional filters
   */
  async getAll(options: QueryOptions & FilterOptions = {}): Promise<Place[]> {
    const response = await fetchCollection('places', placeConverter, options);
    return response.data;
  },

  /**
   * Get place by ID
   */
  async getById(id: string, options: QueryOptions = {}): Promise<Place | null> {
    const response = await fetchDocument('places', id, placeConverter, options);
    return response.data;
  },

  /**
   * Get places by city
   */
  async getByCity(city: string, options: QueryOptions = {}): Promise<Place[]> {
    return this.getAll({ ...options, city });
  },

  /**
   * Get places by category
   */
  async getByCategory(category: string, options: QueryOptions = {}): Promise<Place[]> {
    return this.getAll({ ...options, category });
  },

  /**
   * Get places by tags
   */
  async getByTags(tags: string[], options: QueryOptions = {}): Promise<Place[]> {
    return this.getAll({ ...options, tags });
  }
};

/**
 * Packages API
 */
export const packagesApi = {
  /**
   * Get all packages with optional filters
   */
  async getAll(options: QueryOptions & FilterOptions = {}): Promise<Package[]> {
    const response = await fetchCollection('packages', packageConverter, options);
    return response.data;
  },

  /**
   * Get package by ID
   */
  async getById(id: string, options: QueryOptions = {}): Promise<Package | null> {
    const response = await fetchDocument('packages', id, packageConverter, options);
    return response.data;
  },

  /**
   * Get packages by city
   */
  async getByCity(city: string, options: QueryOptions = {}): Promise<Package[]> {
    return this.getAll({ ...options, city });
  },

  /**
   * Get packages by tags
   */
  async getByTags(tags: string[], options: QueryOptions = {}): Promise<Package[]> {
    return this.getAll({ ...options, tags });
  }
};

/**
 * Legacy exports for backward compatibility
 */
export async function getPlaces(): Promise<Place[]> {
  return placesApi.getAll();
}

export async function getPlaceById(id: string): Promise<Place | undefined> {
  const place = await placesApi.getById(id);
  return place || undefined;
}

export async function getPackages(): Promise<Package[]> {
  return packagesApi.getAll();
}

export async function getPackageById(id: string): Promise<Package | undefined> {
  const pkg = await packagesApi.getById(id);
  return pkg || undefined;
}

/**
 * Data utilities
 */
export const dataUtils = {
  /**
   * Get unique cities from places
   */
  async getUniqueCities(): Promise<string[]> {
    const places = await placesApi.getAll();
    const cities = Array.from(new Set(places.map(place => place.city)));
    return cities.sort();
  },

  /**
   * Get unique categories from places
   */
  async getUniqueCategories(): Promise<string[]> {
    const places = await placesApi.getAll();
    const categories = Array.from(new Set(places.map(place => place.category)));
    return categories.sort();
  },

  /**
   * Get unique tags from places and packages
   */
  async getUniqueTags(): Promise<string[]> {
    const [places, packages] = await Promise.all([
      placesApi.getAll(),
      packagesApi.getAll()
    ]);

    const allTags = [
      ...places.flatMap(place => place.tags),
      ...packages.flatMap(pkg => pkg.tags)
    ];

    return Array.from(new Set(allTags)).sort();
  }
};

/**
 * Export everything for convenience
 */
export { cacheManager };
export default {
  places: placesApi,
  packages: packagesApi,
  utils: dataUtils,
  cache: cacheManager
};