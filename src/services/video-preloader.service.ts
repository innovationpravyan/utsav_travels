// src/services/video-preloader.service.ts

import {
    VideoSource,
    LoadingProgress,
    PreloadResult,
    PreloadEvent,
    PreloadEventType,
    GoogleDriveUrl,
    VideoMetadata,
    VideoPreloadError
} from '@/types/video-cache';
import videoCacheService from './video-cache.service';

class VideoPreloaderService {
    private eventListeners: Map<PreloadEventType, Set<(event: PreloadEvent) => void>> = new Map();
    private activeDownloads: Map<string, AbortController> = new Map();
    private preloadQueue: VideoSource[] = [];
    private isPreloading = false;
    private progressCallbacks: Map<string, (progress: LoadingProgress) => void> = new Map();

    constructor() {
        this.initializeEventListeners();
    }

    /**
     * Preload multiple videos
     */
    async preloadVideos(
        videoSources: VideoSource[],
        videoMetadata: Map<string, VideoMetadata>,
        onProgress?: (videoId: string, progress: LoadingProgress) => void
    ): Promise<Map<string, PreloadResult>> {
        const results = new Map<string, PreloadResult>();

        console.log(`Starting preload of ${videoSources.length} videos`);

        // Initialize cache service
        await videoCacheService.initialize();

        for (const source of videoSources) {
            const metadata = videoMetadata.get(source.id);
            if (!metadata) {
                console.warn(`No metadata found for video ${source.id}`);
                continue;
            }

            if (onProgress) {
                this.progressCallbacks.set(source.id, onProgress);
            }

            try {
                const result = await this.preloadSingleVideo(source, metadata);
                results.set(source.id, result);

                this.emitEvent('complete', source.id, undefined, result);
            } catch (error) {
                const failedResult: PreloadResult = {
                    success: false,
                    videoId: source.id,
                    fromCache: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    size: 0,
                    loadTime: 0
                };

                results.set(source.id, failedResult);
                this.emitEvent('error', source.id, undefined, failedResult);
            }
        }

        console.log(`Preload completed: ${results.size} videos processed`);
        return results;
    }

    /**
     * Preload single video
     */
    async preloadSingleVideo(
        source: VideoSource,
        metadata: VideoMetadata
    ): Promise<PreloadResult> {
        const startTime = Date.now();
        const { id: videoId, originalUrl } = source;

        this.emitEvent('start', videoId);
        this.updateProgress(videoId, 0, 0, 'fetching');

        try {
            // Check cache first
            const cachedBlob = await videoCacheService.getVideo(videoId, originalUrl);

            if (cachedBlob) {
                const blobUrl = URL.createObjectURL(cachedBlob);
                const result: PreloadResult = {
                    success: true,
                    videoId,
                    fromCache: true,
                    blobUrl,
                    size: cachedBlob.size,
                    loadTime: Date.now() - startTime
                };

                this.emitEvent('cache-hit', videoId, undefined, result);
                this.updateProgress(videoId, 100, 100, 'complete');

                console.log(`Video ${videoId} loaded from cache (${(cachedBlob.size / 1024 / 1024).toFixed(2)}MB)`);
                return result;
            }

            // Download from network
            const directUrl = await this.getDirectVideoUrl(source);
            const blob = await this.downloadVideo(directUrl, videoId);

            this.updateProgress(videoId, 100, 100, 'caching');

            // Store in cache
            await videoCacheService.storeVideo(videoId, originalUrl, blob, metadata);

            const blobUrl = URL.createObjectURL(blob);
            const result: PreloadResult = {
                success: true,
                videoId,
                fromCache: false,
                blobUrl,
                size: blob.size,
                loadTime: Date.now() - startTime
            };

            this.updateProgress(videoId, 100, 100, 'complete');
            console.log(`Video ${videoId} downloaded and cached (${(blob.size / 1024 / 1024).toFixed(2)}MB)`);

            return result;

        } catch (error) {
            console.error(`Failed to preload video ${videoId}:`, error);

            throw new VideoPreloadError(
                `Failed to preload video ${videoId}`,
                'PRELOAD_FAILED',
                videoId,
                'download',
                error as Error
            );
        } finally {
            this.activeDownloads.delete(videoId);
            this.progressCallbacks.delete(videoId);
        }
    }

    /**
     * Get direct video URL (handles Google Drive transformation)
     */
    private async getDirectVideoUrl(source: VideoSource): Promise<string> {
        if (source.type === 'public') {
            return source.originalUrl;
        }

        if (source.type === 'google-drive') {
            return this.transformGoogleDriveUrl(source.originalUrl);
        }

        throw new Error(`Unsupported video source type: ${source.type}`);
    }

