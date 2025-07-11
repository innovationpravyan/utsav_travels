// src/services/index.ts

/**
 * Video Cache System - Main Exports
 *
 * This file provides easy access to all video caching functionality.
 * Import this in your components to access the complete video caching system.
 */

// Core services
export { videoCacheService } from './video-cache.service';
export { videoPreloaderService } from './video-preloader.service';

// Types
export type {
    CachedVideo,
    VideoMetadata,
    CacheEntry,
    CacheStats,
    VideoSource,
    LoadingProgress,
    PreloadResult,
    CacheConfig,
    CacheEvent,
    CacheEventType,
    PreloadEvent,
    PreloadEventType,
    GoogleDriveUrl
} from '@/types/video-cache';

// Error classes
export {
    VideoCacheError,
    VideoPreloadError,
    DEFAULT_CACHE_CONFIG
} from '@/types/video-cache';

// Utility functions
export {
    transformVideoConfigToSources,
    getVideoSourcesForPreload,
    getCachedVideoUrlForCarousel,
    mapCarouselVideoIdToCacheId,
    getOriginalVideoUrl,
    isGoogleDriveUrl,
    extractGoogleDriveFileId,
    validateVideoUrl,
    getFallbackVideoSources,
    createVideoSourceFromUrl,
    getVideoPreloadPreferences
} from '@/utils/video-source.utils';

// React hook
export { useVideoCache } from '@/hooks/use-video-cache';

/**
 * Quick setup for video caching in your app:
 *
 * 1. Import the hook: `import { useVideoCache } from '@/services';`
 * 2. Use in your component: `const { getCachedVideoUrl, isVideoCached } = useVideoCache();`
 * 3. The loading.tsx component handles initial preloading automatically
 * 4. Videos are cached persistently across sessions
 *
 * Example usage:
 * ```tsx
 * import { useVideoCache } from '@/services';
 *
 * function VideoPlayer({ videoId }: { videoId: string }) {
 *   const { getCachedVideoUrl, isVideoCached } = useVideoCache();
 *
 *   const videoUrl = getCachedVideoUrl(videoId) || `/videos/${videoId}.mp4`;
 *   const isCached = isVideoCached(videoId);
 *
 *   return (
 *     <div>
 *       <video src={videoUrl} />
 *       {isCached && <span>⚡ Cached</span>}
 *     </div>
 *   );
 * }
 * ```
 */

// Cache management utilities
export const videoCacheManager = {
    /**
     * Initialize the video cache system
     */
    async initialize() {
        await videoCacheService.initialize();
    },

    /**
     * Get cache statistics
     */
    async getStats() {
        return await videoCacheService.getCacheStats();
    },

    /**
     * Clear all cached videos
     */
    async clearAll() {
        return await videoCacheService.clearCache();
    },

    /**
     * Check if a video is cached
     */
    async isVideoCached(videoId: string, url: string) {
        return await videoCacheService.hasVideo(videoId, url);
    },

    /**
     * Preload videos from configuration
     */
    async preloadFromConfig() {
        const { prioritySources, metadata } = getVideoSourcesForPreload();
        return await videoPreloaderService.preloadVideos(prioritySources, metadata);
    }
};

// Default export for convenience
export default {
    cacheService: videoCacheService,
    preloaderService: videoPreloaderService,
    manager: videoCacheManager
};