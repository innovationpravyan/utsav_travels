'use client';

// src/components/video-hero-banner.tsx

import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MotionDiv, StaggerContainer } from '@/components/motion-div';
import { GlassCard, FloatingGlassCard } from '@/components/ui/glass-card';
import { PageBanner } from '@/components/page-banner';
import { 
  VideoHeroBannerProps, 
  VideoControlsProps, 
  HeroBannerContentProps,
  PLACEHOLDER_VIDEOS 
} from '@/types/hero';

/**
 * Video Controls Component
 */
const VideoControls = ({ 
  isMuted, 
  onToggleMute, 
  isPlaying, 
  onTogglePlay, 
  position = 'bottom-right' 
}: VideoControlsProps) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'top-right': 'top-6 right-6', 
    'bottom-left': 'bottom-6 left-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <motion.div
      className={cn('absolute z-40 flex gap-3', positionClasses[position])}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.6 }}
    >
      {/* Mute/Unmute Button */}
      <FloatingGlassCard
        variant="frosted"
        size="sm"
        className="p-3 cursor-pointer group hover:scale-110 transition-all duration-300"
        onClick={onToggleMute}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
          ) : (
            <Volume2 className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
          )}
        </motion.div>
      </FloatingGlassCard>

      {/* Play/Pause Button */}
      <FloatingGlassCard
        variant="frosted"
        size="sm"
        className="p-3 cursor-pointer group hover:scale-110 transition-all duration-300"
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
          ) : (
            <Play className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
          )}
        </motion.div>
      </FloatingGlassCard>
    </motion.div>
  );
};

/**
 * Hero Banner Content Component
 */
const HeroBannerContent = ({ 
  title, 
  subtitle, 
  description, 
  alignment = 'center',
  delay = 0.5 
}: HeroBannerContentProps) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const alignmentClasses = {
    center: 'text-center items-center',
    left: 'text-left items-start',
    right: 'text-right items-end'
  };

  return (
    <motion.div
      style={{ y, opacity }}
      className={cn(
        'relative z-30 flex flex-col justify-center max-w-6xl mx-auto px-4',
        alignmentClasses[alignment]
      )}
    >
      <StaggerContainer>
        {/* Main Title */}
        <MotionDiv preset="slideUp" delay={delay}>
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-headline font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.3, duration: 0.8, ease: "backOut" }}
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
                initial={{ opacity: 0, y: 30, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: delay + 0.5 + index * 0.1, 
                  duration: 0.8,
                  ease: "backOut"
                }}
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 30px rgba(255,255,255,0.8)"
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </MotionDiv>

        {/* Subtitle */}
        {subtitle && (
          <MotionDiv preset="fadeIn" delay={delay + 1}>
            <motion.p
              className="text-2xl md:text-3xl text-primary/90 font-light mb-6 tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 1.2, duration: 0.8 }}
            >
              {subtitle}
            </motion.p>
          </MotionDiv>
        )}

        {/* Description */}
        {description && (
          <MotionDiv preset="fadeIn" delay={delay + 1.5}>
            <motion.p
              className="text-xl text-white/80 max-w-4xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 1.7, duration: 0.8 }}
            >
              {description}
            </motion.p>
          </MotionDiv>
        )}

        {/* Scroll Indicator */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 2.5, duration: 0.8 }}
        >
          <GlassCard variant="subtle" size="sm" className="px-4 py-2">
            <motion.div
              className="flex flex-col items-center gap-2 text-white/70"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-sm font-light">Scroll to explore</span>
              <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent relative">
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  animate={{ y: [0, 24, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </GlassCard>
        </motion.div>
      </StaggerContainer>
    </motion.div>
  );
};

/**
 * Main VideoHeroBanner Component
 */
export function VideoHeroBanner({
  videoSrc,
  fallbackImage,
  title,
  subtitle,
  description,
  overlayDarkness = 0.6,
  showWhatsApp = true,
  height = '100vh',
  autoplay = true,
  loop = true,
  muted = true,
  className,
  children,
}: VideoHeroBannerProps) {
  const [isMuted, setIsMuted] = useState(muted);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video controls
  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle video events
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    setHasVideoError(false);
  };

  const handleVideoError = () => {
    console.warn('Video failed to load, falling back to image or PageBanner');
    setHasVideoError(true);
    setIsVideoLoaded(false);
  };

  // Auto-play video when loaded
  useEffect(() => {
    if (videoRef.current && isVideoLoaded && autoplay) {
      videoRef.current.play().catch(() => {
        console.warn('Autoplay failed, user interaction required');
      });
    }
  }, [isVideoLoaded, autoplay]);

  // If video fails to load, fall back to existing PageBanner
  if (hasVideoError) {
    return (
      <PageBanner
        title={title}
        subtitle={subtitle}
        description={description}
        items={[{
          id: 'fallback',
          image: fallbackImage || 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
          name: title,
          tagline: subtitle || ''
        }]}
        variant="cinematic"
        height={height}
        showStats={false}
        showFloatingElements={true}
      />
    );
  }

  return (
    <section 
      className={cn('relative w-full overflow-hidden', className)}
      style={{ height }}
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000',
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          )}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          playsInline
          preload="metadata"
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          aria-label="Background video"
        >
          <source src={videoSrc} type="video/webm" />
          <source src={videoSrc.replace('.webm', '.mp4')} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading placeholder */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <motion.div
              className="text-white text-xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading video...
            </motion.div>
          </div>
        )}

        {/* Video Overlay */}
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayDarkness }}
          initial={{ opacity: 0 }}
          animate={{ opacity: overlayDarkness }}
          transition={{ duration: 1 }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/30 rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-400/40 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '4s' }} />
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-pink-400/40 rounded-full animate-ping" style={{ animationDelay: '6s' }} />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        {children || (
          <HeroBannerContent
            title={title}
            subtitle={subtitle}
            description={description}
          />
        )}
      </div>

      {/* Video Controls */}
      {isVideoLoaded && (
        <VideoControls
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          position="bottom-right"
        />
      )}

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 pointer-events-none z-15" />
    </section>
  );
}

