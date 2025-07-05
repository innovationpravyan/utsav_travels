'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ParallaxSection } from '@/components/ui/parallax-section';
import { FloatingElements } from '@/components/ui/floating-elements';
import { GlassCard } from '@/components/ui/glass-card';
import { MotionDiv } from '@/components/motion-div';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles, MapPin, Calendar, Star } from 'lucide-react';

export interface BannerItem {
  id: string;
  image: string;
  name: string;
  tagline: string;
}

interface PageBannerProps {
  title: string;
  items: BannerItem[];
  subtitle?: string;
  description?: string;
  variant?: 'default' | 'minimal' | 'dramatic' | 'cinematic';
  height?: string;
  showStats?: boolean;
  showFloatingElements?: boolean;
  overlay?: boolean;
  overlayIntensity?: number;
}

/**
 * Floating stats component
 */
const FloatingStats = () => {
  const stats = [
    { icon: MapPin, label: 'Destinations', value: '50+' },
    { icon: Calendar, label: 'Tours', value: '200+' },
    { icon: Star, label: 'Rating', value: '4.9' },
  ];

  return (
    <div className="absolute top-6 right-6 z-30 hidden lg:block">
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <MotionDiv
            key={stat.label}
            preset="slideLeft"
            delay={1 + index * 0.2}
            hover
            magnetic
          >
            <GlassCard
              variant="frosted"
              size="sm"
              glow
              className="p-3 min-w-[100px]"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 bg-primary/20 rounded-full"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="h-4 w-4 text-primary" />
                </motion.div>
                <div>
                  <div className="text-white font-bold text-lg">{stat.value}</div>
                  <div className="text-white/70 text-xs">{stat.label}</div>
                </div>
              </div>
            </GlassCard>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};

/**
 * Animated breadcrumbs
 */
const AnimatedBreadcrumbs = ({ title }: { title: string }) => {
  const breadcrumbs = ['Home', ...title.split(' ')];

  return (
    <MotionDiv
      preset="slideUp"
      delay={0.8}
      className="absolute top-6 left-6 z-30"
    >
      <GlassCard variant="subtle" size="sm" className="px-4 py-2">
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex items-center gap-2"
            >
              <span className={cn(
                "transition-colors duration-200",
                index === breadcrumbs.length - 1 
                  ? "text-primary font-medium" 
                  : "text-white/60 hover:text-white/80"
              )}>
                {crumb}
              </span>
              {index < breadcrumbs.length - 1 && (
                <span className="text-white/40">/</span>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </MotionDiv>
  );
};

/**
 * Title with advanced typography effects
 */
const BannerTitle = ({ 
  title, 
  subtitle, 
  description, 
  variant 
}: { 
  title: string; 
  subtitle?: string; 
  description?: string; 
  variant: PageBannerProps['variant'];
}) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  const titleSizes = {
    default: 'text-5xl md:text-7xl',
    minimal: 'text-4xl md:text-6xl',
    dramatic: 'text-6xl md:text-8xl',
    cinematic: 'text-7xl md:text-9xl',
  };

  return (
    <motion.div
      style={{ y, opacity, scale }}
      className="relative z-20 text-center max-w-5xl mx-auto"
    >
      {/* Animated Background Text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ delay: 1, duration: 2 }}
      >
        <span className="text-8xl md:text-[200px] font-black text-white select-none">
          {title.split(' ')[0]}
        </span>
      </motion.div>

      {/* Main Title */}
      <MotionDiv preset="typewriter" delay={0.5}>
        <motion.h1
          className={cn(
            "font-headline font-bold text-white mb-6 leading-tight",
            titleSizes[variant || 'default']
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.1 }}
        >
          {title.split(' ').map((word, index) => (
            <motion.span
              key={index}
              className={cn(
                "inline-block mr-4",
                index % 2 === 0 
                  ? "bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
                  : "text-gradient-alt"
              )}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 0.8 + index * 0.1, 
                duration: 0.6,
                ease: "backOut"
              }}
              whileHover={{ 
                scale: 1.05,
                textShadow: "0 0 20px rgba(255,255,255,0.5)"
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
      </MotionDiv>

      {/* Subtitle */}
      {subtitle && (
        <MotionDiv preset="slideUp" delay={1.2}>
          <motion.p
            className="text-xl md:text-2xl text-primary/90 font-light mb-4 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
        </MotionDiv>
      )}

      {/* Description */}
      {description && (
        <MotionDiv preset="fadeIn" delay={1.5}>
          <motion.p
            className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            {description}
          </motion.p>
        </MotionDiv>
      )}

      {/* Decorative Elements */}
      <motion.div
        className="absolute -top-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <Sparkles className="h-8 w-8 text-yellow-400" />
      </motion.div>

      <motion.div
        className="absolute -bottom-10 left-1/4 transform -translate-x-1/2"
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 0.6, rotate: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <Star className="h-6 w-6 text-accent" />
      </motion.div>

      <motion.div
        className="absolute -bottom-8 right-1/4 transform translate-x-1/2"
        initial={{ opacity: 0, rotate: 90 }}
        animate={{ opacity: 0.4, rotate: 0 }}
        transition={{ delay: 2.4, duration: 0.8 }}
      >
        <Sparkles className="h-5 w-5 text-blue-400" />
      </motion.div>
    </motion.div>
  );
};

/**
 * Enhanced Page Banner Component
 */
export function PageBanner({ 
  title, 
  items, 
  subtitle,
  description,
  variant = 'default',
  height = '60vh',
  showStats = true,
  showFloatingElements = true,
  overlay = true,
  overlayIntensity = 0.6
}: PageBannerProps) {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Parallax layers for background
  const parallaxLayers = [
    {
      id: 'deep-background',
      speed: -0.8,
      content: (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      ),
    },
    {
      id: 'pattern-overlay',
      speed: -0.4,
      content: (
        <div className="absolute inset-0 pattern-dots opacity-20" />
      ),
    },
    {
      id: 'gradient-overlay',
      speed: -0.2,
      content: (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      ),
    },
  ];

  return (
    <ParallaxSection
      layers={parallaxLayers}
      height={height}
      className="relative w-full overflow-hidden"
      floatingElements={showFloatingElements}
      interactive
    >
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Carousel
          plugins={[plugin.current]}
          className="h-full w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ loop: true }}
        >
          <CarouselContent className="h-full">
            {items.map((item, index) => (
              <CarouselItem key={item.id} className="relative h-full">
                {/* Background Image with Ken Burns Effect */}
                <motion.div
                  className="relative h-full w-full overflow-hidden"
                  initial={{ scale: 1 }}
                  animate={{ scale: currentSlide === index ? 1.1 : 1 }}
                  transition={{ duration: 8, ease: "linear" }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="100vw"
                  />
                  
                  {/* Image Overlay */}
                  {overlay && (
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(45deg, 
                          rgba(0,0,0,${overlayIntensity}) 0%, 
                          rgba(0,0,0,${overlayIntensity * 0.5}) 50%, 
                          rgba(0,0,0,${overlayIntensity}) 100%)`
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                    />
                  )}
                </motion.div>

                {/* Slide-specific floating text */}
                <motion.div
                  className="absolute bottom-8 left-8 z-10"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: currentSlide === index ? 1 : 0, x: currentSlide === index ? 0 : -50 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <GlassCard variant="subtle" size="sm" className="max-w-xs">
                    <h3 className="text-white font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-white/70 text-sm">{item.tagline}</p>
                  </GlassCard>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Floating Elements */}
      {showFloatingElements && (
        <div className="absolute inset-0 z-5">
          <FloatingElements
            count={20}
            theme="light"
            density="low"
            interactive
            parallax
            className="opacity-40"
          />
        </div>
      )}

      {/* Animated Light Rays */}
      <motion.div
        className="absolute inset-0 z-5"
        animate={{
          background: [
            'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%)',
            'linear-gradient(45deg, transparent 20%, rgba(255,255,255,0.03) 60%, transparent 80%)',
            'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%)',
          ],
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* UI Elements */}
      <AnimatedBreadcrumbs title={title} />
      {showStats && <FloatingStats />}

      {/* Main Content */}
      <div className="relative z-20 h-full flex items-center justify-center px-4">
        <BannerTitle 
          title={title} 
          subtitle={subtitle} 
          description={description}
          variant={variant}
        />
      </div>

      {/* Carousel Indicators */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <GlassCard variant="subtle" size="sm" className="px-4 py-2">
          <div className="flex gap-2">
            {items.map((_, index) => (
              <motion.button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  currentSlide === index 
                    ? "bg-primary scale-125" 
                    : "bg-white/30 hover:bg-white/50"
                )}
                onClick={() => setCurrentSlide(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 right-8 z-30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
      >
        <GlassCard variant="frosted" size="sm" className="p-3">
          <motion.div
            className="flex flex-col items-center gap-2 text-white/70"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs">Scroll</span>
            <div className="w-px h-6 bg-white/30 relative">
              <motion.div
                className="absolute top-0 left-0 w-full bg-primary"
                animate={{ height: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </GlassCard>
      </motion.div>

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 pointer-events-none z-10" />
    </ParallaxSection>
  );
}

/**
 * Preset variants for different page types
 */
export const HeroBanner = (props: Omit<PageBannerProps, 'variant'>) => (
  <PageBanner {...props} variant="cinematic" height="100vh" />
);

export const MinimalBanner = (props: Omit<PageBannerProps, 'variant'>) => (
  <PageBanner {...props} variant="minimal" height="40vh" showStats={false} />
);

export const DramaticBanner = (props: Omit<PageBannerProps, 'variant'>) => (
  <PageBanner {...props} variant="dramatic" height="80vh" overlayIntensity={0.8} />
);