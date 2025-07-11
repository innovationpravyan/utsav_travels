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
 * More lenient validation schemas - allowing for missing/optional fields
 */
const LocationSchema = z.object({
  lat: z.number().min(-90).max(90).default(0),
  lng: z.number().min(-180).max(180).default(0),
}).optional().default({ lat: 0, lng: 0 });

const PlaceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  city: z.string().default('Unknown'),
  category: z.string().default('General'),
  image: z.string().default('https://placehold.co/600x800/cccccc/666666?text=No+Image'),
  shortDescription: z.string().default(''),
  description: z.string().default(''),
  history: z.string().default(''),
  highlights: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  location: LocationSchema,
  // Add optional fields that might exist in your data
  tagline: z.string().optional(),
  rating: z.number().optional(),
  reviews: z.number().optional(),
});

const ItineraryDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1),
  activities: z.array(z.string()).default([]),
});

const PackageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(''),
  duration: z.string().default(''),
  cities: z.array(z.string()).default([]),
  image: z.string().default('https://placehold.co/600x800/cccccc/666666?text=No+Image'),
  highlights: z.array(z.string()).default([]),
  itinerary: z.array(ItineraryDaySchema).default([]),
  inclusions: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  // Add common package fields
  price: z.union([z.string(), z.number()]).optional(),
  originalPrice: z.union([z.string(), z.number()]).optional(),
  discount: z.union([z.string(), z.number()]).optional(),
  tagline: z.string().optional(),
  rating: z.number().optional(),
  reviews: z.number().optional(),
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
 * Data converters with more lenient validation and better error handling
 */
const placeConverter = (doc: QueryDocumentSnapshot | DocumentSnapshot): Place | null => {
  try {
    const data = doc.data();
    if (!data) {
      console.warn(`Document ${doc.id} has no data`);
      return null;
    }

    // Log the raw data for debugging
    if (env.isDev) {
      console.log(`Converting place document ${doc.id}:`, data);
    }

    const place = {
      id: doc.id,
      name: data.name || `Place ${doc.id}`,
      city: data.city || 'Unknown',
      category: data.category || 'General',
      image: data.image || data.imageUrl || 'https://placehold.co/600x800/cccccc/666666?text=No+Image',
      shortDescription: data.shortDescription || data.description?.slice(0, 100) || '',
      description: data.description || '',
      history: data.history || '',
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      gallery: Array.isArray(data.gallery) ? data.gallery : (data.images ? data.images : []),
      tags: Array.isArray(data.tags) ? data.tags : [],
      location: data.location || { lat: 0, lng: 0 },
      tagline: data.tagline,
      rating: data.rating,
      reviews: data.reviews,
    };

    // Validate and return
    const validated = PlaceSchema.parse(place);
    if (env.isDev) {
      console.log(`Successfully converted place ${doc.id}:`, validated);
    }
    return validated;
  } catch (error) {
    console.error(`Error converting place document ${doc.id}:`, error);
    // Return a minimal valid place instead of throwing
    return {
      id: doc.id,
      name: `Place ${doc.id}`,
      city: 'Unknown',
      category: 'General',
      image: 'https://placehold.co/600x800/cccccc/666666?text=Error+Loading',
      shortDescription: 'Error loading place data',
      description: 'There was an error loading this place data.',
      history: '',
      highlights: [],
      gallery: [],
      tags: [],
      location: { lat: 0, lng: 0 },
    };
  }
};

const packageConverter = (doc: QueryDocumentSnapshot | DocumentSnapshot): Package | null => {
  try {
    const data = doc.data();
    if (!data) {
      console.warn(`Document ${doc.id} has no data`);
      return null;
    }

    // Log the raw data for debugging
    if (env.isDev) {
      console.log(`Converting package document ${doc.id}:`, data);
    }

    const pkg = {
      id: doc.id,
      name: data.name || `Package ${doc.id}`,
      description: data.description || '',
      duration: data.duration || data.days || '',
      cities: Array.isArray(data.cities) ? data.cities : [],
      image: data.image || data.imageUrl || 'https://placehold.co/600x800/cccccc/666666?text=No+Image',
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
      inclusions: Array.isArray(data.inclusions) ? data.inclusions : [],
      gallery: Array.isArray(data.gallery) ? data.gallery : (data.images ? data.images : []),
      tags: Array.isArray(data.tags) ? data.tags : [],
      price: data.price,
      originalPrice: data.originalPrice,
      discount: data.discount,
      tagline: data.tagline,
      rating: data.rating,
      reviews: data.reviews,
    };

    // Validate and return
    const validated = PackageSchema.parse(pkg);
    if (env.isDev) {
      console.log(`Successfully converted package ${doc.id}:`, validated);
    }
    return validated;
  } catch (error) {
    console.error(`Error converting package document ${doc.id}:`, error);
    // Return a minimal valid package instead of throwing
    return {
      id: doc.id,
      name: `Package ${doc.id}`,
      description: 'Error loading package data',
      duration: '',
      cities: [],
      image: 'https://placehold.co/600x800/cccccc/666666?text=Error+Loading',
      highlights: [],
      itinerary: [],
      inclusions: [],
      gallery: [],
      tags: [],
    };
  }
};

/**
 * Generic fetch function with better error handling and fallbacks
 */
