'use client';

import Link from "next/link";
import Image from "next/image";
import {type Package} from "@/lib/data";
import {ArrowRight, Clock, DollarSign, MapPin, Sparkles, Star, Users} from "lucide-react";
import React, {useCallback, useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {useThreeInView} from './three-utils';

interface OptimizedPackageCardProps {
    pkg: Package;
    index?: number;
    variant?: 'default' | 'compact' | 'featured' | 'minimal' | 'premium';
    showAnimation?: boolean;
}

export function OptimizedPackageCard({
                                         pkg,
                                         index = 0,
                                         variant = 'default',
                                         showAnimation = true
                                     }: OptimizedPackageCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const {ref: inViewRef, isInView} = useThreeInView(0.05);

    // Safe package object with defaults
    const safePackageProps = {
        id: pkg?.id || 'unknown',
        name: pkg?.name || 'Unknown Package',
        tagline: pkg?.tagline || 'Discover new places',
        description: pkg?.description || '',
        duration: pkg?.duration || '3 Days',
        cities: pkg?.cities || [],
        price: pkg?.price || 'Contact for pricing',
        thumbnail: pkg?.thumbnail || 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=600&h=400',
        images: pkg?.images || [],
        tags: pkg?.tags || [],
        highlights: pkg?.highlights || [],
        inclusions: pkg?.inclusions || [],
        itinerary: pkg?.itinerary || []
    };

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateX = ((e.clientY - centerY) / rect.height) * 5;
        const rotateY = ((centerX - e.clientX) / rect.width) * 5;

        cardRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
        cardRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        if (cardRef.current) {
            cardRef.current.style.setProperty('--rotate-x', '0deg');
            cardRef.current.style.setProperty('--rotate-y', '0deg');
        }
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const variantStyles = {
        default: {
            container: 'aspect-[4/5]',
            title: 'text-2xl',
            subtitle: 'text-sm',
        },
        compact: {
            container: 'aspect-[3/4]',
            title: 'text-xl',
            subtitle: 'text-xs',
        },
        featured: {
            container: 'aspect-[16/9] md:col-span-2',
            title: 'text-3xl md:text-4xl',
            subtitle: 'text-base',
        },
        minimal: {
            container: 'aspect-[5/4]',
            title: 'text-lg',
            subtitle: 'text-xs',
        },
        premium: {
            container: 'aspect-[4/5]',
            title: 'text-2xl',
            subtitle: 'text-sm',
        },
    };

    const styles = variantStyles[variant];
    const priceMatch = safePackageProps.price.match(/[\d,]+/);
    const priceNumber = priceMatch ? priceMatch[0] : safePackageProps.price;

    return (
        <div
            className={cn(
                "h-full group",
                showAnimation && isInView && "animate-fade-in"
            )}
            ref={(node) => {
                cardRef.current = node;
                if (inViewRef.current !== node) {
                    inViewRef.current = node;
                }
            }}
        >
            <Link href={`/packages/${safePackageProps.id}`} className="block h-full">
                <div
                    className={cn(
                        'relative h-full w-full overflow-hidden rounded-3xl cursor-pointer',
                        'transition-all duration-300 ease-out',
                        'hover:scale-[1.02]',
                        '[transform:perspective(1000px)_rotateX(var(--rotate-x,0deg))_rotateY(var(--rotate-y,0deg))]',
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

                        {/* Background Image */}
                        <div className={cn(
                            "absolute inset-0 transition-transform duration-500",
                            isHovered ? "scale-110" : "scale-100"
                        )}>
                            <Image
                                src={safePackageProps.thumbnail}
                                alt={`Image of ${safePackageProps.name}`}
                                fill
                                className={cn(
                                    "object-cover transition-all duration-500",
                                    imageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
                                )}
                                onLoad={() => setImageLoaded(true)}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={index < 3}
                                quality={80}
                            />
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"/>

                        {/* Hover Glass Effect */}
                        <div className={cn(
                            "absolute inset-0 transition-opacity duration-300",
                            variant === 'premium'
                                ? "bg-gradient-to-br from-yellow-400/10 via-transparent to-orange-500/10"
                                : "bg-white/5 backdrop-blur-sm",
                            isHovered ? "opacity-100" : "opacity-0"
                        )}/>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-between p-6">

                            {/* Top Section */}
                            <div className="flex justify-between items-start">
                                <div className="glass-subtle rounded-full px-3 py-1.5 backdrop-blur-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3 text-blue-400"/>
                                        <span className="text-white/90 text-xs font-medium">
                                            {safePackageProps.duration}
                                        </span>
                                    </div>
                                </div>

                                {variant === 'premium' && (
                                    <div
                                        className="glass-strong rounded-full px-3 py-1.5 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 backdrop-blur-sm">
                                        <div className="flex items-center gap-1">
                                            <Sparkles className="h-3 w-3 text-yellow-400 fill-current"/>
                                            <span className="text-yellow-200 text-xs font-bold">PREMIUM</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Main Content */}
                            <div className="space-y-4">
                                <h3 className={cn(
                                    "font-bold text-white text-shadow-lg leading-tight",
                                    styles.title
                                )}>
                                    {safePackageProps.name}
                                </h3>

                                <p className={cn(
                                    "text-accent/90 font-medium text-shadow",
                                    styles.subtitle
                                )}>
                                    {safePackageProps.tagline}
                                </p>

                                <div className={cn(
                                    "flex items-center gap-2 text-white/80",
                                    styles.subtitle
                                )}>
                                    <MapPin className="h-4 w-4 text-emerald-400"/>
                                    <span className="font-medium">
                                        {safePackageProps.cities.length > 2
                                            ? `${safePackageProps.cities.slice(0, 2).join(', ')} +${safePackageProps.cities.length - 2}`
                                            : safePackageProps.cities.join(', ')
                                        }
                                    </span>
                                </div>

                                {/* Package Stats */}
                                {variant !== 'minimal' && (
                                    <div className={cn("flex items-center gap-4 text-white/70", styles.subtitle)}>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 text-yellow-400 fill-current"/>
                                            <span className="text-xs">4.9</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3 text-blue-400"/>
                                            <span className="text-xs">
                                                {Math.floor(Math.random() * 50) + 10} trips
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {variant === 'featured' && safePackageProps.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
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

                                {/* Price & Action */}
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-green-400"/>
                                            <span className={cn("text-green-400 font-bold", styles.subtitle)}>
                                                {safePackageProps.price}
                                            </span>
                                        </div>
                                        {variant !== 'minimal' && (
                                            <span className="text-white/60 text-xs">per person</span>
                                        )}
                                    </div>

                                    <div className={cn(
                                        "flex items-center gap-2 text-accent font-semibold transition-all duration-200",
                                        isHovered ? "opacity-100 translate-x-0" : "opacity-70 -translate-x-2"
                                    )}>
                                        <span className={cn("text-gradient font-semibold", styles.subtitle)}>
                                            Book Now
                                        </span>
                                        <ArrowRight className={cn(
                                            "h-4 w-4 transition-transform duration-200",
                                            isHovered && "translate-x-1"
                                        )}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Price Indicator */}
                        <div className={cn(
                            "absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none transition-all duration-300",
                            isHovered ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-75 translate-x-4"
                        )}>
                            <div className="glass-strong p-3 text-center rounded-xl backdrop-blur-lg">
                                <div className="text-white font-bold text-lg">{priceNumber}</div>
                                <div className="text-white/70 text-xs">Starting</div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"/>
                                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                                    <div className="h-6 bg-white/20 rounded mb-2 animate-pulse"/>
                                    <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"/>
                                    <div className="flex justify-between items-center">
                                        <div className="h-5 bg-white/15 rounded w-20 animate-pulse"/>
                                        <div className="h-4 bg-white/10 rounded w-16 animate-pulse"/>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}