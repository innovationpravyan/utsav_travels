// src/utils/video-source.utils.ts

import { VideoSource, VideoMetadata } from '@/types/video-cache';
import { MEDIA_CONFIG, getVideoCarouselTabs } from '@/utils/utils';

/**
 * Transform video carousel config to video sources and metadata
 */
export function transformVideoConfigToSources(): {
    sources: VideoSource[];
    metadata: Map<string, VideoMetadata>;
} {
    const tabs = getVideoCarouselTabs();
    const sources: VideoSource[] = [];
    const metadata = new Map<string, VideoMetadata>();

    for (const tab of tabs) {
        // Determine if it's a Google Drive URL or public URL
        const isGoogleDrive = isGoogleDriveUrl(tab.src) || isGoogleDriveUrl(tab.mp4);

        // Create WebM source
        if (tab.src) {
            const webmSource: VideoSource = {
                id: `${tab.id}_webm`,
                type: isGoogleDrive ? 'google-drive' : 'public',
                originalUrl: tab.src,
                quality: 'webm'
            };
            sources.push(webmSource);

            // Create metadata for WebM
            const webmMetadata: VideoMetadata = {
                id: webmSource.id,
                label: `${tab.label} (WebM)`,
                title: tab.title,
                subtitle: tab.subtitle,
                description: tab.description,
                thumbnail: tab.thumbnail,
                format: 'webm',
                quality: 'hd'
            };
            metadata.set(webmSource.id, webmMetadata);
        }

        // Create MP4 source
        if (tab.mp4) {
            const mp4Source: VideoSource = {
                id: `${tab.id}_mp4`,
                type: isGoogleDrive ? 'google-drive' : 'public',
                originalUrl: tab.mp4,
                quality: 'mp4'
            };
            sources.push(mp4Source);

            // Create metadata for MP4
            const mp4Metadata: VideoMetadata = {
                id: mp4Source.id,
                label: `${tab.label} (MP4)`,
                title: tab.title,
                subtitle: tab.subtitle,
                description: tab.description,
                thumbnail: tab.thumbnail,
                format: 'mp4',
                quality: 'hd'
            };
            metadata.set(mp4Source.id, mp4Metadata);
        }
    }

    return { sources, metadata };
}

/**
 * Get video sources for preloading with priority
 */
export function getVideoSourcesForPreload(): {
    prioritySources: VideoSource[];
    allSources: VideoSource[];
    metadata: Map<string, VideoMetadata>;
} {
    const { sources, metadata } = transformVideoConfigToSources();

    // Prioritize MP4 over WebM for better compatibility
    const prioritySources = sources.filter(source => source.quality === 'mp4');

    // If no MP4 sources, fall back to WebM
    if (prioritySources.length === 0) {
        prioritySources.push(...sources.filter(source => source.quality === 'webm'));
    }

    return {
        prioritySources,
        allSources: sources,
        metadata
    };
}

/**
 * Get cached video URL for carousel
 */
export function getCachedVideoUrlForCarousel(videoId: string, quality: 'webm' | 'mp4' = 'mp4'): string {
    const cacheKey = `${videoId}_${quality}`;

    // This would be used by the carousel to get cached blob URLs
    // The actual blob URL would be managed by the preloader service
    return `blob:${window.location.origin}/${cacheKey}`;
}

/**
 * Map carousel video ID to cache video ID
 */
export function mapCarouselVideoIdToCacheId(carouselVideoId: string, quality: 'webm' | 'mp4' = 'mp4'): string {
    return `${carouselVideoId}_${quality}`;
}

/**
 * Get original video URL from carousel config
 */
export function getOriginalVideoUrl(videoId: string, quality: 'webm' | 'mp4' = 'mp4'): string {
    const tabs = getVideoCarouselTabs();
    const video = tabs.find(tab => tab.id === videoId);

    if (!video) {
        throw new Error(`Video not found: ${videoId}`);
    }

    return quality === 'mp4' ? video.mp4 : video.src;
}

/**
 * Check if URL is a Google Drive URL
 */
