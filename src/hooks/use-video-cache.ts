// src/hooks/use-video-cache.ts

import {useCallback, useEffect, useRef, useState} from 'react';
import {PreloadResult} from '@/types/video-cache';
import {videoCacheService} from '@/services/video-cache.service';
import {getOriginalVideoUrl, getVideoSourcesForPreload, mapCarouselVideoIdToCacheId} from '@/utils/video-source.utils';

interface CachedVideoInfo {
    videoId: string;
    blobUrl: string;
    fromCache: boolean;
    size: number;
    quality: 'webm' | 'mp4';
}

interface VideoCacheState {
    isInitialized: boolean;
    isLoading: boolean;
    cachedVideos: Map<string, CachedVideoInfo>;
    preloadResults: Map<string, PreloadResult>;
    error: string | null;
    totalCacheSize: number;
}

interface VideoCacheHookReturn {
    // State
    state: VideoCacheState;

    // Main functions
    getCachedVideoUrl: (carouselVideoId: string, quality?: 'webm' | 'mp4') => string | null;
    preloadVideo: (carouselVideoId: string, quality?: 'webm' | 'mp4') => Promise<string | null>;
    clearVideoCache: (carouselVideoId: string) => Promise<boolean>;
    refreshCache: () => Promise<void>;

    // Utility functions
    isVideoCached: (carouselVideoId: string, quality?: 'webm' | 'mp4') => boolean;
    getVideoInfo: (carouselVideoId: string, quality?: 'webm' | 'mp4') => CachedVideoInfo | null;
    getCacheStats: () => { count: number; size: number; hitRate: number };

    // Event handlers
    onCacheUpdate: (callback: (videoId: string, info: CachedVideoInfo) => void) => void;
    offCacheUpdate: (callback: (videoId: string, info: CachedVideoInfo) => void) => void;
}

/**
 * Custom hook for managing video cache in the carousel
 */
