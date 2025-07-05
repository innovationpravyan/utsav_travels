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
  type DocumentData, 
  type QueryDocumentSnapshot,
  type Query,
  type DocumentSnapshot,
  onSnapshot,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import { AppError, safeAsync, env, storage } from './utils';
import { z } from 'zod';

/**
 * Validation schemas using Zod
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
  thumbnail: z.string().url(),
  description: z.string().min(1),
  history: z.string().min(1),
  highlights: z.array(z.string()),
  images: z.array(z.string().url()),
  tags: z.array(z.string()),
  location: LocationSchema,
  tagline: z.string().min(1),
});

const ItineraryDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
});

const PackageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  duration: z.string().min(1),
  price: z.string().min(1),
  tagline: z.string().min(1),
  cities: z.array(z.string()),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()),
  highlights: z.array(z.string()),
  itinerary: z.array(ItineraryDaySchema),
  inclusions: z.array(z.string()),
  tags: z.array(z.string()),
});

/**
 * TypeScript interfaces
 */
export type Location = z.infer<typeof LocationSchema>;
export type Place = z.infer<typeof PlaceSchema>;
export type ItineraryDay = z.infer<typeof ItineraryDaySchema>;
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

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  hasMore: boolean;
  lastDoc?: any;
  total?: number;
}

/**
 * Query options interface
 */
export interface QueryOptions {
  useCache?: boolean;
  cacheTTL?: number; // Time to live in milliseconds
  offline?: boolean;
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
  
  invalidate(pattern: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(pattern)
    );
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      if (env.isClient) {
        storage.remove(`cache_${key}`);
      }
    });
  }
}

const cacheManager = new CacheManager();

/**
 * Data converters with validation
 */
const placeConverter = (doc: QueryDocumentSnapshot | DocumentSnapshot): Place => {
  const data = doc.data();
  if (!data) {
    throw new AppError(`Document ${doc.id} has no data`, 'DOCUMENT_ERROR', 404);
  }
  
  try {
    const place: Place = {
      id: doc.id,
      name: data.name || '',
      city: data.city || '',
      category: data.category || '',
      thumbnail: data.image || 'https://placehold.co/600x800.png',
      description: data.description || '',
      history: data.history || '',
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      images: Array.isArray(data.gallery) ? data.gallery : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      location: data.location || { lat: 0, lng: 0 },
      tagline: data.shortDescription || data.description?.substring(0, 50) + '...' || '',
    };
    
    // Validate the converted data
    return PlaceSchema.parse(place);
  } catch (error) {
    console.error(`Error converting place document ${doc.id}:`, error);
    throw new AppError(
      `Invalid place data for document ${doc.id}`,
      'VALIDATION_ERROR',
      400
    );
  }
};

