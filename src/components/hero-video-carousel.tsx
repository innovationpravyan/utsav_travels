'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {Database, Pause, Play, Volume2, VolumeX, Wifi, WifiOff} from 'lucide-react';
import {cn, getVideoCarouselTabs, MEDIA_CONFIG} from '@/utils/utils';
import {OptimizedMotionDiv, StaggerContainer} from '@/components/optimized-motion-div';
import {GlassCard} from '@/components/ui/glass-card';
import {useSafeWindow} from '@/utils/three-utils';
import {usePerformancePreference} from '@/hooks/use-mobile';
import {useVideoCache} from '@/hooks/use-video-cache';
import {performanceMonitor} from '@/utils/performance-monitor';

/**
 * Enhanced Hero Video Carousel with Smart Caching
 *
 * Features:
 * - Integrates with video preloading and caching system
 * - Uses cached videos when available, falls back to original URLs
 * - Shows cache status in video tabs (green = cached, blue = loading, white = not cached)
 * - Optimized video loading with progressive enhancement
 * - Automatic cache invalidation when URLs change
 * - Performance monitoring and error handling
 * - Support for both Google Drive and public video sources
 */

interface VideoCarouselTab {
    id: string;
    label: string;
    src: string;
    mp4: string;
    title: string;
    subtitle: string;
    description: string;
    thumbnail: string;
}

interface HeroVideoCarouselProps {
    height?: string;
    className?: string;
    autoPlay?: boolean;
}

interface CachedVideo {
    element: HTMLVideoElement;
    loaded: boolean;
    error: boolean;
    progress: number;
    fromCache: boolean;
    cacheStatus: 'cached' | 'loading' | 'not-cached' | 'error';
}

