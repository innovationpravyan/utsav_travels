'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, DollarSign, MapPin, Sparkles, Star, Users, Calendar, Award, Crown, Gem, Heart, Camera } from "lucide-react";
import React, { useCallback, useRef, useState, memo } from "react";
import { cn } from "@/utils/utils";
import { useThreeInView } from '@/utils/three-utils';
import { usePerformancePreference } from '@/hooks/use-mobile';
import { Package } from '@/lib/data';

interface LuxuryPackageCardProps {
    pkg: Package;
    index?: number;
    variant?: 'default' | 'compact' | 'featured' | 'minimal' | 'premium' | 'hero' | 'ultra';
    showAnimation?: boolean;
    priority?: boolean;
    className?: string;
    onClick?: () => void;
}

// Enhanced package card with ultra luxury styling and content truncation
export const OptimizedPackageCard = memo(({
                                              pkg,
                                              index = 0,
                                              variant = 'default',
                                              showAnimation = true,
                                              priority = false,
                                              className,
                                              onClick
                                          }: LuxuryPackageCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const { ref: inViewRef, isInView } = useThreeInView(0.05);
    const { shouldReduceMotion, shouldReduceEffects } = usePerformancePreference();

    // Safe package object with comprehensive defaults and proper field names
    const safePackageProps = {
        id: pkg?.id || `package-${index}`,
        name: pkg?.name || 'Luxury Travel Experience',
        description: pkg?.description || 'Embark on an extraordinary journey through breathtaking destinations with our premium travel packages.',
        duration: pkg?.duration || '5 Days / 4 Nights',
        cities: Array.isArray(pkg?.cities) ? pkg.cities.slice(0, 4) : ['Premium Destination'],
        image: pkg?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=1000',
        highlights: Array.isArray(pkg?.highlights) ? pkg.highlights : ['Luxury Accommodation', 'Private Transfers', 'Guided Tours'],
        itinerary: Array.isArray(pkg?.itinerary) ? pkg.itinerary : [],
        inclusions: Array.isArray(pkg?.inclusions) ? pkg.inclusions : [],
        gallery: Array.isArray(pkg?.gallery) ? pkg.gallery : [],
        tags: Array.isArray(pkg?.tags) ? pkg.tags.slice(0, 3) : ['Premium', 'Luxury'],
        price: pkg?.price || 'Contact for pricing',
        originalPrice: pkg?.originalPrice,
        discount: pkg?.discount
    };

    // Content truncation utilities
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + '...';
    };

    const getDisplayDescription = () => {
        const maxLength = variant === 'hero' ? 150 : variant === 'featured' ? 120 : 80;
        return showFullDescription ? safePackageProps.description : truncateText(safePackageProps.description, maxLength);
    };

    // Enhanced 3D hover effects
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || shouldReduceMotion || shouldReduceEffects) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateX = ((e.clientY - centerY) / rect.height) * 12;
        const rotateY = ((centerX - e.clientX) / rect.width) * 12;

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
            maxCities: 2
        },
        compact: {
            container: 'aspect-[3/4]',
            title: 'text-lg md:text-xl',
            subtitle: 'text-xs',
            padding: 'p-4',
            maxCities: 1
        },
        featured: {
            container: 'aspect-[16/9] md:col-span-2',
            title: 'text-2xl md:text-4xl',
            subtitle: 'text-base md:text-lg',
            padding: 'p-8',
            maxCities: 3
        },
        minimal: {
            container: 'aspect-[5/4]',
            title: 'text-base md:text-lg',
            subtitle: 'text-xs',
            padding: 'p-4',
            maxCities: 1
        },
        premium: {
            container: 'aspect-[4/5]',
            title: 'text-xl md:text-2xl',
            subtitle: 'text-sm md:text-base',
            padding: 'p-6',
            maxCities: 2
        },
        hero: {
            container: 'aspect-[21/9] md:col-span-3',
            title: 'text-3xl md:text-5xl',
            subtitle: 'text-lg md:text-xl',
            padding: 'p-12',
            maxCities: 4
        },
        ultra: {
            container: 'aspect-[4/5]',
            title: 'text-2xl md:text-3xl',
            subtitle: 'text-base md:text-lg',
            padding: 'p-8',
            maxCities: 3
        }
    };

    const styles = variantStyles[variant];

    // Price extraction and formatting
    const priceString = safePackageProps.price?.toString() || 'Contact for pricing';
    const priceMatch = priceString.match(/[\d,]+/);
    const priceNumber = priceMatch ? priceMatch[0] : priceString;
    const currency = priceString.includes('₹') ? '₹' : '$';

    // Click handler with analytics
    const handleClick = useCallback(() => {
        onClick?.();

        // Analytics tracking (optional)
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'luxury_package_click', {
                package_id: safePackageProps.id,
                package_name: safePackageProps.name,
                variant,
                index,
                price: safePackageProps.price
            });
        }
    }, [onClick, safePackageProps.id, safePackageProps.name, safePackageProps.price, variant, index]);

    // Generate dynamic rating and stats
    const rating = 4.8 + (Math.random() * 0.2);
    const reviewCount = Math.floor(Math.random() * 300) + 100;
    const popularityScore = Math.floor(Math.random() * 50) + 50;

    // Determine luxury badge
    const getLuxuryBadge = () => {
        if (variant === 'premium' || variant === 'ultra') return 'PREMIUM';
        if (index === 0) return 'BESTSELLER';
        if (popularityScore > 80) return 'POPULAR';
        return null;
    };

    const luxuryBadge = getLuxuryBadge();

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
                href={`/packages/${safePackageProps.id}`}
                className="block h-full focus:outline-none focus:ring-2 focus:ring-carnation-400 focus:ring-offset-2 focus:ring-offset-black rounded-3xl"
                onClick={handleClick}
                aria-label={`Explore ${safePackageProps.name} - ${safePackageProps.duration} luxury tour package`}
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
                    {/* Enhanced gradient background for ultra luxury */}
                    <div className={cn(
                        "relative h-full w-full overflow-hidden rounded-3xl",
                        variant === 'premium' || variant === 'ultra'
                            ? "bg-gradient-to-br from-thistle-900/30 via-fairy-900/20 to-carnation-900/30"
                            : "bg-gradient-to-br from-black/80 to-black/60"
                    )}>

                        {/* Dynamic background image with enhanced effects */}
                        <div className={cn(
                            "absolute inset-0 transition-all duration-700 ease-out",
                            isHovered && !shouldReduceEffects ? "scale-110 rotate-1" : "scale-100 rotate-0"
                        )}>
                            {!imageError ? (
                                <Image
                                    src={safePackageProps.image}
                                    alt={`${safePackageProps.name} luxury travel package`}
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
                                <div className="w-full h-full bg-gradient-to-br from-thistle-800 via-fairy-800 to-carnation-800 flex items-center justify-center">
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

                        {/* Enhanced gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-thistle-900/20 via-transparent to-carnation-900/20" />

                        {/* Luxury glass effect */}
                        <div className={cn(
                            "absolute inset-0 transition-all duration-500",
                            variant === 'premium' || variant === 'ultra'
                                ? "glass-luxury"
                                : "glass-dreamy",
                            isHovered && !shouldReduceEffects ? "opacity-100" : "opacity-0"
                        )} />

                        {/* Top section - Duration, Rating, and Luxury Badge */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-30">
                            <div className="flex flex-col gap-2">
                                {/* Duration Badge */}
                                <div className="glass-luxury rounded-full px-4 py-2 backdrop-blur-md border border-white/20">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-uranian-400" />
                                        <span className="text-white font-semibold text-sm">
                                            {safePackageProps.duration}
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
                                {/* Luxury Badge */}
                                {luxuryBadge && (
                                    <div className={cn(
                                        "glass-strong rounded-full px-3 py-1.5 backdrop-blur-md border",
                                        luxuryBadge === 'PREMIUM'
                                            ? "bg-gradient-to-r from-carnation-500/40 to-fairy-500/40 border-carnation-300/50"
                                            : luxuryBadge === 'BESTSELLER'
                                                ? "bg-gradient-to-r from-yellow-500/40 to-orange-500/40 border-yellow-300/50"
                                                : "bg-gradient-to-r from-thistle-500/40 to-uranian-500/40 border-thistle-300/50"
                                    )}>
                                        <div className="flex items-center gap-1">
                                            {luxuryBadge === 'PREMIUM' ? (
                                                <Crown className="h-3 w-3 text-carnation-300 fill-current" />
                                            ) : luxuryBadge === 'BESTSELLER' ? (
                                                <Award className="h-3 w-3 text-yellow-300 fill-current" />
                                            ) : (
                                                <Sparkles className="h-3 w-3 text-thistle-300 fill-current" />
                                            )}
                                            <span className={cn(
                                                "text-xs font-bold tracking-wider",
                                                luxuryBadge === 'PREMIUM' ? "text-carnation-200" :
                                                    luxuryBadge === 'BESTSELLER' ? "text-yellow-200" :
                                                        "text-thistle-200"
                                            )}>
                                                {luxuryBadge}
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
                                        isBookmarked ? "bg-carnation-500/30" : "hover:bg-white/10"
                                    )}
                                    aria-label={`${isBookmarked ? 'Remove from' : 'Add to'} wishlist`}
                                >
                                    <Heart className={cn(
                                        "h-4 w-4 transition-all duration-300",
                                        isBookmarked ? "text-carnation-400 fill-current scale-110" : "text-white/80 hover:text-carnation-400"
                                    )} />
                                </button>
                            </div>
                        </div>

                        {/* Main content section */}
                        <div className={cn("absolute bottom-0 left-0 right-0 z-30", styles.padding)}>
                            {/* Package title */}
                            <h3 className={cn(
                                "font-bold text-white text-shadow-lg leading-tight mb-3 transition-all duration-300",
                                styles.title,
                                isHovered && "text-gradient-luxury"
                            )}>
                                {truncateText(safePackageProps.name, variant === 'hero' ? 60 : variant === 'featured' ? 50 : 40)}
                            </h3>

                            {/* Description with read more */}
                            <div className="mb-4">
                                <p className={cn(
                                    "text-fairy-200 font-medium text-shadow leading-relaxed",
                                    styles.subtitle
                                )}>
                                    {getDisplayDescription()}
                                </p>
                                {safePackageProps.description.length > (variant === 'hero' ? 150 : variant === 'featured' ? 120 : 80) && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowFullDescription(!showFullDescription);
                                        }}
                                        className="text-carnation-400 text-xs font-semibold hover:text-carnation-300 transition-colors mt-1"
                                    >
                                        {showFullDescription ? 'Show less' : 'Read more'}
                                    </button>
                                )}
                            </div>

                            {/* Cities display */}
                            <div className={cn(
                                "flex items-center gap-2 text-white/90 mb-4",
                                styles.subtitle
                            )}>
                                <MapPin className="h-4 w-4 text-uranian-400 flex-shrink-0" />
                                <span className="font-semibold truncate">
                                    {safePackageProps.cities.length > styles.maxCities
                                        ? `${safePackageProps.cities.slice(0, styles.maxCities).join(', ')} +${safePackageProps.cities.length - styles.maxCities} more`
                                        : safePackageProps.cities.join(', ')
                                    }
                                </span>
                            </div>

                            {/* Package highlights for featured variants */}
                            {(variant === 'featured' || variant === 'hero' || variant === 'ultra') && safePackageProps.highlights.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {safePackageProps.highlights.slice(0, variant === 'hero' ? 4 : 3).map((highlight, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 glass-dreamy rounded-full text-xs text-white/90 backdrop-blur-sm border border-white/20 font-medium"
                                            >
                                                {truncateText(highlight, 20)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Package stats */}
                            {variant !== 'minimal' && (
                                <div className={cn("flex items-center gap-6 text-white/80 mb-4", styles.subtitle)}>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4 text-thistle-400" />
                                        <span className="text-xs font-medium">{reviewCount} reviews</span>
                                    </div>
                                    {variant === 'featured' || variant === 'hero' || variant === 'ultra' ? (
                                        <div className="flex items-center gap-1">
                                            <Gem className="h-4 w-4 text-carnation-400" />
                                            <span className="text-xs font-medium">Luxury Experience</span>
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            {/* Tags for larger variants */}
                            {(variant === 'featured' || variant === 'hero' || variant === 'ultra') && safePackageProps.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {safePackageProps.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gradient-to-r from-thistle-500/20 to-carnation-500/20 rounded-full text-xs text-white/90 backdrop-blur-sm border border-white/10 font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Price and CTA section */}
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-uranian-400" />
                                        <span className={cn(
                                            "text-uranian-300 font-bold",
                                            variant === 'hero' ? 'text-2xl' : variant === 'featured' ? 'text-xl' : 'text-lg'
                                        )}>
                                            {priceNumber !== priceString ? `${currency}${priceNumber}` : priceString}
                                        </span>
                                    </div>
                                    {variant !== 'minimal' && (
                                        <span className="text-white/60 text-xs">per person</span>
                                    )}
                                </div>

                                <div className={cn(
                                    "flex items-center gap-3 text-carnation-300 font-bold transition-all duration-300",
                                    isHovered && !shouldReduceEffects ? "opacity-100 translate-x-0 scale-105" : "opacity-80 -translate-x-2"
                                )}>
                                    <span className={cn(
                                        "text-gradient-dreamy font-bold tracking-wide",
                                        styles.subtitle
                                    )}>
                                        {variant === 'hero' ? 'Explore Luxury' : variant === 'ultra' ? 'Book Premium' : 'Book Now'}
                                    </span>
                                    <ArrowRight className={cn(
                                        "transition-all duration-300",
                                        variant === 'hero' ? 'h-6 w-6' : 'h-5 w-5',
                                        isHovered && !shouldReduceEffects && "translate-x-2 scale-110"
                                    )} />
                                </div>
                            </div>
                        </div>

                        {/* Floating interactive elements */}
                        <div className={cn(
                            "absolute top-1/2 right-6 transform -translate-y-1/2 pointer-events-none transition-all duration-500",
                            isHovered && !shouldReduceEffects ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-75 translate-x-8"
                        )}>
                            <div className="glass-strong p-4 text-center rounded-2xl backdrop-blur-lg border border-white/20">
                                <div className="text-white font-bold text-xl mb-1">{priceNumber}</div>
                                <div className="text-white/70 text-xs">Starting from</div>
                                <div className="mt-2 flex justify-center">
                                    <Sparkles className="h-5 w-5 text-carnation-400 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Floating particles effect */}
                        {isHovered && !shouldReduceEffects && (
                            <div className="absolute inset-0 pointer-events-none z-20">
                                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-carnation-400/60 rounded-full animate-ping" />
                                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-fairy-400/60 rounded-full animate-ping animation-delay-500" />
                                <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-thistle-400/60 rounded-full animate-ping animation-delay-1000" />
                            </div>
                        )}

                        {/* Loading state with luxury skeleton */}
                        {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 bg-gradient-to-br from-thistle-900 via-fairy-900 to-carnation-900">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                                <div className={cn("absolute bottom-0 left-0 right-0", styles.padding)}>
                                    <div className={cn(
                                        "bg-white/20 rounded-xl mb-3 animate-pulse",
                                        variant === 'featured' || variant === 'hero' ? 'h-10' : 'h-8'
                                    )} />
                                    <div className="h-5 bg-white/15 rounded-lg w-3/4 mb-3 animate-pulse" />
                                    <div className="h-4 bg-white/10 rounded-lg w-1/2 mb-4 animate-pulse" />
                                    <div className="flex justify-between items-center">
                                        <div className="h-6 bg-white/20 rounded-lg w-24 animate-pulse" />
                                        <div className="h-5 bg-white/15 rounded-lg w-20 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Accessibility enhancement */}
                        <div className="sr-only">
                            <p>Luxury Package: {safePackageProps.name}</p>
                            <p>Duration: {safePackageProps.duration}</p>
                            <p>Destinations: {safePackageProps.cities.join(', ')}</p>
                            <p>Price: {safePackageProps.price}</p>
                            <p>Description: {safePackageProps.description}</p>
                            <p>Rating: {rating.toFixed(1)} stars with {reviewCount} reviews</p>
                        </div>
                    </div>
                </article>
            </Link>
        </div>
    );
});

OptimizedPackageCard.displayName = 'OptimizedPackageCard';

// Enhanced skeleton loader with luxury styling
export const PackageCardSkeleton = memo(({ variant = 'default' }: { variant?: string }) => {
    const variantStyles = {
        default: 'aspect-[4/5]',
        compact: 'aspect-[3/4]',
        featured: 'aspect-[16/9] md:col-span-2',
        minimal: 'aspect-[5/4]',
        premium: 'aspect-[4/5]',
        hero: 'aspect-[21/9] md:col-span-3',
        ultra: 'aspect-[4/5]'
    };

    return (
        <div className={cn(
            "card-luxury overflow-hidden animate-pulse",
            variantStyles[variant as keyof typeof variantStyles]
        )}>
            <div className="h-full bg-gradient-to-br from-thistle-900/50 via-fairy-900/30 to-carnation-900/50 relative">
                {/* Floating skeleton elements */}
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <div className="h-8 w-20 bg-white/20 rounded-full animate-pulse" />
                    <div className="h-8 w-8 bg-white/20 rounded-full animate-pulse" />
                </div>

                <div className="absolute bottom-6 left-6 right-6 space-y-4">
                    <div className="h-8 bg-white/30 rounded-xl animate-pulse" />
                    <div className="h-5 bg-white/20 rounded-lg w-3/4 animate-pulse" />
                    <div className="h-4 bg-white/15 rounded-lg w-1/2 animate-pulse" />
                    <div className="flex justify-between items-center">
                        <div className="h-6 bg-white/25 rounded-lg w-24 animate-pulse" />
                        <div className="h-5 bg-white/20 rounded-lg w-20 animate-pulse" />
                    </div>
                </div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmerLuxury" />
            </div>
        </div>
    );
});

PackageCardSkeleton.displayName = 'PackageCardSkeleton';