const packageConverter = (doc: QueryDocumentSnapshot | DocumentSnapshot): Package => {
  const data = doc.data();
  if (!data) {
    throw new AppError(`Document ${doc.id} has no data`, 'DOCUMENT_ERROR', 404);
  }
  
  try {
    const itinerary = (data.itinerary || []).map((item: any) => ({
      day: item.day || 1,
      title: item.title || '',
      description: Array.isArray(item.activities) 
        ? item.activities.join('. ') 
        : item.description || '',
    }));

    const pkg: Package = {
      id: doc.id,
      name: data.name || '',
      description: data.description || '',
      duration: data.duration || '',
      price: data.price || "Contact for price",
      tagline: data.tagline || data.description?.substring(0, 60) + '...' || '',
      cities: Array.isArray(data.cities) ? data.cities : [],
      thumbnail: data.image || 'https://placehold.co/600x800.png',
      images: Array.isArray(data.gallery) ? data.gallery : [],
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      itinerary: itinerary,
      inclusions: Array.isArray(data.inclusions) ? data.inclusions : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
    
    // Validate the converted data
    return PackageSchema.parse(pkg);
  } catch (error) {
    console.error(`Error converting package document ${doc.id}:`, error);
    throw new AppError(
      `Invalid package data for document ${doc.id}`,
      'VALIDATION_ERROR',
      400
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
      'FETCH_ERROR',
      500
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
      'FETCH_ERROR',
      500
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
   * Get places with pagination
   */
  async getPaginated(options: QueryOptions & FilterOptions = {}): Promise<PaginatedResponse<Place>> {
    const response = await fetchCollection('places', placeConverter, options);
    
    return {
      ...response,
      hasMore: response.data.length === (options.limit || 20),
    };
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
   * Search places by tags
   */
  async searchByTags(tags: string[], options: QueryOptions = {}): Promise<Place[]> {
    return this.getAll({ ...options, tags });
  },
  
  /**
   * Get featured places
   */
  async getFeatured(count: number = 5, options: QueryOptions = {}): Promise<Place[]> {
    return this.getAll({ ...options, limit: count, orderBy: 'name' });
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
   * Get packages with pagination
   */
  async getPaginated(options: QueryOptions & FilterOptions = {}): Promise<PaginatedResponse<Package>> {
    const response = await fetchCollection('packages', packageConverter, options);
    
    return {
      ...response,
      hasMore: response.data.length === (options.limit || 20),
    };
  },
  
  /**
   * Get package by ID
   */
  async getById(id: string, options: QueryOptions = {}): Promise<Package | null> {
    const response = await fetchDocument('packages', id, packageConverter, options);
    return response.data;
  },
  
  /**
   * Get packages by cities
   */
  async getByCities(cities: string[], options: QueryOptions = {}): Promise<Package[]> {
    // Firestore doesn't support array-contains-any with arrays, so we'll fetch all and filter
    const allPackages = await this.getAll(options);
    return allPackages.filter(pkg => 
      cities.some(city => pkg.cities.includes(city))
    );
  },
  
  /**
   * Search packages by tags
   */
  async searchByTags(tags: string[], options: QueryOptions = {}): Promise<Package[]> {
    return this.getAll({ ...options, tags });
  },
  
  /**
   * Get popular packages
   */
  async getPopular(count: number = 3, options: QueryOptions = {}): Promise<Package[]> {
    return this.getAll({ ...options, limit: count, orderBy: 'name' });
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
 * Real-time data subscriptions
 */
export const subscriptions = {
  /**
   * Subscribe to places collection changes
   */
  subscribePlaces(callback: (places: Place[]) => void): () => void {
    let unsubscribe: (() => void) | null = null;
    
    (async () => {
      try {
        const db = await getFirebaseDb();
        const q = query(collection(db, 'places'), orderBy('name'));
        
        unsubscribe = onSnapshot(q, (snapshot) => {
          try {
            const places = snapshot.docs.map(placeConverter);
            callback(places);
            
            // Update cache
            cacheManager.set('places_realtime', places);
          } catch (error) {
            console.error('Error processing places subscription:', error);
          }
        }, (error) => {
          console.error('Places subscription error:', error);
        });
      } catch (error) {
        console.error('Failed to setup places subscription:', error);
      }
    })();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  },
  
  /**
   * Subscribe to packages collection changes
   */
  subscribePackages(callback: (packages: Package[]) => void): () => void {
    let unsubscribe: (() => void) | null = null;
    
    (async () => {
      try {
        const db = await getFirebaseDb();
        const q = query(collection(db, 'packages'), orderBy('name'));
        
        unsubscribe = onSnapshot(q, (snapshot) => {
          try {
            const packages = snapshot.docs.map(packageConverter);
            callback(packages);
            
            // Update cache
            cacheManager.set('packages_realtime', packages);
          } catch (error) {
            console.error('Error processing packages subscription:', error);
          }
        }, (error) => {
          console.error('Packages subscription error:', error);
        });
      } catch (error) {
        console.error('Failed to setup packages subscription:', error);
      }
    })();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }
};

/**
 * Data utilities
 */
export const dataUtils = {
  /**
   * Clear all cached data
   */
  clearCache: () => cacheManager.clear(),
  
  /**
   * Invalidate cache by pattern
   */
  invalidateCache: (pattern: string) => cacheManager.invalidate(pattern),
  
  /**
   * Prefetch data for offline usage
   */
  async prefetchData(): Promise<void> {
    const [placesError] = await safeAsync(() => placesApi.getAll({ useCache: true }));
    const [packagesError] = await safeAsync(() => packagesApi.getAll({ useCache: true }));
    
    if (placesError) {
      console.warn('Failed to prefetch places:', placesError);
    }
    
    if (packagesError) {
      console.warn('Failed to prefetch packages:', packagesError);
    }
  },
  
  /**
   * Health check for data connectivity
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; message: string }> {
    const [error] = await safeAsync(async () => {
      const db = await getFirebaseDb();
      // Try to read a single document to test connectivity
      const testDoc = doc(db, 'places', 'test');
      await getDoc(testDoc);
    });
    
    if (error) {
      return {
        status: 'unhealthy',
        message: `Database connection failed: ${error.message}`
      };
    }
    
    return {
      status: 'healthy',
      message: 'Database connection is working properly'
    };
  }
};

/**
 * Export everything for convenience
 */
export { cacheManager };
export default {
  places: placesApi,
  packages: packagesApi,
  subscriptions,
  utils: dataUtils,
  cache: cacheManager
};