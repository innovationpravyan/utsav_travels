'use client';

import {useCallback, useEffect, useRef, useState} from 'react';

// Optimized IntersectionObserver hook - instant loading
export function useThreeInView(threshold = 0.05) {
    const [isInView, setIsInView] = useState(false);
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry?.isIntersecting || false);
            },
            {
                threshold,
                rootMargin: '100px', // Load earlier for instant appearance
            }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold]);

    return {ref: elementRef, isInView};
}

// SSR-safe window access
export function useSafeWindow() {
    const [windowObj, setWindowObj] = useState<Window | null>(null);

    useEffect(() => {
        setWindowObj(window);
    }, []);

    return windowObj;
}

// Optimized scroll hook with throttling
export function useOptimizedScroll(callback: (scrollY: number) => void, throttle = 8) {
    const lastCallTime = useRef(0);
    const windowObj = useSafeWindow();

    useEffect(() => {
        if (!windowObj) return;

        const handleScroll = () => {
            const now = Date.now();
            if (now - lastCallTime.current < throttle) return;
            lastCallTime.current = now;

            callback(windowObj.scrollY);
        };

        windowObj.addEventListener('scroll', handleScroll, {passive: true});
        return () => windowObj.removeEventListener('scroll', handleScroll);
    }, [callback, throttle, windowObj]);
}

// Performance monitoring
export function useThreePerformance() {
    const [fps, setFps] = useState(60);
    const frameCount = useRef(0);
    const lastTime = useRef(0);

    const updateFPS = useCallback(() => {
        if (typeof performance === 'undefined') return;

        frameCount.current++;
        const now = performance.now();

        if (now - lastTime.current >= 1000) {
            setFps(Math.round((frameCount.current * 1000) / (now - lastTime.current)));
            frameCount.current = 0;
            lastTime.current = now;
        }
    }, []);

    return {fps, updateFPS};
}

// Three.js utilities with error handling
export async function loadThreeJS() {
    try {
        const THREE = await import('three');
        return THREE;
    } catch (error) {
        console.warn('Three.js failed to load:', error);
        return null;
    }
}

// Optimized animation timeline
export class ThreeTimeline {
    private animations: Array<{
        start: number;
        duration: number;
        animate: (progress: number) => void;
    }> = [];

    private startTime = 0;
    private isPlaying = false;

    add(delay: number, duration: number, animate: (progress: number) => void) {
        this.animations.push({
            start: delay,
            duration,
            animate
        });
        return this;
    }

    play() {
        this.startTime = Date.now();
        this.isPlaying = true;
    }

    stop() {
        this.isPlaying = false;
    }

    update() {
        if (!this.isPlaying) return;

        const elapsed = (Date.now() - this.startTime) / 1000;

        this.animations.forEach(({start, duration, animate}) => {
            if (elapsed >= start && elapsed <= start + duration) {
                const progress = Math.min(1, (elapsed - start) / duration);
                animate(progress);
            }
        });
    }
}

// Cleanup utilities
export function disposeThreeObject(object: any) {
    if (!object) return;

    if (typeof object.traverse === 'function') {
        object.traverse((child: any) => {
            if (child?.geometry?.dispose) child.geometry.dispose();
            if (child?.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((mat: any) => mat?.dispose?.());
                } else if (child.material?.dispose) {
                    child.material.dispose();
                }
            }
        });
    }
}