export function isGoogleDriveUrl(url: string): boolean {
    const googleDrivePatterns = [
        /drive\.google\.com/,
        /docs\.google\.com/,
        /googleapis\.com/
    ];

    return googleDrivePatterns.some(pattern => pattern.test(url));
}

/**
 * Extract Google Drive file ID from URL
 */
export function extractGoogleDriveFileId(url: string): string | null {
    const patterns = [
        /\/file\/d\/([a-zA-Z0-9-_]+)/, // /file/d/FILE_ID
        /id=([a-zA-Z0-9-_]+)/, // id=FILE_ID
        /folders\/([a-zA-Z0-9-_]+)/, // /folders/FOLDER_ID
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/**
 * Validate video source URL
 */
export function validateVideoUrl(url: string): { isValid: boolean; type: 'public' | 'google-drive'; errors: string[] } {
    const errors: string[] = [];
    let type: 'public' | 'google-drive' = 'public';

    // Check if URL is valid
    try {
        new URL(url);
    } catch {
        errors.push('Invalid URL format');
        return { isValid: false, type, errors };
    }

    // Check if it's a Google Drive URL
    if (isGoogleDriveUrl(url)) {
        type = 'google-drive';

        // Validate Google Drive file ID can be extracted
        const fileId = extractGoogleDriveFileId(url);
        if (!fileId) {
            errors.push('Cannot extract Google Drive file ID');
        }
    } else {
        // For public URLs, check if it looks like a video URL
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
        const hasVideoExtension = videoExtensions.some(ext =>
            url.toLowerCase().includes(ext)
        );

        if (!hasVideoExtension) {
            // This is just a warning, not an error
            console.warn(`URL doesn't appear to be a video file: ${url}`);
        }
    }

    return {
        isValid: errors.length === 0,
        type,
        errors
    };
}

/**
 * Get fallback video sources if primary fails
 */
export function getFallbackVideoSources(primaryVideoId: string): VideoSource[] {
    const { sources } = transformVideoConfigToSources();

    // Return other video sources as fallback
    return sources.filter(source =>
        !source.id.startsWith(primaryVideoId) &&
        source.quality === 'mp4' // Prefer MP4 for fallback
    );
}

/**
 * Create video source from custom URL
 */
export function createVideoSourceFromUrl(
    id: string,
    url: string,
    metadata: Partial<VideoMetadata> = {}
): { source: VideoSource; metadata: VideoMetadata } {
    const { isValid, type, errors } = validateVideoUrl(url);

    if (!isValid) {
        throw new Error(`Invalid video URL: ${errors.join(', ')}`);
    }

    // Determine format from URL
    const format: 'webm' | 'mp4' = url.toLowerCase().includes('.webm') ? 'webm' : 'mp4';

    const source: VideoSource = {
        id,
        type,
        originalUrl: url,
        quality: format
    };

    const videoMetadata: VideoMetadata = {
        id,
        label: metadata.label || 'Custom Video',
        title: metadata.title || 'Custom Video',
        subtitle: metadata.subtitle || 'User Provided',
        description: metadata.description || 'Custom video source',
        thumbnail: metadata.thumbnail || '/images/video-placeholder.jpg',
        format,
        quality: 'hd',
        ...metadata
    };

    return { source, metadata: videoMetadata };
}

/**
 * Get video preferences for preloading
 */
export function getVideoPreloadPreferences(): {
    maxConcurrentDownloads: number;
    preferredQuality: 'webm' | 'mp4';
    preloadStrategy: 'all' | 'priority' | 'lazy';
} {
    // Could be made configurable via user preferences or device capabilities
    const isSlowConnection = navigator.connection &&
        (navigator.connection as any).effectiveType === 'slow-2g' ||
        (navigator.connection as any).effectiveType === '2g';

    return {
        maxConcurrentDownloads: isSlowConnection ? 1 : 3,
        preferredQuality: 'mp4', // MP4 has better browser support
        preloadStrategy: isSlowConnection ? 'priority' : 'all'
    };
}