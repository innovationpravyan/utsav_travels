'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/utils/utils';
import { OptimizedMotionDiv, StaggerContainer } from '@/components/optimized-motion-div';
import { GlassCard } from '@/components/ui/glass-card';
import { useSafeWindow } from '@/utils/three-utils';
import { usePerformancePreference } from '@/hooks/use-mobile';
import {
    MEDIA_CONFIG,
    getVideoCarouselTabs,
    getVideoSource
} from '@/utils/utils';

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
}

export function HeroVideoCarousel({
                                      height = '100vh',
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
    const [sessionMuteState, setSessionMuteState] = useState(true);
    const [videoProgress, setVideoProgress] = useState(0);
    const [preloadingProgress, setPreloadingProgress] = useState(0);
    const [attemptedAutoPlay, setAttemptedAutoPlay] = useState(false);

    // Video cache management
    const videoCache = useRef<Map<string, CachedVideo>>(new Map());
    const activeVideoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const preloadingRef = useRef<boolean>(false);
    const windowObj = useSafeWindow();
    const { shouldReduceEffects } = usePerformancePreference();

    // Access video carousel config from MEDIA_CONFIG
    const videoCarouselConfig = MEDIA_CONFIG.videoCarouselConfig;
    const tabs = getVideoCarouselTabs();
    const currentVideo = tabs[activeTab];

    // Create and cache video element
    const createVideoElement = useCallback((video: VideoCarouselTab): HTMLVideoElement => {
        const videoElement = document.createElement('video');
        videoElement.className = 'absolute inset-0 w-full h-full object-cover transition-opacity duration-800 opacity-0';
        videoElement.style.webkitTransform = 'translateZ(0)';
        videoElement.style.transform = 'translateZ(0)';
        videoElement.autoplay = false;
        videoElement.loop = false;
        videoElement.muted = sessionMuteState;
        videoElement.playsInline = videoCarouselConfig.videoSettings.playsInline;
        videoElement.preload = shouldReduceEffects ? 'none' : 'auto';
        videoElement.poster = video.thumbnail;

        // Add sources
        const webmSource = document.createElement('source');
        webmSource.src = getVideoSource(video.id as any, 'webm');
        webmSource.type = 'video/webm';
        videoElement.appendChild(webmSource);

        const mp4Source = document.createElement('source');
        mp4Source.src = getVideoSource(video.id as any, 'mp4');
        mp4Source.type = 'video/mp4';
        videoElement.appendChild(mp4Source);

        return videoElement;
    }, [sessionMuteState, shouldReduceEffects, videoCarouselConfig.videoSettings.playsInline]);

    // Preload videos in background
    const preloadVideos = useCallback(async () => {
        if (preloadingRef.current || shouldReduceEffects) return;
        preloadingRef.current = true;

        const preloadQueue = [];

        // Priority order: current, next, previous, then rest
        const currentIndex = activeTab;
        const nextIndex = (currentIndex + 1) % tabs.length;
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;

        // Add current video first
        if (!videoCache.current.has(currentVideo.id)) {
            preloadQueue.push(currentVideo);
        }

        // Add next and previous videos
        if (!videoCache.current.has(tabs[nextIndex].id)) {
            preloadQueue.push(tabs[nextIndex]);
        }
        if (!videoCache.current.has(tabs[prevIndex].id)) {
            preloadQueue.push(tabs[prevIndex]);
        }

        // Add remaining videos
        tabs.forEach(tab => {
            if (!videoCache.current.has(tab.id) && !preloadQueue.includes(tab)) {
                preloadQueue.push(tab);
            }
        });

        let loadedCount = 0;
        const totalToLoad = preloadQueue.length;

        for (const video of preloadQueue) {
            if (videoCache.current.has(video.id)) continue;

            try {
                const videoElement = createVideoElement(video);

                const cachedVideo: CachedVideo = {
                    element: videoElement,
                    loaded: false,
                    error: false,
                    progress: 0
                };

                videoCache.current.set(video.id, cachedVideo);

                // Set up event listeners
                videoElement.addEventListener('loadeddata', () => {
                    cachedVideo.loaded = true;
                    cachedVideo.error = false;
                    loadedCount++;
                    setPreloadingProgress((loadedCount / totalToLoad) * 100);

                    // Update state if this is the current video
                    if (videoElement === activeVideoRef.current) {
                        setIsVideoLoaded(true);
                        setHasVideoError(false);
                    }
                });

                videoElement.addEventListener('canplaythrough', () => {
                    cachedVideo.loaded = true;
                    cachedVideo.error = false;

                    // Update state if this is the current video
                    if (videoElement === activeVideoRef.current) {
                        setIsVideoLoaded(true);
                        setHasVideoError(false);
                    }

                    // Auto-play if this is the current video and auto-play is enabled
                    if (videoElement === activeVideoRef.current && autoPlay && !shouldReduceEffects && videoCarouselConfig.autoPlay) {
                        videoElement.muted = sessionMuteState;
                        videoElement.play().then(() => {
                            setAttemptedAutoPlay(true);
                        }).catch(console.warn);
                    }
                });

                videoElement.addEventListener('error', () => {
                    cachedVideo.error = true;
                    cachedVideo.loaded = false;
                    loadedCount++;
                    setPreloadingProgress((loadedCount / totalToLoad) * 100);

                    // Update state if this is the current video
                    if (videoElement === activeVideoRef.current) {
                        setIsVideoLoaded(false);
                        setHasVideoError(true);
                    }
                });

                videoElement.addEventListener('timeupdate', () => {
                    if (videoElement === activeVideoRef.current) {
                        const progress = videoElement.duration > 0
                            ? (videoElement.currentTime / videoElement.duration) * 100
                            : 0;
                        cachedVideo.progress = progress;
                        setVideoProgress(progress);
                    }
                });

                videoElement.addEventListener('ended', () => {
                    if (videoElement === activeVideoRef.current) {
                        handleVideoEnded();
                    }
                });

                videoElement.addEventListener('play', () => {
                    if (videoElement === activeVideoRef.current) {
                        setIsPlaying(true);
                    }
                });

                videoElement.addEventListener('pause', () => {
                    if (videoElement === activeVideoRef.current) {
                        setIsPlaying(false);
                    }
                });

                // Start loading
                videoElement.load();

                // Small delay to prevent overwhelming the browser
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.warn(`Failed to preload video ${video.id}:`, error);
                loadedCount++;
                setPreloadingProgress((loadedCount / totalToLoad) * 100);
            }
        }

        preloadingRef.current = false;
        setPreloadingProgress(100);
    }, [activeTab, tabs, currentVideo.id, createVideoElement, shouldReduceEffects]);

    // Switch to cached video
    const switchToVideo = useCallback((videoId: string) => {
        if (!containerRef.current) return;

        const cachedVideo = videoCache.current.get(videoId);
        if (!cachedVideo) return;

        // Hide current video
        if (activeVideoRef.current) {
            activeVideoRef.current.style.opacity = '0';
            activeVideoRef.current.pause();
        }

        // Show new video
        const newVideoElement = cachedVideo.element;
        activeVideoRef.current = newVideoElement;

        // Ensure video is in container
        if (!containerRef.current.contains(newVideoElement)) {
            containerRef.current.appendChild(newVideoElement);
        }

        // Apply current session settings
        newVideoElement.muted = sessionMuteState;
        newVideoElement.volume = sessionMuteState ? 0 : 0.8;

        // Update states
        setIsVideoLoaded(cachedVideo.loaded);
        setHasVideoError(cachedVideo.error);
        setVideoProgress(cachedVideo.progress);
        setIsMuted(sessionMuteState);

        // Show video with smooth transition
        requestAnimationFrame(() => {
            newVideoElement.style.opacity = cachedVideo.loaded ? '1' : '0';

            // Auto-play if enabled and loaded
            if (autoPlay && cachedVideo.loaded && !cachedVideo.error && !shouldReduceEffects && videoCarouselConfig.autoPlay) {
                newVideoElement.muted = sessionMuteState;
                newVideoElement.volume = sessionMuteState ? 0 : 0.8;
                newVideoElement.play().then(() => {
                    setAttemptedAutoPlay(true);
                }).catch(console.warn);
            }
        });

    }, [sessionMuteState, autoPlay]);

    // Handle scroll for parallax effect
    useEffect(() => {
        if (!windowObj) return;

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

        windowObj.addEventListener('scroll', onScroll, { passive: true });
        return () => windowObj.removeEventListener('scroll', onScroll);
    }, [windowObj]);

    // Initialize video cache and start preloading
    useEffect(() => {
        const initializeFirstVideo = async () => {
            // Get first video from tabs
            const firstVideo = tabs[0];
            if (!firstVideo) return;

            // Always ensure first video is created and displayed immediately
            if (!videoCache.current.has(firstVideo.id)) {
                const videoElement = createVideoElement(firstVideo);
                const cachedVideo: CachedVideo = {
                    element: videoElement,
                    loaded: false,
                    error: false,
                    progress: 0
                };
                videoCache.current.set(firstVideo.id, cachedVideo);

                // Add event listeners for first video
                videoElement.addEventListener('loadeddata', () => {
                    cachedVideo.loaded = true;
                    cachedVideo.error = false;
                    if (videoElement === activeVideoRef.current) {
                        setIsVideoLoaded(true);
                        setHasVideoError(false);
                        // Try auto-play when loaded
                        if (autoPlay && !shouldReduceEffects && videoCarouselConfig.autoPlay) {
                            videoElement.muted = sessionMuteState;
                            videoElement.play().then(() => {
                                setAttemptedAutoPlay(true);
                            }).catch(console.warn);
                        }
                    }
                });

                videoElement.addEventListener('error', () => {
                    cachedVideo.error = true;
                    cachedVideo.loaded = false;
                    if (videoElement === activeVideoRef.current) {
                        setIsVideoLoaded(false);
                        setHasVideoError(true);
                    }
                });

                videoElement.addEventListener('timeupdate', () => {
                    if (videoElement === activeVideoRef.current) {
                        const progress = videoElement.duration > 0
                            ? (videoElement.currentTime / videoElement.duration) * 100
                            : 0;
                        cachedVideo.progress = progress;
                        setVideoProgress(progress);
                    }
                });

                videoElement.addEventListener('ended', () => {
                    if (videoElement === activeVideoRef.current) {
                        handleVideoEnded();
                    }
                });

                videoElement.addEventListener('play', () => {
                    if (videoElement === activeVideoRef.current) {
                        setIsPlaying(true);
                    }
                });

                videoElement.addEventListener('pause', () => {
                    if (videoElement === activeVideoRef.current) {
                        setIsPlaying(false);
                    }
                });

                // Add to DOM immediately and make visible
                if (containerRef.current) {
                    containerRef.current.appendChild(videoElement);
                    activeVideoRef.current = videoElement;
                    videoElement.style.opacity = '1';

                    // Update states
                    setIsVideoLoaded(false); // Will be set to true when loaded
                    setHasVideoError(false);
                    setIsMuted(sessionMuteState);
                }
            }

            // Then start preloading other videos
            setTimeout(() => {
                preloadVideos();
            }, 500);
        };

        initializeFirstVideo();
    }, [tabs, createVideoElement, sessionMuteState, autoPlay, shouldReduceEffects, videoCarouselConfig.autoPlay, preloadVideos]); // Only run once on mount

    // Handle tab change with instant switching
    const handleTabChange = useCallback((tabIndex: number) => {
        setActiveTab(tabIndex);
        setAttemptedAutoPlay(false); // Reset auto-play attempt for new video
        const newVideo = tabs[tabIndex];
        switchToVideo(newVideo.id);
    }, [tabs, switchToVideo]);

    // Auto-switch to next video when current video ends
    const handleVideoEnded = useCallback(() => {
        setVideoProgress(100);
        if (autoPlay && !shouldReduceEffects && videoCarouselConfig.autoPlay) {
            setTimeout(() => {
                const nextIndex = (activeTab + 1) % tabs.length;
                handleTabChange(nextIndex);
            }, 500);
        }
    }, [activeTab, tabs.length, autoPlay, shouldReduceEffects, videoCarouselConfig.autoPlay, handleTabChange]);

    // Video control handlers
    const handleTogglePlay = useCallback(async () => {
        if (!activeVideoRef.current) return;

        try {
            if (isPlaying) {
                activeVideoRef.current.pause();
            } else {
                setUserInteracted(true);
                activeVideoRef.current.muted = sessionMuteState;
                await activeVideoRef.current.play();
            }
        } catch (error) {
            console.warn('Video play failed:', error);
        }
    }, [isPlaying, sessionMuteState]);

    const handleToggleMute = useCallback(() => {
        if (!activeVideoRef.current) return;

        const newMutedState = !isMuted;
        activeVideoRef.current.muted = newMutedState;
        activeVideoRef.current.volume = newMutedState ? 0 : 0.8;
        setIsMuted(newMutedState);
        setSessionMuteState(newMutedState);
    }, [isMuted]);

    // Handle user interaction for autoplay
    useEffect(() => {
        const handleUserInteraction = () => {
            setUserInteracted(true);

            // Try to auto-play the current video if it hasn't been attempted yet
            if (!attemptedAutoPlay && activeVideoRef.current && autoPlay && videoCarouselConfig.autoPlay) {
                const cachedVideo = videoCache.current.get(currentVideo.id);
                if (cachedVideo && cachedVideo.loaded && !cachedVideo.error) {
                    activeVideoRef.current.muted = sessionMuteState;
                    activeVideoRef.current.volume = sessionMuteState ? 0 : 0.8;
                    activeVideoRef.current.play().catch(console.warn);
                    setAttemptedAutoPlay(true);
                }
            }

            // Handle play/pause if video is paused
            if (activeVideoRef.current?.paused && isVideoLoaded && !hasVideoError) {
                handleTogglePlay();
            }
        };

        // Only add listeners if user hasn't interacted yet
        if (!userInteracted) {
            document.addEventListener('click', handleUserInteraction, { once: true });
            document.addEventListener('keydown', handleUserInteraction, { once: true });
            document.addEventListener('touchstart', handleUserInteraction, { once: true });
        }

        return () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
        };
    }, [userInteracted, isVideoLoaded, hasVideoError, handleTogglePlay, attemptedAutoPlay, autoPlay, videoCarouselConfig.autoPlay, currentVideo.id, sessionMuteState]);

    // Initialize current video and ensure first video auto-plays
    useEffect(() => {
        if (currentVideo && videoCache.current.has(currentVideo.id)) {
            switchToVideo(currentVideo.id);
        }
    }, [currentVideo.id, switchToVideo]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            videoCache.current.forEach(({ element }) => {
                element.remove();
            });
            videoCache.current.clear();
        };
    }, []);

    return (
        <section
            className={cn('hero-video-carousel relative w-full overflow-hidden touch-manipulation', className)}
            style={{
                height,
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
                {(!isVideoLoaded || hasVideoError) && (
                    <div
                        className={cn(
                            "absolute inset-0 bg-cover bg-center transition-opacity duration-300 z-10",
                            isVideoLoaded ? "opacity-0" : "opacity-100"
                        )}
                        style={{ backgroundImage: `url(${currentVideo.thumbnail})` }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="text-center">
                                {preloadingProgress < 100 && !isVideoLoaded && (
                                    <>
                                        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-white/80 text-sm mb-2">Loading {currentVideo.label}...</p>
                                        <div className="w-32 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-300"
                                                style={{ width: `${preloadingProgress}%` }}
                                            />
                                        </div>
                                    </>
                                )}
                                {hasVideoError && (
                                    <p className="text-white/80 text-sm">Error loading video</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 z-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-20" />
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
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-bounce" />
                                </div>
                            </GlassCard>
                        </OptimizedMotionDiv>
                    </StaggerContainer>
                </div>
            </div>

            {/* Video Tabs - Responsive positioning */}
            {videoCarouselConfig.showTabs && (
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-40">
                    <OptimizedMotionDiv preset="slideUp" delay={1200}>
                        <div className="flex flex-col gap-2 sm:gap-3">
                            {tabs.map((tab, index) => (
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
                                    style={{
                                        minHeight: '36px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        {/* Active indicator with cache status */}
                                        <div className={cn(
                                            "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300",
                                            activeTab === index ? "bg-primary scale-125" :
                                                videoCache.current.has(tab.id) ? "bg-green-400" : "bg-white/50"
                                        )} />

                                        <span className={cn(
                                            "text-xs sm:text-sm font-medium transition-colors duration-300",
                                            activeTab === index ? "text-white" : "text-white/80"
                                        )}>
                                            {tab.label}
                                        </span>
                                    </div>

                                    {/* Video progress bar for active tab */}
                                    {activeTab === index && isVideoLoaded && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-300 ease-out"
                                                style={{ width: `${videoProgress}%` }}
                                            />
                                        </div>
                                    )}
                                </GlassCard>
                            ))}
                        </div>
                    </OptimizedMotionDiv>
                </div>
            )}

            {/* Video Controls - Always visible and responsive */}
            {videoCarouselConfig.showControls && (
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50 flex gap-2 sm:gap-3">
                    <OptimizedMotionDiv preset="scaleIn" delay={1000}>
                        <GlassCard
                            className="p-2 sm:p-3 cursor-pointer group hover:scale-110 active:scale-95 transition-all duration-200 touch-manipulation"
                            onClick={handleToggleMute}
                            aria-label={isMuted ? "Unmute video" : "Mute video"}
                            style={{
                                minWidth: '40px',
                                minHeight: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {isMuted ? (
                                <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover:text-primary transition-colors" />
                            ) : (
                                <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover:text-primary transition-colors" />
                            )}
                        </GlassCard>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="scaleIn" delay={1100}>
                        <GlassCard
                            className="p-2 sm:p-3 cursor-pointer group hover:scale-110 active:scale-95 transition-all duration-200 touch-manipulation"
                            onClick={handleTogglePlay}
                            aria-label={isPlaying ? "Pause video" : "Play video"}
                            style={{
                                minWidth: '40px',
                                minHeight: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {isPlaying ? (
                                <Pause className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover:text-primary transition-colors" />
                            ) : (
                                <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover:text-primary transition-colors" />
                            )}
                        </GlassCard>
                    </OptimizedMotionDiv>
                </div>
            )}

            {/* Video Progress Indicator - Top */}
            {isVideoLoaded && videoProgress > 0 && (
                <div className="absolute top-0 left-0 right-0 z-40 h-1 sm:h-1.5 bg-white/10">
                    <div
                        className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-300 ease-out"
                        style={{ width: `${videoProgress}%` }}
                    />
                </div>
            )}

            {/* Cache Status Indicator (Development) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-4 left-4 z-50 bg-black/50 text-white text-xs p-2 rounded">
                    <div>Cached: {videoCache.current.size}/{tabs.length}</div>
                    <div>Preloading: {Math.round(preloadingProgress)}%</div>
                </div>
            )}

            {/* Mobile-specific CSS */}
            <style jsx>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }

                /* Ensure controls are always visible on mobile */
                @media (max-width: 640px) {
                    .hero-video-carousel {
                        -webkit-transform: translateZ(0);
                        transform: translateZ(0);
                    }

                    .hero-video-carousel video {
                        -webkit-transform: translateZ(0);
                        transform: translateZ(0);
                    }

                    .hero-video-carousel .glass-card {
                        backdrop-filter: blur(10px) saturate(150%);
                        -webkit-backdrop-filter: blur(10px) saturate(150%);
                    }

                    /* Ensure touch targets are large enough */
                    .hero-video-carousel button,
                    .hero-video-carousel .cursor-pointer {
                        min-width: 44px;
                        min-height: 44px;
                    }
                }

                /* Prevent text selection on mobile */
                @media (max-width: 768px) {
                    .hero-video-carousel * {
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                        -webkit-touch-callout: none;
                    }

                    .hero-video-carousel .touch-manipulation {
                        touch-action: manipulation;
                    }
                }
            `}</style>
        </section>
    );
}