/**
 * Preset Hero Banner Components for different pages
 */
export const HomeVideoHero = (props: Partial<VideoHeroBannerProps>) => (
  <VideoHeroBanner
    videoSrc={PLACEHOLDER_VIDEOS.spiritual}
    title="Discover the Spiritual Heritage"
    subtitle="of Varanasi, Ayodhya, Rishikesh, Kedarnath"
    description="Embark on transformative journeys through India's most sacred destinations"
    showWhatsApp={true}
    height="100vh"
    {...props}
  />
);

export const AboutVideoHero = (props: Partial<VideoHeroBannerProps>) => (
  <VideoHeroBanner
    videoSrc={PLACEHOLDER_VIDEOS.nature}
    title="About Utsav Travels"
    subtitle="Your Gateway to Spiritual India"
    description="Connecting travelers with the authentic soul of sacred destinations"
    height="80vh"
    {...props}
  />
);

export const DestinationsVideoHero = (props: Partial<VideoHeroBannerProps>) => (
  <VideoHeroBanner
    videoSrc={PLACEHOLDER_VIDEOS.temple}
    title="Explore Sacred Destinations"
    subtitle="Journey Through India's Spiritual Heritage"
    description="Discover ancient temples, sacred ghats, and spiritual sites"
    height="85vh"
    {...props}
  />
);

export const PackagesVideoHero = (props: Partial<VideoHeroBannerProps>) => (
  <VideoHeroBanner
    videoSrc={PLACEHOLDER_VIDEOS.journey}
    title="Curated Travel Packages"
    subtitle="Journeys Crafted for the Soul"
    description="Experience India's spiritual heritage through our carefully designed packages"
    height="90vh"
    {...props}
  />
);