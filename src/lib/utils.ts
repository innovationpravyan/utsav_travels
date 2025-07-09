import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge for better className handling
 * @param inputs - Class values to combine
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Type-safe local storage wrapper
 */
export const storage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

};

/**
 * Environment configuration helper
 */
export const env = {
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isClient: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',
} as const;

/**
 * Error handling utility
 */
export class AppError extends Error {
  constructor(
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Safe async function wrapper
 * @param asyncFn - Async function to wrap
 * @returns Tuple of [error, result]
 */
export async function safeAsync<T, E = Error>(
  asyncFn: () => Promise<T>
): Promise<[E | null, T | null]> {
  try {
    const result = await asyncFn();
    return [null, result];
  } catch (error) {
    return [error as E, null];
  }
}