export function useVideoCache(): VideoCacheHookReturn {
    const [state, setState] = useState<VideoCacheState>({
        isInitialized: false,
        isLoading: false,
        cachedVideos: new Map(),
        preloadResults: new Map(),
        error: null,
        totalCacheSize: 0
    });

    const cacheUpdateCallbacks = useRef<Set<(videoId: string, info: CachedVideoInfo) => void>>(new Set());
    const blobUrlsRef = useRef<Map<string, string>>(new Map());

    /**
     * Initialize cache system
     */
    const initializeCache = useCallback(async () => {
        if (state.isInitialized) return;

        try {
            setState(prev => ({...prev, isLoading: true, error: null}));

            // Initialize cache service
            await videoCacheService.initialize();

            // Load existing cached videos
            await loadExistingCachedVideos();

            setState(prev => ({
                ...prev,
                isInitialized: true,
                isLoading: false
            }));

            console.log('Video cache initialized successfully');
        } catch (error) {
            console.error('Failed to initialize video cache:', error);
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to initialize cache',
                isLoading: false
            }));
        }
    }, [state.isInitialized]);

    /**
     * Load existing cached videos and create blob URLs
     */
    const loadExistingCachedVideos = useCallback(async () => {
        try {
            const {prioritySources, metadata} = getVideoSourcesForPreload();
            const newCachedVideos = new Map<string, CachedVideoInfo>();
            let totalSize = 0;

            for (const source of prioritySources) {
                const originalUrl = source.originalUrl;
                const cachedBlob = await videoCacheService.getVideo(source.id, originalUrl);

                if (cachedBlob) {
                    const blobUrl = URL.createObjectURL(cachedBlob);
                    blobUrlsRef.current.set(source.id, blobUrl);

                    // Map to carousel video ID
                    const carouselVideoId = source.id.replace(/_webm$|_mp4$/, '');

                    const videoInfo: CachedVideoInfo = {
                        videoId: source.id,
                        blobUrl,
                        fromCache: true,
                        size: cachedBlob.size,
                        quality: source.quality
                    };

                    newCachedVideos.set(source.id, videoInfo);
                    totalSize += cachedBlob.size;

                    console.log(`Loaded cached video: ${source.id} (${(cachedBlob.size / 1024 / 1024).toFixed(2)}MB)`);
                }
            }

            setState(prev => ({
                ...prev,
                cachedVideos: newCachedVideos,
                totalCacheSize: totalSize
            }));

        } catch (error) {
            console.error('Failed to load existing cached videos:', error);
        }
    }, []);

    /**
     * Get cached video URL for carousel
     */
    const getCachedVideoUrl = useCallback((
        carouselVideoId: string,
        quality: 'webm' | 'mp4' = 'mp4'
    ): string | null => {
        const cacheVideoId = mapCarouselVideoIdToCacheId(carouselVideoId, quality);
        const videoInfo = state.cachedVideos.get(cacheVideoId);
        return videoInfo?.blobUrl || null;
    }, [state.cachedVideos]);

    /**
     * Preload a specific video
     */
    const preloadVideo = useCallback(async (
        carouselVideoId: string,
        quality: 'webm' | 'mp4' = 'mp4'
    ): Promise<string | null> => {
        try {
            const cacheVideoId = mapCarouselVideoIdToCacheId(carouselVideoId, quality);

            // Check if already cached
            const existingUrl = getCachedVideoUrl(carouselVideoId, quality);
            if (existingUrl) {
                return existingUrl;
            }

            // Get original URL
            const originalUrl = getOriginalVideoUrl(carouselVideoId, quality);

            // Check cache service directly
            const cachedBlob = await videoCacheService.getVideo(cacheVideoId, originalUrl);
            if (cachedBlob) {
                const blobUrl = URL.createObjectURL(cachedBlob);
                blobUrlsRef.current.set(cacheVideoId, blobUrl);

                // Update state
                const videoInfo: CachedVideoInfo = {
                    videoId: cacheVideoId,
                    blobUrl,
                    fromCache: true,
                    size: cachedBlob.size,
                    quality
                };

                setState(prev => ({
                    ...prev,
                    cachedVideos: new Map(prev.cachedVideos.set(cacheVideoId, videoInfo)),
                    totalCacheSize: prev.totalCacheSize + cachedBlob.size
                }));

                // Notify callbacks
                cacheUpdateCallbacks.current.forEach(callback => {
                    callback(carouselVideoId, videoInfo);
                });

                return blobUrl;
            }

            // If not cached, this would typically be handled by the preloader service
            // during the initial loading phase
            console.warn(`Video ${carouselVideoId} not found in cache and preloading not supported in runtime`);
            return null;

        } catch (error) {
            console.error(`Failed to preload video ${carouselVideoId}:`, error);
            return null;
        }
    }, [getCachedVideoUrl]);

    /**
     * Clear specific video from cache
     */
    const clearVideoCache = useCallback(async (carouselVideoId: string): Promise<boolean> => {
        try {
            const webmId = mapCarouselVideoIdToCacheId(carouselVideoId, 'webm');
            const mp4Id = mapCarouselVideoIdToCacheId(carouselVideoId, 'mp4');

            // Clear from cache service
            const webmCleared = await videoCacheService.removeVideo(webmId);
            const mp4Cleared = await videoCacheService.removeVideo(mp4Id);

            // Revoke blob URLs
            const webmBlobUrl = blobUrlsRef.current.get(webmId);
            const mp4BlobUrl = blobUrlsRef.current.get(mp4Id);

            if (webmBlobUrl) {
                URL.revokeObjectURL(webmBlobUrl);
                blobUrlsRef.current.delete(webmId);
            }

            if (mp4BlobUrl) {
                URL.revokeObjectURL(mp4BlobUrl);
                blobUrlsRef.current.delete(mp4Id);
            }

            // Update state
            setState(prev => {
                const newCachedVideos = new Map(prev.cachedVideos);
                const webmInfo = newCachedVideos.get(webmId);
                const mp4Info = newCachedVideos.get(mp4Id);

                const removedSize = (webmInfo?.size || 0) + (mp4Info?.size || 0);

                newCachedVideos.delete(webmId);
                newCachedVideos.delete(mp4Id);

                return {
                    ...prev,
                    cachedVideos: newCachedVideos,
                    totalCacheSize: Math.max(0, prev.totalCacheSize - removedSize)
                };
            });

            console.log(`Cleared cache for video: ${carouselVideoId}`);
            return webmCleared || mp4Cleared;

        } catch (error) {
            console.error(`Failed to clear cache for video ${carouselVideoId}:`, error);
            return false;
        }
    }, []);

    /**
     * Refresh entire cache
     */
    const refreshCache = useCallback(async () => {
        try {
            setState(prev => ({...prev, isLoading: true, error: null}));

            // Revoke all existing blob URLs
            blobUrlsRef.current.forEach(blobUrl => {
                URL.revokeObjectURL(blobUrl);
            });
            blobUrlsRef.current.clear();

            // Reload cached videos
            await loadExistingCachedVideos();

            setState(prev => ({...prev, isLoading: false}));
            console.log('Video cache refreshed');

        } catch (error) {
            console.error('Failed to refresh cache:', error);
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to refresh cache',
                isLoading: false
            }));
        }
    }, [loadExistingCachedVideos]);

    /**
     * Check if video is cached
     */
    const isVideoCached = useCallback((
        carouselVideoId: string,
        quality: 'webm' | 'mp4' = 'mp4'
    ): boolean => {
        const cacheVideoId = mapCarouselVideoIdToCacheId(carouselVideoId, quality);
        return state.cachedVideos.has(cacheVideoId);
    }, [state.cachedVideos]);

    /**
     * Get video info
     */
    const getVideoInfo = useCallback((
        carouselVideoId: string,
        quality: 'webm' | 'mp4' = 'mp4'
    ): CachedVideoInfo | null => {
        const cacheVideoId = mapCarouselVideoIdToCacheId(carouselVideoId, quality);
        return state.cachedVideos.get(cacheVideoId) || null;
    }, [state.cachedVideos]);

    /**
     * Get cache statistics
     */
    const getCacheStats = useCallback(() => {
        const videos = Array.from(state.cachedVideos.values());
        const count = videos.length;
        const size = state.totalCacheSize;
        const hitRate = 0; // This would be calculated based on usage tracking

        return {count, size, hitRate};
    }, [state.cachedVideos, state.totalCacheSize]);

    /**
     * Event callback management
     */
    const onCacheUpdate = useCallback((
        callback: (videoId: string, info: CachedVideoInfo) => void
    ) => {
        cacheUpdateCallbacks.current.add(callback);
    }, []);

    const offCacheUpdate = useCallback((
        callback: (videoId: string, info: CachedVideoInfo) => void
    ) => {
        cacheUpdateCallbacks.current.delete(callback);
    }, []);

    /**
     * Initialize on mount
     */
    useEffect(() => {
        initializeCache();
    }, [initializeCache]);

    /**
     * Handle window unload - cleanup blob URLs
     */
    useEffect(() => {
        const handleUnload = () => {
            blobUrlsRef.current.forEach(blobUrl => {
                URL.revokeObjectURL(blobUrl);
            });
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            handleUnload(); // Cleanup on component unmount
        };
    }, []);

    /**
     * Update cached videos when preload results change
     */
    useEffect(() => {
        const updateFromPreloadResults = async () => {
            if (state.preloadResults.size === 0) return;

            const newCachedVideos = new Map(state.cachedVideos);
            let totalSizeChange = 0;

            for (const [videoId, result] of state.preloadResults) {
                if (result.success && result.blobUrl && !newCachedVideos.has(videoId)) {
                    // Determine quality from video ID
                    const quality: 'webm' | 'mp4' = videoId.includes('_webm') ? 'webm' : 'mp4';

                    const videoInfo: CachedVideoInfo = {
                        videoId,
                        blobUrl: result.blobUrl,
                        fromCache: result.fromCache,
                        size: result.size,
                        quality
                    };

                    newCachedVideos.set(videoId, videoInfo);
                    totalSizeChange += result.size;

                    // Store blob URL reference
                    blobUrlsRef.current.set(videoId, result.blobUrl);

                    // Notify callbacks
                    const carouselVideoId = videoId.replace(/_webm$|_mp4$/, '');
                    cacheUpdateCallbacks.current.forEach(callback => {
                        callback(carouselVideoId, videoInfo);
                    });
                }
            }

            if (totalSizeChange > 0) {
                setState(prev => ({
                    ...prev,
                    cachedVideos: newCachedVideos,
                    totalCacheSize: prev.totalCacheSize + totalSizeChange
                }));
            }
        };

        updateFromPreloadResults();
    }, [state.preloadResults, state.cachedVideos]);

    return {
        state,
        getCachedVideoUrl,
        preloadVideo,
        clearVideoCache,
        refreshCache,
        isVideoCached,
        getVideoInfo,
        getCacheStats,
        onCacheUpdate,
        offCacheUpdate
    };
}

export default useVideoCache;