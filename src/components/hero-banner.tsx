'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { ErrorBoundary } from '@/components/error-boundary';
import { FloatingElements } from './ui/floating-elements';
import { ParallaxSection } from './ui/parallax-section';
import { GlassCard } from './ui/glass-card';
import { MotionDiv } from './motion-div';
import { useParallax } from '@/hooks/use-parallax';
import { cn } from '@/lib/utils';

// Fix the dynamic import with proper error handling
const Globe = dynamic(
  () => import('@/components/globe').catch(() => ({ default: () => null })),
  {
    ssr: false,
    loading: () => <Skeleton className="absolute inset-0 h-full w-full bg-transparent" />
  }
);

/**
 * Floating typography component with advanced animations
 */
const FloatingTypography = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const ySpring = useSpring(y, springConfig);

  return (
    <motion.div
      style={{ y: ySpring, opacity, scale }}
      className="relative z-20 text-center"
    >
      {/* Main Heading with Typewriter Effect */}
      <MotionDiv
        preset="typewriter"
        delay={0.5}
        className="overflow-hidden"
      >
        <motion.h1
          className="text-4xl md:text-7xl font-headline font-bold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.1 }}
        >
          <span className="inline-block bg-gradient-to-r from-white via-yellow-200 to-orange-300 bg-clip-text text-transparent animate-pulse">
            Discover the Spiritual
          </span>
          <br />
          <motion.span
            className="inline-block text-gradient-alt"
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8, ease: "backOut" }}
          >
            Heritage
          </motion.span>
        </motion.h1>
      </MotionDiv>

      {/* Subtitle with Liquid Animation */}
      <MotionDiv
        preset="liquid"
        delay={2}
        className="mt-4 max-w-2xl mx-auto"
      >
        <motion.p
          className="text-lg md:text-xl text-primary font-light tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            of Varanasi, Ayodhya, Rishikesh, Kedarnath
          </motion.span>
        </motion.p>
      </MotionDiv>

      {/* Floating Call-to-Action Buttons */}
      <MotionDiv
        preset="bounce"
        delay={3}
        className="mt-8 flex flex-wrap justify-center gap-4"
      >
        <GlassCard
          variant="gradient"
          animation="hover"
          interactive
          glow
          className="px-8 py-4 cursor-pointer group"
        >
          <motion.span
            className="text-white font-semibold flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              ✨
            </motion.span>
            Explore Now
            <motion.span
              className="ml-2 group-hover:translate-x-1 transition-transform"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              →
            </motion.span>
          </motion.span>
        </GlassCard>

        <GlassCard
          variant="frosted"
          animation="tilt"
          className="px-8 py-4 cursor-pointer"
        >
          <motion.span
            className="text-white/90 font-medium"
            whileHover={{ color: "#fbbf24" }}
            transition={{ duration: 0.3 }}
          >
            Watch Journey
          </motion.span>
        </GlassCard>
      </MotionDiv>
    </motion.div>
  );
};

/**
 * Parallax background layers
 */
const ParallaxLayers = () => {
  const backgroundLayers = [
    {
      id: 'deep-background',
      speed: -0.8,
      content: (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      ),
    },
    {
      id: 'pattern-layer',
      speed: -0.6,
      content: (
        <div className="absolute inset-0 pattern-dots opacity-10" />
      ),
    },
    {
      id: 'glow-orbs',
      speed: -0.4,
      content: (
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-red-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400/10 to-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
              delay: 4,
            }}
          />
        </div>
      ),
    },
    {
      id: 'light-rays',
      speed: -0.2,
      content: (
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%),
                linear-gradient(-45deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%)
              `,
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <ParallaxSection
      layers={backgroundLayers}
      height="100vh"
      className="absolute inset-0"
    />
  );
};

/**
 * Interactive floating elements
 */
const InteractiveFloatingElements = () => {
  return (
    <div className="absolute inset-0 z-5">
      <FloatingElements
        count={25}
        theme="light"
        density="medium"
        interactive
        parallax
        className="opacity-60"
      />
    </div>
  );
};

/**
 * Scroll indicator with progress
 */
const ScrollIndicator = () => {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 4, duration: 0.8 }}
    >
      <GlassCard
        variant="subtle"
        className="px-4 py-2 flex flex-col items-center gap-2"
      >
        <motion.div
          className="text-white/70 text-sm font-light"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to explore
        </motion.div>
        
        {/* <motion.div
          className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent relative"
          style={{
            scaleY: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
          }}
        >
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div> */}
      </GlassCard>
    </motion.div>
  );
};

/**
 * Globe wrapper with enhanced effects
 */
const EnhancedGlobe = () => {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.7, 0.3]);

  return (
    <motion.div
      className="absolute inset-0 z-0"
      style={{ rotate, scale, opacity }}
    >
      <ErrorBoundary fallback={<div className="absolute inset-0 h-full w-full bg-transparent" />}>
        <Suspense fallback={<Skeleton className="absolute inset-0 h-full w-full bg-transparent" />}>
          <Globe />
        </Suspense>
      </ErrorBoundary>
    </motion.div>
  );
};

/**
 * Enhanced hero banner with advanced effects
 */
export function HeroBanner() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      className="relative h-screen w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parallax Background Layers */}
      <ParallaxLayers />

      {/* Enhanced Globe */}
      <EnhancedGlobe />

      {/* Interactive Floating Elements */}
      <InteractiveFloatingElements />

      {/* Mouse-responsive overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x}% ${50 + mousePosition.y}%, 
            rgba(255,255,255,0.05) 0%, 
            rgba(255,255,255,0.02) 30%, 
            transparent 70%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Main Content */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center p-4">
        <FloatingTypography />
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Ambient Particles */}
      <motion.div
        className="absolute inset-0 z-1"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-400/40 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-pink-400/40 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/3 right-10 w-2 h-2 bg-yellow-400/30 rounded-full animate-ping" style={{ animationDelay: '4s' }} />
      </motion.div>

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 pointer-events-none z-10" />
    </section>
  );
}