'use client';

import Link from "next/link";
import Image from "next/image";
import { type Place } from "@/lib/data";
import { ArrowRight, MapPin, Star, Clock, Camera, Heart, Eye } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface PlaceCardProps {
  place: Place;
  index?: number;
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  showAnimation?: boolean;
}

export function PlaceCard({ 
  place, 
  index = 0, 
  variant = 'default',
  showAnimation = true 
}: PlaceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for 3D transforms
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]));
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]));

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Stagger animation delay
  const animationDelay = showAnimation ? index * 0.1 : 0;

  // Variant-specific styles
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
    <motion.div
      initial={showAnimation ? { opacity: 0, y: 50, scale: 0.9 } : {}}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: animationDelay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="h-full group"
    >
      <Link href={`/places/${place.id}`} className="block h-full">
        <motion.div
          ref={cardRef}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            'relative h-full w-full overflow-hidden rounded-3xl transform-3d perspective-1000 cursor-pointer',
            styles.container
          )}
        >
          {/* Main Card Container */}
          <div className="relative h-full w-full overflow-hidden rounded-3xl bg-black">
            
            {/* Background Image */}
            <motion.div
              className="absolute inset-0"
              style={{
                scale: isHovered ? 1.1 : 1,
                transition: "scale 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              <Image
                src={place.thumbnail}
                alt={`Image of ${place.name}`}
                fill
                className={cn(
                  "object-cover transition-all duration-700",
                  imageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 3}
              />
            </motion.div>

            {/* Enhanced Gradient Overlay for Better Text Visibility */}
            <div className="absolute inset-0 card-overlay" />
            
            {/* Hover Glass Effect - Subtle */}
            <motion.div
              className="absolute inset-0 glass-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.7 : 0 }}
              transition={{ duration: 0.4 }}
            />

            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              }}
            />

            {/* Top Section - Category & Rating */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: animationDelay + 0.2 }}
                className="glass-subtle rounded-full px-3 py-1.5 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-accent" />
                  <span className="text-white text-xs font-medium">
                    {place.category}
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: animationDelay + 0.3 }}
                className="glass-subtle rounded-full px-2 py-1.5 backdrop-blur-sm"
              >
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-white text-xs font-semibold">
                    4.8
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Content Section - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              
              {/* Title */}
              <motion.h3
                className={cn(
                  "font-bold text-white text-shadow-lg leading-tight mb-2",
                  styles.title
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: animationDelay + 0.4 }}
              >
                {place.name}
              </motion.h3>

              {/* Tagline */}
              {place.tagline && (
                <motion.p
                  className={cn(
                    "text-primary/90 font-medium text-shadow mb-3",
                    styles.subtitle
                  )}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: animationDelay + 0.5 }}
                >
                  {place.tagline}
                </motion.p>
              )}

              {/* Location */}
              <motion.div
                className="flex items-center gap-2 text-white/90 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: animationDelay + 0.6 }}
              >
                <MapPin className="h-4 w-4 text-accent" />
                <span className={cn("font-medium", styles.subtitle)}>
                  {place.city}
                </span>
              </motion.div>

              {/* Tags */}
              {variant !== 'minimal' && place.tags.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: animationDelay + 0.7 }}
                >
                  {place.tags.slice(0, 3).map((tag, tagIndex) => (
                    <motion.span
                      key={tag}
                      className="px-2 py-1 glass-subtle rounded-full text-xs text-white/80 backdrop-blur-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: animationDelay + 0.8 + tagIndex * 0.1 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>

            {/* 3D Depth Layers */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                transform: "translateZ(25px)",
              }}
            >
              <div className="absolute inset-4 border border-white/20 rounded-2xl shadow-2xl" />
            </motion.div>

            {/* Floating Action Indicator */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="glass-strong p-4 rounded-full backdrop-blur-lg">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </motion.div>

            {/* Loading State */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse">
                <div className="absolute inset-0 card-overlay" />
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                  <div className="h-6 bg-white/20 rounded animate-pulse" />
                  <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
                    <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/**
 * Preset variants for different use cases
 */
export const FeaturedPlaceCard = ({ place, index }: PlaceCardProps) => (
  <PlaceCard place={place} index={index} variant="featured" />
);

export const CompactPlaceCard = ({ place, index }: PlaceCardProps) => (
  <PlaceCard place={place} index={index} variant="compact" />
);

export const MinimalPlaceCard = ({ place, index }: PlaceCardProps) => (
  <PlaceCard place={place} index={index} variant="minimal" />
);

/**
 * Place card skeleton for loading states
 */
export const PlaceCardSkeleton = ({ variant = 'default' }: { variant?: PlaceCardProps['variant'] }) => {
  const styles = {
    default: 'aspect-[4/5]',
    compact: 'aspect-[3/4]',
    featured: 'aspect-[16/10] md:col-span-2',
    minimal: 'aspect-square',
  };

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-slate-800/50", styles[variant])}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 animate-pulse">
        <div className="absolute inset-0 card-overlay" />
        
        {/* Top badges */}
        <div className="absolute top-6 left-6 right-6 flex justify-between">
          <div className="h-6 w-20 bg-white/20 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-white/20 rounded-full animate-pulse" />
        </div>
        
        {/* Bottom content */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <div className="h-6 bg-white/20 rounded animate-pulse" />
          <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-white/10 rounded-full animate-pulse" />
              <div className="h-8 w-8 bg-white/10 rounded-full animate-pulse" />
            </div>
            <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};