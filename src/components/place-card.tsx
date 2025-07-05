'use client';

import Link from "next/link";
import Image from "next/image";
import { type Place } from "@/lib/data";
import { ArrowRight, MapPin, Star, Clock, Camera } from "lucide-react";
import { MotionDiv, InteractiveDiv } from "./motion-div";
import { GlassCard } from "./ui/glass-card";
import { useMouseParallax } from "@/hooks/use-parallax";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";

interface PlaceCardProps {
  place: Place;
  index?: number;
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  showAnimation?: boolean;
}

/**
 * Enhanced Place Card with advanced effects
 */
export function PlaceCard({ 
  place, 
  index = 0, 
  variant = 'default',
  showAnimation = true 
}: PlaceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse parallax for interactive effects
  const mouseParallax = useMouseParallax(0.1, true);
  
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
      content: 'p-6',
      title: 'text-2xl',
      subtitle: 'text-sm',
    },
    compact: {
      container: 'aspect-[3/4]',
      content: 'p-4',
      title: 'text-xl',
      subtitle: 'text-xs',
    },
    featured: {
      container: 'aspect-[16/10] md:col-span-2',
      content: 'p-8',
      title: 'text-3xl md:text-4xl',
      subtitle: 'text-base',
    },
    minimal: {
      container: 'aspect-square',
      content: 'p-4',
      title: 'text-lg',
      subtitle: 'text-xs',
    },
  };

  const styles = variantStyles[variant];

  return (
    <MotionDiv
      preset="scaleIn"
      delay={animationDelay}
      hover
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
            'relative h-full w-full overflow-hidden transform-3d perspective-1000',
            styles.container
          )}
        >
          <GlassCard
            variant="default"
            animation="liquid"
            interactive
            glow
            className="h-full w-full p-0 bg-gradient-to-br from-card/80 to-card/40"
          >
            {/* Background Image with Parallax */}
            <div className="relative h-full w-full overflow-hidden rounded-inherit">
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

              {/* Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              {/* Hover Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? "100%" : "-100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                }}
              />

              {/* Content Overlay */}
              <div className={cn("absolute inset-0 flex flex-col justify-end", styles.content)}>
                
                {/* Category Badge */}
                <motion.div
                  className="absolute top-4 left-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: animationDelay + 0.2 }}
                >
                  <GlassCard
                    variant="frosted"
                    size="sm"
                    className="px-3 py-1"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-accent" />
                      <span className="text-white/90 text-xs font-medium">
                        {place.category}
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Rating Badge */}
                <motion.div
                  className="absolute top-4 right-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: animationDelay + 0.3 }}
                >
                  <GlassCard
                    variant="colored"
                    size="sm"
                    className="px-2 py-1"
                  >
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-white text-xs font-semibold">
                        4.8
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Main Content */}
                <div className="space-y-3">
                  {/* Title */}
                  <motion.h3
                    className={cn(
                      "font-headline font-bold text-white text-shadow-lg leading-tight",
                      styles.title
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: animationDelay + 0.4 }}
                  >
                    {place.name}
                  </motion.h3>

                  {/* Subtitle */}
                  <motion.p
                    className={cn(
                      "text-primary/90 font-medium text-shadow",
                      styles.subtitle
                    )}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: animationDelay + 0.5 }}
                  >
                    {place.tagline}
                  </motion.p>

                  {/* Location */}
                  <motion.div
                    className="flex items-center gap-2 text-white/80"
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
                      className="flex flex-wrap gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: animationDelay + 0.7 }}
                    >
                      {place.tags.slice(0, 3).map((tag, tagIndex) => (
                        <motion.span
                          key={tag}
                          className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/80 border border-white/20"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: animationDelay + 0.8 + tagIndex * 0.1 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}

                  {/* Action Button */}
                  <motion.div
                    className={cn(
                      "flex items-center gap-2 text-accent font-semibold opacity-0 transition-all duration-300 group-hover:opacity-100",
                      isHovered ? "translate-x-0" : "-translate-x-2"
                    )}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: isHovered ? 1 : 0, 
                      x: isHovered ? 0 : -10 
                    }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className={cn("text-gradient", styles.subtitle)}>
                      Explore
                    </span>
                    <motion.div
                      animate={{ x: isHovered ? 5 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* 3D Depth Layers */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  transform: "translateZ(20px)",
                  opacity: isHovered ? 0.1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-4 border border-white/20 rounded-lg" />
              </motion.div>

              {/* Loading State */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="h-6 bg-white/20 rounded mb-2 animate-pulse" />
                    <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Floating Action Indicators */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <GlassCard
              variant="frosted"
              size="sm"
              className="p-3"
            >
              <Camera className="h-5 w-5 text-white" />
            </GlassCard>
          </motion.div>
        </motion.div>
      </Link>
    </MotionDiv>
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
    <div className={cn("relative overflow-hidden rounded-xl bg-card/50", styles[variant])}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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
};