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
    const [videoProgress, setVideoProgress] = useState(0);
    const [preloadingProgress, setPreloadingProgress] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

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

    // Auto-switch to next video when current video ends
    const handleVideoEnded = useCallback(() => {
        setVideoProgress(100);
        if (autoPlay && !shouldReduceEffects && videoCarouselConfig.autoPlay) {
            setTimeout(() => {
                const nextIndex = (activeTab + 1) % tabs.length;
                setActiveTab(nextIndex);
            }, 500);
        }
    }, [activeTab, tabs.length, autoPlay, shouldReduceEffects, videoCarouselConfig.autoPlay]);

    // Create and cache video element
    const createVideoElement = useCallback((video: VideoCarouselTab): HTMLVideoElement => {
        const videoElement = document.createElement('video');
        videoElement.className = 'absolute inset-0 w-full h-full object-cover transition-opacity duration-800';
        videoElement.style.opacity = '0';
        videoElement.style.WebkitTransform = 'translateZ(0)';
        videoElement.style.transform = 'translateZ(0)';
        videoElement.autoplay = false;
        videoElement.loop = false;
        videoElement.muted = true; // Always start muted for autoplay
        videoElement.playsInline = true;
        videoElement.preload = 'auto';
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
    }, []);

    // Setup video event listeners
    const setupVideoEventListeners = useCallback((videoElement: HTMLVideoElement, cachedVideo: CachedVideo) => {
        const handleLoadedData = () => {
            cachedVideo.loaded = true;
            cachedVideo.error = false;

            if (videoElement === activeVideoRef.current) {
                setIsVideoLoaded(true);
                setHasVideoError(false);

                // Auto-play on initial load
                if (isInitialLoad && autoPlay && !shouldReduceEffects) {
                    videoElement.play().then(() => {
                        setIsPlaying(true);
                        setIsInitialLoad(false);
                    }).catch((error) => {
                        console.warn('Autoplay failed:', error);
                        // Try playing muted
                        videoElement.muted = true;
                        videoElement.play().then(() => {
                            setIsPlaying(true);
                            setIsInitialLoad(false);
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
                videoElement.style.opacity = '1';
            }
        };

        const handleError = () => {
            cachedVideo.error = true;
            cachedVideo.loaded = false;

            if (videoElement === activeVideoRef.current) {
                setIsVideoLoaded(false);
                setHasVideoError(true);
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

        videoElement.addEventListener('loadeddata', handleLoadedData);
        videoElement.addEventListener('canplaythrough', handleCanPlayThrough);
        videoElement.addEventListener('error', handleError);
        videoElement.addEventListener('timeupdate', handleTimeUpdate);
        videoElement.addEventListener('ended', handleEnded);
        videoElement.addEventListener('play', handlePlay);
        videoElement.addEventListener('pause', handlePause);

        // Cleanup function
        return () => {
            videoElement.removeEventListener('loadeddata', handleLoadedData);
            videoElement.removeEventListener('canplaythrough', handleCanPlayThrough);
            videoElement.removeEventListener('error', handleError);
            videoElement.removeEventListener('timeupdate', handleTimeUpdate);
            videoElement.removeEventListener('ended', handleEnded);
            videoElement.removeEventListener('play', handlePlay);
            videoElement.removeEventListener('pause', handlePause);
        };
    }, [autoPlay, shouldReduceEffects, isInitialLoad, handleVideoEnded]);

    // Initialize first video immediately
    useEffect(() => {
        if (!containerRef.current || tabs.length === 0) return;

        const firstVideo = tabs[0];
        const videoElement = createVideoElement(firstVideo);
        const cachedVideo: CachedVideo = {
            element: videoElement,
            loaded: false,
            error: false,
            progress: 0
        };

        // Setup event listeners
        const cleanup = setupVideoEventListeners(videoElement, cachedVideo);

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
                        progress: 0
                    };

                    setupVideoEventListeners(videoElement, cachedVideo);
                    videoCache.current.set(video.id, cachedVideo);
                    videoElement.load();

                    // Small delay between preloads
                    await new Promise(resolve => setTimeout(resolve, 200));
                } catch (error) {
                    console.warn(`Failed to preload video ${video.id}:`, error);
                }
            }

            preloadingRef.current = false;
            setPreloadingProgress(100);
        };

        preloadVideos();
    }, [isVideoLoaded, tabs, createVideoElement, setupVideoEventListeners, shouldReduceEffects]);

    // Switch video on tab change
    const switchToVideo = useCallback((videoId: string) => {
        if (!containerRef.current) return;

        const cachedVideo = videoCache.current.get(videoId);
        if (!cachedVideo) {
            // Create video if not cached
            const video = tabs.find(t => t.id === videoId);
            if (!video) return;

            const videoElement = createVideoElement(video);
            const newCachedVideo: CachedVideo = {
                element: videoElement,
                loaded: false,
                error: false,
                progress: 0
            };

            setupVideoEventListeners(videoElement, newCachedVideo);
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

        // Show video with smooth transition
        requestAnimationFrame(() => {
            cachedVideo.element.style.opacity = '1';

            // Auto-play if enabled and loaded
            if (autoPlay && cachedVideo.loaded && !cachedVideo.error) {
                cachedVideo.element.muted = isMuted;
                cachedVideo.element.play().catch(console.warn);
            }
        });
    }, [tabs, createVideoElement, setupVideoEventListeners, autoPlay, isMuted]);

    // Handle tab change
    const handleTabChange = useCallback((tabIndex: number) => {
        setActiveTab(tabIndex);
        const newVideo = tabs[tabIndex];
        switchToVideo(newVideo.id);
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
            } else {
                setUserInteracted(true);
                await activeVideoRef.current.play();
            }
        } catch (error) {
            console.warn('Video play failed:', error);
        }
    }, [isPlaying]);

    const handleToggleMute = useCallback(() => {
        if (!activeVideoRef.current) return;

        const newMutedState = !isMuted;
        activeVideoRef.current.muted = newMutedState;
        activeVideoRef.current.volume = newMutedState ? 0 : 0.8;
        setIsMuted(newMutedState);
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

        windowObj.addEventListener('scroll', onScroll, { passive: true });
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
            document.addEventListener(event, handleUserInteraction, { once: true });
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleUserInteraction);
            });
        };
    }, [userInteracted, isVideoLoaded, hasVideoError]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            videoCache.current.forEach(({ element }) => {
                element.pause();
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
                {(!isVideoLoaded || hasVideoError) && currentVideo && (
                    <div
                        className={cn(
                            "absolute inset-0 bg-cover bg-center transition-opacity duration-300 z-10",
                            isVideoLoaded && !hasVideoError ? "opacity-0" : "opacity-100"
                        )}
                        style={{ backgroundImage: `url(${currentVideo.thumbnail})` }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="text-center">
                                {!hasVideoError && (
                                    <>
                                        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-white/80 text-sm">Loading video...</p>
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

            {/* Video Tabs */}
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
                                >
                                    <div className="flex items-center gap-2 sm:gap-3">
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

            {/* Video Controls */}
            {videoCarouselConfig.showControls && (
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50 flex gap-2 sm:gap-3">
                    <OptimizedMotionDiv preset="scaleIn" delay={1000}>
                        <GlassCard
                            className="p-2 sm:p-3 cursor-pointer group hover:scale-110 active:scale-95 transition-all duration-200 touch-manipulation"
                            onClick={handleToggleMute}
                            aria-label={isMuted ? "Unmute video" : "Mute video"}
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

            {/* Video Progress Indicator */}
            {isVideoLoaded && videoProgress > 0 && (
                <div className="absolute top-0 left-0 right-0 z-40 h-1 sm:h-1.5 bg-white/10">
                    <div
                        className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-300 ease-out"
                        style={{ width: `${videoProgress}%` }}
                    />
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