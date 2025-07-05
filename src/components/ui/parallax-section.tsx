'use client';

import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { useParallax, useMultiLayerParallax } from '@/hooks/use-parallax';
import { useScrollReveal } from '@/hooks/use-scroll';
import { FloatingElements } from './floating-elements';
import { cn } from '@/lib/utils';

/**
 * Parallax layer configuration
 */
export interface ParallaxLayer {
  id: string;
  speed: number; // Parallax speed (-2 to 2)
  content?: React.ReactNode;
  image?: string;
  video?: string;
  className?: string;
  style?: React.CSSProperties;
  blur?: number;
  opacity?: number;
  scale?: number;
  offset?: { x?: number; y?: number };
}

/**
 * Parallax section props
 */
export interface ParallaxSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  layers?: ParallaxLayer[];
  height?: string | number; // CSS height value
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundColor?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  scrollReveal?: boolean;
  floatingElements?: boolean;
  interactive?: boolean;
  children?: React.ReactNode;
}

/**
 * Individual parallax layer component
 */
const ParallaxLayerComponent: React.FC<{
  layer: ParallaxLayer;
  containerHeight: number;
}> = ({ layer, containerHeight }) => {
  const parallax = useParallax({
    speed: layer.speed,
    direction: 'vertical',
    scale: layer.scale ? { min: layer.scale, max: layer.scale * 1.1 } : undefined,
    offset: layer.offset,
  });

  const layerStyle: React.CSSProperties = {
    ...layer.style,
    opacity: layer.opacity,
    filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: containerHeight + Math.abs(layer.speed) * 200, // Extra height for parallax movement
    backgroundImage: layer.image ? `url(${layer.image})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    willChange: 'transform',
  };

  return (
    <div
      ref={parallax.ref}
      className={cn('parallax-layer', layer.className)}
      style={{
        ...layerStyle,
        ...parallax.style,
      }}
    >
      {layer.video && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={layer.video} type="video/mp4" />
        </video>
      )}
      {layer.content}
    </div>
  );
};

/**
 * Main parallax section component
 */
export const ParallaxSection = forwardRef<HTMLDivElement, ParallaxSectionProps>(
  ({
    layers = [],
    height = '100vh',
    backgroundImage,
    backgroundVideo,
    backgroundColor,
    overlay = false,
    overlayColor = 'rgba(0,0,0,0.3)',
    overlayOpacity = 0.3,
    scrollReveal = false,
    floatingElements = false,
    interactive = false,
    className,
    style,
    children,
    ...props
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState(800);
    
    const scrollRevealProps = useScrollReveal({
      threshold: 0.1,
      triggerOnce: true,
    });

    // Multi-layer parallax for performance
    const multiLayerParallax = useMultiLayerParallax(
      layers.map(layer => ({ speed: layer.speed, id: layer.id }))
    );

    // Update container height
    useEffect(() => {
      if (containerRef.current) {
        const updateHeight = () => {
          setContainerHeight(containerRef.current?.offsetHeight || 800);
        };
        
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
      }
    }, []);

    const containerStyle: React.CSSProperties = {
      ...style,
      height: typeof height === 'number' ? `${height}px` : height,
      backgroundColor,
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden',
    };

    return (
      <div
        ref={scrollReveal ? scrollRevealProps.ref : (ref || containerRef)}
        className={cn(
          'parallax-section relative',
          scrollReveal && !scrollRevealProps.isVisible && 'scroll-reveal',
          scrollReveal && scrollRevealProps.isVisible && 'scroll-reveal revealed',
          className
        )}
        style={containerStyle}
        {...props}
      >
        {/* Background video */}
        {backgroundVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        )}

        {/* Parallax layers */}
        <div ref={multiLayerParallax.containerRef} className="absolute inset-0">
          {layers.map((layer) => (
            <div key={layer.id} {...multiLayerParallax.getLayerProps(layer.id)}>
              <ParallaxLayerComponent layer={layer} containerHeight={containerHeight} />
            </div>
          ))}
        </div>

        {/* Floating elements */}
        {floatingElements && (
          <div className="absolute inset-0 z-10">
            <FloatingElements
              count={15}
              theme="light"
              density="low"
              interactive={interactive}
              parallax
            />
          </div>
        )}

        {/* Overlay */}
        {overlay && (
          <div
            className="absolute inset-0 z-20"
            style={{
              backgroundColor: overlayColor,
              opacity: overlayOpacity,
            }}
          />
        )}

        {/* Content */}
        {children && (
          <div className="relative z-30 h-full flex flex-col justify-center items-center">
            {children}
          </div>
        )}
      </div>
    );
  }
);

ParallaxSection.displayName = 'ParallaxSection';

/**
 * Parallax hero section with optimized defaults
 */
export const ParallaxHero = forwardRef<HTMLDivElement, ParallaxSectionProps>(
  ({ children, layers, ...props }, ref) => {
    const defaultLayers: ParallaxLayer[] = [
      {
        id: 'background',
        speed: -0.5,
        className: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      },
      {
        id: 'midground',
        speed: -0.3,
        content: (
          <div className="absolute inset-0 pattern-dots opacity-20" />
        ),
      },
      {
        id: 'foreground',
        speed: -0.1,
        content: (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />
        ),
      },
    ];

    return (
      <ParallaxSection
        ref={ref}
        layers={layers || defaultLayers}
        height="100vh"
        floatingElements
        interactive
        scrollReveal
        {...props}
      >
        {children}
      </ParallaxSection>
    );
  }
);

ParallaxHero.displayName = 'ParallaxHero';

/**
 * Parallax content section with text reveal
 */
export const ParallaxContent = forwardRef<HTMLDivElement, ParallaxSectionProps>(
  ({ children, className, ...props }, ref) => (
    <ParallaxSection
      ref={ref}
      height="80vh"
      scrollReveal
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <div className="container mx-auto px-4 text-center">
        {children}
      </div>
    </ParallaxSection>
  )
);

ParallaxContent.displayName = 'ParallaxContent';

/**
 * Parallax image section with Ken Burns effect
 */
export const ParallaxImage = forwardRef<HTMLDivElement, 
  ParallaxSectionProps & { 
    src: string; 
    alt?: string; 
    kenBurns?: boolean; 
    zoomDirection?: 'in' | 'out';
  }
>(({ src, alt, kenBurns = false, zoomDirection = 'in', children, ...props }, ref) => {
  const kenBurnsLayers: ParallaxLayer[] = kenBurns ? [
    {
      id: 'ken-burns',
      speed: -0.2,
      image: src,
      className: cn(
        'transition-transform duration-[20s] ease-linear',
        zoomDirection === 'in' ? 'hover:scale-110' : 'scale-110 hover:scale-100'
      ),
    },
  ] : [
    {
      id: 'static-image',
      speed: -0.3,
      image: src,
    },
  ];

  return (
    <ParallaxSection
      ref={ref}
      layers={kenBurnsLayers}
      height="70vh"
      overlay
      overlayColor="rgba(0,0,0,0.4)"
      scrollReveal
      {...props}
    >
      {children}
    </ParallaxSection>
  );
});

ParallaxImage.displayName = 'ParallaxImage';

/**
 * Parallax video section with controls
 */
export const ParallaxVideo = forwardRef<HTMLDivElement, 
  ParallaxSectionProps & { 
    src: string; 
    poster?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
  }
>(({ 
  src, 
  poster, 
  autoPlay = true, 
  muted = true, 
  loop = true, 
  children, 
  overlay = true,
  overlayColor = 'rgba(0,0,0,0.5)',
  ...props 
}, ref) => {
  const videoLayers: ParallaxLayer[] = [
    {
      id: 'video-background',
      speed: -0.1,
      content: (
        <video
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          poster={poster}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      ),
    },
  ];

  return (
    <ParallaxSection
      ref={ref}
      layers={videoLayers}
      height="80vh"
      overlay={overlay}
      overlayColor={overlayColor}
      scrollReveal
      {...props}
    >
      {children}
    </ParallaxSection>
  );
});

ParallaxVideo.displayName = 'ParallaxVideo';

/**
 * Parallax gallery section with multiple images
 */
export const ParallaxGallery = forwardRef<HTMLDivElement,
  ParallaxSectionProps & {
    images: Array<{ src: string; alt?: string; speed?: number }>;
  }
>(({ images, children, ...props }, ref) => {
  const galleryLayers: ParallaxLayer[] = images.map((img, index) => ({
    id: `gallery-${index}`,
    speed: img.speed || -0.2 - (index * 0.1),
    image: img.src,
    opacity: 0.3 + (index * 0.1),
    className: `z-${index + 1}`,
  }));

  return (
    <ParallaxSection
      ref={ref}
      layers={galleryLayers}
      height="90vh"
      overlay
      overlayColor="rgba(0,0,0,0.6)"
      scrollReveal
      {...props}
    >
      {children}
    </ParallaxSection>
  );
});

ParallaxGallery.displayName = 'ParallaxGallery';