// src/types/video-cache.ts

export interface CachedVideo {
    id: string;
    url: string;
    originalUrl: string;
    blob: Blob;
    metadata: VideoMetadata;
    cachedAt: number;
    lastAccessed: number;
    size: number;
}

export interface VideoMetadata {
    id: string;
    label: string;
    title: string;
    subtitle: string;
    description: string;
    thumbnail: string;
    duration?: number;
    format: 'webm' | 'mp4';
    quality: 'hd' | 'sd';
}

export interface CacheEntry {
    videoId: string;
    url: string;
    urlHash: string;
    blobData: Blob;
    metadata: VideoMetadata;
    cachedAt: number;
    lastAccessed: number;
    size: number;
    version: string;
}

export interface CacheStats {
    totalSize: number;
    totalVideos: number;
    oldestCacheTime: number;
    newestCacheTime: number;
    hitRate: number;
}

export interface VideoSource {
    id: string;
    type: 'public' | 'google-drive';
    originalUrl: string;
    directUrl?: string;
    quality: 'webm' | 'mp4';
}

export interface LoadingProgress {
    videoId: string;
    loaded: number;
    total: number;
    percentage: number;
    stage: 'fetching' | 'processing' | 'caching' | 'complete' | 'error';
    error?: string;
}

export interface CacheConfig {
    maxCacheSize: number; // in MB
    maxVideos: number;
    cacheVersion: string;
    dbName: string;
    storeName: string;
    indexName: string;
}

export interface PreloadResult {
    success: boolean;
    videoId: string;
    fromCache: boolean;
    blobUrl?: string;
    error?: string;
    size: number;
    loadTime: number;
}

export type CacheEventType =
    | 'cache-hit'
    | 'cache-miss'
    | 'cache-store'
    | 'cache-clear'
    | 'cache-error'
    | 'cache-full';

export interface CacheEvent {
    type: CacheEventType;
    videoId: string;
    timestamp: number;
    data?: any;
}

// Google Drive URL patterns
export interface GoogleDriveUrl {
    fileId: string;
    originalUrl: string;
    directUrl: string;
    isValid: boolean;
}

// Video preloader events
export type PreloadEventType =
    | 'start'
    | 'progress'
    | 'complete'
    | 'error'
    | 'cache-hit';

export interface PreloadEvent {
    type: PreloadEventType;
    videoId: string;
    progress?: LoadingProgress;
    result?: PreloadResult;
}

// Validation schemas
export const VIDEO_FORMATS = ['webm', 'mp4'] as const;
export const VIDEO_SOURCES = ['public', 'google-drive'] as const;
export const CACHE_STAGES = ['fetching', 'processing', 'caching', 'complete', 'error'] as const;

// Constants
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
    maxCacheSize: 500, // 500MB
    maxVideos: 20,
    cacheVersion: '1.0.0',
    dbName: 'utsav-video-cache',
    storeName: 'videos',
    indexName: 'url-index'
};

// Error types
export class VideoCacheError extends Error {
    constructor(
        message: string,
        public code: string,
        public videoId?: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'VideoCacheError';
    }
}

export class VideoPreloadError extends Error {
    constructor(
        message: string,
        public code: string,
        public videoId: string,
        public stage: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'VideoPreloadError';
    }
}
