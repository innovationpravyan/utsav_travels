// src/services/video-cache.service.ts

import {
    CacheEntry,
    CacheConfig,
    CacheStats,
    CacheEvent,
    CacheEventType,
    VideoCacheError,
    VideoMetadata,
    DEFAULT_CACHE_CONFIG
} from '@/types/video-cache';

class VideoCacheService {
    private db: IDBDatabase | null = null;
    private config: CacheConfig;
    private eventListeners: Map<CacheEventType, Set<(event: CacheEvent) => void>> = new Map();
    private isInitialized = false;
    private initializationPromise: Promise<void> | null = null;

    constructor(config: Partial<CacheConfig> = {}) {
        this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
        this.initializeEventListeners();
    }

    /**
     * Initialize the cache service and IndexedDB
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;
        if (this.initializationPromise) return this.initializationPromise;

        this.initializationPromise = this._initialize();
        await this.initializationPromise;
    }

    private async _initialize(): Promise<void> {
        try {
            if (typeof window === 'undefined' || !('indexedDB' in window)) {
                throw new VideoCacheError('IndexedDB not supported', 'INDEXEDDB_NOT_SUPPORTED');
            }

            await this.openDatabase();
            await this.cleanupOldEntries();
            this.isInitialized = true;

            console.log('Video cache service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize video cache service:', error);
            throw new VideoCacheError(
                'Failed to initialize cache service',
                'INIT_FAILED',
                undefined,
                error as Error
            );
        }
    }

    /**
     * Open IndexedDB database
     */
    private openDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.config.dbName, 1);

            request.onerror = () => {
                reject(new VideoCacheError('Failed to open database', 'DB_OPEN_FAILED'));
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create object store
                if (!db.objectStoreNames.contains(this.config.storeName)) {
                    const store = db.createObjectStore(this.config.storeName, {
                        keyPath: 'videoId'
                    });

                    // Create indices
                    store.createIndex(this.config.indexName, 'urlHash', { unique: false });
                    store.createIndex('cachedAt', 'cachedAt', { unique: false });
                    store.createIndex('lastAccessed', 'lastAccessed', { unique: false });
                }
            };
        });
    }

    /**
     * Store video in cache
     */
    async storeVideo(
        videoId: string,
        url: string,
        blob: Blob,
        metadata: VideoMetadata
    ): Promise<boolean> {
        await this.ensureInitialized();

        try {
            const urlHash = await this.hashUrl(url);
            const now = Date.now();

            const entry: CacheEntry = {
                videoId,
                url,
                urlHash,
                blobData: blob,
                metadata,
                cachedAt: now,
                lastAccessed: now,
                size: blob.size,
                version: this.config.cacheVersion
            };

            // Check cache size limits
            const currentSize = await this.getCurrentCacheSize();
            const maxSizeBytes = this.config.maxCacheSize * 1024 * 1024; // Convert MB to bytes

            if (currentSize + blob.size > maxSizeBytes) {
                await this.evictOldEntries(blob.size);
            }

            // Store in IndexedDB
            await this.performTransaction('readwrite', (store) => {
                return store.put(entry);
            });

            this.emitEvent('cache-store', videoId, { size: blob.size, url });
            console.log(`Video cached: ${videoId} (${(blob.size / 1024 / 1024).toFixed(2)}MB)`);

            return true;
        } catch (error) {
            this.emitEvent('cache-error', videoId, { error: error.message });
            console.error(`Failed to store video ${videoId}:`, error);
            throw new VideoCacheError(
                'Failed to store video in cache',
                'STORE_FAILED',
                videoId,
                error as Error
            );
        }
    }

    /**
     * Retrieve video from cache
     */
    async getVideo(videoId: string, url: string): Promise<Blob | null> {
        await this.ensureInitialized();

        try {
            const urlHash = await this.hashUrl(url);

            const entry = await this.performTransaction('readonly', (store) => {
                return store.get(videoId);
            }) as CacheEntry;

            if (!entry) {
                this.emitEvent('cache-miss', videoId, { url });
                return null;
            }

            // Verify URL hash matches (URL changed check)
            if (entry.urlHash !== urlHash) {
                console.log(`URL changed for video ${videoId}, removing old cache`);
                await this.removeVideo(videoId);
                this.emitEvent('cache-miss', videoId, { reason: 'url-changed', url });
                return null;
            }

            // Update last accessed time
            entry.lastAccessed = Date.now();
            await this.performTransaction('readwrite', (store) => {
                return store.put(entry);
            });

            this.emitEvent('cache-hit', videoId, { size: entry.size, url });
            console.log(`Video retrieved from cache: ${videoId}`);

            return entry.blobData;
        } catch (error) {
            this.emitEvent('cache-error', videoId, { error: error.message });
            console.error(`Failed to retrieve video ${videoId}:`, error);
            return null;
        }
    }

    /**
     * Remove specific video from cache
     */
    async removeVideo(videoId: string): Promise<boolean> {
        await this.ensureInitialized();

        try {
            await this.performTransaction('readwrite', (store) => {
                return store.delete(videoId);
            });

            console.log(`Video removed from cache: ${videoId}`);
            return true;
        } catch (error) {
            console.error(`Failed to remove video ${videoId}:`, error);
            return false;
        }
    }

    /**
     * Clear all cached videos
     */
    async clearCache(): Promise<boolean> {
        await this.ensureInitialized();

        try {
            await this.performTransaction('readwrite', (store) => {
                return store.clear();
            });

            this.emitEvent('cache-clear', 'all');
            console.log('All cached videos cleared');
            return true;
        } catch (error) {
            console.error('Failed to clear cache:', error);
            return false;
        }
    }

    /**
     * Get cache statistics
     */
    async getCacheStats(): Promise<CacheStats> {
        await this.ensureInitialized();

        try {
            const entries = await this.getAllEntries();

            const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);
            const totalVideos = entries.length;

            const cacheTimes = entries.map(entry => entry.cachedAt);
            const oldestCacheTime = Math.min(...cacheTimes);
            const newestCacheTime = Math.max(...cacheTimes);

            return {
                totalSize,
                totalVideos,
                oldestCacheTime: oldestCacheTime || 0,
                newestCacheTime: newestCacheTime || 0,
                hitRate: 0 // This would need to be tracked over time
            };
        } catch (error) {
            console.error('Failed to get cache stats:', error);
            return {
                totalSize: 0,
                totalVideos: 0,
                oldestCacheTime: 0,
                newestCacheTime: 0,
                hitRate: 0
            };
        }
    }

    /**
     * Check if video exists in cache and URL hasn't changed
     */
    async hasVideo(videoId: string, url: string): Promise<boolean> {
        await this.ensureInitialized();

        try {
            const urlHash = await this.hashUrl(url);

            const entry = await this.performTransaction('readonly', (store) => {
                return store.get(videoId);
            }) as CacheEntry;

            return entry !== undefined && entry.urlHash === urlHash;
        } catch (error) {
            console.error(`Failed to check video existence ${videoId}:`, error);
            return false;
        }
    }

    /**
     * Event listener management
     */
    addEventListener(type: CacheEventType, listener: (event: CacheEvent) => void): void {
        if (!this.eventListeners.has(type)) {
            this.eventListeners.set(type, new Set());
        }
        this.eventListeners.get(type)!.add(listener);
    }

    removeEventListener(type: CacheEventType, listener: (event: CacheEvent) => void): void {
        this.eventListeners.get(type)?.delete(listener);
    }

    /**
     * Private helper methods
     */
    private async ensureInitialized(): Promise<void> {
        if (!this.isInitialized) {
            await this.initialize();
        }
    }

    private async performTransaction<T>(
        mode: IDBTransactionMode,
        operation: (store: IDBObjectStore) => IDBRequest<T>
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction([this.config.storeName], mode);
            const store = transaction.objectStore(this.config.storeName);
            const request = operation(store);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    private async getAllEntries(): Promise<CacheEntry[]> {
        return this.performTransaction('readonly', (store) => {
            return store.getAll();
        });
    }

    private async getCurrentCacheSize(): Promise<number> {
        const entries = await this.getAllEntries();
        return entries.reduce((total, entry) => total + entry.size, 0);
    }

    private async evictOldEntries(neededSpace: number): Promise<void> {
        const entries = await this.getAllEntries();

        // Sort by last accessed time (oldest first)
        entries.sort((a, b) => a.lastAccessed - b.lastAccessed);

        let freedSpace = 0;
        const toRemove: string[] = [];

        for (const entry of entries) {
            toRemove.push(entry.videoId);
            freedSpace += entry.size;

            if (freedSpace >= neededSpace) break;
        }

        // Remove old entries
        for (const videoId of toRemove) {
            await this.removeVideo(videoId);
        }

        console.log(`Evicted ${toRemove.length} videos to free ${(freedSpace / 1024 / 1024).toFixed(2)}MB`);
    }

    private async cleanupOldEntries(): Promise<void> {
        const entries = await this.getAllEntries();
        const currentVersion = this.config.cacheVersion;

        // Remove entries with different version
        for (const entry of entries) {
            if (entry.version !== currentVersion) {
                await this.removeVideo(entry.videoId);
            }
        }

        // Check if we exceed max videos limit
        if (entries.length > this.config.maxVideos) {
            const excess = entries.length - this.config.maxVideos;
            entries.sort((a, b) => a.lastAccessed - b.lastAccessed);

            for (let i = 0; i < excess; i++) {
                await this.removeVideo(entries[i].videoId);
            }
        }
    }

    private async hashUrl(url: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(url);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    private initializeEventListeners(): void {
        Object.values(['cache-hit', 'cache-miss', 'cache-store', 'cache-clear', 'cache-error', 'cache-full'] as CacheEventType[])
            .forEach(type => {
                this.eventListeners.set(type, new Set());
            });
    }

    private emitEvent(type: CacheEventType, videoId: string, data?: any): void {
        const event: CacheEvent = {
            type,
            videoId,
            timestamp: Date.now(),
            data
        };

        this.eventListeners.get(type)?.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Error in cache event listener:', error);
            }
        });
    }
}

// Singleton instance
export const videoCacheService = new VideoCacheService();
export default videoCacheService;
