'use client';

import { useState, useEffect, useCallback } from 'react';

// Breakpoint constants
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  breakpoint: Breakpoint;
}

// Main mobile detection hook
export function useIsMobile(breakpoint: Breakpoint = 'lg'): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkIsMobile = () => {
      const width = window.innerWidth;
      const threshold = BREAKPOINTS[breakpoint];
      setIsMobile(width < threshold);
    };

    // Check on mount
    checkIsMobile();

    // Optimized resize listener with RAF
    let rafId: number;
    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkIsMobile);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [breakpoint]);

  return isMobile;
}

// Enhanced device detection hook
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1920,
    height: 1080,
    orientation: 'landscape',
    breakpoint: 'xl'
  });

  const updateDeviceInfo = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation = width > height ? 'landscape' : 'portrait';

    // Determine breakpoint
    let breakpoint: Breakpoint = 'sm';
    for (const [bp, size] of Object.entries(BREAKPOINTS)) {
      if (width >= size) {
        breakpoint = bp as Breakpoint;
      }
    }

    // Device type detection
    const isMobile = width < BREAKPOINTS.md;
    const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
    const isDesktop = width >= BREAKPOINTS.lg;

    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      width,
      height,
      orientation,
      breakpoint
    });
  }, []);

  useEffect(() => {
    updateDeviceInfo();

    let rafId: number;
    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateDeviceInfo);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [updateDeviceInfo]);

  return deviceInfo;
}

// Breakpoint hook for multiple breakpoints
// Touch device detection
export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          (navigator as any).msMaxTouchPoints > 0;
      setIsTouch(hasTouch);
    };

    checkTouch();
  }, []);

  return isTouch;
}

// Network information hook
export function useNetworkInfo() {
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
    saveData: false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;

    if (!connection) return;

    const updateNetworkInfo = () => {
      setNetworkInfo({
        effectiveType: connection.effectiveType || '4g',
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 50,
        saveData: connection.saveData || false
      });
    };

    updateNetworkInfo();
    connection.addEventListener('change', updateNetworkInfo);

    return () => {
      connection.removeEventListener('change', updateNetworkInfo);
    };
  }, []);

  return networkInfo;
}

// Performance preference hook
export function usePerformancePreference() {
  const { isMobile } = useDeviceDetection();
  const { saveData, effectiveType } = useNetworkInfo();
  const isTouch = useTouchDevice();

  const shouldReduceMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isLowPerformance = isMobile ||
      saveData ||
      effectiveType === 'slow-2g' ||
      effectiveType === '2g' ||
      shouldReduceMotion;

  return {
    shouldReduceMotion,
    shouldReduceEffects: isLowPerformance,
    shouldLazyLoad: isMobile || saveData,
    shouldPreferLowQuality: saveData || effectiveType === '2g',
    shouldUseTouch: isTouch,
    performanceLevel: isLowPerformance ? 'low' : isMobile ? 'medium' : 'high'
  };
}

// Export all hooks and utilities
export { BREAKPOINTS };
export type { DeviceInfo, Breakpoint };