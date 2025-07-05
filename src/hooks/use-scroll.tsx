'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Scroll position and direction tracking
 */
export interface ScrollData {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right' | null;
  progress: number; // 0 to 1 representing scroll progress through document
  velocity: number; // pixels per frame
}

/**
 * Scroll reveal configuration
 */
export interface ScrollRevealConfig {
  threshold?: number; // 0 to 1, how much of element should be visible
  rootMargin?: string; // CSS margin values
  triggerOnce?: boolean; // Whether to trigger animation only once
  delay?: number; // Delay before triggering animation
}

/**
 * Enhanced scroll hook with multiple features
 */
export function useScroll() {
  const [scrollData, setScrollData] = useState<ScrollData>({
    x: 0,
    y: 0,
    direction: null,
    progress: 0,
    velocity: 0,
  });

  const lastScrollTop = useRef(0);
  const lastScrollLeft = useRef(0);
  const lastTimestamp = useRef(0);
  const velocityArray = useRef<number[]>([]);

  const updateScrollData = useCallback(() => {
    const currentTime = Date.now();
    const currentScrollY = window.scrollY;
    const currentScrollX = window.scrollX;
    
    // Calculate direction
    let direction: ScrollData['direction'] = null;
    if (currentScrollY > lastScrollTop.current) {
      direction = 'down';
    } else if (currentScrollY < lastScrollTop.current) {
      direction = 'up';
    } else if (currentScrollX > lastScrollLeft.current) {
      direction = 'right';
    } else if (currentScrollX < lastScrollLeft.current) {
      direction = 'left';
    }

    // Calculate velocity (pixels per millisecond, then convert to pixels per frame assuming 60fps)
    const deltaY = Math.abs(currentScrollY - lastScrollTop.current);
    const deltaTime = currentTime - lastTimestamp.current;
    const currentVelocity = deltaTime > 0 ? (deltaY / deltaTime) * 16.67 : 0; // Convert to pixels per frame

    // Smooth velocity using rolling average
    velocityArray.current.push(currentVelocity);
    if (velocityArray.current.length > 5) {
      velocityArray.current.shift();
    }
    const smoothVelocity = velocityArray.current.reduce((a, b) => a + b, 0) / velocityArray.current.length;

    // Calculate progress (0 to 1)
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? Math.min(currentScrollY / documentHeight, 1) : 0;

    setScrollData({
      x: currentScrollX,
      y: currentScrollY,
      direction,
      progress,
      velocity: smoothVelocity,
    });

    // Update CSS custom property for parallax effects
    document.documentElement.style.setProperty('--scroll-progress', progress.toString());

    lastScrollTop.current = currentScrollY;
    lastScrollLeft.current = currentScrollX;
    lastTimestamp.current = currentTime;
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollData();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial call
    updateScrollData();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollData, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollData);
    };
  }, [updateScrollData]);

  return scrollData;
}

/**
 * Hook for scroll-triggered reveal animations
 */
export function useScrollReveal(config: ScrollRevealConfig = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0,
  } = config;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutRef.current = setTimeout(() => {
              setIsVisible(true);
              setHasTriggered(true);
            }, delay);
          } else {
            setIsVisible(true);
            setHasTriggered(true);
          }
        } else if (!triggerOnce || !hasTriggered) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered]);

  return { ref: elementRef, isVisible, hasTriggered };
}

/**
 * Hook for smooth scrolling to elements
 */
export function useSmoothScroll() {
  const scrollToElement = useCallback((
    target: string | HTMLElement,
    options: ScrollIntoViewOptions = {}
  ) => {
    const element = typeof target === 'string' 
      ? document.querySelector(target) as HTMLElement
      : target;

    if (!element) return;

    const defaultOptions: ScrollIntoViewOptions = {
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
      ...options,
    };

    element.scrollIntoView(defaultOptions);
  }, []);

  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  }, []);

  const scrollToPosition = useCallback((
    x: number,
    y: number,
    behavior: ScrollBehavior = 'smooth'
  ) => {
    window.scrollTo({
      top: y,
      left: x,
      behavior,
    });
  }, []);

  return {
    scrollToElement,
    scrollToTop,
    scrollToPosition,
  };
}

/**
 * Hook for detecting scroll direction changes
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);
  const threshold = useRef(10); // Minimum scroll distance to register direction change

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      
      if (Math.abs(scrollY - lastScrollY.current) < threshold.current) {
        ticking = false;
        return;
      }

      setScrollDirection(scrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrollDirection;
}

/**
 * Hook for scroll-based progress tracking
 */
export function useScrollProgress(target?: string | HTMLElement) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      let scrollProgress = 0;

      if (target) {
        const element = typeof target === 'string' 
          ? document.querySelector(target) as HTMLElement
          : target;

        if (element) {
          const rect = element.getBoundingClientRect();
          const elementHeight = element.offsetHeight;
          const windowHeight = window.innerHeight;
          
          if (rect.top <= windowHeight && rect.bottom >= 0) {
            const visibleHeight = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);
            scrollProgress = visibleHeight / elementHeight;
          }
        }
      } else {
        // Global document progress
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = documentHeight > 0 ? window.scrollY / documentHeight : 0;
      }

      setProgress(Math.max(0, Math.min(1, scrollProgress)));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    // Initial calculation
    updateProgress();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateProgress);
    };
  }, [target]);

  return progress;
}

/**
 * Hook for element's visibility in viewport
 */
export function useInView(options: IntersectionObserverInit = {}) {
  const [isInView, setIsInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([observerEntry]) => {
      setEntry(observerEntry);
      setIsInView(observerEntry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '0px',
      ...options,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return { ref: elementRef, isInView, entry };
}

/**
 * Hook for scroll-based animations with multiple triggers
 */
export function useScrollAnimation() {
  const [animations, setAnimations] = useState<Map<string, boolean>>(new Map());
  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map());

  const registerElement = useCallback((
    id: string,
    element: HTMLElement,
    options: IntersectionObserverInit = {}
  ) => {
    // Clean up existing observer
    const existingObserver = observersRef.current.get(id);
    if (existingObserver) {
      existingObserver.disconnect();
    }

    const observer = new IntersectionObserver(([entry]) => {
      setAnimations(prev => new Map(prev.set(id, entry.isIntersecting)));
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    });

    observer.observe(element);
    observersRef.current.set(id, observer);

    return () => {
      observer.disconnect();
      observersRef.current.delete(id);
      setAnimations(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    };
  }, []);

  const isVisible = useCallback((id: string) => {
    return animations.get(id) || false;
  }, [animations]);

  useEffect(() => {
    return () => {
      // Cleanup all observers
      observersRef.current.forEach(observer => observer.disconnect());
      observersRef.current.clear();
    };
  }, []);

  return { registerElement, isVisible };
}