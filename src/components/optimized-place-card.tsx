'use client';

import Link from "next/link";
import Image from "next/image";
import { Camera, MapPin, Star, Clock, Users, Heart } from "lucide-react";
import React, { useCallback, useRef, useState, memo } from "react";
import { cn } from "@/utils/utils";
import { useThreeInView } from '@/utils/three-utils';
import { usePerformancePreference } from '@/hooks/use-mobile';
import { Place } from '@/lib/data'; // Use the correct type from data.ts

interface OptimizedPlaceCardProps {
    place: Place; // Use the exported type from data.ts
    index?: number;
    variant?: 'default' | 'compact' | 'featured' | 'minimal' | 'hero';
    showAnimation?: boolean;
    priority?: boolean;
    className?: string;
    onClick?: () => void;
}

// Memoized place card component for performance
export const OptimizedPlaceCard = memo(({
                                            place,
                                            index = 0,
                                            variant = 'default',
                                            showAnimation = true,
                                            priority = false,
                                            className,
                                            onClick
                                        }: OptimizedPlaceCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const { ref: inViewRef, isInView } = useThreeInView(0.05);
    const { shouldReduceMotion, shouldReduceEffects } = usePerformancePreference();

    // Safe place object with comprehensive defaults - using correct field names
    const safePlaceProps = {
        id: place?.id || `place-${index}`,
        name: place?.name || 'Unknown Place',
        city: place?.city || 'Unknown City',
        category: place?.category || 'Destination',
        image: place?.image || 'https://placehold.co/600x800/cccccc/666666?text=No+Image', // Use 'image' field
        shortDescription: place?.shortDescription || 'Discover this amazing destination',
        tags: Array.isArray(place?.tags) ? place.tags.slice(0, 3) : [],
        gallery: Array.isArray(place?.gallery) ? place.gallery : [], // Use 'gallery' field
        highlights: Array.isArray(place?.highlights) ? place.highlights : [],
        description: place?.description || '',
        history: place?.history || '',
        location: place?.location || { lat: 0, lng: 0 }
    };

    // Mouse interaction handlers with performance optimization
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || shouldReduceMotion || shouldReduceEffects) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateX = ((e.clientY - centerY) / rect.height) * 8;
        const rotateY = ((centerX - e.clientX) / rect.width) * 8;

        cardRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
        cardRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
    }, [shouldReduceMotion, shouldReduceEffects]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        if (cardRef.current && !shouldReduceMotion) {
            cardRef.current.style.setProperty('--rotate-x', '0deg');
            cardRef.current.style.setProperty('--rotate-y', '0deg');
        }
    }, [shouldReduceMotion]);

    const handleMouseEnter = useCallback(() => {
        if (!shouldReduceEffects) {
            setIsHovered(true);
        }
    }, [shouldReduceEffects]);

    // Image handlers
    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
        setImageError(false);
    }, []);

    const handleImageError = useCallback(() => {
        setImageError(true);
        setImageLoaded(false);
    }, []);

    // Variant styles configuration
    const variantStyles = {
        default: {
            container: 'aspect-[4/5]',
            title: 'text-xl md:text-2xl',
            subtitle: 'text-sm',
            padding: 'p-6'
        },
        compact: {
            container: 'aspect-[3/4]',
            title: 'text-lg md:text-xl',
            subtitle: 'text-xs',
            padding: 'p-4'
        },
        featured: {
            container: 'aspect-[16/10] md:col-span-2',
            title: 'text-2xl md:text-4xl',
            subtitle: 'text-base',
            padding: 'p-8'
        },
        minimal: {
            container: 'aspect-square',
            title: 'text-base md:text-lg',
            subtitle: 'text-xs',
            padding: 'p-4'
        },
        hero: {
            container: 'aspect-[21/9] md:col-span-3',
            title: 'text-3xl md:text-5xl',
            subtitle: 'text-lg',
            padding: 'p-12'
        }
    };

    const styles = variantStyles[variant];

    // Click handler with analytics
    const handleClick = useCallback(() => {
        onClick?.();

        // Analytics tracking (optional)
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'place_card_click', {
                place_id: safePlaceProps.id,
                place_name: safePlaceProps.name,
                variant,
                index
            });
        }
    }, [onClick, safePlaceProps.id, safePlaceProps.name, variant, index]);

    return (
        <div
            className={cn(
                "h-full group",
                showAnimation && isInView && "animate-fade-in",
                className
            )}
            ref={(node) => {
                cardRef.current = node;
                if (inViewRef.current !== node) {
                    inViewRef.current = node;
                }
            }}
        >
            <Link
                href={`/places/${safePlaceProps.id}`}
                className="block h-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded-3xl"
                onClick={handleClick}
                aria-label={`View details for ${safePlaceProps.name} in ${safePlaceProps.city}`}
            >
                <article
                    className={cn(
                        'relative h-full w-full overflow-hidden rounded-3xl cursor-pointer',
                        'transition-all duration-300 ease-out',
                        !shouldReduceEffects && 'hover:scale-[1.02]',
                        !shouldReduceMotion && '[transform:perspective(1000px)_rotateX(var(--rotate-x,0deg))_rotateY(var(--rotate-y,0deg))]',
                        styles.container
                    )}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        '--rotate-x': '0deg',
                        '--rotate-y': '0deg',
                    } as React.CSSProperties}
                >
                    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-black">

                        {/* Background Image with optimized loading - using correct field */}
                        <div className={cn(
                            "absolute inset-0 transition-transform duration-500",
                            isHovered && !shouldReduceEffects ? "scale-110" : "scale-100"
                        )}>
                            {!imageError ? (
                                <Image
                                    src={safePlaceProps.image}
                                    alt={`Beautiful view of ${safePlaceProps.name}`}
                                    fill
                                    className={cn(
                                        "object-cover transition-all duration-500",
                                        imageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
                                    )}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                    sizes={
                                        variant === 'featured' ? "(max-width: 768px) 100vw, 66vw" :
                                            variant === 'hero' ? "(max-width: 768px) 100vw, 75vw" :
                                                "(max-width: 768px) 100vw, 33vw"
                                    }
                                    priority={priority || index < 3}
                                    quality={75}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                    <Camera className="w-12 h-12 text-white/30" />
                                </div>
                            )}
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Hover Glass Effect */}
                        <div className={cn(
                            "absolute inset-0 bg-white/5 backdrop-blur-sm transition-opacity duration-300",
                            isHovered && !shouldReduceEffects ? "opacity-100" : "opacity-0"
                        )} />

                        {/* Top Section - Category and Rating */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                            <div className="glass-subtle rounded-full px-3 py-1.5 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3 text-accent" />
                                    <span className="text-white text-xs font-medium">
                    {safePlaceProps.category}
                  </span>
                                </div>
                            </div>

                            <div className="glass-subtle rounded-full px-2 py-1.5 backdrop-blur-sm">
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                    <span className="text-white text-xs font-semibold">4.8</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className={cn("absolute bottom-0 left-0 right-0 z-20", styles.padding)}>
                            <h3 className={cn(
                                "font-bold text-white text-shadow-lg leading-tight mb-3",
                                styles.title
                            )}>
                                {safePlaceProps.name}
                            </h3>

                            {safePlaceProps.shortDescription && (
                                <p className={cn(
                                    "text-primary/90 font-medium text-shadow mb-4",
                                    styles.subtitle
                                )}>
                                    {safePlaceProps.shortDescription}
                                </p>
                            )}

                            <div className={cn(
                                "flex items-center gap-2 text-white/90 mb-4",
                                styles.subtitle
                            )}>
                                <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                                <span className="font-medium truncate">{safePlaceProps.city}</span>
                            </div>

                            {/* Tags */}
                            {variant !== 'minimal' && safePlaceProps.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {safePlaceProps.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 glass-subtle rounded-full text-xs text-white/80 backdrop-blur-sm"
                                        >
                      {tag}
                    </span>
                                    ))}
                                </div>
                            )}

                            {/* Stats for featured variant */}
                            {variant === 'featured' && (
                                <div className="flex items-center gap-4 text-white/70 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4 text-blue-400" />
                                        <span>{Math.floor(Math.random() * 100) + 50} visitors</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4 text-green-400" />
                                        <span>2-3 days</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Floating Action Indicator */}
                        <div className={cn(
                            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200",
                            isHovered && !shouldReduceEffects ? "opacity-100 scale-100" : "opacity-0 scale-75"
                        )}>
                            <div className="glass-strong p-4 rounded-full backdrop-blur-lg">
                                <Camera className="h-6 w-6 text-white" />
                            </div>
                        </div>

                        {/* Bookmark button */}
                        <button
                            className={cn(
                                "absolute top-4 right-16 p-2 glass-subtle rounded-full backdrop-blur-sm transition-all duration-200",
                                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Handle bookmark functionality
                            }}
                            aria-label={`Bookmark ${safePlaceProps.name}`}
                        >
                            <Heart className="h-4 w-4 text-white hover:text-red-400 transition-colors" />
                        </button>

                        {/* Loading State */}
                        {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                                <div className={cn("absolute bottom-0 left-0 right-0", styles.padding)}>
                                    <div className={cn("h-6 bg-white/20 rounded mb-3 animate-pulse",
                                        variant === 'featured' ? 'h-8' : 'h-6')} />
                                    <div className="h-4 bg-white/10 rounded w-3/4 mb-3 animate-pulse" />
                                    <div className="flex gap-2">
                                        <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
                                        <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Accessibility enhancement */}
                        <div className="sr-only">
                            <p>Destination: {safePlaceProps.name}</p>
                            <p>Location: {safePlaceProps.city}</p>
                            <p>Category: {safePlaceProps.category}</p>
                            {safePlaceProps.shortDescription && <p>Description: {safePlaceProps.shortDescription}</p>}
                        </div>
                    </div>
                </article>
            </Link>
        </div>
    );
});

OptimizedPlaceCard.displayName = 'OptimizedPlaceCard';

// Skeleton loader for place cards
export const PlaceCardSkeleton = memo(({ variant = 'default' }: { variant?: string }) => {
    const variantStyles = {
        default: 'aspect-[4/5]',
        compact: 'aspect-[3/4]',
        featured: 'aspect-[16/10] md:col-span-2',
        minimal: 'aspect-square',
        hero: 'aspect-[21/9] md:col-span-3'
    };

    return (
        <div className={cn("rounded-3xl overflow-hidden bg-white/5 animate-pulse", variantStyles[variant as keyof typeof variantStyles])}>
            <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 relative">
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                    <div className="h-6 bg-white/20 rounded animate-pulse" />
                    <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
                        <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
});

PlaceCardSkeleton.displayName = 'PlaceCardSkeleton';