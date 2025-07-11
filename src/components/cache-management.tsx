'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Database,
    Trash2,
    RefreshCw,
    Download,
    HardDrive,
    Clock,
    CheckCircle,
    AlertCircle,
    Settings,
    BarChart3
} from 'lucide-react';
import { useVideoCache } from '@/hooks/use-video-cache';
import { videoCacheService } from '@/services/video-cache.service';
import { CacheStats } from '@/types/video-cache';

interface CacheManagementProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

/**
 * Cache Management Component
 *
 * Provides a UI for managing video cache:
 * - View cache statistics
 * - Clear individual videos or entire cache
 * - Monitor cache performance
 * - Configure cache settings
 */
export function CacheManagement({ isOpen, onClose, className = '' }: CacheManagementProps) {
    const videoCache = useVideoCache();
    const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<'overview' | 'videos' | 'settings'>('overview');

    // Load cache statistics
    const loadCacheStats = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const stats = await videoCacheService.getCacheStats();
            setCacheStats(stats);
        } catch (err) {
            console.error('Failed to load cache stats:', err);
            setError(err instanceof Error ? err.message : 'Failed to load cache statistics');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Clear entire cache
    const handleClearAllCache = useCallback(async () => {
        if (!confirm('Are you sure you want to clear all cached videos? This will remove all downloaded content.')) {
            return;
        }

        try {
            setIsLoading(true);
            const success = await videoCacheService.clearCache();

            if (success) {
                await loadCacheStats();
                await videoCache.refreshCache();
                console.log('Cache cleared successfully');
            } else {
                setError('Failed to clear cache');
            }
        } catch (err) {
            console.error('Failed to clear cache:', err);
            setError(err instanceof Error ? err.message : 'Failed to clear cache');
        } finally {
            setIsLoading(false);
        }
    }, [loadCacheStats, videoCache]);

    // Clear specific video
    const handleClearVideo = useCallback(async (videoId: string) => {
        try {
            setIsLoading(true);
            const success = await videoCache.clearVideoCache(videoId);

            if (success) {
                await loadCacheStats();
                console.log(`Cleared cache for video: ${videoId}`);
            } else {
                setError(`Failed to clear cache for video: ${videoId}`);
            }
        } catch (err) {
            console.error(`Failed to clear video ${videoId}:`, err);
            setError(err instanceof Error ? err.message : 'Failed to clear video');
        } finally {
            setIsLoading(false);
        }
    }, [videoCache, loadCacheStats]);

    // Refresh cache
    const handleRefreshCache = useCallback(async () => {
        try {
            setIsLoading(true);
            await videoCache.refreshCache();
            await loadCacheStats();
            console.log('Cache refreshed successfully');
        } catch (err) {
            console.error('Failed to refresh cache:', err);
            setError(err instanceof Error ? err.message : 'Failed to refresh cache');
        } finally {
            setIsLoading(false);
        }
    }, [videoCache, loadCacheStats]);

    // Load stats on open
    useEffect(() => {
        if (isOpen) {
            loadCacheStats();
        }
    }, [isOpen, loadCacheStats]);

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${className}`}>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <Database className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Video Cache Management
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <span className="sr-only">Close</span>
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'videos', label: 'Videos', icon: Download },
                        { id: 'settings', label: 'Settings', icon: Settings }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                                selectedTab === tab.id
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                <span className="font-medium">Error</span>
                            </div>
                            <p className="mt-1 text-red-600 dark:text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Overview Tab */}
                    {selectedTab === 'overview' && (
                        <div className="space-y-6">

                            {/* Cache Statistics */}
                            {cacheStats && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <span className="font-medium text-blue-900 dark:text-blue-100">Storage Used</span>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                            {(cacheStats.totalSize / 1024 / 1024).toFixed(1)} MB
                                        </p>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">
                                            {cacheStats.totalVideos} videos cached
                                        </p>
                                    </div>

                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            <span className="font-medium text-green-900 dark:text-green-100">Cache Efficiency</span>
                                        </div>
                                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                            {cacheStats.hitRate > 0 ? `${(cacheStats.hitRate * 100).toFixed(1)}%` : 'N/A'}
                                        </p>
                                        <p className="text-sm text-green-600 dark:text-green-400">
                                            Hit rate
                                        </p>
                                    </div>

                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            <span className="font-medium text-purple-900 dark:text-purple-100">Last Updated</span>
                                        </div>
                                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                            {cacheStats.newestCacheTime > 0
                                                ? new Date(cacheStats.newestCacheTime).toLocaleDateString()
                                                : 'Never'
                                            }
                                        </p>
                                        <p className="text-sm text-purple-600 dark:text-purple-400">
                                            Most recent cache
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <button
                                        onClick={handleRefreshCache}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                        Refresh Cache
                                    </button>

                                    <button
                                        onClick={() => loadCacheStats()}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        Update Stats
                                    </button>

                                    <button
                                        onClick={handleClearAllCache}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Clear All
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Videos Tab */}
                    {selectedTab === 'videos' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cached Videos</h3>

                            {videoCache.state.cachedVideos.size === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No videos cached yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {Array.from(videoCache.state.cachedVideos.entries()).map(([videoId, info]) => (
                                        <div key={videoId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {videoId.replace(/_webm$|_mp4$/, '')}
                          </span>
                                                    <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded">
                            {info.quality.toUpperCase()}
                          </span>
                                                    {info.fromCache && (
                                                        <span className="px-2 py-1 text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded">
                              Cached
                            </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {(info.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleClearVideo(videoId.replace(/_webm$|_mp4$/, ''))}
                                                disabled={isLoading}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                title="Clear this video from cache"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings Tab */}
                    {selectedTab === 'settings' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cache Settings</h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Settings className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                        <span className="font-medium text-yellow-900 dark:text-yellow-100">
                      Cache Configuration
                    </span>
                                    </div>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                        Cache settings are currently managed automatically.
                                        Maximum cache size: 500MB, Maximum videos: 20
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Auto-Clear Policy</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Old videos are automatically removed when cache is full
                                        </p>
                                    </div>

                                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cache Persistence</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Videos remain cached until URLs change or manually cleared
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Video caching improves performance by storing videos locally
                    </div>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// Hook for managing cache management modal
export function useCacheManagement() {
    const [isOpen, setIsOpen] = useState(false);

    const openCacheManagement = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeCacheManagement = useCallback(() => {
        setIsOpen(false);
    }, []);

    return {
        isOpen,
        openCacheManagement,
        closeCacheManagement,
        CacheManagementModal: ({ className }: { className?: string }) => (
            <CacheManagement
                isOpen={isOpen}
                onClose={closeCacheManagement}
                className={className}
            />
        )
    };
}

export default CacheManagement;