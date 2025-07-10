'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OptimizedMotionDiv, StaggerContainer } from '@/components/optimized-motion-div';
import { GlassCard } from '@/components/ui/glass-card';
import { useSafeWindow, useThreeInView } from '@/utils/three-utils';
import { usePerformancePreference } from '@/hooks/use-mobile';
import { VIDEO_URLS, VIDEO_HERO_CONTENT } from '@/lib/utils';

// Types for better type safety
export interface VideoControlsProps {
    isMuted: boolean;
    onToggleMute: () => void;
    isPlaying: boolean;
    onTogglePlay: () => void;
    position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
    className?: string;
}

export interface HeroBannerContentProps {
    title: string;
    subtitle?: string;
    description?: string;
    alignment?: 'center' | 'left' | 'right';
    delay?: number;
    className?: string;
}

export interface VideoHeroBannerProps {
    videoSrc?: string;
    fallbackImage?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    overlayDarkness?: number;
    height?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    className?: string;
    children?: ReactNode;
    showControls?: boolean;
    preload?: 'none' | 'metadata' | 'auto';
    quality?: 'low' | 'medium' | 'high';
    onVideoLoad?: () => void;
    onVideoError?: (error: string) => void;
    pageType?: 'home' | 'about' | 'destinations' | 'packages';
}

// Safe video source helper with quality selection
function getSafeVideoSource(src?: string, quality: 'low' | 'medium' | 'high' = 'medium'): string {
    if (!src) {
        return VIDEO_URLS.home.primary;
    }

    // Add quality suffix if not already present
    if (quality !== 'medium' && !src.includes(`-${quality}`)) {
        const extension = src.split('.').pop();
        const baseName = src.replace(`.${extension}`, '');
        return `${baseName}-${quality}.${extension}`;
    }

    return src;
}

// Convert WebM to MP4 for broader compatibility
function getMP4Source(webmSrc: string): string {
    try {
        return webmSrc.includes('.webm')
            ? webmSrc.replace('.webm', '.mp4')
            : webmSrc.replace(/\.(webm|mov|avi)$/i, '.mp4');
    } catch (error) {
        console.warn('Error converting video source:', error);
        return webmSrc;
    }
}

// Get safe fallback image
function getSafeFallbackImage(fallbackImage?: string, pageType: string = 'home'): string {
    if (fallbackImage) return fallbackImage;

    switch (pageType) {
        case 'about':
            return VIDEO_URLS.fallbacks.culture;
        case 'destinations':
            return VIDEO_URLS.fallbacks.temple;
        case 'packages':
            return VIDEO_URLS.fallbacks.journey;
        default:
            return VIDEO_URLS.fallbacks.spiritual;
    }
}

// Get content for page type
function getPageContent(pageType: string = 'home', customContent?: Partial<HeroBannerContentProps>) {
    const content = VIDEO_HERO_CONTENT[pageType as keyof typeof VIDEO_HERO_CONTENT] || VIDEO_HERO_CONTENT.home;

    return {
        title: customContent?.title || content.title,
        subtitle: customContent?.subtitle || content.subtitle,
        description: customContent?.description || content.description,
    };
}

// Optimized video controls component
const OptimizedVideoControls = ({
                                    isMuted,
                                    onToggleMute,
                                    isPlaying,
                                    onTogglePlay,
                                    position = 'bottom-right',
                                    className
                                }: VideoControlsProps) => {
    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'top-right': 'top-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-left': 'top-6 left-6'
    };

    return (
        <OptimizedMotionDiv
            preset="scaleIn"
            delay={1000}
            className={cn('absolute z-40 flex gap-3', positionClasses[position], className)}
        >
            <GlassCard
                className="p-3 cursor-pointer group hover:scale-110 transition-all duration-200 backdrop-blur-md"
                onClick={onToggleMute}
                role="button"
                tabIndex={0}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggleMute();
                    }
                }}
            >
                {isMuted ? (
                    <VolumeX className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
                ) : (
                    <Volume2 className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
                )}
            </GlassCard>

            <GlassCard
                className="p-3 cursor-pointer group hover:scale-110 transition-all duration-200 backdrop-blur-md"
                onClick={onTogglePlay}
                role="button"
                tabIndex={0}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onTogglePlay();
                    }
                }}
            >
                {isPlaying ? (
                    <Pause className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
                ) : (
                    <Play className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
                )}
            </GlassCard>
        </OptimizedMotionDiv>
    );
};

