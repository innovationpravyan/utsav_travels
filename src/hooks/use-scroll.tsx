'use client';

import { useEffect, useState, useRef } from 'react';
/**
 * Scroll reveal configuration
 */
export interface ScrollRevealConfig {
  threshold?: number; // 0 to 1, how much of an element should be visible
  rootMargin?: string; // CSS margin values
  triggerOnce?: boolean; // Whether to trigger animation only once
  delay?: number; // Delay before triggering animation
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
        if (entry!.isIntersecting) {
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