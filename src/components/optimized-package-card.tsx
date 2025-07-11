'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, DollarSign, MapPin, Sparkles, Star, Users, Calendar, Award } from "lucide-react";
import React, { useCallback, useRef, useState, memo } from "react";
import { cn } from "@/utils/utils";
import { useThreeInView } from '@/utils/three-utils';
import { usePerformancePreference } from '@/hooks/use-mobile';
import { Package } from '@/lib/data'; // Use the correct type from data.ts

interface OptimizedPackageCardProps {
    pkg: Package; // Use the exported type from data.ts
    index?: number;
    variant?: 'default' | 'compact' | 'featured' | 'minimal' | 'premium' | 'hero';
    showAnimation?: boolean;
    priority?: boolean;
    className?: string;
    onClick?: () => void;
}

// Memoized package card component for performance
export const OptimizedPackageCard = memo(({
                                              pkg,
                                              index = 0,
                                              variant = 'default',
                                              showAnimation = true,
                                              priority = false,
                                              className,
                                              onClick
                                          }: OptimizedPackageCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const { ref: inViewRef, isInView } = useThreeInView(0.05);
    const { shouldReduceMotion, shouldReduceEffects } = usePerformancePreference();

    // Safe package object with comprehensive defaults - using correct field names
    const safePackageProps = {
        id: pkg?.id || `package-${index}`,
        name: pkg?.name || 'Unknown Package',
        description: pkg?.description || 'An amazing travel experience awaits you.',
        duration: pkg?.duration || '3 Days',
        cities: Array.isArray(pkg?.cities) ? pkg.cities.slice(0, 3) : ['Unknown City'],
        image: pkg?.image || 'https://placehold.co/600x800/cccccc/666666?text=No+Image', // Use 'image' field
        highlights: Array.isArray(pkg?.highlights) ? pkg.highlights : [],
        itinerary: Array.isArray(pkg?.itinerary) ? pkg.itinerary : [],
        inclusions: Array.isArray(pkg?.inclusions) ? pkg.inclusions : [],
        gallery: Array.isArray(pkg?.gallery) ? pkg.gallery : [], // Use 'gallery' field
        tags: Array.isArray(pkg?.tags) ? pkg.tags.slice(0, 4) : [],
        // Handle price field properly
        price: pkg?.price || 'Contact for pricing',
        originalPrice: pkg?.originalPrice,
        discount: pkg?.discount
    };

    // Mouse interaction handlers with performance optimization
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || shouldReduceMotion || shouldReduceEffects) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateX = ((e.clientY - centerY) / rect.height) * 6;
        const rotateY = ((centerX - e.clientX) / rect.width) * 6;

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
            container: 'aspect-[16/9] md:col-span-2',
            title: 'text-2xl md:text-3xl',
            subtitle: 'text-base',
            padding: 'p-8'
        },
        minimal: {
            container: 'aspect-[5/4]',
            title: 'text-base md:text-lg',
            subtitle: 'text-xs',
            padding: 'p-4'
        },
        premium: {
            container: 'aspect-[4/5]',
            title: 'text-xl md:text-2xl',
            subtitle: 'text-sm',
            padding: 'p-6'
        },
        hero: {
            container: 'aspect-[21/9] md:col-span-3',
            title: 'text-3xl md:text-4xl',
            subtitle: 'text-lg',
            padding: 'p-12'
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
            window.gtag('event', 'package_card_click', {
                package_id: safePackageProps.id,
                package_name: safePackageProps.name,
                variant,
                index,
                price: safePackageProps.price
            });
        }
    }, [onClick, safePackageProps.id, safePackageProps.name, safePackageProps.price, variant, index]);

    // Generate rating and review count
    const rating = 4.7 + (Math.random() * 0.3);
    const reviewCount = Math.floor(Math.random() * 200) + 50;

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
                href={`/packages/${safePackageProps.id}`}
                className="block h-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded-3xl"
                onClick={handleClick}
                aria-label={`View ${safePackageProps.name} package details - ${safePackageProps.duration} tour`}
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
                    <div className={cn(
                        "relative h-full w-full overflow-hidden rounded-3xl",
                        variant === 'premium'
                            ? "bg-gradient-to-br from-yellow-900/20 via-black to-orange-900/20"
                            : "bg-black"
                    )}>

                        {/* Background Image - using correct field */}
                        <div className={cn(
                            "absolute inset-0 transition-transform duration-500",
                            isHovered && !shouldReduceEffects ? "scale-110" : "scale-100"
                        )}>
                            {!imageError ? (
                                <Image
                                    src={safePackageProps.image}
                                    alt={`${safePackageProps.name} tour package`}
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
                                    <Calendar className="w-12 h-12 text-white/30" />
                                </div>
                            )}
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Hover Glass Effect */}
                        <div className={cn(
                            "absolute inset-0 transition-opacity duration-300",
                            variant === 'premium'
                                ? "bg-gradient-to-br from-yellow-400/10 via-transparent to-orange-500/10"
                                : "bg-white/5 backdrop-blur-sm",
                            isHovered && !shouldReduceEffects ? "opacity-100" : "opacity-0"
                        )} />

                        {/* Top Section - Duration and Premium Badge */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                            <div className="glass-subtle rounded-full px-3 py-1.5 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3 text-blue-400" />
                                    <span className="text-white/90 text-xs font-medium">
                    {safePackageProps.duration}
                  </span>
                                </div>
                            </div>

                            {variant === 'premium' && (
                                <div className="glass-strong rounded-full px-3 py-1.5 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 backdrop-blur-sm">
                                    <div className="flex items-center gap-1">
                                        <Sparkles className="h-3 w-3 text-yellow-400 fill-current" />
                                        <span className="text-yellow-200 text-xs font-bold">PREMIUM</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Main Content */}
                        <div className={cn("absolute bottom-0 left-0 right-0 z-20", styles.padding)}>
                            {/* Package Title */}
                            <h3 className={cn(
                                "font-bold text-white text-shadow-lg leading-tight mb-3",
                                styles.title
                            )}>
                                {safePackageProps.name}
                            </h3>

                            {/* Description */}
                            <p className={cn(
                                "text-accent/90 font-medium text-shadow mb-4",
                                styles.subtitle
                            )}>
                                {safePackageProps.description}
                            </p>

                            {/* Cities */}
                            <div className={cn(
                                "flex items-center gap-2 text-white/80 mb-4",
                                styles.subtitle
                            )}>
                                <MapPin className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                <span className="font-medium truncate">
                  {safePackageProps.cities.length > 2
                      ? `${safePackageProps.cities.slice(0, 2).join(', ')} +${safePackageProps.cities.length - 2}`
                      : safePackageProps.cities.join(', ')
                  }
                </span>
                            </div>

                            {/* Package Stats */}
                            {variant !== 'minimal' && (
                                <div className={cn("flex items-center gap-4 text-white/70 mb-4", styles.subtitle)}>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                        <span className="text-xs">{rating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3 text-blue-400" />
                                        <span className="text-xs">{reviewCount} reviews</span>
                                    </div>
                                    {variant === 'featured' && (
                                        <div className="flex items-center gap-1">
                                            <Award className="h-3 w-3 text-purple-400" />
                                            <span className="text-xs">Bestseller</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tags for featured variants */}
                            {(variant === 'featured' || variant === 'hero') && safePackageProps.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {safePackageProps.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 glass-subtle rounded-full text-xs text-white/80 backdrop-blur-sm"
                                        >
                      {tag}
                    </span>
                                    ))}
                                </div>
                            )}

                            {/* Price & CTA */}
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-green-400" />
                                        <span className={cn("text-green-400 font-bold", styles.subtitle)}>
                      {priceNumber !== priceString ? `${currency}${priceNumber}` : priceString}
                    </span>
                                    </div>
                                    {variant !== 'minimal' && (
                                        <span className="text-white/60 text-xs">per person</span>
                                    )}
                                </div>

                                <div className={cn(
                                    "flex items-center gap-2 text-accent font-semibold transition-all duration-200",
                                    isHovered && !shouldReduceEffects ? "opacity-100 translate-x-0" : "opacity-70 -translate-x-2"
                                )}>
                  <span className={cn("text-gradient font-semibold", styles.subtitle)}>
                    {variant === 'hero' ? 'Explore Package' : 'Book Now'}
                  </span>
                                    <ArrowRight className={cn(
                                        "h-4 w-4 transition-transform duration-200",
                                        isHovered && !shouldReduceEffects && "translate-x-1"
                                    )} />
                                </div>
                            </div>

                            {/* Floating highlights for hero variant */}
                            {variant === 'hero' && safePackageProps.highlights.length > 0 && (
                                <div className="mt-6 space-y-2">
                                    {safePackageProps.highlights.slice(0, 2).map((highlight, i) => (
                                        <div key={i} className="flex items-center gap-2 text-white/80 text-sm">
                                            <Star className="h-3 w-3 text-yellow-400 fill-current flex-shrink-0" />
                                            <span>{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Floating Price Indicator */}
                        <div className={cn(
                            "absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none transition-all duration-300",
                            isHovered && !shouldReduceEffects ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-75 translate-x-4"
                        )}>
                            <div className="glass-strong p-3 text-center rounded-xl backdrop-blur-lg">
                                <div className="text-white font-bold text-lg">{priceNumber}</div>
                                <div className="text-white/70 text-xs">Starting from</div>
                            </div>
                        </div>

                        {/* Bestseller Badge */}
                        {index === 0 && variant !== 'minimal' && (
                            <div className="absolute top-6 left-6 transform -rotate-12 z-30">
                                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    BESTSELLER
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                                <div className={cn("absolute bottom-0 left-0 right-0", styles.padding)}>
                                    <div className={cn("h-6 bg-white/20 rounded mb-2 animate-pulse",
                                        variant === 'featured' ? 'h-8' : 'h-6')} />
                                    <div className="h-4 bg-white/10 rounded w-3/4 mb-3 animate-pulse" />
                                    <div className="flex justify-between items-center">
                                        <div className="h-5 bg-white/15 rounded w-20 animate-pulse" />
                                        <div className="h-4 bg-white/10 rounded w-16 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Accessibility enhancement */}
                        <div className="sr-only">
                            <p>Package: {safePackageProps.name}</p>
                            <p>Duration: {safePackageProps.duration}</p>
                            <p>Cities: {safePackageProps.cities.join(', ')}</p>
                            <p>Price: {safePackageProps.price}</p>
                            <p>Description: {safePackageProps.description}</p>
                        </div>
                    </div>
                </article>
            </Link>
        </div>
    );
});

OptimizedPackageCard.displayName = 'OptimizedPackageCard';

// Skeleton loader for package cards
export const PackageCardSkeleton = memo(({ variant = 'default' }: { variant?: string }) => {
    const variantStyles = {
        default: 'aspect-[4/5]',
        compact: 'aspect-[3/4]',
        featured: 'aspect-[16/9] md:col-span-2',
        minimal: 'aspect-[5/4]',
        premium: 'aspect-[4/5]',
        hero: 'aspect-[21/9] md:col-span-3'
    };

    return (
        <div className={cn("rounded-3xl overflow-hidden bg-white/5 animate-pulse", variantStyles[variant as keyof typeof variantStyles])}>
            <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 relative">
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
                    <div className="h-6 w-6 bg-white/10 rounded-full animate-pulse" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                    <div className="h-6 bg-white/20 rounded animate-pulse" />
                    <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                    <div className="flex justify-between items-center">
                        <div className="h-5 bg-white/15 rounded w-20 animate-pulse" />
                        <div className="h-4 bg-white/10 rounded w-16 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
});

PackageCardSkeleton.displayName = 'PackageCardSkeleton';