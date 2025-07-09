'use client';

import {ReactNode, useEffect, useRef, useState} from 'react';
import {Pause, Play, Volume2, VolumeX} from 'lucide-react';
import {cn} from '@/lib/utils';
import {OptimizedMotionDiv, StaggerContainer} from '@/components/optimized-motion-div';
import {GlassCard} from '@/components/ui/glass-card';
import {PageBanner} from '@/components/page-banner';
import {useSafeWindow, useThreeInView} from './three-utils';

export interface VideoControlsProps {
    isMuted: boolean;
    onToggleMute: () => void;
    isPlaying: boolean;
    onTogglePlay: () => void;
    position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
}

export interface HeroBannerContentProps {
    title: string;
    subtitle?: string;
    description?: string;
    alignment?: 'center' | 'left' | 'right';
    delay?: number;
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
    showWhatsApp?: boolean;
}

// Safe placeholder videos with fallbacks
export const PLACEHOLDER_VIDEOS = {
    spiritual: '/videos/spiritual-hero.webm',
    nature: '/videos/nature-hero.webm',
    temple: '/videos/temple-hero.webm',
    journey: '/videos/journey-hero.webm',
};

// Safe video source helper
function getSafeVideoSource(src?: string): string {
    if (!src || typeof src !== 'string') {
        return PLACEHOLDER_VIDEOS.spiritual;
    }
    return src;
}

// Safe MP4 conversion
function getMP4Source(webmSrc: string): string {
    try {
        if (webmSrc.includes('.webm')) {
            return webmSrc.replace('.webm', '.mp4');
        }
        return webmSrc;
    } catch (error) {
        console.warn('Error converting video source:', error);
        return webmSrc;
    }
}

const OptimizedVideoControls = ({
                                    isMuted, onToggleMute, isPlaying, onTogglePlay, position = 'bottom-right'
                                }: VideoControlsProps) => {
    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'top-right': 'top-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-left': 'top-6 left-6'
    };

    return (
        <div className={cn('absolute z-40 flex gap-3', positionClasses[position])}>
            <GlassCard
                className="p-3 cursor-pointer group hover:scale-110 transition-all duration-200"
                onClick={onToggleMute}
            >
                {isMuted ? (
                    <VolumeX className="h-5 w-5 text-white group-hover:text-primary transition-colors"/>
                ) : (
                    <Volume2 className="h-5 w-5 text-white group-hover:text-primary transition-colors"/>
                )}
            </GlassCard>

            <GlassCard
                className="p-3 cursor-pointer group hover:scale-110 transition-all duration-200"
                onClick={onTogglePlay}
            >
                {isPlaying ? (
                    <Pause className="h-5 w-5 text-white group-hover:text-primary transition-colors"/>
                ) : (
                    <Play className="h-5 w-5 text-white group-hover:text-primary transition-colors"/>
                )}
            </GlassCard>
        </div>
    );
};

const OptimizedHeroBannerContent = ({
                                        title, subtitle, description, alignment = 'center', delay = 0
                                    }: HeroBannerContentProps) => {
    const alignmentClasses = {
        center: 'text-center items-center',
        left: 'text-left items-start',
        right: 'text-right items-end'
    };

    const [scrollY, setScrollY] = useState(0);
    const windowObj = useSafeWindow();
    const {ref: contentRef, isInView} = useThreeInView(0.1);

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

        windowObj.addEventListener('scroll', onScroll, {passive: true});
        return () => windowObj.removeEventListener('scroll', onScroll);
    }, [windowObj]);

    return (
        <div
            ref={contentRef}
            className={cn(
                'relative z-30 flex flex-col justify-center max-w-6xl mx-auto px-4',
                alignmentClasses[alignment]
            )}
            style={{
                transform: `translateY(${scrollY * 0.2}px)`,
                opacity: Math.max(0.3, 1 - scrollY / 1000)
            }}
        >
            <StaggerContainer>
                <OptimizedMotionDiv preset="slideUp" delay={0}>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-headline font-bold text-white mb-6 leading-tight">
                        {title.split(' ').map((word, index) => (
                            <span
                                key={index}
                                className={cn(
                                    "inline-block mr-4 transition-all duration-300 hover:scale-105",
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

                {subtitle && (
                    <OptimizedMotionDiv preset="fadeIn" delay={0}>
                        <p className="text-2xl md:text-3xl text-primary/90 font-light mb-6 tracking-wide">
                            {subtitle}
                        </p>
                    </OptimizedMotionDiv>
                )}

                {description && (
                    <OptimizedMotionDiv preset="fadeIn" delay={0}>
                        <p className="text-xl text-white/80 max-w-4xl leading-relaxed">
                            {description}
                        </p>
                    </OptimizedMotionDiv>
                )}

                <div className="mt-16 flex flex-col items-center gap-4">
                    <GlassCard className="px-4 py-2">
                        <div className="flex flex-col items-center gap-2 text-white/70">
                            <span className="text-sm font-light">Scroll to explore</span>
                            <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent relative">
                                <div
                                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-bounce"/>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </StaggerContainer>
        </div>
    );
};

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
                                         }: VideoHeroBannerProps) {
    const [isMuted, setIsMuted] = useState(muted);
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [hasVideoError, setHasVideoError] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const {ref: containerRef, isInView} = useThreeInView(0.1);

    // Safe video source
    const safeVideoSrc = getSafeVideoSource(videoSrc);
    const mp4VideoSrc = getMP4Source(safeVideoSrc);

    const handleToggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTogglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(console.warn);
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVideoLoad = () => {
        setIsVideoLoaded(true);
        setHasVideoError(false);
    };

    const handleVideoError = () => {
        console.warn('Video failed to load, falling back to image');
        setHasVideoError(true);
        setIsVideoLoaded(false);
    };

    useEffect(() => {
        if (!videoRef.current) return;

        if (isInView && autoplay && isVideoLoaded) {
            videoRef.current.play().catch(() => {
                console.warn('Autoplay failed, user interaction required');
            });
        } else if (!isInView && videoRef.current) {
            videoRef.current.pause();
        }
    }, [isInView, autoplay, isVideoLoaded]);

    if (hasVideoError) {
        return (
            <PageBanner
                title={title}
                subtitle={subtitle || ''}
                description={description || ''}
                items={[{
                    id: 'fallback',
                    image: fallbackImage,
                    name: title,
                    tagline: subtitle || ''
                }]}
                variant="cinematic"
                height={height}
                showStats={false}
                showFloatingElements={true}
            />
        );
    }

    return (
        <section
            ref={containerRef}
            className={cn('relative w-full overflow-hidden', className)}
            style={{height}}
        >
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    className={cn(
                        'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
                        isVideoLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    autoPlay={autoplay}
                    loop={loop}
                    muted={muted}
                    playsInline
                    preload="metadata"
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                    aria-label="Background video"
                >
                    <source src={safeVideoSrc} type="video/webm"/>
                    <source src={mp4VideoSrc} type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>

                {!isVideoLoaded && (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{backgroundImage: `url(${fallbackImage})`}}
                    >
                        <div className="absolute inset-0 bg-black/50"/>
                    </div>
                )}

                <div
                    className="absolute inset-0 bg-black transition-opacity duration-500"
                    style={{opacity: overlayDarkness}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"/>
            </div>

            <div className="relative z-20 h-full flex items-center justify-center">
                {children || (
                    <OptimizedHeroBannerContent
                        title={title}
                        subtitle={subtitle}
                        description={description}
                    />
                )}
            </div>

            {isVideoLoaded && (
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

// Preset components with safe defaults
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