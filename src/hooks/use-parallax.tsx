'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Parallax configuration options
 */
export interface ParallaxConfig {
  speed?: number; // Parallax speed multiplier (-1 to 1, where 0 is no movement)
  direction?: 'vertical' | 'horizontal' | 'both';
  rootMargin?: string; // IntersectionObserver root margin
  threshold?: number; // IntersectionObserver threshold
  enabled?: boolean; // Enable/disable parallax
  easing?: 'linear' | 'easeOut' | 'easeInOut' | 'custom';
  customEasing?: (t: number) => number; // Custom easing function
  offset?: { x?: number; y?: number }; // Initial offset
  scale?: { min?: number; max?: number }; // Scale range based on scroll
  rotate?: { min?: number; max?: number }; // Rotation range based on scroll
  opacity?: { min?: number; max?: number }; // Opacity range based on scroll
}

/**
 * Transform values for parallax effect
 */
export interface ParallaxTransform {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
}

/**
 * Easing functions for smooth parallax animations
 */
const easingFunctions = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - (1 - t) * (1 - t),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
};

/**
 * Main parallax hook with advanced features
 */
export function useParallax(config: ParallaxConfig = {}) {
  const {
    speed = -0.5,
    direction = 'vertical',
    rootMargin = '0px',
    threshold = 0,
    enabled = true,
    easing = 'linear',
    customEasing,
    offset = { x: 0, y: 0 },
    scale,
    rotate,
    opacity,
  } = config;

  const elementRef = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState<ParallaxTransform>({
    x: offset.x || 0,
    y: offset.y || 0,
    scale: scale?.min || 1,
    rotate: rotate?.min || 0,
    opacity: opacity?.min || 1,
  });

  const [isInView, setIsInView] = useState(false);
  const lastScrollY = useRef(0);
  const lastScrollX = useRef(0);
  const animationFrame = useRef<number>();

  const easingFunction = customEasing || easingFunctions[easing];

  const updateTransform = useCallback(() => {
    if (!enabled || !isInView || !elementRef.current) return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Calculate progress based on element position in viewport
    let progress = 0;
    
    if (direction === 'vertical' || direction === 'both') {
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      progress = (viewportCenter - elementCenter) / (windowHeight + rect.height);
    }

    if (direction === 'horizontal') {
      const elementCenter = rect.left + rect.width / 2;
      const viewportCenter = windowWidth / 2;
      progress = (viewportCenter - elementCenter) / (windowWidth + rect.width);
    }

    // Apply easing
    const easedProgress = easingFunction(Math.abs(progress));
    const signedProgress = progress >= 0 ? easedProgress : -easedProgress;

    // Calculate transforms
    const newTransform: ParallaxTransform = {
      x: offset.x || 0,
      y: offset.y || 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
    };

    // Parallax movement
    if (direction === 'vertical' || direction === 'both') {
      newTransform.y = (offset.y || 0) + signedProgress * speed * 100;
    }
    
    if (direction === 'horizontal' || direction === 'both') {
      newTransform.x = (offset.x || 0) + signedProgress * speed * 100;
    }

    // Scale transformation
    if (scale) {
      const scaleRange = (scale.max || 1) - (scale.min || 1);
      newTransform.scale = (scale.min || 1) + Math.abs(signedProgress) * scaleRange;
    }

    // Rotation transformation
    if (rotate) {
      const rotateRange = (rotate.max || 0) - (rotate.min || 0);
      newTransform.rotate = (rotate.min || 0) + signedProgress * rotateRange;
    }

    // Opacity transformation
    if (opacity) {
      const opacityRange = (opacity.max || 1) - (opacity.min || 1);
      newTransform.opacity = (opacity.min || 1) + Math.abs(signedProgress) * opacityRange;
    }

    setTransform(newTransform);
  }, [enabled, isInView, speed, direction, easingFunction, offset, scale, rotate, opacity]);

  // Scroll event handler
  useEffect(() => {
    if (!enabled) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        animationFrame.current = requestAnimationFrame(() => {
          updateTransform();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateTransform, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateTransform);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [enabled, updateTransform]);

  // Intersection observer for performance
  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          updateTransform();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [enabled, rootMargin, threshold, updateTransform]);

  // CSS transform string
  const transformString = `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale}) rotate(${transform.rotate}deg)`;

  return {
    ref: elementRef,
    transform,
    transformString,
    style: {
      transform: transformString,
      opacity: transform.opacity,
      willChange: 'transform, opacity',
    },
    isInView,
  };
}

/**
 * Simple parallax hook for basic vertical movement
 */
export function useSimpleParallax(speed: number = -0.5) {
  return useParallax({ speed, direction: 'vertical' });
}

/**
 * Multi-layer parallax hook for complex scenes
 */
export function useMultiLayerParallax(layers: Array<{ speed: number; id: string }>) {
  const [transforms, setTransforms] = useState<Map<string, ParallaxTransform>>(new Map());
  const containerRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  const updateAllLayers = useCallback(() => {
    if (!isInView || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate progress for container
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    const progress = (viewportCenter - elementCenter) / (windowHeight + rect.height);

    const newTransforms = new Map<string, ParallaxTransform>();

    layers.forEach(({ speed, id }) => {
      const movement = progress * speed * 100;
      newTransforms.set(id, {
        x: 0,
        y: movement,
        scale: 1,
        rotate: 0,
        opacity: 1,
      });
    });

    setTransforms(newTransforms);
  }, [isInView, layers]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateAllLayers();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateAllLayers, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateAllLayers);
    };
  }, [updateAllLayers]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          updateAllLayers();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0,
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [updateAllLayers]);

  const getLayerProps = useCallback((id: string) => {
    const transform = transforms.get(id) || { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
    return {
      style: {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        willChange: 'transform',
      },
    };
  }, [transforms]);

  return {
    containerRef,
    getLayerProps,
    isInView,
  };
}

