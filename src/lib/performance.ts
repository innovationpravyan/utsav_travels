/**
 * Performance Optimization Utilities
 * 
 * This module contains utilities for optimizing application performance,
 * including image optimization, lazy loading, and intersection observer helpers.
 * 
 * Features:
 * - Image optimization utilities
 * - Lazy loading helpers
 * - Intersection observer hooks
 * - Performance monitoring
 * - Memory optimization
 */

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Image optimization configuration
 */
export const imageConfig = {
  // Optimized image sizes for different breakpoints
  sizes: {
    mobile: '(max-width: 640px) 100vw',
    tablet: '(max-width: 1024px) 50vw',
    desktop: '33vw',
    hero: '100vw',
    card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  },
  
  // Device-specific sizes
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  
  // Supported formats (WebP first for better compression)
  formats: ['image/webp', 'image/jpeg'],
  
  // Quality settings
  quality: {
    high: 90,
    medium: 75,
    low: 60,
    thumbnail: 50,
  },
};

/**
 * Generate optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  options: {
    priority?: boolean;
    sizes?: string;
    quality?: keyof typeof imageConfig.quality;
    fill?: boolean;
    width?: number;
    height?: number;
  } = {}
) {
  const {
    priority = false,
    sizes = imageConfig.sizes.card,
    quality = 'medium',
    fill = false,
    width,
    height,
  } = options;

  return {
    src,
    alt,
    priority,
    sizes,
    quality: imageConfig.quality[quality],
    fill,
    width,
    height,
    className: 'transition-opacity duration-300',
    loading: priority ? 'eager' : 'lazy' as const,
  };
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [hasIntersected, options]);

  return { targetRef, isIntersecting, hasIntersected };
}

/**
 * Lazy loading component wrapper
 */
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export function LazyWrapper({
  children,
  fallback = <div className="animate-pulse bg-gray-200 rounded" />,
  className = '',
  threshold = 0.1,
  rootMargin = '50px',
}: LazyWrapperProps) {
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  return (
    <div ref={targetRef} className={className}>
      {hasIntersected ? children : fallback}
    </div>
  );
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  /**
   * Start measuring performance for a given operation
   */
  static startMeasure(name: string) {
    if (typeof window === 'undefined') return;
    
    const now = performance.now();
    this.marks.set(name, now);
    
    // Use Performance API if available
    if (performance.mark) {
      performance.mark(`${name}-start`);
    }
  }

  /**
   * End measuring and log the duration
   */
  static endMeasure(name: string) {
    if (typeof window === 'undefined') return;
    
    const startTime = this.marks.get(name);
    if (!startTime) return;
    
    const duration = performance.now() - startTime;
    this.marks.delete(name);
    
    // Use Performance API if available
    if (performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  /**
   * Measure React component render time
   */
  static measureRender(componentName: string) {
    return {
      onStart: () => this.startMeasure(`render-${componentName}`),
      onEnd: () => this.endMeasure(`render-${componentName}`),
    };
  }
}

/**
 * Debounce hook for performance optimization
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for performance optimization
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + interval) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * Memory optimization: Cleanup unused resources
 */
export function useCleanup(cleanup: () => void) {
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload critical images
  const criticalImages = [
    '/images/hero-bg.jpg',
    '/images/logo.png',
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });

  // Preload critical fonts
  const criticalFonts = [
    'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap',
  ];

  criticalFonts.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
    
    // Load the stylesheet
    setTimeout(() => {
      link.rel = 'stylesheet';
    }, 0);
  });
}

/**
 * Optimize bundle size by code splitting
 */
export const createDynamicImport = <T>(
  importFn: () => Promise<{ default: T }>,
  fallback?: T
) => {
  let cached: T | undefined;
  
  return async (): Promise<T> => {
    if (cached) return cached;
    
    try {
      const module = await importFn();
      cached = module.default;
      return cached;
    } catch (error) {
      console.error('Dynamic import failed:', error);
      if (fallback) return fallback;
      throw error;
    }
  };
};

/**
 * Web Vitals measurement
 */
export function measureWebVitals() {
  if (typeof window === 'undefined') return;

  // Measure First Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        console.log('🎨 FCP:', entry.startTime);
      }
    }
  }).observe({ entryTypes: ['paint'] });

  // Measure Largest Contentful Paint
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('🖼️ LCP:', lastEntry.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // Measure Cumulative Layout Shift
  let clsValue = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
    console.log('📐 CLS:', clsValue);
  }).observe({ entryTypes: ['layout-shift'] });
}

/**
 * Resource hints for better performance
 */
export function addResourceHints() {
  if (typeof document === 'undefined') return;

  // DNS prefetch for external domains
  const domains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'images.pexels.com',
    'images.unsplash.com',
  ];

  domains.forEach((domain) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });

  // Preconnect to critical origins
  const criticalOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  criticalOrigins.forEach((origin) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}