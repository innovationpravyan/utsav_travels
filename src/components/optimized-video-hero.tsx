'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OptimizedMotionDiv, StaggerContainer } from '@/components/optimized-motion-div';
import { GlassCard } from '@/components/ui/glass-card';
import { useSafeWindow, useThreeInView } from '@/utils/three-utils';
import { usePerformancePreference } from '@/hooks/use-mobile';

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
    videoSrc: string;
    fallbackImage: string;
    title: string;
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
}

// Safe placeholder videos with comprehensive fallbacks
export const PLACEHOLDER_VIDEOS = {
    spiritual: '/videos/spiritual-hero.webm',
    nature: '/videos/nature-hero.webm',
    temple: '/videos/temple-hero.webm',
    journey: '/videos/journey-hero.webm',
    default: '/videos/default-hero.webm'
} as const;

// Safe video source helper with quality selection
function getSafeVideoSource(src?: string, quality: 'low' | 'medium' | 'high' = 'medium'): string {
    if (!src) {
        return PLACEHOLDER_VIDEOS.spiritual;
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
                                             onVideoError
                                         }: VideoHeroBannerProps) {
    const [isMuted, setIsMuted] = useState(muted);
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [hasVideoError, setHasVideoError] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const { ref: containerRef, isInView } = useThreeInView(0.1);
    const { shouldReduceEffects} = usePerformancePreference();

    // Determine optimal quality based on performance
    const optimalQuality = shouldReduceEffects ? 'low' : quality;
    const safeVideoSrc = getSafeVideoSource(videoSrc, optimalQuality);
    const mp4VideoSrc = getMP4Source(safeVideoSrc);

    // Video control handlers
    const handleToggleMute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    }, [isMuted]);

    const handleTogglePlay = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch((error) => {
                    console.warn('Video play failed:', error);
                    setErrorMessage('Autoplay blocked by browser');
                });
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    // Video event handlers
    const handleVideoLoad = useCallback(() => {
        setIsVideoLoaded(true);
        setHasVideoError(false);
        setLoadingProgress(100);
        onVideoLoad?.();
    }, [onVideoLoad]);

    const handleVideoError = useCallback((event: any) => {
        const error = event.target?.error;
        const errorMsg = error?.code === 4
            ? 'Video format not supported'
            : 'Failed to load video';

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

    // Intersection observer effect for autoplay
    useEffect(() => {
        if (!videoRef.current || shouldReduceEffects) return;

        const video = videoRef.current;

        if (isInView && autoplay && isVideoLoaded && !hasVideoError) {
            video.play().catch((error) => {
                console.warn('Autoplay failed:', error);
                setErrorMessage('Autoplay requires user interaction');
            });
        } else if (!isInView) {
            video.pause();
        }
    }, [isInView, autoplay, isVideoLoaded, hasVideoError, shouldReduceEffects]);

    // Fallback for video errors
    if (hasVideoError) {
        return (
            <VideoErrorFallback
                fallbackImage={fallbackImage}
                title={title}
                subtitle={subtitle}
                description={description}
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
                    muted={muted}
                    playsInline
                    preload={shouldReduceEffects ? 'none' : preload}
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                    onProgress={handleVideoProgress}
                    aria-hidden="true"
                    poster={fallbackImage}
                >
                    <source src={safeVideoSrc} type="video/webm" />
                    <source src={mp4VideoSrc} type="video/mp4" />
                    <p>Your browser does not support the video tag.</p>
                </video>

                {/* Fallback image while video loads */}
                {!isVideoLoaded && (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${fallbackImage})` }}
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
                        title={title}
                        subtitle={subtitle}
                        description={description}
                    />
                )}
            </div>

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
        videoSrc={PLACEHOLDER_VIDEOS.spiritual}
        title="Discover the Spiritual Heritage"
        subtitle="of Varanasi, Ayodhya, Rishikesh, Kedarnath"
        description="Embark on transformative journeys through India's most sacred destinations"
        height="100vh"
        fallbackImage="https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
        {...props}
    />
);

export const AboutVideoHero = (props: Partial<VideoHeroBannerProps>) => (
    <OptimizedVideoHeroBanner
        videoSrc={PLACEHOLDER_VIDEOS.nature}
        title="About Utsav Travels"
        subtitle="Your Gateway to Spiritual India"
        description="Connecting travelers with the authentic soul of sacred destinations"
        height="80vh"
        fallbackImage="https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg?w=1920&h=1080&fit=crop"
        {...props}
    />
);

export const DestinationsVideoHero = (props: Partial<VideoHeroBannerProps>) => (
    <OptimizedVideoHeroBanner
        videoSrc={PLACEHOLDER_VIDEOS.temple}
        title="Explore Sacred Destinations"
        subtitle="Journey Through India's Spiritual Heritage"
        description="Discover ancient temples, sacred ghats, and spiritual sites"
        height="85vh"
        fallbackImage="https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
        {...props}
    />
);

export const PackagesVideoHero = (props: Partial<VideoHeroBannerProps>) => (
    <OptimizedVideoHeroBanner
        videoSrc={PLACEHOLDER_VIDEOS.journey}
        title="Curated Travel Packages"
        subtitle="Journeys Crafted for the Soul"
        description="Experience India's spiritual heritage through our carefully designed packages"
        height="90vh"
        fallbackImage="https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
        {...props}
    />
);