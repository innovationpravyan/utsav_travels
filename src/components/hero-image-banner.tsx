'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils/utils';
import { OptimizedMotionDiv, StaggerContainer } from '@/components/optimized-motion-div';
import { GlassCard } from '@/components/ui/glass-card';
import { useSafeWindow } from '@/utils/three-utils';
import { usePerformancePreference } from '@/hooks/use-mobile';
import { MEDIA_CONFIG, getHeroImage } from '@/utils/utils';

interface HeroImageBannerProps {
    page: 'destinations' | 'packages' | 'about';
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    height?: string;
    overlayOpacity?: number;
    className?: string;
    showScrollIndicator?: boolean;
    parallaxEffect?: boolean;
}

export function HeroImageBanner({
                                    page,
                                    title,
                                    subtitle,
                                    description,
                                    imageUrl,
                                    height = MEDIA_CONFIG.heroImageConfig.height,
                                    overlayOpacity = MEDIA_CONFIG.heroImageConfig.overlayOpacity,
                                    className,
                                    showScrollIndicator = MEDIA_CONFIG.heroImageConfig.showScrollIndicator,
                                    parallaxEffect = MEDIA_CONFIG.heroImageConfig.parallaxEffect
                                }: HeroImageBannerProps) {
    const [scrollY, setScrollY] = useState(0);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const windowObj = useSafeWindow();
    const { shouldReduceEffects } = usePerformancePreference();

    // Get page-specific content
    const pageContent = getHeroImage(page);
    const finalTitle = title || pageContent.title;
    const finalSubtitle = subtitle || pageContent.subtitle;
    const finalDescription = description || pageContent.description;
    const finalImageUrl = imageUrl || pageContent.primary;

    // Handle scroll for parallax effect
    useEffect(() => {
        if (!windowObj || !parallaxEffect || shouldReduceEffects) return;

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
    }, [windowObj, parallaxEffect, shouldReduceEffects]);

    // Preload image
    useEffect(() => {
        const img = new Image();
        img.onload = () => setIsImageLoaded(true);
        img.onerror = () => setIsImageLoaded(true); // Still show fallback
        img.src = finalImageUrl;
    }, [finalImageUrl]);

    return (
        <section
            className={cn('relative w-full overflow-hidden', className)}
            style={{ height }}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    transform: parallaxEffect && !shouldReduceEffects
                        ? `translateY(${scrollY * 0.5}px)`
                        : undefined
                }}
            >
                {/* Loading placeholder */}
                {!isImageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-white/80 text-sm">Loading...</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main background image */}
                <div
                    className={cn(
                        'absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500',
                        isImageLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    style={{ backgroundImage: `url(${finalImageUrl})` }}
                />

                {/* Gradient overlay */}
                <div
                    className="absolute inset-0 bg-black transition-opacity duration-500"
                    style={{ opacity: overlayOpacity }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Pattern overlay for visual interest */}
                <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
                </div>
            </div>

            {/* Content */}
            <div
                className="relative z-20 h-full flex items-center justify-center"
                style={{
                    transform: parallaxEffect && !shouldReduceEffects
                        ? `translateY(${Math.min(scrollY * 0.3, 100)}px)`
                        : undefined,
                    opacity: parallaxEffect && !shouldReduceEffects
                        ? Math.max(0.1, 1 - scrollY / 800)
                        : 1
                }}
            >
                <div className="text-center max-w-6xl mx-auto px-4">
                    <StaggerContainer staggerDelay={200}>
                        {/* Page icon */}
                        <OptimizedMotionDiv preset="scaleIn" delay={0}>
                            <div className="flex justify-center mb-8">
                                <GlassCard className="p-4 rounded-full">
                                    {page === 'destinations' && (
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                    {page === 'packages' && (
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    )}
                                    {page === 'about' && (
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    )}
                                </GlassCard>
                            </div>
                        </OptimizedMotionDiv>

                        {/* Title */}
                        <OptimizedMotionDiv preset="slideUp" delay={200}>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                {finalTitle.split(' ').map((word, index) => (
                                    <span
                                        key={index}
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

                        {/* Subtitle */}
                        {finalSubtitle && (
                            <OptimizedMotionDiv preset="fadeIn" delay={400}>
                                <p className="text-xl md:text-2xl lg:text-3xl text-primary/90 font-light mb-6 tracking-wide">
                                    {finalSubtitle}
                                </p>
                            </OptimizedMotionDiv>
                        )}

                        {/* Description */}
                        {finalDescription && (
                            <OptimizedMotionDiv preset="fadeIn" delay={600}>
                                <p className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                                    {finalDescription}
                                </p>
                            </OptimizedMotionDiv>
                        )}

                        {/* Scroll indicator */}
                        {showScrollIndicator && (
                            <OptimizedMotionDiv preset="fadeIn" delay={800} className="mt-16">
                                <GlassCard className="inline-flex flex-col items-center gap-2 px-4 py-3">
                                    <span className="text-sm font-light text-white/70">Scroll to explore</span>
                                    <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent relative">
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-bounce" />
                                    </div>
                                </GlassCard>
                            </OptimizedMotionDiv>
                        )}
                    </StaggerContainer>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {/* Floating particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping animation-delay-1000" />
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping animation-delay-2000" />
                <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-white/10 rounded-full animate-ping animation-delay-3000" />

                {/* Corner gradients */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl" />
            </div>
        </section>
    );
}