// src/utils/performance-monitor.ts

import React from 'react';

/**
 * Performance Monitor for Video Caching System
 *
 * Tracks and analyzes performance metrics for video loading,
 * caching efficiency, and user experience optimization.
 */

interface PerformanceMetric {
    id: string;
    name: string;
    value: number;
    unit: string;
    timestamp: number;
    category: 'cache' | 'network' | 'user' | 'system';
    metadata?: Record<string, any>;
}

interface VideoLoadMetrics {
    videoId: string;
    loadStartTime: number;
    loadEndTime?: number;
    fromCache: boolean;
    fileSize: number;
    loadDuration?: number;
    networkSpeed?: number;
    cacheHit: boolean;
    quality: 'webm' | 'mp4';
    url: string;
    error?: string;
}

interface CacheMetrics {
    totalSize: number;
    videoCount: number;
    hitRate: number;
    missRate: number;
    evictionCount: number;
    storageUsage: number;
    averageLoadTime: number;
    lastCacheUpdate: number;
}

interface UserExperienceMetrics {
    timeToFirstVideo: number;
    totalLoadingTime: number;
    userInteractionDelay: number;
    videoPlaybackReady: number;
    errorCount: number;
    retryCount: number;
    skipCount: number;
}

class PerformanceMonitor {
    private metrics: Map<string, PerformanceMetric> = new Map();
    private videoMetrics: Map<string, VideoLoadMetrics> = new Map();
    private cacheMetrics: CacheMetrics | null = null;
    private uxMetrics: UserExperienceMetrics | null = null;
    private observers: Set<(metric: PerformanceMetric) => void> = new Set();
    private isEnabled: boolean = true;
    private startTime: number = performance.now();

    constructor() {
        this.initializeUXMetrics();
        this.setupPerformanceObserver();
    }

    /**
     * Initialize UX metrics tracking
     */
    private initializeUXMetrics(): void {
        this.uxMetrics = {
            timeToFirstVideo: 0,
            totalLoadingTime: 0,
            userInteractionDelay: 0,
            videoPlaybackReady: 0,
            errorCount: 0,
            retryCount: 0,
            skipCount: 0
        };
    }

    /**
     * Setup Performance Observer for browser metrics
     */
    private setupPerformanceObserver(): void {
        if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
            return;
        }

