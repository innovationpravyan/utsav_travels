'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Suspense, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { GlassCard } from './ui/glass-card';
import { MotionDiv } from './motion-div';
import { cn } from '@/lib/utils';

/**
 * Floating typography component with optimized animations
 */
const FloatingTypography = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div
      style={{ y, opacity }}
      className="relative z-20 text-center"
    >
      {/* Main Heading */}
      <MotionDiv
        preset="slideUp"
        delay={0.5}
        className="overflow-hidden"
      >
        <motion.h1
          className="text-4xl md:text-7xl font-headline font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <span className="inline-block bg-gradient-to-r from-white via-yellow-200 to-orange-300 bg-clip-text text-transparent">
            Discover the Spiritual
          </span>
          <br />
          <motion.span
            className="inline-block text-gradient-alt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            Heritage
          </motion.span>
        </motion.h1>
      </MotionDiv>

      {/* Subtitle */}
      <MotionDiv
        preset="fadeIn"
        delay={1.5}
        className="mt-4 max-w-2xl mx-auto"
      >
        <motion.p
          className="text-lg md:text-xl text-white/90 font-light tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          of Varanasi, Ayodhya, Rishikesh, Kedarnath
        </motion.p>
      </MotionDiv>

      {/* Call-to-Action Buttons */}
      <MotionDiv
        preset="slideUp"
        delay={2.2}
        className="mt-8 flex flex-wrap justify-center gap-4"
      >
        <GlassCard
          variant="gradient"
          className="px-8 py-4 cursor-pointer group hover:scale-105 transition-all duration-300"
        >
          <motion.span
            className="text-white font-semibold flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <span className="animate-pulse">✨</span>
            Explore Now
            <motion.span
              className="ml-2 group-hover:translate-x-1 transition-transform"
              whileHover={{ x: 3 }}
            >
              →
            </motion.span>
          </motion.span>
        </GlassCard>

        <GlassCard
          variant="frosted"
          className="px-8 py-4 cursor-pointer hover:scale-105 transition-all duration-300"
        >
          <span className="text-white/90 font-medium">Watch Journey</span>
        </GlassCard>
      </MotionDiv>
    </motion.div>
  );
};

/**
 * Scroll indicator with simple animation
 */
const ScrollIndicator = () => {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3, duration: 0.8 }}
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
        
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent relative"
        >
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </GlassCard>
    </motion.div>
  );
};

/**
 * Optimized hero banner with nature background
 */
export function HeroBanner() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Nature Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Spiritual nature landscape"
          fill
          className={cn(
            "object-cover transition-all duration-1000",
            imageLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          priority
          sizes="100vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        
        {/* Subtle animated overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-blue-900/20"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Loading fallback */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Skeleton className="h-full w-full" />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center p-4">
        <FloatingTypography />
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Subtle floating particles - reduced count */}
      <motion.div
        className="absolute inset-0 z-1 pointer-events-none"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute top-10 left-10 w-1 h-1 bg-white/40 rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-400/20 rounded-full animate-ping" style={{ animationDelay: '4s' }} />
        <div className="absolute top-2/3 right-1/3 w-0.5 h-0.5 bg-pink-400/30 rounded-full animate-ping" style={{ animationDelay: '6s' }} />
      </motion.div>

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 pointer-events-none z-10" />
    </section>
  );
}