'use client';

import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useMouseParallax } from '@/hooks/use-parallax';

/**
 * Glass card variant types
 */
type GlassVariant = 'default' | 'strong' | 'subtle' | 'colored' | 'gradient' | 'frosted';

/**
 * Glass card size types
 */
type GlassSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Glass card animation types
 */
type GlassAnimation = 'none' | 'hover' | 'float' | 'pulse' | 'tilt' | 'lift' | 'liquid';

/**
 * Glass card props interface
 */
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  size?: GlassSize;
  animation?: GlassAnimation;
  blur?: number; // Custom blur amount (px)
  opacity?: number; // Background opacity (0-1)
  border?: boolean;
  glow?: boolean;
  interactive?: boolean; // Enable mouse parallax
  padding?: boolean;
  children?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements; // Polymorphic component
}

/**
 * Variant styles mapping
 */
const variantStyles: Record<GlassVariant, string> = {
  default: 'glass',
  strong: 'glass-strong',
  subtle: 'bg-white/5 backdrop-blur-sm border border-white/5',
  colored: 'bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-lg border border-white/10',
  gradient: 'bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border border-white/10',
  frosted: 'bg-white/20 backdrop-blur-3xl border border-white/20 shadow-2xl',
};

/**
 * Size styles mapping
 */
const sizeStyles: Record<GlassSize, string> = {
  sm: 'p-3 rounded-lg',
  md: 'p-4 rounded-xl',
  lg: 'p-6 rounded-2xl',
  xl: 'p-8 rounded-3xl',
  full: 'p-6 rounded-2xl w-full h-full',
};

/**
 * Animation styles mapping
 */
const animationStyles: Record<GlassAnimation, string> = {
  none: '',
  hover: 'hover-lift transition-smooth',
  float: 'float',
  pulse: 'pulse-slow',
  tilt: 'hover-tilt transition-smooth',
  lift: 'hover-scale transition-smooth',
  liquid: 'liquid-border',
};

/**
 * Glass Card Component with advanced glass morphism effects
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    animation = 'none',
    blur,
    opacity,
    border = true,
    glow = false,
    interactive = false,
    padding = true,
    children,
    as: Component = 'div',
    style,
    onMouseEnter,
    onMouseLeave,
    ...props
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Mouse parallax for interactive cards
    const mouseParallax = useMouseParallax(0.05, true);

    // Custom blur and opacity styles
    const customStyles: React.CSSProperties = {
      ...style,
      ...(blur && {
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
      }),
      ...(opacity && {
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      }),
    };

    // Combine interactive styles
    const interactiveStyles = interactive ? mouseParallax.style : {};

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(true);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false);
      onMouseLeave?.(e);
    };

    return (
      <Component
        ref={interactive ? mouseParallax.ref : ref}
        className={cn(
          // Base glass styles
          variantStyles[variant],
          
          // Size and padding
          padding && sizeStyles[size],
          !padding && `rounded-${size === 'sm' ? 'lg' : size === 'md' ? 'xl' : size === 'lg' ? '2xl' : '3xl'}`,
          
          // Animation styles
          animationStyles[animation],
          
          // Conditional styles
          glow && 'glow-hover',
          !border && 'border-0',
          isHovered && glow && 'glow',
          
          // Interactive states
          'group relative overflow-hidden',
          
          className
        )}
        style={{
          ...customStyles,
          ...interactiveStyles,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Animated background overlay for hover effects */}
        {(animation === 'hover' || glow) && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-[inherit]" />
          </div>
        )}
        
        {/* Liquid animation overlay */}
        {animation === 'liquid' && (
          <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
               style={{
                 background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                 backgroundSize: '200% 200%',
                 animation: isHovered ? 'liquid-flow 2s ease-in-out infinite' : 'none',
               }} 
          />
        )}
        
        {/* Shimmer effect for interactive cards */}
        {interactive && isHovered && (
          <div className="absolute inset-0 rounded-[inherit] pointer-events-none">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              }}
            />
          </div>
        )}
        
        {/* Content wrapper */}
        <div className="relative z-10">
          {children}
        </div>
      </Component>
    );
  }
);

GlassCard.displayName = 'GlassCard';

/**
 * Glass Card Header Component
 */
export const GlassCardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  />
));

GlassCardHeader.displayName = 'GlassCardHeader';

/**
 * Glass Card Title Component
 */
export const GlassCardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-gradient',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));

GlassCardTitle.displayName = 'GlassCardTitle';

/**
 * Glass Card Description Component
 */
export const GlassCardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-white/70', className)}
    {...props}
  />
));

GlassCardDescription.displayName = 'GlassCardDescription';

/**
 * Glass Card Content Component
 */
export const GlassCardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-4', className)} {...props} />
));

GlassCardContent.displayName = 'GlassCardContent';

/**
 * Glass Card Footer Component
 */
export const GlassCardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4 border-t border-white/10', className)}
    {...props}
  />
));

GlassCardFooter.displayName = 'GlassCardFooter';

/**
 * Special glass card variants
 */

/**
 * Floating Glass Card with 3D transform
 */
export const FloatingGlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, ...props }, ref) => (
    <GlassCard
      ref={ref}
      animation="float"
      glow
      className={cn('transform-3d float-3d', className)}
      {...props}
    >
      {children}
    </GlassCard>
  )
);

FloatingGlassCard.displayName = 'FloatingGlassCard';

/**
 * Interactive Glass Card with mouse tracking
 */
export const InteractiveGlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, ...props }, ref) => (
    <GlassCard
      ref={ref}
      interactive
      animation="hover"
      glow
      className={cn('cursor-pointer', className)}
      {...props}
    >
      {children}
    </GlassCard>
  )
);

InteractiveGlassCard.displayName = 'InteractiveGlassCard';

/**
 * Gradient Glass Card with animated border
 */
export const GradientGlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, ...props }, ref) => (
    <GlassCard
      ref={ref}
      variant="gradient"
      animation="liquid"
      className={cn('gradient-border', className)}
      {...props}
    >
      {children}
    </GlassCard>
  )
);

GradientGlassCard.displayName = 'GradientGlassCard';