export function HeroVideoCarousel({
                                      height,
                                      className,
                                      autoPlay = true
                                  }: HeroVideoCarouselProps) {
    const [activeTab, setActiveTab] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [hasVideoError, setHasVideoError] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [userInteracted, setUserInteracted] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [currentVideoSource, setCurrentVideoSource] = useState<'cache' | 'network'>('cache');
    const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');

    // Video cache management
    const videoCache = useRef<Map<string, CachedVideo>>(new Map());
    const activeVideoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const preloadingRef = useRef<boolean>(false);
    const windowObj = useSafeWindow();
    const {shouldReduceEffects} = usePerformancePreference();
    const videoCacheHook = useVideoCache();

    // Access video carousel config from MEDIA_CONFIG
    const videoCarouselConfig = MEDIA_CONFIG.videoCarouselConfig;
    const tabs = getVideoCarouselTabs();
    const currentVideo = tabs[activeTab];

    // Get cache stats for debugging
    const cacheStats = videoCacheHook.getCacheStats();

    // Log cache information in development
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && cacheStats.count > 0) {
            console.log(`Video Cache Stats: ${cacheStats.count} videos, ${(cacheStats.size / 1024 / 1024).toFixed(2)}MB total`);
        }
    }, [cacheStats]);

    // Auto-switch to next video when current video ends
    const handleVideoEnded = useCallback(() => {
        setVideoProgress(100);
        performanceMonitor.recordUserInteraction('video-completed');

        if (autoPlay && !shouldReduceEffects && videoCarouselConfig.autoPlay) {
            setTimeout(() => {
                const nextIndex = (activeTab + 1) % tabs.length;
                setActiveTab(nextIndex);
                performanceMonitor.recordUserInteraction('auto-advance');
            }, 500);
        }
    }, [activeTab, tabs.length, autoPlay, shouldReduceEffects, videoCarouselConfig.autoPlay]);

    // Get video URL with cache preference
    const getVideoUrl = useCallback((video: VideoCarouselTab, quality: 'webm' | 'mp4' = 'mp4'): string => {
        // Try to get cached video first
        const cachedUrl = videoCacheHook.getCachedVideoUrl(video.id, quality);

        if (cachedUrl) {
            setCurrentVideoSource('cache');
            console.log(`Using cached video for ${video.id} (${quality})`);
            return cachedUrl;
        }

        // Fallback to original URL
        setCurrentVideoSource('network');
        const originalUrl = quality === 'mp4' ? video.mp4 : video.src;
        console.log(`Using network video for ${video.id} (${quality}): ${originalUrl}`);
        return originalUrl;
    }, [videoCacheHook]);

    // Get cache status for a video
    const getVideosCacheStatus = useCallback((videoId: string): 'cached' | 'loading' | 'not-cached' | 'error' => {
        const mp4Cached = videoCacheHook.isVideoCached(videoId, 'mp4');
        const webmCached = videoCacheHook.isVideoCached(videoId, 'webm');

        if (mp4Cached || webmCached) {
            return 'cached';
        }

        // Check if currently being processed
        const cachedVideo = videoCache.current.get(videoId);
        if (cachedVideo && !cachedVideo.loaded && !cachedVideo.error) {
            return 'loading';
        }

        if (cachedVideo && cachedVideo.error) {
            return 'error';
        }

        return 'not-cached';
    }, [videoCacheHook]);

    // Create and cache video element with cached sources
    const createVideoElement = useCallback((video: VideoCarouselTab): HTMLVideoElement => {
        const videoElement = document.createElement('video');
        videoElement.className = 'absolute inset-0 w-full h-full object-cover transition-opacity duration-800';
        videoElement.style.opacity = '0';
        videoElement.style.webkitTransform = 'translateZ(0)';
        videoElement.style.transform = 'translateZ(0)';
        videoElement.autoplay = false;
        videoElement.loop = false;
        videoElement.muted = true; // Always start muted for autoplay
        videoElement.playsInline = true;
        videoElement.preload = 'auto';
        videoElement.poster = video.thumbnail;

        // Try to use cached videos first, fallback to original URLs
        const mp4Url = getVideoUrl(video, 'mp4');
        const webmUrl = getVideoUrl(video, 'webm');

        // Add sources - prefer MP4 for compatibility
        if (mp4Url) {
            const mp4Source = document.createElement('source');
            mp4Source.src = mp4Url;
            mp4Source.type = 'video/mp4';
            videoElement.appendChild(mp4Source);
        }

        if (webmUrl && webmUrl !== mp4Url) {
            const webmSource = document.createElement('source');
            webmSource.src = webmUrl;
            webmSource.type = 'video/webm';
            videoElement.appendChild(webmSource);
        }

        // Performance monitoring
        performanceMonitor.startVideoLoad(video.id, mp4Url || webmUrl, 'mp4');

        return videoElement;
    }, [getVideoUrl]);

    // Setup video event listeners with cache awareness
    const setupVideoEventListeners = useCallback((videoElement: HTMLVideoElement, cachedVideo: CachedVideo, videoId: string) => {
        const handleLoadedData = () => {
            cachedVideo.loaded = true;
            cachedVideo.error = false;
            cachedVideo.cacheStatus = videoCacheHook.isVideoCached(videoId) ? 'cached' : 'not-cached';

            if (videoElement === activeVideoRef.current) {
                setIsVideoLoaded(true);
                setHasVideoError(false);
                setLoadingStatus('Video loaded successfully');

                // Performance monitoring
                const fromCache = currentVideoSource === 'cache';
                const fileSize = videoElement.videoWidth * videoElement.videoHeight * 0.1; // Estimate
                performanceMonitor.completeVideoLoad(videoId, fromCache, fileSize);

                // Auto-play on initial load
                if (isInitialLoad && autoPlay && !shouldReduceEffects) {
                    videoElement.play().then(() => {
                        setIsPlaying(true);
                        setIsInitialLoad(false);
                        performanceMonitor.recordUserInteraction('autoplay-start');
                    }).catch((error) => {
                        console.warn('Autoplay failed:', error);
                        // Try playing muted
                        videoElement.muted = true;
                        videoElement.play().then(() => {
                            setIsPlaying(true);
                            setIsInitialLoad(false);
                            performanceMonitor.recordUserInteraction('autoplay-muted');
                        }).catch(console.error);
                    });
                }
            }
        };

        const handleCanPlayThrough = () => {
            cachedVideo.loaded = true;
            cachedVideo.error = false;

            if (videoElement === activeVideoRef.current) {
                setIsVideoLoaded(true);
                setHasVideoError(false);
                setLoadingStatus('Ready to play');
                videoElement.style.opacity = '1';
            }
        };

        const handleError = (event: Event) => {
            cachedVideo.error = true;
            cachedVideo.loaded = false;
            cachedVideo.cacheStatus = 'error';

            console.error(`Video error for ${videoId}:`, event);

            if (videoElement === activeVideoRef.current) {
                setIsVideoLoaded(false);
                setHasVideoError(true);
                setLoadingStatus('Video load failed');

                // Performance monitoring
                performanceMonitor.completeVideoLoad(videoId, false, 0, 'Video load error');
            }

            // Try to fallback to network if cache failed
            if (currentVideoSource === 'cache') {
                console.log(`Cache failed for ${videoId}, trying network fallback`);
                setCurrentVideoSource('network');
                // Could implement automatic retry here
            }
        };

        const handleTimeUpdate = () => {
            if (videoElement === activeVideoRef.current && videoElement.duration > 0) {
                const progress = (videoElement.currentTime / videoElement.duration) * 100;
                cachedVideo.progress = progress;
                setVideoProgress(progress);
            }
        };

        const handleEnded = () => {
            if (videoElement === activeVideoRef.current) {
                handleVideoEnded();
            }
        };

        const handlePlay = () => {
            if (videoElement === activeVideoRef.current) {
                setIsPlaying(true);
            }
        };

        const handlePause = () => {
            if (videoElement === activeVideoRef.current) {
                setIsPlaying(false);
            }
        };

        const handleLoadStart = () => {
            if (videoElement === activeVideoRef.current) {
                setLoadingStatus('Starting video load...');
            }
        };

        const handleProgress = () => {
            if (videoElement === activeVideoRef.current && videoElement.buffered.length > 0) {
                const buffered = videoElement.buffered.end(videoElement.buffered.length - 1);
                const duration = videoElement.duration;
                if (duration > 0) {
                    const bufferPercent = (buffered / duration) * 100;
                    setLoadingStatus(`Buffered: ${Math.round(bufferPercent)}%`);
                }
            }
        };

        // Add event listeners
        videoElement.addEventListener('loadeddata', handleLoadedData);
        videoElement.addEventListener('canplaythrough', handleCanPlayThrough);
        videoElement.addEventListener('error', handleError);
        videoElement.addEventListener('timeupdate', handleTimeUpdate);
        videoElement.addEventListener('ended', handleEnded);
        videoElement.addEventListener('play', handlePlay);
        videoElement.addEventListener('pause', handlePause);
        videoElement.addEventListener('loadstart', handleLoadStart);
        videoElement.addEventListener('progress', handleProgress);

        // Cleanup function
        return () => {
            videoElement.removeEventListener('loadeddata', handleLoadedData);
            videoElement.removeEventListener('canplaythrough', handleCanPlayThrough);
            videoElement.removeEventListener('error', handleError);
            videoElement.removeEventListener('timeupdate', handleTimeUpdate);
            videoElement.removeEventListener('ended', handleEnded);
            videoElement.removeEventListener('play', handlePlay);
            videoElement.removeEventListener('pause', handlePause);
            videoElement.removeEventListener('loadstart', handleLoadStart);
            videoElement.removeEventListener('progress', handleProgress);
        };
    }, [autoPlay, shouldReduceEffects, isInitialLoad, handleVideoEnded, videoCacheHook, currentVideoSource]);

    // Initialize first video immediately
    useEffect(() => {
        if (!containerRef.current || tabs.length === 0) return;

        const firstVideo = tabs[0];
        const videoElement = createVideoElement(firstVideo);
        const cachedVideo: CachedVideo = {
            element: videoElement,
            loaded: false,
            error: false,
            progress: 0,
            fromCache: currentVideoSource === 'cache',
            cacheStatus: getVideosCacheStatus(firstVideo.id)
        };

        // Setup event listeners
        const cleanup = setupVideoEventListeners(videoElement, cachedVideo, firstVideo.id);

        // Add to cache and DOM
        videoCache.current.set(firstVideo.id, cachedVideo);
        containerRef.current.appendChild(videoElement);
        activeVideoRef.current = videoElement;

        // Start loading immediately
        videoElement.load();

        // Show video as soon as possible
        requestAnimationFrame(() => {
            videoElement.style.opacity = '1';
        });

        return () => {
            cleanup();
        };
    }, []); // Only run once on mount

    // Preload other videos after initial load
    useEffect(() => {
        if (!isVideoLoaded || preloadingRef.current || shouldReduceEffects) return;

        const preloadVideos = async () => {
            preloadingRef.current = true;

            for (let i = 1; i < tabs.length; i++) {
                const video = tabs[i];
                if (videoCache.current.has(video.id)) continue;

                try {
                    const videoElement = createVideoElement(video);
                    const cachedVideo: CachedVideo = {
                        element: videoElement,
                        loaded: false,
                        error: false,
                        progress: 0,
                        fromCache: currentVideoSource === 'cache',
                        cacheStatus: getVideosCacheStatus(video.id)
                    };

                    setupVideoEventListeners(videoElement, cachedVideo, video.id);
                    videoCache.current.set(video.id, cachedVideo);
                    videoElement.load();

                    // Small delay between preloads to avoid overwhelming the browser
                    await new Promise(resolve => setTimeout(resolve, 200));
                } catch (error) {
                    console.warn(`Failed to preload video ${video.id}:`, error);
                }
            }

            preloadingRef.current = false;
            console.log('Video preloading completed');
        };

        preloadVideos();
    }, [isVideoLoaded, tabs, createVideoElement, setupVideoEventListeners, shouldReduceEffects, getVideosCacheStatus]);

    // Switch video on tab change
    const switchToVideo = useCallback((videoId: string) => {
        if (!containerRef.current) return;

        let cachedVideo = videoCache.current.get(videoId);

        if (!cachedVideo) {
            // Create video if not cached
            const video = tabs.find(t => t.id === videoId);
            if (!video) return;

            const videoElement = createVideoElement(video);
            const newCachedVideo: CachedVideo = {
                element: videoElement,
                loaded: false,
                error: false,
                progress: 0,
                fromCache: currentVideoSource === 'cache',
                cacheStatus: getVideosCacheStatus(video.id)
            };

            setupVideoEventListeners(videoElement, newCachedVideo, video.id);
            videoCache.current.set(video.id, newCachedVideo);
            containerRef.current.appendChild(videoElement);
            videoElement.load();
            cachedVideo = newCachedVideo;
        }

        // Hide current video
        if (activeVideoRef.current && activeVideoRef.current !== cachedVideo.element) {
            activeVideoRef.current.style.opacity = '0';
            activeVideoRef.current.pause();
        }

        // Show new video
        activeVideoRef.current = cachedVideo.element;

        if (!containerRef.current.contains(cachedVideo.element)) {
            containerRef.current.appendChild(cachedVideo.element);
        }

        // Update states
        setIsVideoLoaded(cachedVideo.loaded);
        setHasVideoError(cachedVideo.error);
        setVideoProgress(cachedVideo.progress);
        setCurrentVideoSource(cachedVideo.fromCache ? 'cache' : 'network');

        // Show video with smooth transition
        requestAnimationFrame(() => {
            cachedVideo.element.style.opacity = '1';

            // Auto-play if enabled and loaded
            if (autoPlay && cachedVideo.loaded && !cachedVideo.error) {
                cachedVideo.element.muted = isMuted;
                cachedVideo.element.play().catch(console.warn);
            }
        });

        // Performance monitoring
        performanceMonitor.recordUserInteraction('video-switch', Date.now());
    }, [tabs, createVideoElement, setupVideoEventListeners, autoPlay, isMuted, getVideosCacheStatus]);

    // Handle tab change
    const handleTabChange = useCallback((tabIndex: number) => {
        setActiveTab(tabIndex);
        const newVideo = tabs[tabIndex];
        switchToVideo(newVideo.id);
        performanceMonitor.recordUserInteraction('tab-change');
    }, [tabs, switchToVideo]);

    // Update video when activeTab changes
    useEffect(() => {
        if (currentVideo && activeTab !== 0) {
            switchToVideo(currentVideo.id);
        }
    }, [activeTab, currentVideo, switchToVideo]);

    // Video control handlers
    const handleTogglePlay = useCallback(async () => {
        if (!activeVideoRef.current) return;

        try {
            if (isPlaying) {
                activeVideoRef.current.pause();
                performanceMonitor.recordUserInteraction('pause');
            } else {
                setUserInteracted(true);
                await activeVideoRef.current.play();
                performanceMonitor.recordUserInteraction('play');
            }
        } catch (error) {
            console.warn('Video play failed:', error);
            performanceMonitor.recordUserInteraction('play-failed');
        }
    }, [isPlaying]);

    const handleToggleMute = useCallback(() => {
        if (!activeVideoRef.current) return;

        const newMutedState = !isMuted;
        activeVideoRef.current.muted = newMutedState;
        activeVideoRef.current.volume = newMutedState ? 0 : 0.8;
        setIsMuted(newMutedState);
        performanceMonitor.recordUserInteraction(newMutedState ? 'mute' : 'unmute');
    }, [isMuted]);

    // Handle scroll for parallax effect
    useEffect(() => {
        if (!windowObj || shouldReduceEffects) return;

        let ticking = false;
        const updateScrollY = () => {
            setScrollY(windowObj.scrollY);
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollY);
                ticking = true;
            }
        };

        windowObj.addEventListener('scroll', onScroll, {passive: true});
        return () => windowObj.removeEventListener('scroll', onScroll);
    }, [windowObj, shouldReduceEffects]);

    // Handle user interaction for browsers that require it
    useEffect(() => {
        if (userInteracted || !isVideoLoaded) return;

        const handleUserInteraction = () => {
            setUserInteracted(true);

            if (activeVideoRef.current?.paused && !hasVideoError) {
                activeVideoRef.current.play().catch(console.warn);
            }
        };

        const events = ['click', 'touchstart', 'keydown'];
        events.forEach(event => {
            document.addEventListener(event, handleUserInteraction, {once: true});
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleUserInteraction);
            });
        };
    }, [userInteracted, isVideoLoaded, hasVideoError]);

    // Cache status update listener
    useEffect(() => {
        const handleCacheUpdate = (videoId: string) => {
            // Update cache status for the video
            const cachedVideo = videoCache.current.get(videoId);
            if (cachedVideo) {
                cachedVideo.cacheStatus = getVideosCacheStatus(videoId);
                cachedVideo.fromCache = videoCacheHook.isVideoCached(videoId);
            }
        };

        videoCacheHook.onCacheUpdate(handleCacheUpdate);
        return () => videoCacheHook.offCacheUpdate(handleCacheUpdate);
    }, [videoCacheHook, getVideosCacheStatus]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            videoCache.current.forEach(({element}) => {
                element.pause();
                element.remove();
            });
            videoCache.current.clear();
        };
    }, []);

    return (
        <section
            className={cn('hero-video-carousel relative w-full overflow-hidden touch-manipulation', height ? '' : 'h-[50vh] md:h-screen', className)}
            style={{
                ...(height && { height }),
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
            }}
        >
            {/* Video Container */}
            <div
                ref={containerRef}
                className="absolute inset-0 z-0"
            >
                {/* Fallback image while video loads */}
                {(!isVideoLoaded || hasVideoError) && currentVideo && (
                    <div
                        className={cn(
                            "absolute inset-0 bg-cover bg-center transition-opacity duration-300 z-10",
                            isVideoLoaded && !hasVideoError ? "opacity-0" : "opacity-100"
                        )}
                        style={{backgroundImage: `url(${currentVideo.thumbnail})`}}
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="text-center">
                                {!hasVideoError && (
                                    <>
                                        <div
                                            className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"/>
                                        <p className="text-white/80 text-sm mb-2">Loading video...</p>
                                        <p className="text-white/60 text-xs">{loadingStatus}</p>
                                        <div className="flex items-center justify-center gap-2 mt-2">
                                            {currentVideoSource === 'cache' ? (
                                                <>
                                                    <Database className="w-4 h-4 text-green-400"/>
                                                    <span className="text-green-400 text-xs">From Cache</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Wifi className="w-4 h-4 text-blue-400"/>
                                                    <span className="text-blue-400 text-xs">From Network</span>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                                {hasVideoError && (
                                    <>
                                        <WifiOff className="w-16 h-16 text-red-400 mx-auto mb-4"/>
                                        <p className="text-red-400 text-sm">Video load failed</p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                                        >
                                            Retry
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 z-20"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-20"/>
            </div>

            {/* Content */}
            <div
                className="relative z-30 h-full flex items-center justify-center pb-20 sm:pb-24 md:pb-32"
                style={{
                    transform: shouldReduceEffects ? 'none' : `translateY(${Math.min(scrollY * 0.3, 100)}px)`,
                    opacity: shouldReduceEffects ? 1 : Math.max(0.1, 1 - scrollY / 800)
                }}
            >
                <div className="text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <StaggerContainer staggerDelay={200}>
                        <OptimizedMotionDiv preset="slideUp" key={`title-${currentVideo.id}`}>
                            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                                {currentVideo.title.split(' ').map((word, index) => (
                                    <span
                                        key={`${currentVideo.id}-${index}`}
                                        className={cn(
                                            "inline-block mr-2 sm:mr-4 transition-all duration-300",
                                            index % 2 === 0
                                                ? "bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
                                                : "text-gradient-alt"
                                        )}
                                    >
                                        {word}
                                    </span>
                                ))}
                            </h1>
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="fadeIn" delay={300} key={`subtitle-${currentVideo.id}`}>
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary/90 font-light mb-4 sm:mb-6 tracking-wide">
                                {currentVideo.subtitle}
                            </p>
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="fadeIn" delay={500} key={`description-${currentVideo.id}`}>
                            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                                {currentVideo.description}
                            </p>
                        </OptimizedMotionDiv>

                        {/* Scroll indicator */}
                        <OptimizedMotionDiv preset="fadeIn" delay={800} className="mt-8 sm:mt-12 md:mt-16">
                            <GlassCard className="inline-flex flex-col items-center gap-2 px-3 py-2 sm:px-4 sm:py-3">
                                <span className="text-xs sm:text-sm font-light text-white/70">Scroll to explore</span>
                                <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-white/50 to-transparent relative">
                                    <div
                                        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-bounce"/>
                                </div>
                            </GlassCard>
                        </OptimizedMotionDiv>
                    </StaggerContainer>
                </div>
            </div>

            {/* Video Tabs */}
            {videoCarouselConfig.showTabs && (
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-40">
                    <OptimizedMotionDiv preset="slideUp" delay={1200}>
                        <div className="flex flex-col gap-2 sm:gap-3">
                            {tabs.map((tab, index) => {
                                const cacheStatus = getVideosCacheStatus(tab.id);

                                return (
                                    <GlassCard
                                        key={tab.id}
                                        className={cn(
                                            "px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 cursor-pointer transition-all duration-300 group relative overflow-hidden touch-manipulation",
                                            "hover:scale-105 active:scale-95 hover:bg-white/20",
                                            activeTab === index
                                                ? "bg-white/20 border-primary/50 shadow-lg shadow-primary/20"
                                                : "bg-white/10 hover:bg-white/15"
                                        )}
                                        onClick={() => handleTabChange(index)}
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className={cn(
                                                "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300",
                                                activeTab === index ? "bg-primary scale-125" :
                                                    cacheStatus === 'cached' ? "bg-green-400" :
                                                        cacheStatus === 'loading' ? "bg-blue-400 animate-pulse" :
                                                            cacheStatus === 'error' ? "bg-red-400" :
                                                                videoCache.current.has(tab.id) ? "bg-yellow-400" : "bg-white/50"
                                            )}/>

                                            <span className={cn(
                                                "text-xs sm:text-sm font-medium transition-colors duration-300",
                                                activeTab === index ? "text-white" : "text-white/80"
                                            )}>
                                                {tab.label}
                                            </span>

                                            {/* Cache status indicator */}
                                            <div className="flex items-center gap-1">
                                                {cacheStatus === 'cached' && (
                                                    <Database className="w-3 h-3 text-green-400" title="Cached"/>
                                                )}
                                                {cacheStatus === 'loading' && (
                                                    <Wifi className="w-3 h-3 text-blue-400 animate-pulse"
                                                          title="Loading"/>
                                                )}
                                                {cacheStatus === 'error' && (
                                                    <WifiOff className="w-3 h-3 text-red-400" title="Error"/>
                                                )}
                                                {cacheStatus === 'not-cached' && currentVideoSource === 'network' && (
                                                    <Wifi className="w-3 h-3 text-white/50" title="Network"/>
                                                )}
                                            </div>
                                        </div>

                                        {/* Video progress bar for active tab */}
                                        {activeTab === index && isVideoLoaded && (
                                            <div
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-300 ease-out"
                                                    style={{width: `${videoProgress}%`}}
                                                />
                                            </div>
                                        )}
                                    </GlassCard>
                                );
                            })}
                        </div>
                    </OptimizedMotionDiv>
                </div>
            )}

            {/* Video Controls */}
            {videoCarouselConfig.showControls && (
                <div
                    className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50 flex gap-2 sm:gap-3">
                    <OptimizedMotionDiv preset="scaleIn" delay={1000}>
                        <GlassCard
                            className="p-2 sm:p-3 cursor-pointer group hover:scale-110 active:scale-95 transition-all duration-200 touch-manipulation"
                            onClick={handleToggleMute}
                            aria-label={isMuted ? "Unmute video" : "Mute video"}
                        >
                            {isMuted ? (
                                <VolumeX
                                    className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover:text-primary transition-colors"/>
                            ) : (
                                <Volume2
                                    className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover:text-primary transition-colors"/>
                            )}
                        </GlassCard>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="scaleIn" delay={1100}>
                        <GlassCard
                            className="p-2 sm:p-3 cursor-pointer group hover:scale-110 active:scale-95 transition-all duration-200 touch-manipulation"
                            onClick={handleTogglePlay}
                            aria-label={isPlaying ? "Pause video" : "Play video"}
                        >
                            {isPlaying ? (
                                <Pause
                                    className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover:text-primary transition-colors"/>
                            ) : (
                                <Play
                                    className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover:text-primary transition-colors"/>
                            )}
                        </GlassCard>
                    </OptimizedMotionDiv>

                    {/* Cache status indicator */}
                    <OptimizedMotionDiv preset="scaleIn" delay={1200}>
                        <GlassCard className="p-2 sm:p-3">
                            {currentVideoSource === 'cache' ? (
                                <Database className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" title="Playing from cache"/>
                            ) : (
                                <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" title="Playing from network"/>
                            )}
                        </GlassCard>
                    </OptimizedMotionDiv>
                </div>
            )}

            {/* Video Progress Indicator */}
            {isVideoLoaded && videoProgress > 0 && (
                <div className="absolute top-0 left-0 right-0 z-40 h-1 sm:h-1.5 bg-white/10">
                    <div
                        className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-300 ease-out"
                        style={{width: `${videoProgress}%`}}
                    />
                </div>
            )}

            {/* Cache information overlay (development only) */}
            {process.env.NODE_ENV === 'development' && cacheStats.count > 0 && (
                <div className="absolute top-4 left-4 z-50 bg-black/70 text-white text-xs p-2 rounded">
                    <div>Cache: {cacheStats.count} videos</div>
                    <div>Size: {(cacheStats.size / 1024 / 1024).toFixed(1)}MB</div>
                    <div>Source: {currentVideoSource}</div>
                </div>
            )}

            {/* Autoplay notification for users */}
            {!isPlaying && isVideoLoaded && !userInteracted && (
                <div className="absolute top-4 right-4 z-50 bg-black/50 text-white text-xs p-2 rounded">
                    Click anywhere to play video
                </div>
            )}
        </section>
    );
}