    /**
     * Transform Google Drive share URL to direct download URL
     */
    private transformGoogleDriveUrl(url: string): string {
        // Extract file ID from various Google Drive URL formats
        const patterns = [
            /\/file\/d\/([a-zA-Z0-9-_]+)/, // /file/d/FILE_ID
            /id=([a-zA-Z0-9-_]+)/, // id=FILE_ID
            /folders\/([a-zA-Z0-9-_]+)/, // /folders/FOLDER_ID
        ];

        let fileId: string | null = null;

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                fileId = match[1];
                break;
            }
        }

        if (!fileId) {
            throw new Error(`Cannot extract file ID from Google Drive URL: ${url}`);
        }

        // Transform to direct download URL
        const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        console.log(`Transformed Google Drive URL: ${url} -> ${directUrl}`);

        return directUrl;
    }

    /**
     * Download video with progress tracking
     */
    private async downloadVideo(url: string, videoId: string): Promise<Blob> {
        const abortController = new AbortController();
        this.activeDownloads.set(videoId, abortController);

        try {
            const response = await fetch(url, {
                signal: abortController.signal,
                headers: {
                    'Accept': 'video/webm,video/mp4,video/*',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentLength = response.headers.get('content-length');
            const total = contentLength ? parseInt(contentLength, 10) : 0;

            if (!response.body) {
                throw new Error('Response body is null');
            }

            const reader = response.body.getReader();
            const chunks: Uint8Array[] = [];
            let loaded = 0;

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                chunks.push(value);
                loaded += value.length;

                // Update progress
                if (total > 0) {
                    this.updateProgress(videoId, loaded, total, 'fetching');
                }
            }

            this.updateProgress(videoId, loaded, loaded, 'processing');

            // Combine chunks into blob
            const blob = new Blob(chunks, {
                type: response.headers.get('content-type') || 'video/mp4'
            });

            return blob;

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Download was cancelled');
            }
            throw error;
        }
    }

    /**
     * Cancel specific video download
     */
    cancelDownload(videoId: string): boolean {
        const controller = this.activeDownloads.get(videoId);
        if (controller) {
            controller.abort();
            this.activeDownloads.delete(videoId);
            console.log(`Cancelled download for video ${videoId}`);
            return true;
        }
        return false;
    }

    /**
     * Cancel all active downloads
     */
    cancelAllDownloads(): void {
        for (const [videoId, controller] of this.activeDownloads) {
            controller.abort();
            console.log(`Cancelled download for video ${videoId}`);
        }
        this.activeDownloads.clear();
    }

    /**
     * Get cached video blob URL
     */
    async getCachedVideoUrl(videoId: string, originalUrl: string): Promise<string | null> {
        try {
            await videoCacheService.initialize();
            const blob = await videoCacheService.getVideo(videoId, originalUrl);
            return blob ? URL.createObjectURL(blob) : null;
        } catch (error) {
            console.error(`Failed to get cached video URL for ${videoId}:`, error);
            return null;
        }
    }

    /**
     * Check if video is cached
     */
    async isVideoCached(videoId: string, originalUrl: string): Promise<boolean> {
        try {
            await videoCacheService.initialize();
            return await videoCacheService.hasVideo(videoId, originalUrl);
        } catch (error) {
            console.error(`Failed to check cache for video ${videoId}:`, error);
            return false;
        }
    }

    /**
     * Clear specific video from cache
     */
    async clearVideoFromCache(videoId: string): Promise<boolean> {
        try {
            await videoCacheService.initialize();
            return await videoCacheService.removeVideo(videoId);
        } catch (error) {
            console.error(`Failed to clear video ${videoId} from cache:`, error);
            return false;
        }
    }

    /**
     * Get overall preload progress
     */
    getOverallProgress(videoIds: string[]): { completed: number; total: number; percentage: number } {
        // This would track progress across multiple videos
        // Implementation depends on how you want to track overall progress
        return {
            completed: 0,
            total: videoIds.length,
            percentage: 0
        };
    }

    /**
     * Event listener management
     */
    addEventListener(type: PreloadEventType, listener: (event: PreloadEvent) => void): void {
        if (!this.eventListeners.has(type)) {
            this.eventListeners.set(type, new Set());
        }
        this.eventListeners.get(type)!.add(listener);
    }

    removeEventListener(type: PreloadEventType, listener: (event: PreloadEvent) => void): void {
        this.eventListeners.get(type)?.delete(listener);
    }

    /**
     * Private helper methods
     */
    private updateProgress(
        videoId: string,
        loaded: number,
        total: number,
        stage: LoadingProgress['stage'],
        error?: string
    ): void {
        const progress: LoadingProgress = {
            videoId,
            loaded,
            total,
            percentage: total > 0 ? Math.round((loaded / total) * 100) : 0,
            stage,
            error
        };

        const callback = this.progressCallbacks.get(videoId);
        if (callback) {
            callback(progress);
        }

        this.emitEvent('progress', videoId, progress);
    }

    private initializeEventListeners(): void {
        (['start', 'progress', 'complete', 'error', 'cache-hit'] as PreloadEventType[])
            .forEach(type => {
                this.eventListeners.set(type, new Set());
            });
    }

    private emitEvent(
        type: PreloadEventType,
        videoId: string,
        progress?: LoadingProgress,
        result?: PreloadResult
    ): void {
        const event: PreloadEvent = {
            type,
            videoId,
            progress,
            result
        };

        this.eventListeners.get(type)?.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Error in preload event listener:', error);
            }
        });
    }
}

// Singleton instance
export const videoPreloaderService = new VideoPreloaderService();
export default videoPreloaderService;