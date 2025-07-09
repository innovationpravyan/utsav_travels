import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Environment configuration
 */
export const env = {
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isClient: typeof window !== 'undefined',
    isServer: typeof window === 'undefined',
} as const;

/**
 * Application error class
 */
export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;

    constructor(
        message: string,
        code: string = 'UNKNOWN_ERROR',
        statusCode: number = 500
    ) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}

/**
 * Safe async wrapper
 */
export async function safeAsync<T, E = AppError>(
    asyncFn: () => Promise<T>
): Promise<[E | null, T | null]> {
    try {
        const result = await asyncFn();
        return [null, result];
    } catch (error) {
        return [error as E, null];
    }
}

/**
 * Type-safe storage wrapper
 */
export const storage = {
    get<T>(key: string, fallback: T): T {
        if (env.isServer) return fallback;

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch {
            return fallback;
        }
    },

    set<T>(key: string, value: T): void {
        if (env.isServer) return;

        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('Storage write failed:', error);
        }
    },

    remove(key: string): void {
        if (env.isServer) return;
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('Storage remove failed:', error);
        }
    },

    clear(): void {
        if (env.isServer) return;
        try {
            localStorage.clear();
        } catch (error) {
            console.warn('Storage clear failed:', error);
        }
    }
};

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as T;
    if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
    if (typeof obj === 'object') {
        const cloned = {} as T;
        Object.keys(obj).forEach(key => {
            (cloned as any)[key] = deepClone((obj as any)[key]);
        });
        return cloned;
    }
    return obj;
}

/**
 * Format currency
 */
export function formatCurrency(
    amount: number,
    currency: string = 'INR',
    locale: string = 'en-IN'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
}

/**
 * Format date
 */
export function formatDate(
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {},
    locale: string = 'en-IN'
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options,
    }).format(dateObj);
}

/**
 * Generate random ID
 */
export function generateId(length: number = 8): string {
    return Math.random()
        .toString(36)
        .substring(2, 2 + length);
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Map number from one range to another
 */
export function mapRange(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return false;
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry async function
 */
export async function retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (attempt === maxAttempts) break;
            await sleep(delay * attempt);
        }
    }

    throw lastError!;
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
    try {
        return JSON.parse(json);
    } catch {
        return fallback;
    }
}

/**
 * Create URL with search params
 */
export function createUrl(
    base: string,
    params: Record<string, string | number | boolean | undefined>
): string {
    const url = new URL(base, env.isClient ? window.location.origin : 'http://localhost:3000');

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            url.searchParams.set(key, String(value));
        }
    });

    return url.toString();
}

/**
 * Constants
 */
export const CONSTANTS = {
    ANIMATION_DURATION: 300,
    SCROLL_THRESHOLD: 50,
    CACHE_TTL: 5 * 60 * 1000, // 5 minutes
    API_TIMEOUT: 30000, // 30 seconds
    MOBILE_BREAKPOINT: 768,
    TABLET_BREAKPOINT: 1024,
    DESKTOP_BREAKPOINT: 1280,
} as const;

/**
 * Breakpoint utilities
 */
export const breakpoints = {
    mobile: `(max-width: ${CONSTANTS.MOBILE_BREAKPOINT - 1}px)`,
    tablet: `(min-width: ${CONSTANTS.MOBILE_BREAKPOINT}px) and (max-width: ${CONSTANTS.TABLET_BREAKPOINT - 1}px)`,
    desktop: `(min-width: ${CONSTANTS.TABLET_BREAKPOINT}px)`,

    isMobile: () => env.isClient && window.matchMedia(breakpoints.mobile).matches,
    isTablet: () => env.isClient && window.matchMedia(breakpoints.tablet).matches,
    isDesktop: () => env.isClient && window.matchMedia(breakpoints.desktop).matches,
} as const;