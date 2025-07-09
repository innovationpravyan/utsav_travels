'use client';

import {useEffect, useRef, useState} from 'react';

// Types
interface InViewOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}
// Optimized IntersectionObserver hook with immediate loading
export function useThreeInView(threshold = 0.01, options: InViewOptions = {}) {
    const [isInView, setIsInView] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const elementRef = useRef<HTMLElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const { rootMargin = '50px', triggerOnce = false } = options;

    useEffect(() => {
        const element = elementRef.current;
        if (!element || typeof window === 'undefined') return;

        // Clean up previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        try {
            observerRef.current = new IntersectionObserver(
                ([entry]) => {
                    const isIntersecting = entry?.isIntersecting ?? false;

                    if (isIntersecting) {
                        setIsInView(true);
                        if (!hasTriggered) {
                            setHasTriggered(true);
                        }
                        // Disconnect if triggerOnce
                        if (triggerOnce) {
                            observerRef.current?.disconnect();
                        }
                    } else if (!triggerOnce) {
                        setIsInView(false);
                    }
                },
                {
                    threshold: Math.max(0, Math.min(1, threshold)),
                    rootMargin,
                }
            );

            observerRef.current.observe(element);
        } catch (error) {
            console.warn('IntersectionObserver failed:', error);
            // Fallback: assume element is in view
            setIsInView(true);
            setHasTriggered(true);
        }

        return () => {
            observerRef.current?.disconnect();
        };
    }, [threshold, rootMargin, triggerOnce, hasTriggered]);

    return { ref: elementRef, isInView, hasTriggered };
}

// SSR-safe window access with error handling
export function useSafeWindow() {
    const [windowObj, setWindowObj] = useState<Window | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowObj(window);
        }
    }, []);

    return windowObj;
}

// Highly optimized scroll hook with RAF throttling
export function useOptimizedScroll(
    callback: (scrollY: number, scrollX: number) => void,
    throttle = 16 // ~60fps
) {
    const callbackRef = useRef(callback);
    const lastCallTime = useRef(0);
    const rafRef = useRef<number>();
    const windowObj = useSafeWindow();

    // Keep callback ref updated
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!windowObj) return;

        const handleScroll = () => {
            const now = performance.now();

            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                if (now - lastCallTime.current >= throttle) {
                    try {
                        callbackRef.current(windowObj.scrollY, windowObj.scrollX);
                        lastCallTime.current = now;
                    } catch (error) {
                        console.warn('Scroll callback error:', error);
                    }
                }
            });
        };

        windowObj.addEventListener('scroll', handleScroll, {
            passive: true,
            capture: false
        });

        // Initial call
        handleScroll();

        return () => {
            windowObj.removeEventListener('scroll', handleScroll);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [throttle, windowObj]);
}
