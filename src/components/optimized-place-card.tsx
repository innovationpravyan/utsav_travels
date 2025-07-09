'use client';

import Link from "next/link";
import Image from "next/image";
import {type Place} from "@/lib/data";
import {Camera, MapPin, Star} from "lucide-react";
import React, {useCallback, useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {useThreeInView} from './three-utils';

interface OptimizedPlaceCardProps {
    place: Place;
    index?: number;
    variant?: 'default' | 'compact' | 'featured' | 'minimal';
    showAnimation?: boolean;
}

export function OptimizedPlaceCard({
                                       place,
                                       index = 0,
                                       variant = 'default',
                                       showAnimation = true
                                   }: OptimizedPlaceCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const {ref: inViewRef, isInView} = useThreeInView(0.05);

    // Safe place object with defaults
    const safePlaceProps = {
        id: place?.id || 'unknown',
        name: place?.name || 'Unknown Place',
        city: place?.city || 'Unknown City',
        category: place?.category || 'Destination',
        thumbnail: place?.thumbnail || 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=600&h=400',
        tagline: place?.tagline || '',
        tags: place?.tags || [],
        images: place?.images || [],
        highlights: place?.highlights || [],
        description: place?.description || '',
        history: place?.history || '',
        location: place?.location || {lat: 0, lng: 0}
    };

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateX = ((e.clientY - centerY) / rect.height) * 5; // Reduced rotation
        const rotateY = ((centerX - e.clientX) / rect.width) * 5; // Reduced rotation

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
            container: 'aspect-[16/10] md:col-span-2',
            title: 'text-3xl md:text-4xl',
            subtitle: 'text-base',
        },
        minimal: {
            container: 'aspect-square',
            title: 'text-lg',
            subtitle: 'text-xs',
        },
    };

    const styles = variantStyles[variant];

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
            <Link href={`/places/${safePlaceProps.id}`} className="block h-full">
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
                    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-black">

                        {/* Background Image */}
                        <div className={cn(
                            "absolute inset-0 transition-transform duration-500",
                            isHovered ? "scale-110" : "scale-100"
                        )}>
                            <Image
                                src={safePlaceProps.thumbnail}
                                alt={`Image of ${safePlaceProps.name}`}
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
                            "absolute inset-0 bg-white/5 backdrop-blur-sm transition-opacity duration-300",
                            isHovered ? "opacity-100" : "opacity-0"
                        )}/>

                        {/* Top Section */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                            <div className="glass-subtle rounded-full px-3 py-1.5 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3 text-accent"/>
                                    <span className="text-white text-xs font-medium">
                                        {safePlaceProps.category}
                                    </span>
                                </div>
                            </div>

                            <div className="glass-subtle rounded-full px-2 py-1.5 backdrop-blur-sm">
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current"/>
                                    <span className="text-white text-xs font-semibold">4.8</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                            <h3 className={cn(
                                "font-bold text-white text-shadow-lg leading-tight mb-2",
                                styles.title
                            )}>
                                {safePlaceProps.name}
                            </h3>

                            {safePlaceProps.tagline && (
                                <p className={cn(
                                    "text-primary/90 font-medium text-shadow mb-3",
                                    styles.subtitle
                                )}>
                                    {safePlaceProps.tagline}
                                </p>
                            )}

                            <div className={cn(
                                "flex items-center gap-2 text-white/90 mb-4",
                                styles.subtitle
                            )}>
                                <MapPin className="h-4 w-4 text-accent"/>
                                <span className="font-medium">{safePlaceProps.city}</span>
                            </div>

                            {/* Tags */}
                            {variant !== 'minimal' && safePlaceProps.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {safePlaceProps.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 glass-subtle rounded-full text-xs text-white/80 backdrop-blur-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Floating Action Indicator */}
                        <div className={cn(
                            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200",
                            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
                        )}>
                            <div className="glass-strong p-4 rounded-full backdrop-blur-lg">
                                <Camera className="h-6 w-6 text-white"/>
                            </div>
                        </div>

                        {/* Loading State */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"/>
                                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                                    <div className="h-6 bg-white/20 rounded animate-pulse"/>
                                    <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"/>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse"/>
                                        <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse"/>
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