async function fetchCollection<T>(
    collectionName: string,
    converter: (doc: QueryDocumentSnapshot) => T | null,
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
      console.log(`Cache hit for ${collectionName}:`, cached.length, 'items');
      return {
        data: cached,
        success: true,
        timestamp: Date.now(),
        cached: true
      };
    }
  }

  const [error, result] = await safeAsync(async () => {
    console.log(`Fetching ${collectionName} from Firebase...`);
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

    console.log(`Executing query for ${collectionName}...`);
    const snapshot = await getDocs(q);
    console.log(`Got ${snapshot.docs.length} documents from ${collectionName}`);

    const convertedDocs = snapshot.docs
        .map(converter)
        .filter((item): item is T => item !== null);

    console.log(`Successfully converted ${convertedDocs.length} ${collectionName} documents`);
    return convertedDocs;
  });

  if (error) {
    console.error(`Error fetching ${collectionName}:`, error);

    // Return fallback data instead of throwing
    const fallbackData = getFallbackData<T>(collectionName);
    return {
      data: fallbackData,
      success: false,
      error: error.message,
      timestamp: Date.now(),
      cached: false
    };
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
 * Fallback data when Firebase fails
 */
function getFallbackData<T>(collectionName: string): T[] {
  if (collectionName === 'places') {
    return [
      {
        id: 'fallback-place-1',
        name: 'Sacred Temple',
        city: 'Varanasi',
        category: 'Temple',
        image: 'https://placehold.co/600x800/4f46e5/ffffff?text=Sacred+Temple',
        shortDescription: 'A beautiful ancient temple',
        description: 'This is a fallback place while we load the real data.',
        history: 'Ancient history',
        highlights: ['Beautiful architecture', 'Spiritual atmosphere'],
        gallery: [],
        tags: ['spiritual', 'ancient'],
        location: { lat: 25.3176, lng: 82.9739 },
      }
    ] as T[];
  }

  if (collectionName === 'packages') {
    return [
      {
        id: 'fallback-package-1',
        name: 'Spiritual Journey',
        description: 'A beautiful spiritual journey package',
        duration: '3 Days',
        cities: ['Varanasi'],
        image: 'https://placehold.co/600x800/10b981/ffffff?text=Spiritual+Journey',
        highlights: ['Temple visits', 'Sacred experiences'],
        itinerary: [],
        inclusions: ['Accommodation', 'Meals'],
        gallery: [],
        tags: ['spiritual', 'pilgrimage'],
      }
    ] as T[];
  }

  return [];
}

/**
 * Generic fetch single document function
 */
async function fetchDocument<T>(
    collectionName: string,
    documentId: string,
    converter: (doc: DocumentSnapshot) => T | null,
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
    return {
      data: null,
      success: false,
      error: error.message,
      timestamp: Date.now(),
      cached: false
    };
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
 * Legacy exports for backward compatibility with better error handling
 */
export async function getPlaces(): Promise<Place[]> {
  try {
    console.log('Legacy getPlaces() called');
    const places = await placesApi.getAll();
    console.log('Legacy getPlaces() returning:', places.length, 'places');
    return places;
  } catch (error) {
    console.error('Error in legacy getPlaces():', error);
    return getFallbackData<Place>('places');
  }
}

export async function getPlaceById(id: string): Promise<Place | undefined> {
  try {
    const place = await placesApi.getById(id);
    return place || undefined;
  } catch (error) {
    console.error('Error in legacy getPlaceById():', error);
    return undefined;
  }
}

export async function getPackages(): Promise<Package[]> {
  try {
    console.log('Legacy getPackages() called');
    const packages = await packagesApi.getAll();
    console.log('Legacy getPackages() returning:', packages.length, 'packages');
    return packages;
  } catch (error) {
    console.error('Error in legacy getPackages():', error);
    return getFallbackData<Package>('packages');
  }
}

export async function getPackageById(id: string): Promise<Package | undefined> {
  try {
    const pkg = await packagesApi.getById(id);
    return pkg || undefined;
  } catch (error) {
    console.error('Error in legacy getPackageById():', error);
    return undefined;
  }
}

/**
 * Data utilities
 */
export const dataUtils = {
  /**
   * Get unique cities from places
   */
  async getUniqueCities(): Promise<string[]> {
    try {
      const places = await placesApi.getAll();
      const cities = Array.from(new Set(places.map(place => place.city)));
      return cities.sort();
    } catch (error) {
      console.error('Error getting unique cities:', error);
      return ['Varanasi', 'Rishikesh', 'Haridwar'];
    }
  },

  /**
   * Get unique categories from places
   */
  async getUniqueCategories(): Promise<string[]> {
    try {
      const places = await placesApi.getAll();
      const categories = Array.from(new Set(places.map(place => place.category)));
      return categories.sort();
    } catch (error) {
      console.error('Error getting unique categories:', error);
      return ['Temple', 'Ghat', 'Ashram'];
    }
  },

  /**
   * Get unique tags from places and packages
   */
  async getUniqueTags(): Promise<string[]> {
    try {
      const [places, packages] = await Promise.all([
        placesApi.getAll(),
        packagesApi.getAll()
      ]);

      const allTags = [
        ...places.flatMap(place => place.tags),
        ...packages.flatMap(pkg => pkg.tags)
      ];

      return Array.from(new Set(allTags)).sort();
    } catch (error) {
      console.error('Error getting unique tags:', error);
      return ['spiritual', 'pilgrimage', 'heritage'];
    }
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