/**
 * Mouse parallax hook for interactive effects
 */
export function useMouseParallax(sensitivity: number = 0.1, centerOnLeave: boolean = true) {
  const elementRef = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * sensitivity;
      const deltaY = (e.clientY - centerY) * sensitivity;
      
      setTransform({ x: deltaX, y: deltaY });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (centerOnLeave) {
        setTransform({ x: 0, y: 0 });
      }
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [sensitivity, centerOnLeave]);

  return {
    ref: elementRef,
    transform,
    isHovered,
    style: {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      transition: isHovered ? 'none' : 'transform 0.3s ease-out',
      willChange: 'transform',
    },
  };
}

/**
 * Gyroscope parallax hook for mobile devices
 */
export function useGyroscopeParallax(sensitivity: number = 0.5) {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if device motion is supported
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      setIsSupported(true);

      const handleDeviceMotion = (e: DeviceMotionEvent) => {
        if (e.accelerationIncludingGravity) {
          const { x, y } = e.accelerationIncludingGravity;
          if (x !== null && y !== null) {
            setTransform({
              x: x * sensitivity * 10,
              y: y * sensitivity * 10,
            });
          }
        }
      };

      window.addEventListener('devicemotion', handleDeviceMotion);

      return () => {
        window.removeEventListener('devicemotion', handleDeviceMotion);
      };
    }
  }, [sensitivity]);

  return {
    transform,
    isSupported,
    style: {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      transition: 'transform 0.1s ease-out',
      willChange: 'transform',
    },
  };
}

/**
 * Scroll velocity parallax hook
 */
export function useVelocityParallax(multiplier: number = 0.1) {
  const elementRef = useRef<HTMLElement>(null);
  const [velocity, setVelocity] = useState(0);
  const [position, setPosition] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    let ticking = false;

    const updateVelocity = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;
      
      const deltaTime = currentTime - lastTime.current;
      const deltaScroll = currentScrollY - lastScrollY.current;
      
      if (deltaTime > 0) {
        const currentVelocity = deltaScroll / deltaTime;
        setVelocity(currentVelocity);
        setPosition(prev => prev + currentVelocity * multiplier);
      }

      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateVelocity);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [multiplier]);

  return {
    ref: elementRef,
    velocity,
    position,
    style: {
      transform: `translateY(${position}px)`,
      willChange: 'transform',
    },
  };
}