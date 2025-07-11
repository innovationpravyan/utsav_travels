// src/utils/video-config.update.ts

/**
 * Enhanced Video Configuration for Caching System
 *
 * This file contains the updated video configuration that supports
 * both Google Drive and public video URLs with smart caching.
 */

// Updated MEDIA_CONFIG with Google Drive support
export const ENHANCED_MEDIA_CONFIG = {
    // Video carousel with mixed sources
    videoCarousel: {
        default: {
            id: 'default',
            label: 'Default',
            // Example: Google Drive video (you'll need to replace with actual URLs)
            src: 'https://drive.google.com/file/d/1NUvHHnsh0_64Dw77mJ7k1duWuXUO9srU/view?usp=drive_link',
            mp4: 'https://drive.google.com/uc?export=download&id=1NUvHHnsh0_64Dw77mJ7k1duWuXUO9srU',
            title: 'Discover Sacred India',
            subtitle: 'Journey Through Spiritual Heritage',
            description: 'Embark on transformative journeys through India\'s most sacred destinations',
            thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop&crop=center'
        },
        varanasi: {
            id: 'varanasi',
            label: 'Varanasi',
            // Example: Public video URL
            src: '/videos/varanasi-hero.webm',
            mp4: '/videos/varanasi-hero.mp4',
            title: 'Sacred Varanasi',
            subtitle: 'The Spiritual Capital of India',
            description: 'Experience the eternal city where spirituality flows like the sacred Ganges',
            thumbnail: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1920&h=1080&fit=crop&crop=center'
        },
        kedarnath: {
            id: 'kedarnath',
            label: 'Kedarnath',
            // Example: Another Google Drive video
            src: 'https://drive.google.com/file/d/EXAMPLE_KEDARNATH_WEBM_ID/view?usp=sharing',
            mp4: 'https://drive.google.com/uc?export=download&id=EXAMPLE_KEDARNATH_MP4_ID',
            title: 'Mystical Kedarnath',
            subtitle: 'Lord Shiva\'s Sacred Abode',
            description: 'Journey to the divine heights where earth meets heaven in eternal devotion',
            thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center'
        },
        rishikesh: {
            id: 'rishikesh',
            label: 'Rishikesh',
            // Example: CDN hosted video
            src: 'https://cdn.example.com/videos/rishikesh-hero.webm',
            mp4: 'https://cdn.example.com/videos/rishikesh-hero.mp4',
            title: 'Serene Rishikesh',
            subtitle: 'Yoga Capital of the World',
            description: 'Find inner peace in the foothills of the Himalayas where the Ganges flows pure',
            thumbnail: 'https://images.unsplash.com/photo-1532664189809-02133fee698d?w=1920&h=1080&fit=crop&crop=center'
        },
        ayodhya: {
            id: 'ayodhya',
            label: 'Ayodhya',
            // Example: Another public URL
            src: '/videos/ayodhya-hero.webm',
            mp4: '/videos/ayodhya-hero.mp4',
            title: 'Divine Ayodhya',
            subtitle: 'Birthplace of Lord Rama',
            description: 'Walk in the footsteps of divinity in the sacred birthplace of Lord Rama',
            thumbnail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop&crop=center'
        }
    },

    // Enhanced video carousel configuration
    videoCarouselConfig: {
        autoPlay: true,
        autoPlayInterval: 8000,
        loop: true,
        showControls: true,
        showTabs: true,
        tabPosition: 'bottom-left' as const,
        transitionDuration: 800,
        videoSettings: {
            muted: true,
            preload: 'metadata' as const,
            playsInline: true
        },
        // New caching options
        caching: {
            enabled: true,
            preloadAll: true,
            cacheStrategy: 'priority' as 'all' | 'priority' | 'lazy',
            maxCacheSize: 500, // MB
            maxConcurrentDownloads: 3,
            retryAttempts: 3,
            retryDelay: 1000
        },
        // Performance options
        performance: {
            enableProgressiveLoading: true,
            enableThumbnailFallback: true,
            enableErrorRecovery: true,
            loadTimeoutMs: 30000
        }
    }
} as const;

// Video source validation patterns
export const VIDEO_URL_PATTERNS = {
    googleDrive: [
        /drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/,
        /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9-_]+)/,
        /docs\.google\.com\/.*\/d\/([a-zA-Z0-9-_]+)/
    ],
    youtube: [
        /youtube\.com\/watch\?v=([a-zA-Z0-9-_]+)/,
        /youtu\.be\/([a-zA-Z0-9-_]+)/
    ],
    vimeo: [
        /vimeo\.com\/(\d+)/
    ],
    public: [
        /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i
    ]
} as const;

// Enhanced cache configuration
export const CACHE_CONFIGURATION = {
    // IndexedDB settings
    database: {
        name: 'utsav-video-cache',
        version: 2,
        storeName: 'videos',
        indexName: 'url-index'
    },

    // Cache limits
    limits: {
        maxSizeBytes: 500 * 1024 * 1024, // 500MB
        maxVideos: 20,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        cleanupThreshold: 0.9 // Clean when 90% full
    },

    // Preload settings
    preload: {
        enabled: true,
        strategy: 'priority' as 'all' | 'priority' | 'lazy',
        maxConcurrent: 3,
        timeoutMs: 30000,
        retryAttempts: 3,
        retryDelayMs: 1000
    },

    // Performance monitoring
    monitoring: {
        enabled: true,
        sampleRate: 1.0, // 100% sampling
        reportingInterval: 60000, // 1 minute
        maxMetrics: 1000
    }
} as const;