        try {
            // Observe navigation timing
            const navObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'navigation') {
                        this.recordMetric('page-load-time', entry.duration, 'ms', 'system', {
                            type: entry.type,
                            name: entry.name
                        });
                    }
                }
            });
            navObserver.observe({ entryTypes: ['navigation'] });

            // Observe resource timing for video loads
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name.includes('video') || entry.name.includes('.mp4') || entry.name.includes('.webm')) {
                        this.recordMetric('video-resource-load', entry.duration, 'ms', 'network', {
                            url: entry.name,
                            size: (entry as any).transferSize || 0,
                            cached: (entry as any).transferSize === 0
                        });
                    }
                }
            });
            resourceObserver.observe({ entryTypes: ['resource'] });

        } catch (error) {
            console.warn('Performance Observer setup failed:', error);
        }
    }

    /**
     * Record a performance metric
     */
    recordMetric(
        name: string,
        value: number,
        unit: string = '',
        category: PerformanceMetric['category'] = 'system',
        metadata?: Record<string, any>
    ): void {
        if (!this.isEnabled) return;

        const metric: PerformanceMetric = {
            id: `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name,
            value,
            unit,
            timestamp: performance.now(),
            category,
            metadata
        };

        this.metrics.set(metric.id, metric);
        this.notifyObservers(metric);

        // Clean up old metrics (keep last 1000)
        if (this.metrics.size > 1000) {
            const entries = Array.from(this.metrics.entries());
            const oldEntries = entries.slice(0, entries.length - 1000);
            oldEntries.forEach(([id]) => this.metrics.delete(id));
        }
    }

    /**
     * Start tracking video load
     */
    startVideoLoad(videoId: string, url: string, quality: 'webm' | 'mp4'): void {
        const loadMetrics: VideoLoadMetrics = {
            videoId,
            loadStartTime: performance.now(),
            fromCache: false,
            fileSize: 0,
            cacheHit: false,
            quality,
            url
        };

        this.videoMetrics.set(videoId, loadMetrics);
        this.recordMetric('video-load-start', loadMetrics.loadStartTime, 'ms', 'cache', {
            videoId,
            quality,
            url
        });
    }

    /**
     * Complete video load tracking
     */
    completeVideoLoad(
        videoId: string,
        fromCache: boolean,
        fileSize: number,
        error?: string
    ): void {
        const loadMetrics = this.videoMetrics.get(videoId);
        if (!loadMetrics) return;

        const endTime = performance.now();
        const loadDuration = endTime - loadMetrics.loadStartTime;
        const networkSpeed = fileSize > 0 ? (fileSize / (loadDuration / 1000)) : 0;

        const updatedMetrics: VideoLoadMetrics = {
            ...loadMetrics,
            loadEndTime: endTime,
            loadDuration,
            fromCache,
            fileSize,
            networkSpeed,
            cacheHit: fromCache,
            error
        };

        this.videoMetrics.set(videoId, updatedMetrics);

        // Record metrics
        this.recordMetric('video-load-duration', loadDuration, 'ms', 'cache', {
            videoId,
            fromCache,
            fileSize,
            networkSpeed,
            error
        });

        this.recordMetric('video-cache-hit', fromCache ? 1 : 0, 'boolean', 'cache', {
            videoId
        });

        if (fileSize > 0) {
            this.recordMetric('video-file-size', fileSize, 'bytes', 'network', {
                videoId,
                quality: loadMetrics.quality
            });
        }

        if (networkSpeed > 0) {
            this.recordMetric('network-speed', networkSpeed, 'bytes/sec', 'network', {
                videoId
            });
        }

        // Update UX metrics
        if (this.uxMetrics) {
            if (this.uxMetrics.timeToFirstVideo === 0) {
                this.uxMetrics.timeToFirstVideo = endTime - this.startTime;
                this.recordMetric('time-to-first-video', this.uxMetrics.timeToFirstVideo, 'ms', 'user');
            }

            if (error) {
                this.uxMetrics.errorCount++;
                this.recordMetric('video-error-count', this.uxMetrics.errorCount, 'count', 'user');
            }
        }
    }

    /**
     * Update cache metrics
     */
    updateCacheMetrics(metrics: Partial<CacheMetrics>): void {
        this.cacheMetrics = {
            ...this.cacheMetrics,
            ...metrics,
            lastCacheUpdate: performance.now()
        } as CacheMetrics;

        // Record individual cache metrics
        Object.entries(metrics).forEach(([key, value]) => {
            if (typeof value === 'number') {
                const unit = key.includes('Size') || key.includes('Usage') ? 'bytes' :
                    key.includes('Time') ? 'ms' :
                        key.includes('Rate') ? 'percent' : 'count';

                this.recordMetric(`cache-${key}`, value, unit, 'cache');
            }
        });
    }

    /**
     * Record user interaction
     */
    recordUserInteraction(action: string, delay?: number): void {
        this.recordMetric(`user-${action}`, delay || 0, 'ms', 'user', {
            action,
            timestamp: performance.now()
        });

        if (this.uxMetrics && action === 'retry') {
            this.uxMetrics.retryCount++;
        } else if (this.uxMetrics && action === 'skip') {
            this.uxMetrics.skipCount++;
        }
    }

    /**
     * Get performance summary
     */
    getPerformanceSummary(): {
        cacheEfficiency: number;
        averageLoadTime: number;
        networkUtilization: number;
        userSatisfaction: number;
        totalVideosLoaded: number;
        errorRate: number;
    } {
        const videoMetrics = Array.from(this.videoMetrics.values()).filter(m => m.loadDuration);
        const totalVideos = videoMetrics.length;

        if (totalVideos === 0) {
            return {
                cacheEfficiency: 0,
                averageLoadTime: 0,
                networkUtilization: 0,
                userSatisfaction: 0,
                totalVideosLoaded: 0,
                errorRate: 0
            };
        }

        const cachedVideos = videoMetrics.filter(m => m.fromCache).length;
        const errorVideos = videoMetrics.filter(m => m.error).length;
        const totalLoadTime = videoMetrics.reduce((sum, m) => sum + (m.loadDuration || 0), 0);
        const averageLoadTime = totalLoadTime / totalVideos;

        const cacheEfficiency = (cachedVideos / totalVideos) * 100;
        const errorRate = (errorVideos / totalVideos) * 100;

        // Calculate network utilization (lower is better for cache)
        const networkLoads = videoMetrics.filter(m => !m.fromCache).length;
        const networkUtilization = (networkLoads / totalVideos) * 100;

        // Calculate user satisfaction score (0-100)
        const baseScore = 100;
        const errorPenalty = errorRate * 2; // 2 points per % error rate
        const loadTimePenalty = Math.max(0, (averageLoadTime - 1000) / 100); // Penalty for > 1s load times
        const retryPenalty = (this.uxMetrics?.retryCount || 0) * 5; // 5 points per retry

        const userSatisfaction = Math.max(0, baseScore - errorPenalty - loadTimePenalty - retryPenalty);

        return {
            cacheEfficiency: Math.round(cacheEfficiency),
            averageLoadTime: Math.round(averageLoadTime),
            networkUtilization: Math.round(networkUtilization),
            userSatisfaction: Math.round(userSatisfaction),
            totalVideosLoaded: totalVideos,
            errorRate: Math.round(errorRate * 100) / 100
        };
    }

    /**
     * Get detailed metrics for a specific category
     */
    getMetricsByCategory(category: PerformanceMetric['category']): PerformanceMetric[] {
        return Array.from(this.metrics.values()).filter(m => m.category === category);
    }

    /**
     * Get video-specific metrics
     */
    getVideoMetrics(videoId?: string): VideoLoadMetrics[] {
        if (videoId) {
            const metric = this.videoMetrics.get(videoId);
            return metric ? [metric] : [];
        }
        return Array.from(this.videoMetrics.values());
    }

    /**
     * Export metrics for analysis
     */
    exportMetrics(): {
        summary: ReturnType<typeof this.getPerformanceSummary>;
        allMetrics: PerformanceMetric[];
        videoMetrics: VideoLoadMetrics[];
        cacheMetrics: CacheMetrics | null;
        uxMetrics: UserExperienceMetrics | null;
        timestamp: number;
    } {
        return {
            summary: this.getPerformanceSummary(),
            allMetrics: Array.from(this.metrics.values()),
            videoMetrics: Array.from(this.videoMetrics.values()),
            cacheMetrics: this.cacheMetrics,
            uxMetrics: this.uxMetrics,
            timestamp: Date.now()
        };
    }

    /**
     * Clear all metrics
     */
    clearMetrics(): void {
        this.metrics.clear();
        this.videoMetrics.clear();
        this.cacheMetrics = null;
        this.initializeUXMetrics();
        this.startTime = performance.now();
    }

    /**
     * Subscribe to metric updates
     */
    subscribe(observer: (metric: PerformanceMetric) => void): () => void {
        this.observers.add(observer);
        return () => this.observers.delete(observer);
    }

    /**
     * Enable or disable monitoring
     */
    setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
    }

    /**
     * Check if monitoring is enabled
     */
    isMonitoringEnabled(): boolean {
        return this.isEnabled;
    }

    /**
     * Generate performance report
     */
    generateReport(): string {
        const summary = this.getPerformanceSummary();
        const videoCount = this.videoMetrics.size;

        return `
Performance Report - ${new Date().toISOString()}
==============================================

Cache Performance:
- Cache Efficiency: ${summary.cacheEfficiency}%
- Average Load Time: ${summary.averageLoadTime}ms
- Network Utilization: ${summary.networkUtilization}%

User Experience:
- User Satisfaction Score: ${summary.userSatisfaction}/100
- Total Videos Loaded: ${summary.totalVideosLoaded}
- Error Rate: ${summary.errorRate}%
- Retry Count: ${this.uxMetrics?.retryCount || 0}
- Skip Count: ${this.uxMetrics?.skipCount || 0}

System Performance:
- Time to First Video: ${this.uxMetrics?.timeToFirstVideo || 0}ms
- Total Loading Time: ${this.uxMetrics?.totalLoadingTime || 0}ms
- Videos in Cache: ${videoCount}

Cache Statistics:
- Total Cache Size: ${this.cacheMetrics ? (this.cacheMetrics.totalSize / 1024 / 1024).toFixed(2) + 'MB' : 'N/A'}
- Video Count: ${this.cacheMetrics?.videoCount || 0}
- Hit Rate: ${this.cacheMetrics ? (this.cacheMetrics.hitRate * 100).toFixed(1) + '%' : 'N/A'}
`.trim();
    }

    /**
     * Notify observers of new metrics
     */
    private notifyObservers(metric: PerformanceMetric): void {
        this.observers.forEach(observer => {
            try {
                observer(metric);
            } catch (error) {
                console.error('Performance observer error:', error);
            }
        });
    }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor() {
    const [summary, setSummary] = React.useState(() => performanceMonitor.getPerformanceSummary());

    React.useEffect(() => {
        const updateSummary = () => setSummary(performanceMonitor.getPerformanceSummary());

        // Update every 5 seconds
        const interval = setInterval(updateSummary, 5000);

        // Subscribe to metric updates
        const unsubscribe = performanceMonitor.subscribe(updateSummary);

        return () => {
            clearInterval(interval);
            unsubscribe();
        };
    }, []);

    return {
        summary,
        monitor: performanceMonitor,
        startVideoLoad: performanceMonitor.startVideoLoad.bind(performanceMonitor),
        completeVideoLoad: performanceMonitor.completeVideoLoad.bind(performanceMonitor),
        recordUserInteraction: performanceMonitor.recordUserInteraction.bind(performanceMonitor),
        generateReport: () => performanceMonitor.generateReport(),
        exportMetrics: () => performanceMonitor.exportMetrics()
    };
}

export default performanceMonitor;