// Optimized hero banner content
const OptimizedHeroBannerContent = ({
                                        title,
                                        subtitle,
                                        description,
                                        alignment = 'center',
                                        delay = 0,
                                        className
                                    }: HeroBannerContentProps) => {
    const alignmentClasses = {
        center: 'text-center items-center',
        left: 'text-left items-start',
        right: 'text-right items-end'
    };

    const [scrollY, setScrollY] = useState(0);
    const windowObj = useSafeWindow();
    const { ref: contentRef} = useThreeInView(0.1);

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

    return (
        <div
            ref={contentRef}
            className={cn(
                'relative z-30 flex flex-col justify-center max-w-6xl mx-auto px-4',
                alignmentClasses[alignment],
                className
            )}
            style={{
                transform: `translateY(${Math.min(scrollY * 0.3, 100)}px)`,
                opacity: Math.max(0.1, 1 - scrollY / 800)
            }}
        >
            <StaggerContainer staggerDelay={200}>
                <OptimizedMotionDiv preset="slideUp" delay={delay}>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight">
                        {title.split(' ').map((word, index) => (
                            <OptimizedMotionDiv
                                key={index}
                                preset="slideUp"
                                delay={delay + (index * 100)}
                                as="span"
                                className={cn(
                                    "inline-block mr-4 transition-all duration-300 hover:scale-105",
                                    index % 2 === 0
                                        ? "bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
                                        : "text-gradient-alt"
                                )}
                            >
                                {word}
                            </OptimizedMotionDiv>
                        ))}
                    </h1>
                </OptimizedMotionDiv>

                {subtitle && (
                    <OptimizedMotionDiv preset="fadeIn" delay={delay + 300}>
                        <p className="text-xl md:text-2xl lg:text-3xl text-primary/90 font-light mb-6 tracking-wide text-shadow">
                            {subtitle}
                        </p>
                    </OptimizedMotionDiv>
                )}

                {description && (
                    <OptimizedMotionDiv preset="fadeIn" delay={delay + 500}>
                        <p className="text-lg md:text-xl text-white/80 max-w-4xl leading-relaxed text-shadow">
                            {description}
                        </p>
                    </OptimizedMotionDiv>
                )}

                {/* Scroll indicator */}
                <OptimizedMotionDiv preset="fadeIn" delay={delay + 800} className="mt-16">
                    <GlassCard className="inline-flex flex-col items-center gap-2 px-4 py-3">
                        <span className="text-sm font-light text-white/70">Scroll to explore</span>
                        <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent relative">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-bounce" />
                        </div>
                    </GlassCard>
                </OptimizedMotionDiv>
            </StaggerContainer>
        </div>
    );
};

// Error fallback component
const VideoErrorFallback = ({
                                fallbackImage,
                                title,
                                subtitle,
                                description,
                                height,
                                error
                            }: {
    fallbackImage: string;
    title: string;
    subtitle?: string;
    description?: string;
    height: string;
    error: string;
}) => (
    <section className="relative w-full overflow-hidden" style={{ height }}>
        <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${fallbackImage})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        <div className="relative z-20 h-full flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <p className="text-yellow-200 text-sm mb-4">Video unavailable: {error}</p>
                </div>
                <OptimizedHeroBannerContent
                    title={title}
                    subtitle={subtitle}
                    description={description}
                />
            </div>
        </div>
    </section>
);

