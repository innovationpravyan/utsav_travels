'use client';

import Link from "next/link";
import Image from "next/image";
import { type Package } from "@/lib/data";
import { Calendar, Tag, ArrowRight, Clock, MapPin, Star, Users, Sparkles, DollarSign } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface PackageCardProps {
  pkg: Package;
  index?: number;
  variant?: 'default' | 'compact' | 'featured' | 'minimal' | 'premium';
  showAnimation?: boolean;
}

export function PackageCard({ 
  pkg, 
  index = 0, 
  variant = 'default',
  showAnimation = true 
}: PackageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for 3D transforms
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]));
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]));
  const scale = useSpring(useTransform(y, [-0.5, 0.5], [1, 1.02]));

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
      description: 'text-sm',
    },
    compact: {
      container: 'aspect-[3/4]',
      title: 'text-xl',
      subtitle: 'text-xs',
      description: 'text-xs',
    },
    featured: {
      container: 'aspect-[16/9] md:col-span-2',
      title: 'text-3xl md:text-4xl',
      subtitle: 'text-base',
      description: 'text-base',
    },
    minimal: {
      container: 'aspect-[5/4]',
      title: 'text-lg',
      subtitle: 'text-xs',
      description: 'text-xs',
    },
    premium: {
      container: 'aspect-[4/5]',
      title: 'text-2xl',
      subtitle: 'text-sm',
      description: 'text-sm',
    },
  };

  const styles = variantStyles[variant];

  // Extract price number for animation
  const priceMatch = pkg.price.match(/[\d,]+/);
  const priceNumber = priceMatch ? priceMatch[0] : pkg.price;

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
      <Link href={`/packages/${pkg.id}`} className="block h-full">
        <motion.div
          ref={cardRef}
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            'relative h-full w-full overflow-hidden transform-3d perspective-1000 cursor-pointer',
            styles.container
          )}
        >
          {/* Main Card Container */}
          <div className={cn(
            "relative h-full w-full overflow-hidden rounded-3xl",
            variant === 'premium' 
              ? "bg-gradient-to-br from-yellow-900/20 via-black to-orange-900/20" 
              : "bg-black"
          )}>
            
            {/* Background Image with Parallax */}
            <motion.div
              className="absolute inset-0"
              style={{
                scale: isHovered ? 1.15 : 1,
                transition: "scale 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              <Image
                src={pkg.thumbnail}
                alt={`Image of ${pkg.name}`}
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
            
            {/* Hover Glass Effect */}
            <motion.div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                variant === 'premium' 
                  ? "bg-gradient-to-br from-yellow-400/10 via-transparent to-orange-500/10"
                  : "glass-subtle"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.8 : 0 }}
              transition={{ duration: 0.4 }}
            />

            {/* Animated Shimmer Effect */}
            <motion.div
              className="absolute inset-0"
              initial={{ x: "-100%" }}
              animate={{ x: isHovered ? "100%" : "-100%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              }}
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              
              {/* Top Section - Duration & Premium Badge */}
              <div className="flex justify-between items-start">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: animationDelay + 0.2 }}
                >
                  <div className="glass-subtle rounded-full px-3 py-1.5 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-blue-400" />
                      <span className="text-white/90 text-xs font-medium">
                        {pkg.duration}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {variant === 'premium' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: animationDelay + 0.3 }}
                  >
                    <div className="glass-strong rounded-full px-3 py-1.5 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 backdrop-blur-sm">
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-yellow-200 text-xs font-bold">
                          PREMIUM
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Main Content Section */}
              <div className="space-y-4">
                {/* Title */}
                <motion.h3
                  className={cn(
                    "font-bold text-white text-shadow-lg leading-tight",
                    styles.title
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: animationDelay + 0.4 }}
                >
                  {pkg.name}
                </motion.h3>

                {/* Tagline */}
                <motion.p
                  className={cn(
                    "text-accent/90 font-medium text-shadow",
                    styles.subtitle
                  )}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: animationDelay + 0.5 }}
                >
                  {pkg.tagline}
                </motion.p>

                {/* Cities */}
                <motion.div
                  className="flex items-center gap-2 text-white/80"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: animationDelay + 0.6 }}
                >
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span className={cn("font-medium", styles.subtitle)}>
                    {pkg.cities.length > 2 
                      ? `${pkg.cities.slice(0, 2).join(', ')} +${pkg.cities.length - 2}`
                      : pkg.cities.join(', ')
                    }
                  </span>
                </motion.div>

                {/* Package Stats */}
                {variant !== 'minimal' && (
                  <motion.div
                    className="flex items-center gap-4 text-white/70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: animationDelay + 0.7 }}
                  >
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className={cn("text-xs", styles.subtitle)}>4.9</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-blue-400" />
                      <span className={cn("text-xs", styles.subtitle)}>
                        {Math.floor(Math.random() * 50) + 10} trips
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Tags */}
                {variant === 'featured' && pkg.tags.length > 0 && (
                  <motion.div
                    className="flex flex-wrap gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: animationDelay + 0.8 }}
                  >
                    {pkg.tags.slice(0, 3).map((tag, tagIndex) => (
                      <motion.span
                        key={tag}
                        className="px-2 py-1 glass-subtle rounded-full text-xs text-white/80 backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: animationDelay + 0.9 + tagIndex * 0.1 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* Price & Action Section */}
                <div className="flex items-center justify-between">
                  {/* Price */}
                  <motion.div
                    className="space-y-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: animationDelay + 0.8 }}
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className={cn("text-green-400 font-bold", styles.subtitle)}>
                        {pkg.price}
                      </span>
                    </div>
                    {variant !== 'minimal' && (
                      <span className="text-white/60 text-xs">per person</span>
                    )}
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    className={cn(
                      "flex items-center gap-2 text-accent font-semibold transition-all duration-300",
                      isHovered ? "opacity-100 translate-x-0" : "opacity-70 -translate-x-2"
                    )}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: isHovered ? 1 : 0.7, 
                      x: isHovered ? 0 : -10 
                    }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className={cn("text-gradient font-semibold", styles.subtitle)}>
                      Book Now
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
            </div>

            {/* 3D Depth Layers */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                transform: "translateZ(25px)",
              }}
            >
              <div className="absolute inset-4 border border-white/30 rounded-2xl shadow-2xl" />
            </motion.div>

            {/* Floating Price Indicator */}
            <motion.div
              className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none"
              initial={{ opacity: 0, scale: 0, x: 20 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0,
                x: isHovered ? 0 : 20,
              }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="glass-strong p-3 text-center rounded-xl backdrop-blur-lg">
                <div className="text-white font-bold text-lg">{priceNumber}</div>
                <div className="text-white/70 text-xs">Starting</div>
              </div>
            </motion.div>

            {/* Loading State */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse">
                <div className="absolute inset-0 card-overlay" />
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                  <div className="h-6 bg-white/20 rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-white/15 rounded w-20 animate-pulse" />
                    <div className="h-4 bg-white/10 rounded w-16 animate-pulse" />
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
export const FeaturedPackageCard = ({ pkg, index }: PackageCardProps) => (
  <PackageCard pkg={pkg} index={index} variant="featured" />
);

export const CompactPackageCard = ({ pkg, index }: PackageCardProps) => (
  <PackageCard pkg={pkg} index={index} variant="compact" />
);

export const MinimalPackageCard = ({ pkg, index }: PackageCardProps) => (
  <PackageCard pkg={pkg} index={index} variant="minimal" />
);

export const PremiumPackageCard = ({ pkg, index }: PackageCardProps) => (
  <PackageCard pkg={pkg} index={index} variant="premium" />
);

/**
 * Package card skeleton for loading states
 */
export const PackageCardSkeleton = ({ variant = 'default' }: { variant?: PackageCardProps['variant'] }) => {
  const styles = {
    default: 'aspect-[4/5]',
    compact: 'aspect-[3/4]',
    featured: 'aspect-[16/9] md:col-span-2',
    minimal: 'aspect-[5/4]',
    premium: 'aspect-[4/5]',
  };

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-slate-800/50", styles[variant])}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 animate-pulse">
        <div className="absolute inset-0 card-overlay" />
        
        {/* Top badges */}
        <div className="absolute top-6 left-6 right-6 flex justify-between">
          <div className="h-6 w-20 bg-white/20 rounded-full animate-pulse" />
          {variant === 'premium' && (
            <div className="h-6 w-16 bg-yellow-400/30 rounded-full animate-pulse" />
          )}
        </div>
        
        {/* Bottom content */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <div className="h-6 bg-white/20 rounded animate-pulse" />
          <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
          <div className="flex justify-between items-center">
            <div className="h-5 bg-white/15 rounded w-24 animate-pulse" />
            <div className="h-4 bg-white/10 rounded w-20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};