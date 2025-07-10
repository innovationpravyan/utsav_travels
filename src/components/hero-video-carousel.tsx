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

    const videoRef = useRef<HTMLVideoElement>(null);
    const intervalRef = useRef<NodeJS.Timeout>();
    const windowObj = useSafeWindow();
    const { shouldReduceEffects } = usePerformancePreference();

    // Access video carousel config from MEDIA_CONFIG
    const videoCarouselConfig = MEDIA_CONFIG.videoCarouselConfig;
    const tabs = getVideoCarouselTabs();
    const currentVideo = tabs[activeTab];

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

    // Auto-play carousel
    useEffect(() => {
        if (!autoPlay || shouldReduceEffects || !videoCarouselConfig.autoPlay) return;

        const startAutoPlay = () => {
            intervalRef.current = setInterval(() => {
                setActiveTab((prev) => (prev + 1) % tabs.length);
            }, videoCarouselConfig.autoPlayInterval);
        };

        const stopAutoPlay = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };

        // Start auto-play after initial load
        const timer = setTimeout(startAutoPlay, 3000);

        return () => {
            clearTimeout(timer);
            stopAutoPlay();
        };
    }, [autoPlay, shouldReduceEffects, tabs.length, videoCarouselConfig.autoPlay, videoCarouselConfig.autoPlayInterval]);

    // Handle tab change
    const handleTabChange = useCallback((tabIndex: number) => {
        setActiveTab(tabIndex);
        setIsVideoLoaded(false);

        // Clear auto-play when user interacts
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, []);

    // Video control handlers
    const handleTogglePlay = useCallback(async () => {
        if (!videoRef.current) return;

        try {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                setUserInteracted(true);
                videoRef.current.muted = true; // Ensure muted for autoplay
                await videoRef.current.play();
                setIsPlaying(true);
            }
        } catch (error) {
            console.warn('Video play failed:', error);
        }
    }, [isPlaying]);

    const handleToggleMute = useCallback(() => {
        if (videoRef.current) {
            const newMutedState = !isMuted;
            videoRef.current.muted = newMutedState;
            videoRef.current.volume = newMutedState ? 0 : 0.8;
            setIsMuted(newMutedState);
        }
    }, [isMuted]);

    // Video event handlers
    const handleVideoLoad = useCallback(() => {
        setIsVideoLoaded(true);
        setHasVideoError(false);
    }, []);

    const handleVideoError = useCallback(() => {
        setHasVideoError(true);
        setIsVideoLoaded(false);
    }, []);

    const handleCanPlayThrough = useCallback(async () => {
        if (autoPlay && !shouldReduceEffects && videoRef.current && videoCarouselConfig.autoPlay) {
            try {
                videoRef.current.muted = videoCarouselConfig.videoSettings.muted;
                await videoRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                console.warn('Auto-play failed:', error);
            }
        }
    }, [autoPlay, shouldReduceEffects, videoCarouselConfig.autoPlay, videoCarouselConfig.videoSettings.muted]);

    // Handle user interaction for autoplay
    useEffect(() => {
        const handleUserInteraction = () => {
            setUserInteracted(true);
            if (videoRef.current?.paused && isVideoLoaded && !hasVideoError) {
                handleTogglePlay();
            }
        };

        document.addEventListener('click', handleUserInteraction, { once: true });
        document.addEventListener('keydown', handleUserInteraction, { once: true });

        return () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };
    }, [isVideoLoaded, hasVideoError, handleTogglePlay]);

    return (
        <section
            className={cn('relative w-full overflow-hidden', className)}
            style={{ height }}
        >
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    key={currentVideo.id} // Force re-render on video change
                    className={cn(
                        'absolute inset-0 w-full h-full object-cover transition-opacity duration-800',
                        isVideoLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    autoPlay={autoPlay && !shouldReduceEffects && videoCarouselConfig.autoPlay}
                    loop={videoCarouselConfig.loop}
                    muted={isMuted}
                    playsInline={videoCarouselConfig.videoSettings.playsInline}
                    preload={shouldReduceEffects ? 'none' : videoCarouselConfig.videoSettings.preload}
                    onLoadedData={handleVideoLoad}
                    onCanPlayThrough={handleCanPlayThrough}
                    onError={handleVideoError}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    poster={currentVideo.thumbnail}
                >
                    <source src={getVideoSource(currentVideo.id as any, 'webm')} type="video/webm" />
                    <source src={getVideoSource(currentVideo.id as any, 'mp4')} type="video/mp4" />
                </video>

                {/* Fallback image while video loads */}
                {!isVideoLoaded && (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
                        style={{ backgroundImage: `url(${currentVideo.thumbnail})` }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-white/80 text-sm">Loading {currentVideo.label}...</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </div>

            {/* Content */}
            <div
                className="relative z-20 h-full flex items-center justify-center"
                style={{
                    transform: `translateY(${Math.min(scrollY * 0.3, 100)}px)`,
                    opacity: Math.max(0.1, 1 - scrollY / 800)
                }}
            >
                <div className="text-center max-w-6xl mx-auto px-4">
                    <StaggerContainer staggerDelay={200}>
                        <OptimizedMotionDiv preset="slideUp" key={`title-${currentVideo.id}`}>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight">
                                {currentVideo.title.split(' ').map((word, index) => (
                                    <span
                                        key={`${currentVideo.id}-${index}`}
                                        className={cn(
                                            "inline-block mr-4 transition-all duration-300",
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
                            <p className="text-xl md:text-2xl lg:text-3xl text-primary/90 font-light mb-6 tracking-wide">
                                {currentVideo.subtitle}
                            </p>
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="fadeIn" delay={500} key={`description-${currentVideo.id}`}>
                            <p className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                                {currentVideo.description}
                            </p>
                        </OptimizedMotionDiv>

                        {/* Scroll indicator */}
                        <OptimizedMotionDiv preset="fadeIn" delay={800} className="mt-16">
                            <GlassCard className="inline-flex flex-col items-center gap-2 px-4 py-3">
                                <span className="text-sm font-light text-white/70">Scroll to explore</span>
                                <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent relative">
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-bounce" />
                                </div>
                            </GlassCard>
                        </OptimizedMotionDiv>
                    </StaggerContainer>
                </div>
            </div>

            {/* Video Tabs - Bottom Left */}
            {videoCarouselConfig.showTabs && (
                <OptimizedMotionDiv
                    preset="slideUp"
                    delay={1200}
                    className="absolute bottom-8 left-8 z-30"
                >
                    <div className="flex flex-col gap-3">
                        {tabs.map((tab, index) => (
                            <GlassCard
                                key={tab.id}
                                className={cn(
                                    "px-6 py-3 cursor-pointer transition-all duration-300 group",
                                    "hover:scale-105 hover:bg-white/20",
                                    activeTab === index
                                        ? "bg-white/20 border-primary/50 shadow-lg shadow-primary/20"
                                        : "bg-white/10 hover:bg-white/15"
                                )}
                                onClick={() => handleTabChange(index)}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Active indicator */}
                                    <div className={cn(
                                        "w-2 h-2 rounded-full transition-all duration-300",
                                        activeTab === index ? "bg-primary scale-125" : "bg-white/50"
                                    )} />

                                    <span className={cn(
                                        "text-sm font-medium transition-colors duration-300",
                                        activeTab === index ? "text-white" : "text-white/80"
                                    )}>
                                        {tab.label}
                                    </span>
                                </div>

                                {/* Progress bar for active tab */}
                                {activeTab === index && autoPlay && !shouldReduceEffects && videoCarouselConfig.autoPlay && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-100 ease-linear"
                                            style={{
                                                animation: `progress ${videoCarouselConfig.autoPlayInterval}ms linear infinite`
                                            }}
                                        />
                                    </div>
                                )}
                            </GlassCard>
                        ))}
                    </div>
                </OptimizedMotionDiv>
            )}

            {/* Video Controls - Bottom Right */}
            {isVideoLoaded && !shouldReduceEffects && videoCarouselConfig.showControls && (
                <OptimizedMotionDiv
                    preset="scaleIn"
                    delay={1000}
                    className="absolute bottom-8 right-8 z-30 flex gap-3"
                >
                    <GlassCard
                        className="p-3 cursor-pointer group hover:scale-110 transition-all duration-200"
                        onClick={handleToggleMute}
                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                        {isMuted ? (
                            <VolumeX className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
                        ) : (
                            <Volume2 className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
                        )}
                    </GlassCard>

                    <GlassCard
                        className="p-3 cursor-pointer group hover:scale-110 transition-all duration-200"
                        onClick={handleTogglePlay}
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                        {isPlaying ? (
                            <Pause className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
                        ) : (
                            <Play className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
                        )}
                    </GlassCard>
                </OptimizedMotionDiv>
            )}

            {/* CSS for progress animation */}
            <style jsx>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </section>
    );
}