// Main video hero banner component
export function OptimizedVideoHeroBanner({
                                             videoSrc,
                                             fallbackImage,
                                             title,
                                             subtitle,
                                             description,
                                             overlayDarkness = 0.6,
                                             height = '100vh',
                                             autoplay = true,
                                             loop = true,
                                             muted = true,
                                             className,
                                             children,
                                             showControls = true,
                                             preload = 'metadata',
                                             quality = 'medium',
                                             onVideoLoad,
                                             onVideoError,
                                             pageType = 'home'
                                         }: VideoHeroBannerProps) {
    const [isMuted, setIsMuted] = useState(true); // Always start muted
    const [isPlaying, setIsPlaying] = useState(false); // Start as not playing
    const [hasVideoError, setHasVideoError] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [userInteracted, setUserInteracted] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const { ref: containerRef, isInView } = useThreeInView(0.1);
    const { shouldReduceEffects} = usePerformancePreference();

    // Determine optimal quality based on performance
    const optimalQuality = shouldReduceEffects ? 'low' : quality;
    const safeVideoSrc = getSafeVideoSource(videoSrc, optimalQuality);
    const mp4VideoSrc = getMP4Source(safeVideoSrc);
    const safeFallbackImage = getSafeFallbackImage(fallbackImage, pageType);

    // Get content based on page type
    const pageContent = getPageContent(pageType, { title, subtitle, description });

    // Attempt to play video with better error handling
    const attemptVideoPlay = useCallback(async () => {
        if (!videoRef.current || !isVideoLoaded || hasVideoError) return;

        const video = videoRef.current;

        try {
            // Ensure video is muted for autoplay
            video.muted = true;

            // Wait for video to be ready
            if (video.readyState < 3) {
                await new Promise((resolve) => {
                    const onCanPlay = () => {
                        video.removeEventListener('canplaythrough', onCanPlay);
                        resolve(undefined);
                    };
                    video.addEventListener('canplaythrough', onCanPlay);
                });
            }

            const playPromise = video.play();
            if (playPromise !== undefined) {
                await playPromise;
                setIsPlaying(true);
                setErrorMessage('');
            }
        } catch (error: any) {
            console.warn('Video play failed:', error);
            if (error.name === 'NotAllowedError') {
                setErrorMessage('Click to play video');
                setIsPlaying(false);
            }
        }
    }, [isVideoLoaded, hasVideoError]);

    // Video control handlers with proper sound management
    const handleToggleMute = useCallback(() => {
        if (videoRef.current) {
            const newMutedState = !isMuted;
            videoRef.current.muted = newMutedState;
            setIsMuted(newMutedState);

            // Ensure audio context is properly initialized
            if (!newMutedState) {
                videoRef.current.volume = 0.8; // Set reasonable volume
            }
        }
    }, [isMuted]);

    const handleTogglePlay = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                setUserInteracted(true);
                attemptVideoPlay();
            }
        }
    }, [isPlaying, attemptVideoPlay]);

    // Video event handlers
    const handleVideoLoad = useCallback(() => {
        setIsVideoLoaded(true);
        setHasVideoError(false);
        setLoadingProgress(100);
        onVideoLoad?.();
    }, [onVideoLoad]);

    // Handle when video can play through without buffering
    const handleCanPlayThrough = useCallback(() => {
        if (autoplay && !shouldReduceEffects && !userInteracted) {
            // Try autoplay when video is ready
            attemptVideoPlay();
        }
    }, [autoplay, shouldReduceEffects, userInteracted, attemptVideoPlay]);

    const handleVideoError = useCallback((event: any) => {
        const error = event.target?.error;
        let errorMsg = 'Failed to load video';

        if (error) {
            switch (error.code) {
                case 1:
                    errorMsg = 'Video loading was aborted';
                    break;
                case 2:
                    errorMsg = 'Network error occurred';
                    break;
                case 3:
                    errorMsg = 'Video decoding failed';
                    break;
                case 4:
                    errorMsg = 'Video format not supported';
                    break;
                default:
                    errorMsg = 'Unknown video error';
            }
        }

        console.warn('Video error:', errorMsg, error);
        setHasVideoError(true);
        setIsVideoLoaded(false);
        setErrorMessage(errorMsg);
        onVideoError?.(errorMsg);
    }, [onVideoError]);

    const handleVideoProgress = useCallback((event: any) => {
        const video = event.target;
        if (video.buffered.length > 0) {
            const progress = (video.buffered.end(0) / video.duration) * 100;
            setLoadingProgress(Math.round(progress));
        }
    }, []);

    // Handle video play/pause state changes
    const handleVideoPlay = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const handleVideoPause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    // Auto-attempt play when video loads and is in view
    useEffect(() => {
        if (isInView && isVideoLoaded && !hasVideoError && autoplay && !shouldReduceEffects && !userInteracted) {
            const timer = setTimeout(attemptVideoPlay, 300);
            return () => clearTimeout(timer);
        }
    }, [isInView, isVideoLoaded, hasVideoError, autoplay, shouldReduceEffects, userInteracted, attemptVideoPlay]);

    // Handle user interaction to enable autoplay
    useEffect(() => {
        const handleUserInteraction = () => {
            setUserInteracted(true);
            if (videoRef.current?.paused && isVideoLoaded && !hasVideoError) {
                attemptVideoPlay();
            }
        };

        // Listen for any page interaction
        document.addEventListener('click', handleUserInteraction, { once: true });
        document.addEventListener('keydown', handleUserInteraction, { once: true });
        document.addEventListener('touchstart', handleUserInteraction, { once: true });

        return () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
        };
    }, [isVideoLoaded, hasVideoError, attemptVideoPlay]);

    // Fallback for video errors
    if (hasVideoError) {
        return (
            <VideoErrorFallback
                fallbackImage={safeFallbackImage}
                title={pageContent.title}
                subtitle={pageContent.subtitle}
                description={pageContent.description}
                height={height}
                error={errorMessage}
            />
        );
    }

    return (
        <section
            ref={containerRef}
            className={cn('relative w-full overflow-hidden', className)}
            style={{ height }}
            role="banner"
            aria-label="Hero video banner"
        >
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    className={cn(
                        'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
                        isVideoLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    autoPlay={autoplay && !shouldReduceEffects}
                    loop={loop}
                    muted={isMuted}
                    playsInline
                    preload={shouldReduceEffects ? 'none' : preload}
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                    onProgress={handleVideoProgress}
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    aria-hidden="true"
                    poster={safeFallbackImage}
                    controls={false}
                >
                    <source src={safeVideoSrc} type="video/webm" />
                    <source src={mp4VideoSrc} type="video/mp4" />
                    <p>Your browser does not support the video tag.</p>
                </video>

                {/* Fallback image while video loads */}
                {!isVideoLoaded && (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${safeFallbackImage})` }}
                    >
                        {/* Loading indicator */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-white/80 text-sm">Loading video... {loadingProgress}%</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black transition-opacity duration-500"
                    style={{ opacity: overlayDarkness }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex items-center justify-center">
                {children || (
                    <OptimizedHeroBannerContent
                        title={pageContent.title}
                        subtitle={pageContent.subtitle}
                        description={pageContent.description}
                    />
                )}
            </div>

            {/* Play Button Overlay for blocked autoplay */}
            {isVideoLoaded && !isPlaying && errorMessage.includes('Click to play') && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20">
                    <OptimizedMotionDiv preset="scaleIn" className="text-center">
                        <GlassCard
                            className="p-8 cursor-pointer group hover:scale-110 transition-all duration-200"
                            onClick={handleTogglePlay}
                        >
                            <Play className="w-16 h-16 text-white mx-auto mb-4 group-hover:text-primary transition-colors" />
                            <p className="text-white text-lg">Click to Play Video</p>
                        </GlassCard>
                    </OptimizedMotionDiv>
                </div>
            )}

            {/* Video Controls */}
            {showControls && isVideoLoaded && !shouldReduceEffects && (
                <OptimizedVideoControls
                    isMuted={isMuted}
                    onToggleMute={handleToggleMute}
                    isPlaying={isPlaying}
                    onTogglePlay={handleTogglePlay}
                    position="bottom-right"
                />
            )}
        </section>
    );
}

// Preset components for different use cases
export const HomeVideoHero = (props: Partial<VideoHeroBannerProps>) => (
    <OptimizedVideoHeroBanner
        pageType="home"
        height="100vh"
        {...props}
    />
);

export const AboutVideoHero = (props: Partial<VideoHeroBannerProps>) => (
    <OptimizedVideoHeroBanner
        pageType="about"
        height="80vh"
        {...props}
    />
);

export const DestinationsVideoHero = (props: Partial<VideoHeroBannerProps>) => (
    <OptimizedVideoHeroBanner
        pageType="destinations"
        height="85vh"
        {...props}
    />
);

export const PackagesVideoHero = (props: Partial<VideoHeroBannerProps>) => (
    <OptimizedVideoHeroBanner
        pageType="packages"
        height="90vh"
        {...props}
    />
);