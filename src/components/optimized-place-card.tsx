'use client';

import Link from "next/link";
import Image from "next/image";
import { Camera, MapPin, Star, Clock, Users, Heart, Crown, Sparkles, Compass, Globe, Mountain, Building, TreePine } from "lucide-react";
import React, { useCallback, useRef, useState, memo } from "react";
import { cn } from "@/utils/utils";
import { useThreeInView } from '@/utils/three-utils';
import { usePerformancePreference } from '@/hooks/use-mobile';
import { Place } from '@/lib/data';

interface LuxuryPlaceCardProps {
    place: Place;
    index?: number;
    variant?: 'default' | 'compact' | 'featured' | 'minimal' | 'hero' | 'ultra' | 'destination';
    showAnimation?: boolean;
    priority?: boolean;
    className?: string;
    onClick?: () => void;
}

// Enhanced place card with ultra luxury styling and travel theming
export const OptimizedPlaceCard = memo(({
                                            place,
                                            index = 0,
                                            variant = 'default',
                                            showAnimation = true,
                                            priority = false,
                                            className,
                                            onClick
                                        }: LuxuryPlaceCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const { ref: inViewRef, isInView } = useThreeInView(0.05);
    const { shouldReduceMotion, shouldReduceEffects } = usePerformancePreference();

    // Safe place object with comprehensive defaults and proper field names
    const safePlaceProps = {
        id: place?.id || `place-${index}`,
        name: place?.name || 'Stunning Destination',
        city: place?.city || 'Premium Location',
        category: place?.category || 'Heritage Site',
        image: place?.image || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=1000',
        shortDescription: place?.shortDescription || 'Discover the breathtaking beauty and rich cultural heritage of this extraordinary destination.',
        tags: Array.isArray(place?.tags) ? place.tags.slice(0, 4) : ['Luxury', 'Heritage'],
        gallery: Array.isArray(place?.gallery) ? place.gallery : [],
        highlights: Array.isArray(place?.highlights) ? place.highlights : ['World Heritage Site', 'Architectural Marvel', 'Cultural Experience'],
        description: place?.description || '',
        history: place?.history || '',
        location: place?.location || { lat: 0, lng: 0 }
    };

    // Content truncation utilities
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + '...';
    };

    const getDisplayDescription = () => {
        const maxLength = variant === 'hero' ? 140 : variant === 'featured' ? 100 : variant === 'destination' ? 120 : 80;
        return showFullDescription ? safePlaceProps.shortDescription : truncateText(safePlaceProps.shortDescription, maxLength);
    };

    // Category icon mapping for travel themes
    const getCategoryIcon = (category: string) => {
        const categoryLower = category.toLowerCase();
        if (categoryLower.includes('heritage') || categoryLower.includes('temple') || categoryLower.includes('palace')) return Building;
        if (categoryLower.includes('mountain') || categoryLower.includes('hill')) return Mountain;
        if (categoryLower.includes('forest') || categoryLower.includes('nature')) return TreePine;
        if (categoryLower.includes('city') || categoryLower.includes('urban')) return Building;
        return Globe;
    };

    const CategoryIcon = getCategoryIcon(safePlaceProps.category);

    // Enhanced 3D hover effects with travel-specific animations
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || shouldReduceMotion || shouldReduceEffects) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateX = ((e.clientY - centerY) / rect.height) * 10;
        const rotateY = ((centerX - e.clientX) / rect.width) * 10;

        cardRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
        cardRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
        cardRef.current.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        cardRef.current.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    }, [shouldReduceMotion, shouldReduceEffects]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        if (cardRef.current && !shouldReduceMotion) {
            cardRef.current.style.setProperty('--rotate-x', '0deg');
            cardRef.current.style.setProperty('--rotate-y', '0deg');
            cardRef.current.style.setProperty('--mouse-x', '50%');
            cardRef.current.style.setProperty('--mouse-y', '50%');
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

    // Bookmark handler
    const handleBookmark = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsBookmarked(!isBookmarked);
    }, [isBookmarked]);

    // Variant styles configuration
    const variantStyles = {
        default: {
            container: 'aspect-[4/5]',
            title: 'text-xl md:text-2xl',
            subtitle: 'text-sm',
            padding: 'p-6',
            maxTags: 2
        },
        compact: {
            container: 'aspect-[3/4]',
            title: 'text-lg md:text-xl',
            subtitle: 'text-xs',
            padding: 'p-4',
            maxTags: 1
        },
        featured: {
            container: 'aspect-[16/10] md:col-span-2',
            title: 'text-2xl md:text-4xl',
            subtitle: 'text-base md:text-lg',
            padding: 'p-8',
            maxTags: 3
        },
        minimal: {
            container: 'aspect-square',
            title: 'text-base md:text-lg',
            subtitle: 'text-xs',
            padding: 'p-4',
            maxTags: 1
        },
        hero: {
            container: 'aspect-[21/9] md:col-span-3',
            title: 'text-3xl md:text-5xl',
            subtitle: 'text-lg md:text-xl',
            padding: 'p-12',
            maxTags: 4
        },
        ultra: {
            container: 'aspect-[4/5]',
            title: 'text-2xl md:text-3xl',
            subtitle: 'text-base md:text-lg',
            padding: 'p-8',
            maxTags: 3
        },
        destination: {
            container: 'aspect-[5/6]',
            title: 'text-xl md:text-2xl',
            subtitle: 'text-sm md:text-base',
            padding: 'p-6',
            maxTags: 3
        }
    };

    const styles = variantStyles[variant];

    // Click handler with analytics
    const handleClick = useCallback(() => {
        onClick?.();

        // Analytics tracking (optional)
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'luxury_destination_click', {
                place_id: safePlaceProps.id,
                place_name: safePlaceProps.name,
                variant,
                index,
                category: safePlaceProps.category
            });
        }
    }, [onClick, safePlaceProps.id, safePlaceProps.name, safePlaceProps.category, variant, index]);

    // Generate dynamic rating and visitor stats
    const rating = 4.7 + (Math.random() * 0.3);
    const visitorCount = Math.floor(Math.random() * 500) + 200;
    const monthlyVisitors = Math.floor(Math.random() * 2000) + 1000;

    // Determine destination badge
    const getDestinationBadge = () => {
        if (safePlaceProps.category.toLowerCase().includes('heritage')) return 'UNESCO';
        if (index === 0) return 'FEATURED';
        if (rating > 4.8) return 'TOP RATED';
        return null;
    };

    const destinationBadge = getDestinationBadge();

    return (
        <div
            className={cn(
                "h-full group relative",
                showAnimation && isInView && "animate-fade-in-up",
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
                className="block h-full focus:outline-none focus:ring-2 focus:ring-thistle-400 focus:ring-offset-2 focus:ring-offset-black rounded-3xl"
                onClick={handleClick}
                aria-label={`Explore ${safePlaceProps.name} in ${safePlaceProps.city} - ${safePlaceProps.category}`}
            >
                <article
                    className={cn(
                        'card-luxury relative h-full w-full overflow-hidden cursor-pointer',
                        'transition-all duration-500 ease-out',
                        !shouldReduceEffects && 'hover-luxury',
                        !shouldReduceMotion && '[transform:perspective(1000px)_rotateX(var(--rotate-x,0deg))_rotateY(var(--rotate-y,0deg))]',
                        styles.container
                    )}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        '--rotate-x': '0deg',
                        '--rotate-y': '0deg',
                        '--mouse-x': '50%',
                        '--mouse-y': '50%',
                    } as React.CSSProperties}
                >
                    {/* Enhanced gradient background for ultra luxury destinations */}
                    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-gradient-to-br from-thistle-900/30 via-uranian-900/20 to-sky-900/30">

                        {/* Dynamic background image with enhanced effects */}
                        <div className={cn(
                            "absolute inset-0 transition-all duration-700 ease-out",
                            isHovered && !shouldReduceEffects ? "scale-110 rotate-1" : "scale-100 rotate-0"
                        )}>
                            {!imageError ? (
                                <Image
                                    src={safePlaceProps.image}
                                    alt={`Beautiful view of ${safePlaceProps.name}`}
                                    fill
                                    className={cn(
                                        "object-cover transition-all duration-700 ease-out",
                                        imageLoaded ? "scale-100 opacity-100 blur-0" : "scale-110 opacity-0 blur-sm"
                                    )}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                    sizes={
                                        variant === 'featured' ? "(max-width: 768px) 100vw, 66vw" :
                                            variant === 'hero' ? "(max-width: 768px) 100vw, 75vw" :
                                                "(max-width: 768px) 100vw, 50vw"
                                    }
                                    priority={priority || index < 3}
                                    quality={85}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-thistle-800 via-uranian-800 to-sky-800 flex items-center justify-center">
                                    <Camera className="w-16 h-16 text-white/40" />
                                </div>
                            )}

                            {/* Interactive hover spotlight */}
                            <div
                                className={cn(
                                    "absolute inset-0 opacity-0 transition-opacity duration-500",
                                    isHovered && "opacity-100"
                                )}
                                style={{
                                    background: `radial-gradient(circle 200px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.1), transparent 70%)`
                                }}
                            />
                        </div>

                        {/* Enhanced gradient overlays for travel destinations */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-thistle-900/20 via-transparent to-uranian-900/20" />

                        {/* Luxury glass effect with destination theming */}
                        <div className={cn(
                            "absolute inset-0 transition-all duration-500 glass-dreamy",
                            isHovered && !shouldReduceEffects ? "opacity-100" : "opacity-0"
                        )} />

                        {/* Top section - Category, Rating, and Destination Badge */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-30">
                            <div className="flex flex-col gap-2">
                                {/* Category Badge */}
                                <div className="glass-luxury rounded-full px-4 py-2 backdrop-blur-md border border-white/20">
                                    <div className="flex items-center gap-2">
                                        <CategoryIcon className="h-4 w-4 text-thistle-400" />
                                        <span className="text-white font-semibold text-sm">
                                            {truncateText(safePlaceProps.category, 15)}
                                        </span>
                                    </div>
                                </div>

                                {/* Rating Badge */}
                                <div className="glass-luxury rounded-full px-3 py-1.5 backdrop-blur-md border border-white/20">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                        <span className="text-white text-xs font-bold">{rating.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 items-end">
                                {/* Destination Badge */}
                                {destinationBadge && (
                                    <div className={cn(
                                        "glass-strong rounded-full px-3 py-1.5 backdrop-blur-md border",
                                        destinationBadge === 'UNESCO'
                                            ? "bg-gradient-to-r from-thistle-500/40 to-uranian-500/40 border-thistle-300/50"
                                            : destinationBadge === 'FEATURED'
                                                ? "bg-gradient-to-r from-carnation-500/40 to-fairy-500/40 border-carnation-300/50"
                                                : "bg-gradient-to-r from-yellow-500/40 to-orange-500/40 border-yellow-300/50"
                                    )}>
                                        <div className="flex items-center gap-1">
                                            {destinationBadge === 'UNESCO' ? (
                                                <Crown className="h-3 w-3 text-thistle-300 fill-current" />
                                            ) : destinationBadge === 'FEATURED' ? (
                                                <Sparkles className="h-3 w-3 text-carnation-300 fill-current" />
                                            ) : (
                                                <Star className="h-3 w-3 text-yellow-300 fill-current" />
                                            )}
                                            <span className={cn(
                                                "text-xs font-bold tracking-wider",
                                                destinationBadge === 'UNESCO' ? "text-thistle-200" :
                                                    destinationBadge === 'FEATURED' ? "text-carnation-200" :
                                                        "text-yellow-200"
                                            )}>
                                                {destinationBadge}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Bookmark Button */}
                                <button
                                    onClick={handleBookmark}
                                    className={cn(
                                        "p-2 glass-luxury rounded-full backdrop-blur-md border border-white/20",
                                        "transition-all duration-300 hover:scale-110",
                                        isBookmarked ? "bg-thistle-500/30" : "hover:bg-white/10"
                                    )}
                                    aria-label={`${isBookmarked ? 'Remove from' : 'Add to'} travel wishlist`}
                                >
                                    <Heart className={cn(
                                        "h-4 w-4 transition-all duration-300",
                                        isBookmarked ? "text-thistle-400 fill-current scale-110" : "text-white/80 hover:text-thistle-400"
                                    )} />
                                </button>
                            </div>
                        </div>

                        {/* Main content section */}
                        <div className={cn("absolute bottom-0 left-0 right-0 z-30", styles.padding)}>
                            {/* Destination title */}
                            <h3 className={cn(
                                "font-bold text-white text-shadow-lg leading-tight mb-3 transition-all duration-300",
                                styles.title,
                                isHovered && "text-gradient-luxury"
                            )}>
                                {truncateText(safePlaceProps.name, variant === 'hero' ? 50 : variant === 'featured' ? 40 : 30)}
                            </h3>

                            {/* Description with read more */}
                            <div className="mb-4">
                                <p className={cn(
                                    "text-thistle-200 font-medium text-shadow leading-relaxed",
                                    styles.subtitle
                                )}>
                                    {getDisplayDescription()}
                                </p>
                                {safePlaceProps.shortDescription.length > (variant === 'hero' ? 140 : variant === 'featured' ? 100 : 80) && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowFullDescription(!showFullDescription);
                                        }}
                                        className="text-thistle-400 text-xs font-semibold hover:text-thistle-300 transition-colors mt-1"
                                    >
                                        {showFullDescription ? 'Show less' : 'Read more'}
                                    </button>
                                )}
                            </div>

                            {/* Location display */}
                            <div className={cn(
                                "flex items-center gap-2 text-white/90 mb-4",
                                styles.subtitle
                            )}>
                                <MapPin className="h-4 w-4 text-uranian-400 flex-shrink-0" />
                                <span className="font-semibold truncate">
                                    {safePlaceProps.city}
                                </span>
                                <Compass className="h-3 w-3 text-sky-400 ml-2" />
                            </div>

                            {/* Destination highlights for featured variants */}
                            {(variant === 'featured' || variant === 'hero' || variant === 'ultra' || variant === 'destination') && safePlaceProps.highlights.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {safePlaceProps.highlights.slice(0, variant === 'hero' ? 3 : 2).map((highlight, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 glass-dreamy rounded-full text-xs text-white/90 backdrop-blur-sm border border-white/20 font-medium"
                                            >
                                                {truncateText(highlight, 18)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Travel stats */}
                            {variant !== 'minimal' && (
                                <div className={cn("flex items-center gap-6 text-white/80 mb-4", styles.subtitle)}>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4 text-thistle-400" />
                                        <span className="text-xs font-medium">{visitorCount}+ visitors</span>
                                    </div>
                                    {(variant === 'featured' || variant === 'hero' || variant === 'ultra' || variant === 'destination') && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-uranian-400" />
                                            <span className="text-xs font-medium">2-4 hours</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tags display */}
                            {safePlaceProps.tags.length > 0 && variant !== 'minimal' && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {safePlaceProps.tags.slice(0, styles.maxTags).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gradient-to-r from-thistle-500/20 to-uranian-500/20 rounded-full text-xs text-white/90 backdrop-blur-sm border border-white/10 font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Exploration CTA */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <Globe className="h-4 w-4 text-sky-400" />
                                        <span className="text-white/70 text-xs font-medium">Discover More</span>
                                    </div>
                                </div>

                                <div className={cn(
                                    "flex items-center gap-3 text-thistle-300 font-bold transition-all duration-300",
                                    isHovered && !shouldReduceEffects ? "opacity-100 translate-x-0 scale-105" : "opacity-80 -translate-x-2"
                                )}>
                                    <span className={cn(
                                        "text-gradient-sky font-bold tracking-wide",
                                        styles.subtitle
                                    )}>
                                        {variant === 'hero' ? 'Explore Destination' : variant === 'destination' ? 'Plan Visit' : 'Explore'}
                                    </span>
                                    <Compass className={cn(
                                        "transition-all duration-300",
                                        variant === 'hero' ? 'h-6 w-6' : 'h-5 w-5',
                                        isHovered && !shouldReduceEffects && "translate-x-2 scale-110 rotate-12"
                                    )} />
                                </div>
                            </div>
                        </div>

                        {/* Floating interactive visitor info */}
                        <div className={cn(
                            "absolute top-1/2 right-6 transform -translate-y-1/2 pointer-events-none transition-all duration-500",
                            isHovered && !shouldReduceEffects ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-75 translate-x-8"
                        )}>
                            <div className="glass-strong p-4 text-center rounded-2xl backdrop-blur-lg border border-white/20">
                                <div className="text-white font-bold text-lg mb-1">{monthlyVisitors.toLocaleString()}</div>
                                <div className="text-white/70 text-xs">monthly visitors</div>
                                <div className="mt-2 flex justify-center">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Floating travel particles effect */}
                        {isHovered && !shouldReduceEffects && (
                            <div className="absolute inset-0 pointer-events-none z-20">
                                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-thistle-400/60 rounded-full animate-ping" />
                                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-uranian-400/60 rounded-full animate-ping animation-delay-500" />
                                <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-sky-400/60 rounded-full animate-ping animation-delay-1000" />
                            </div>
                        )}

                        {/* Loading state with luxury destination skeleton */}
                        {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 bg-gradient-to-br from-thistle-900 via-uranian-900 to-sky-900">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                                <div className={cn("absolute bottom-0 left-0 right-0", styles.padding)}>
                                    <div className={cn(
                                        "bg-white/20 rounded-xl mb-3 animate-pulse",
                                        variant === 'featured' || variant === 'hero' ? 'h-10' : 'h-8'
                                    )} />
                                    <div className="h-5 bg-white/15 rounded-lg w-3/4 mb-3 animate-pulse" />
                                    <div className="h-4 bg-white/10 rounded-lg w-1/2 mb-4 animate-pulse" />
                                    <div className="flex gap-2 mb-4">
                                        <div className="h-6 bg-white/15 rounded-full w-16 animate-pulse" />
                                        <div className="h-6 bg-white/15 rounded-full w-20 animate-pulse" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-5 bg-white/20 rounded-lg w-20 animate-pulse" />
                                        <div className="h-5 bg-white/15 rounded-lg w-16 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Accessibility enhancement */}
                        <div className="sr-only">
                            <p>Destination: {safePlaceProps.name}</p>
                            <p>Location: {safePlaceProps.city}</p>
                            <p>Category: {safePlaceProps.category}</p>
                            <p>Description: {safePlaceProps.shortDescription}</p>
                            <p>Rating: {rating.toFixed(1)} stars</p>
                            <p>Monthly visitors: {monthlyVisitors.toLocaleString()}</p>
                        </div>
                    </div>
                </article>
            </Link>
        </div>
    );
});

OptimizedPlaceCard.displayName = 'OptimizedPlaceCard';

// Enhanced skeleton loader for place cards with destination theming
export const PlaceCardSkeleton = memo(({ variant = 'default' }: { variant?: string }) => {
    const variantStyles = {
        default: 'aspect-[4/5]',
        compact: 'aspect-[3/4]',
        featured: 'aspect-[16/10] md:col-span-2',
        minimal: 'aspect-square',
        hero: 'aspect-[21/9] md:col-span-3',
        ultra: 'aspect-[4/5]',
        destination: 'aspect-[5/6]'
    };

    return (
        <div className={cn(
            "card-luxury overflow-hidden animate-pulse",
            variantStyles[variant as keyof typeof variantStyles]
        )}>
            <div className="h-full bg-gradient-to-br from-thistle-900/50 via-uranian-900/30 to-sky-900/50 relative">
                {/* Floating skeleton elements */}
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="h-8 w-24 bg-white/20 rounded-full animate-pulse" />
                        <div className="h-6 w-16 bg-white/15 rounded-full animate-pulse" />
                    </div>
                    <div className="h-8 w-8 bg-white/20 rounded-full animate-pulse" />
                </div>

                <div className="absolute bottom-6 left-6 right-6 space-y-4">
                    <div className="h-8 bg-white/30 rounded-xl animate-pulse" />
                    <div className="h-5 bg-white/20 rounded-lg w-3/4 animate-pulse" />
                    <div className="h-4 bg-white/15 rounded-lg w-1/2 animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-6 w-16 bg-white/15 rounded-full animate-pulse" />
                        <div className="h-6 w-20 bg-white/15 rounded-full animate-pulse" />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="h-5 bg-white/20 rounded-lg w-20 animate-pulse" />
                        <div className="h-5 bg-white/15 rounded-lg w-16 animate-pulse" />
                    </div>
                </div>

                {/* Travel-themed shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmerLuxury" />

                {/* Floating destination icons */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <Globe className="absolute top-1/3 right-1/4 h-6 w-6 text-thistle-400 animate-pulse" />
                    <Mountain className="absolute bottom-1/3 left-1/4 h-5 w-5 text-uranian-400 animate-pulse animation-delay-1000" />
                </div>
            </div>
        </div>
    );
});

PlaceCardSkeleton.displayName = 'PlaceCardSkeleton';