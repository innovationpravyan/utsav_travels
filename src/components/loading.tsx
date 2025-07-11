'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, MapPin, Calendar, Star, Plane, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { LoadingProgress, PreloadResult } from '@/types/video-cache';
import { videoPreloaderService } from '@/services/video-preloader.service';
import { getVideoSourcesForPreload } from '@/utils/video-source.utils';

/**
 * Enhanced Loading Component with Video Preloading
 *
 * Features:
 * - Video preloading and caching
 * - Real-time progress tracking
 * - Fallback handling
 * - Performance monitoring
 * - User feedback
 */

interface LoadingProps {
  message?: string;
  showProgress?: boolean;
  variant?: 'default' | 'minimal' | 'detailed';
  timeout?: number;
}

interface VideoLoadingState {
  videoId: string;
  label: string;
  progress: LoadingProgress;
  result?: PreloadResult;
  status: 'pending' | 'downloading' | 'processing' | 'caching' | 'complete' | 'error';
}

export default function Loading({
                                  message = "Preparing your spiritual journey...",
                                  showProgress = true,
                                  variant = 'default',
                                  timeout = 45000 // 45 seconds for video loading
                                }: LoadingProps = {}) {
  // Loading states
  const [overallProgress, setOverallProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('initializing');
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [videoStates, setVideoStates] = useState<Map<string, VideoLoadingState>>(new Map());
  const [isPreloadingComplete, setIsPreloadingComplete] = useState(false);
  const [preloadResults, setPreloadResults] = useState<Map<string, PreloadResult>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalVideos: 0,
    completedVideos: 0,
    cachedVideos: 0,
    downloadedVideos: 0,
    totalSize: 0,
    elapsedTime: 0
  });

  // Refs
  const startTimeRef = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();
  const preloadStartedRef = useRef(false);

  /**
   * Update video loading state
   */
  const updateVideoState = useCallback((
      videoId: string,
      updates: Partial<VideoLoadingState>
  ) => {
    setVideoStates(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(videoId) || {
        videoId,
        label: videoId,
        progress: {
          videoId,
          loaded: 0,
          total: 0,
          percentage: 0,
          stage: 'fetching'
        },
        status: 'pending'
      };

      newMap.set(videoId, { ...existing, ...updates });
      return newMap;
    });
  }, []);

  /**
   * Calculate overall progress from video states
   */
  const calculateOverallProgress = useCallback(() => {
    const states = Array.from(videoStates.values());
    if (states.length === 0) return 0;

    const totalProgress = states.reduce((sum, state) => {
      return sum + (state.progress?.percentage || 0);
    }, 0);

    return Math.round(totalProgress / states.length);
  }, [videoStates]);

  /**
   * Update statistics
   */
  const updateStats = useCallback(() => {
    const states = Array.from(videoStates.values());
    const results = Array.from(preloadResults.values());

    const completedVideos = states.filter(s => s.status === 'complete').length;
    const cachedVideos = results.filter(r => r.fromCache).length;
    const downloadedVideos = results.filter(r => !r.fromCache && r.success).length;
    const totalSize = results.reduce((sum, r) => sum + r.size, 0);

    setStats({
      totalVideos: states.length,
      completedVideos,
      cachedVideos,
      downloadedVideos,
      totalSize,
      elapsedTime: Date.now() - startTimeRef.current
    });
  }, [videoStates, preloadResults]);

  /**
   * Start video preloading
   */
  const startVideoPreloading = useCallback(async () => {
    if (preloadStartedRef.current) return;
    preloadStartedRef.current = true;

    try {
      setLoadingStage('preparing');
      setOverallProgress(5);

      // Get video sources
      const { prioritySources, metadata } = getVideoSourcesForPreload();

      if (prioritySources.length === 0) {
        console.log('No videos to preload, completing immediately');
        setIsPreloadingComplete(true);
        return;
      }

      console.log(`Starting preload of ${prioritySources.length} priority videos`);

      // Initialize video states
      prioritySources.forEach(source => {
        const meta = metadata.get(source.id);
        updateVideoState(source.id, {
          videoId: source.id,
          label: meta?.label || source.id,
          progress: {
            videoId: source.id,
            loaded: 0,
            total: 0,
            percentage: 0,
            stage: 'fetching'
          },
          status: 'pending'
        });
      });

      setLoadingStage('downloading');
      setOverallProgress(10);

      // Setup progress tracking
      const handleProgress = (videoId: string, progress: LoadingProgress) => {
        updateVideoState(videoId, {
          progress,
          status: progress.stage === 'complete' ? 'complete' :
              progress.stage === 'error' ? 'error' : 'downloading'
        });
      };

      // Start preloading
      const results = await videoPreloaderService.preloadVideos(
          prioritySources,
          metadata,
          handleProgress
      );

      setPreloadResults(results);
      setIsPreloadingComplete(true);
      setOverallProgress(100);
      setLoadingStage('complete');

      // Log cache statistics internally
      console.log('Video preloading completed:', results);

      const successCount = Array.from(results.values()).filter(r => r.success).length;
      const fromCacheCount = Array.from(results.values()).filter(r => r.fromCache).length;
      const totalSize = Array.from(results.values()).reduce((sum, r) => sum + r.size, 0);

      console.log(`Videos loaded: ${successCount}/${results.size} successful`);
      console.log(`Cache efficiency: ${fromCacheCount}/${successCount} from cache`);
      console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);

      console.log(`Video preloading completed: ${results.size} videos processed`);

    } catch (err) {
      console.error('Video preloading failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to preload videos');
      setLoadingStage('error');

      // Continue loading anyway - videos will fall back to direct URLs
      console.warn('Continuing with direct video URLs as fallback');
    }
  }, [updateVideoState]);

  /**
   * Initialize preloading on component mount
   */
  useEffect(() => {
    startVideoPreloading();

    // Setup timeout
    timeoutRef.current = setTimeout(() => {
      if (!isPreloadingComplete) {
        setHasTimedOut(true);
        setError('Loading timeout - videos are taking longer than expected');
      }
    }, timeout);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Cancel any ongoing downloads
      videoPreloaderService.cancelAllDownloads();
    };
  }, [startVideoPreloading, timeout, isPreloadingComplete]);

  /**
   * Update overall progress based on video states
   */
  useEffect(() => {
    const newProgress = calculateOverallProgress();
    setOverallProgress(newProgress);
    updateStats();
  }, [videoStates, calculateOverallProgress, updateStats]);

  /**
   * Auto-advance to next stage when preloading completes
   */
  useEffect(() => {
    if (isPreloadingComplete && !error) {
      setTimeout(() => {
        // This would typically navigate to the main app
        console.log('Video preloading complete, ready to proceed');
      }, 1000);
    }
  }, [isPreloadingComplete, error]);

  // Timeout fallback UI
  if (hasTimedOut && !isPreloadingComplete) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
          <div className="text-center z-10 px-4 max-w-md">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Taking longer than expected
            </h2>

            <p className="text-white/70 mb-6">
              Videos are loading in the background. You can continue or wait for better performance.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                  onClick={() => {
                    setHasTimedOut(false);
                    setIsPreloadingComplete(true);
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Continue Anyway
              </button>
              <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
    );
  }

  // Minimal loading variant
  if (variant === 'minimal') {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="text-foreground text-sm">{message}</span>
            {showProgress && (
                <span className="text-foreground/60 text-xs">({overallProgress}%)</span>
            )}
          </div>
        </div>
    );
  }

  // Main loading UI
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">

        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-pink-400/10 to-red-500/10 rounded-full blur-3xl animate-float animation-delay-2000" />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-2xl animate-float animation-delay-1000" />
        </div>

        {/* Main Content */}
        <div className="text-center z-10 px-4 max-w-lg">

          {/* Brand Logo */}
          <div className="mb-8 relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-2xl">
              {error ? (
                  <AlertCircle className="w-10 h-10 text-white" />
              ) : isPreloadingComplete ? (
                  <CheckCircle className="w-10 h-10 text-white" />
              ) : (
                  <Plane className="w-10 h-10 text-white transform rotate-45" />
              )}
            </div>

            {!error && !isPreloadingComplete && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-24 h-24 text-primary/50 animate-spin" strokeWidth={1} />
                </div>
            )}
          </div>

          {/* Loading Text */}
          <div className="space-y-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {error ? 'Loading Error' :
                  isPreloadingComplete ? 'Ready to Begin' :
                      loadingStage === 'initializing' ? 'Initializing' :
                          loadingStage === 'preparing' ? 'Preparing' :
                              loadingStage === 'downloading' ? 'Loading Videos' :
                                  loadingStage === 'complete' ? 'Complete' : 'Loading'}
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Spiritual Journey
            </span>
            </h2>

            <p className="text-white/70 text-lg max-w-md mx-auto">
              {error || message}
            </p>
          </div>

          {/* Progress Section */}
          {showProgress && !error && (
              <div className="mb-8 space-y-4">
                {/* Overall Progress Bar */}
                <div className="w-full max-w-sm mx-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60 text-sm">Overall Progress</span>
                    <span className="text-white/60 text-sm">{overallProgress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-size-200 animate-shimmer transition-all duration-300 ease-out"
                        style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>

                {/* Video Loading Details */}
                {variant === 'detailed' && videoStates.size > 0 && (
                    <div className="max-w-md mx-auto space-y-2">
                      <div className="text-white/60 text-sm mb-3">Video Loading Status:</div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {Array.from(videoStates.values()).map(state => (
                            <div key={state.videoId} className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-2 flex-1">
                                {state.status === 'complete' ? (
                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                ) : state.status === 'error' ? (
                                    <AlertCircle className="w-3 h-3 text-red-400" />
                                ) : (
                                    <Download className="w-3 h-3 text-primary animate-pulse" />
                                )}
                                <span className="text-white/70 truncate">{state.label}</span>
                              </div>
                              <span className="text-white/50">
                        {state.progress?.percentage || 0}%
                      </span>
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                {/* Statistics */}
                {stats.totalVideos > 0 && (
                    <div className="flex justify-center gap-4 text-xs text-white/60">
                      <span>Videos: {stats.completedVideos}/{stats.totalVideos}</span>
                      <span>Cached: {stats.cachedVideos}</span>
                      <span>Size: {(stats.totalSize / 1024 / 1024).toFixed(1)}MB</span>
                    </div>
                )}
              </div>
          )}

          {/* Loading Animation Dots */}
          {!error && !isPreloadingComplete && (
              <div className="mb-8 flex justify-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce animation-delay-100" />
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce animation-delay-200" />
              </div>
          )}

          {/* Features Preview */}
          {variant === 'detailed' && !error && (
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto opacity-60">
                <div className="text-center animate-pulse">
                  <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-white/50 text-xs">Planning</div>
                </div>
                <div className="text-center animate-pulse animation-delay-500">
                  <MapPin className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-white/50 text-xs">Destinations</div>
                </div>
                <div className="text-center animate-pulse animation-delay-1000">
                  <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-white/50 text-xs">Experiences</div>
                </div>
              </div>
          )}

          {/* Error Actions */}
          {error && (
              <div className="flex gap-3 justify-center">
                <button
                    onClick={() => {
                      setError(null);
                      setHasTimedOut(false);
                      preloadStartedRef.current = false;
                      startVideoPreloading();
                    }}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Retry
                </button>
                <button
                    onClick={() => {
                      setError(null);
                      setIsPreloadingComplete(true);
                    }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Skip Videos
                </button>
              </div>
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50 pointer-events-none" />
      </div>
  );
}

// Specialized loading components
export function PageLoading() {
  return <Loading message="Loading page content..." variant="minimal" showProgress={false} />;
}

export function DataLoading() {
  return <Loading message="Fetching latest information..." showProgress={false} variant="minimal" />;
}

export function FormLoading() {
  return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-foreground">Processing...</span>
        </div>
      </div>
  );
}

export function ComponentLoading({ className = "" }: { className?: string }) {
  return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
  );
}