// Google Drive URL transformation utilities
export const GOOGLE_DRIVE_HELPERS = {
    /**
     * Extract file ID from various Google Drive URL formats
     */
    extractFileId(url: string): string | null {
        for (const pattern of VIDEO_URL_PATTERNS.googleDrive) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    },

    /**
     * Convert Google Drive share URL to direct download URL
     */
    toDirectUrl(url: string): string {
        const fileId = this.extractFileId(url);
        if (!fileId) {
            throw new Error(`Cannot extract file ID from Google Drive URL: ${url}`);
        }
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    },

    /**
     * Convert Google Drive share URL to streaming URL
     */
    toStreamUrl(url: string): string {
        const fileId = this.extractFileId(url);
        if (!fileId) {
            throw new Error(`Cannot extract file ID from Google Drive URL: ${url}`);
        }
        return `https://drive.google.com/file/d/${fileId}/preview`;
    },

    /**
     * Check if URL is a Google Drive URL
     */
    isGoogleDriveUrl(url: string): boolean {
        return VIDEO_URL_PATTERNS.googleDrive.some(pattern => pattern.test(url));
    }
} as const;

// Video quality detection
export const VIDEO_QUALITY_DETECTION = {
    /**
     * Detect video format from URL
     */
    detectFormat(url: string): 'webm' | 'mp4' | 'unknown' {
        if (url.toLowerCase().includes('.webm')) return 'webm';
        if (url.toLowerCase().includes('.mp4')) return 'mp4';
        return 'unknown';
    },

    /**
     * Prefer MP4 for better compatibility
     */
    getPreferredFormat(): 'mp4' | 'webm' {
        // Check browser support
        const video = document.createElement('video');
        const canPlayMp4 = video.canPlayType('video/mp4') !== '';
        const canPlayWebm = video.canPlayType('video/webm') !== '';

        // MP4 has better compatibility across browsers
        return canPlayMp4 ? 'mp4' : (canPlayWebm ? 'webm' : 'mp4');
    },

    /**
     * Check if browser supports format
     */
    supportsFormat(format: string): boolean {
        const video = document.createElement('video');
        return video.canPlayType(`video/${format}`) !== '';
    }
} as const;

// Environment-specific configuration
export const ENVIRONMENT_CONFIG = {
    development: {
        caching: {
            ...CACHE_CONFIGURATION,
            monitoring: {
                ...CACHE_CONFIGURATION.monitoring,
                enabled: true,
                reportingInterval: 10000 // More frequent in dev
            }
        },
        debugging: {
            logCacheHits: true,
            logCacheMisses: true,
            logErrors: true,
            showPerformanceMetrics: true
        }
    },

    production: {
        caching: {
            ...CACHE_CONFIGURATION,
            monitoring: {
                ...CACHE_CONFIGURATION.monitoring,
                enabled: true,
                sampleRate: 0.1 // 10% sampling in production
            }
        },
        debugging: {
            logCacheHits: false,
            logCacheMisses: false,
            logErrors: true,
            showPerformanceMetrics: false
        }
    }
} as const;

// Migration helpers for existing configurations
export const MIGRATION_HELPERS = {
    /**
     * Migrate old video config to new format
     */
    migrateVideoConfig(oldConfig: any) {
        return {
            ...oldConfig,
            caching: CACHE_CONFIGURATION,
            performance: ENHANCED_MEDIA_CONFIG.videoCarouselConfig.performance,
            sources: Object.entries(oldConfig.videoCarousel || {}).map(([key, video]: [string, any]) => ({
                id: key,
                type: GOOGLE_DRIVE_HELPERS.isGoogleDriveUrl(video.src || video.mp4) ? 'google-drive' : 'public',
                originalUrl: video.mp4 || video.src,
                quality: VIDEO_QUALITY_DETECTION.detectFormat(video.mp4 || video.src),
                metadata: {
                    label: video.label,
                    title: video.title,
                    subtitle: video.subtitle,
                    description: video.description,
                    thumbnail: video.thumbnail
                }
            }))
        };
    },

    /**
     * Validate video configuration
     */
    validateConfig(config: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!config.videoCarousel) {
            errors.push('videoCarousel is required');
        }

        if (config.videoCarousel) {
            Object.entries(config.videoCarousel).forEach(([key, video]: [string, any]) => {
                if (!video.src && !video.mp4) {
                    errors.push(`Video ${key} must have either src or mp4 URL`);
                }
                if (!video.title) {
                    errors.push(`Video ${key} must have a title`);
                }
                if (!video.thumbnail) {
                    errors.push(`Video ${key} must have a thumbnail`);
                }
            });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
} as const;

// Export everything for easy import
export default {
    ENHANCED_MEDIA_CONFIG,
    CACHE_CONFIGURATION,
    GOOGLE_DRIVE_HELPERS,
    VIDEO_QUALITY_DETECTION,
    ENVIRONMENT_CONFIG,
    MIGRATION_HELPERS,
    VIDEO_URL_PATTERNS
};