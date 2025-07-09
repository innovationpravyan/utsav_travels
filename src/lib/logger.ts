/**
 * Professional Logging System
 * Standalone logging solution for the travel application
 */

/**
 * Declare global gtag for TypeScript
 */
declare var gtag: (...args: any[]) => void;

/**
 * Environment detection
 */
const ENV = {
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isClient: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',
} as const;

/**
 * Log levels enum
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

/**
 * Log entry interface
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, any> | undefined;
  error?: Error | undefined;
  userId?: string | undefined;
  sessionId?: string | undefined;
  url?: string | undefined;
  userAgent?: string | undefined;
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  enableRemote: boolean;
  maxStorageEntries: number;
  sessionId?: string;
  includeStackTrace: boolean;
  enablePerformanceLogging: boolean;
}

/**
 * Default logger configuration
 */
const DEFAULT_CONFIG: LoggerConfig = {
  level: ENV.isDev ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableStorage: ENV.isClient,
  enableRemote: ENV.isProd,
  maxStorageEntries: 1000,
  includeStackTrace: ENV.isDev,
  enablePerformanceLogging: ENV.isDev,
};

/**
 * Professional Logger class
 */
class Logger {
  private config: LoggerConfig;
  private sessionId: string;
  private buffer: LogEntry[] = [];
  private readonly STORAGE_KEY = 'utsav_travel_logs';
  private performanceMarks: Map<string, number> = new Map();

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sessionId = this.generateSessionId();
    
    // Initialize storage cleanup
    if (this.config.enableStorage) {
      this.cleanupOldLogs();
    }

    // Set up global error handlers in browser
    if (ENV.isClient) {
      this.setupGlobalErrorHandlers();
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Set up global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', new Error(event.reason), {
        type: 'unhandledrejection',
        promise: event.promise,
      });
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.error('Global Error', event.error || new Error(event.message), {
        type: 'global-error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        this.error('Resource Loading Error', new Error('Failed to load resource'), {
          type: 'resource-error',
          target: (event.target as any).tagName,
          src: (event.target as any).src || (event.target as any).href,
        });
      }
    }, true);
  }

  /**
   * Check if log level should be processed
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  /**
   * Format log message for console
   */
  private formatConsoleMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const level = LogLevel[entry.level].padEnd(5);
    const sessionId = entry.sessionId?.slice(-6) || 'unknown';
    
    let message = `[${timestamp}] ${level} [${sessionId}] ${entry.message}`;
    
    if (entry.context && Object.keys(entry.context).length > 0) {
      message += ` | Context: ${JSON.stringify(entry.context)}`;
    }
    
    return message;
  }

  /**
   * Log to console with appropriate styling
   */
  private logToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole || ENV.isServer) return;

    const message = this.formatConsoleMessage(entry);
    const styles = this.getConsoleStyles(entry.level);
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(`🐛 ${message}`, styles, entry.context || '');
        break;
      case LogLevel.INFO:
        console.info(`ℹ️ ${message}`, styles, entry.context || '');
        break;
      case LogLevel.WARN:
        console.warn(`⚠️ ${message}`, styles, entry.context || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(`❌ ${message}`, styles, entry.error || entry.context || '');
        if (entry.error && this.config.includeStackTrace) {
          console.error('Stack trace:', entry.error.stack);
        }
        break;
    }
  }

  /**
   * Get console styles for different log levels
   */
  private getConsoleStyles(level: LogLevel): string {
    const baseStyle = 'font-weight: bold; padding: 2px 4px; border-radius: 2px;';
    
    switch (level) {
      case LogLevel.DEBUG:
        return `${baseStyle} background: #e3f2fd; color: #1976d2;`;
      case LogLevel.INFO:
        return `${baseStyle} background: #e8f5e8; color: #2e7d32;`;
      case LogLevel.WARN:
        return `${baseStyle} background: #fff3e0; color: #f57c00;`;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return `${baseStyle} background: #ffebee; color: #d32f2f;`;
      default:
        return baseStyle;
    }
  }

  /**
   * Store log entry in local storage
   */
  private storeLog(entry: LogEntry): void {
    if (!this.config.enableStorage || ENV.isServer) return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const logs: LogEntry[] = stored ? JSON.parse(stored) : [];
      
      // Add current entry
      logs.push({
        ...entry,
        // Remove functions and circular references
        context: entry.context ? JSON.parse(JSON.stringify(entry.context)) : undefined,
      });
      
      // Keep only the most recent entries
      if (logs.length > this.config.maxStorageEntries) {
        logs.splice(0, logs.length - this.config.maxStorageEntries);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.warn('Failed to store log entry:', error);
    }
  }

  /**
   * Send log to remote service
   */
  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.enableRemote || ENV.isServer) return;

    // Only send warnings, errors, and fatal logs to remote
    if (entry.level < LogLevel.WARN) return;

    try {
      // Send to Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: entry.message,
          fatal: entry.level === LogLevel.FATAL,
          custom_map: {
            level: LogLevel[entry.level],
            sessionId: entry.sessionId,
            ...entry.context,
          },
        });
      }

      // Send to custom logging endpoint (if implemented)
      if (entry.level >= LogLevel.ERROR) {
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...entry,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date(entry.timestamp).toISOString(),
          }),
        }).catch(() => {
          // Silently fail for remote logging
        });
      }
      
    } catch (error) {
      console.warn('Failed to send log to remote service:', error);
    }
  }

  /**
   * Clean up old logs from storage
   */
  private cleanupOldLogs(): void {
    if (ENV.isServer) return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return;

      const logs: LogEntry[] = JSON.parse(stored);
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      
      const recentLogs = logs.filter(log => log.timestamp > oneDayAgo);
      
      if (recentLogs.length !== logs.length) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentLogs));
      }
    } catch (error) {
      console.warn('Failed to cleanup old logs:', error);
    }
  }

  /**
   * Core logging method
   */
  public log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context: {
        ...context,
        ...(ENV.isClient && {
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      },
      error,
      sessionId: this.sessionId,
    };

    // Log to console
    this.logToConsole(entry);

    // Store locally
    this.storeLog(entry);

    // Send to remote (async, don't wait)
    this.sendToRemote(entry).catch(() => {
      // Silently fail for remote logging
    });

    // Add to buffer for batch operations
    this.buffer.push(entry);
    
    // Keep buffer size manageable
    if (this.buffer.length > 100) {
      this.buffer = this.buffer.slice(-50);
    }
  }

  /**
   * Debug logging
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Info logging
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Warning logging
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Error logging
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Fatal error logging
   */
  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  /**
   * Performance timing utility
   */
  time(label: string): () => void {
    const start = performance.now();
    this.performanceMarks.set(label, start);
    
    return () => {
      const duration = performance.now() - start;
      this.performanceMarks.delete(label);
      
      if (this.config.enablePerformanceLogging) {
        const level = duration > 1000 ? LogLevel.WARN : LogLevel.DEBUG;
        this.log(level, `Performance: ${label}`, {
          duration: `${duration.toFixed(2)}ms`,
          slow: duration > 1000,
        });
      }
    };
  }

  /**
   * Start performance measurement
   */
  startTiming(label: string): void {
    this.performanceMarks.set(label, performance.now());
  }

  /**
   * End performance measurement
   */
  endTiming(label: string): number {
    const start = this.performanceMarks.get(label);
    if (!start) {
      this.warn(`No timing started for label: ${label}`);
      return 0;
    }

    const duration = performance.now() - start;
    this.performanceMarks.delete(label);

    if (this.config.enablePerformanceLogging) {
      const level = duration > 1000 ? LogLevel.WARN : LogLevel.DEBUG;
      this.log(level, `Performance: ${label}`, {
        duration: `${duration.toFixed(2)}ms`,
        slow: duration > 1000,
      });
    }

    return duration;
  }

  /**
   * Create child logger with context
   */
  child(context: Record<string, any>): Logger {
    const childLogger = new Logger(this.config);
    
    // Override log method to include parent context
    const originalLog = childLogger.log.bind(childLogger);
    childLogger.log = (level, message, childContext, error) => {
      const mergedContext = { ...context, ...childContext };
      originalLog(level, message, mergedContext, error);
    };
    
    return childLogger;
  }

  /**
   * Get stored logs
   */
  getStoredLogs(): LogEntry[] {
    if (ENV.isServer) return [];

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get buffer logs
   */
  getBufferLogs(): LogEntry[] {
    return [...this.buffer];
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.buffer = [];
    
    if (ENV.isClient) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Update logger configuration
   */
  configure(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Export logs for debugging
   */
  exportLogs(): string {
    const allLogs = [...this.getStoredLogs(), ...this.buffer];
    return JSON.stringify(allLogs, null, 2);
  }

  /**
   * Get logger statistics
   */
  getStats(): {
    totalLogs: number;
    logsByLevel: Record<string, number>;
    sessionDuration: number;
    bufferSize: number;
    oldestLog?: Date;
    newestLog?: Date;
  } {
    const allLogs = [...this.getStoredLogs(), ...this.buffer];
    const logsByLevel = allLogs.reduce((acc, log) => {
      const levelName = LogLevel[log.level];
      acc[levelName] = (acc[levelName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const timestamps = allLogs.map(log => log.timestamp);
    const oldestTimestamp = Math.min(...timestamps);
    const newestTimestamp = Math.max(...timestamps);

    return {
      totalLogs: allLogs.length,
      logsByLevel,
      sessionDuration: Date.now() - (this.performanceMarks.get('session_start') || Date.now()),
      bufferSize: this.buffer.length,
      oldestLog: new Date(oldestTimestamp),
      newestLog: new Date(newestTimestamp),
    };
  }
}

/**
 * Global logger instance
 */
export const logger = new Logger();

/**
 * Create scoped loggers for different modules
 */
export const createLogger = (scope: string, context?: Record<string, any>) => {
  const scopedContext = { scope, ...context };
  return logger.child(scopedContext);
};

/**
 * Convenience functions
 */
export const log = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger),
  time: logger.time.bind(logger),
};

/**
 * Module-specific loggers
 */
export const loggers = {
  firebase: createLogger('Firebase'),
  api: createLogger('API'),
  ui: createLogger('UI'),
  auth: createLogger('Auth'),
  cache: createLogger('Cache'),
  performance: createLogger('Performance'),
  search: createLogger('Search'),
  form: createLogger('Form'),
  navigation: createLogger('Navigation'),
};

/**
 * Error boundary logger
 */
export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error(`Unhandled error: ${error.message}`, error, {
    ...context,
    stack: error.stack,
    name: error.name,
  });
};

/**
 * Performance monitoring
 */
export const logPerformance = (operation: string, duration: number, context?: Record<string, any>) => {
  const level = duration > 1000 ? LogLevel.WARN : LogLevel.INFO;
  logger.log(level, `Performance: ${operation}`, {
    ...context,
    duration: `${duration.toFixed(2)}ms`,
    slow: duration > 1000,
  });
};

/**
 * User action logging
 */
export const logUserAction = (action: string, context?: Record<string, any>) => {
  logger.info(`User action: ${action}`, {
    ...context,
    timestamp: new Date().toISOString(),
    userAgent: ENV.isClient ? navigator.userAgent : 'server',
    url: ENV.isClient ? window.location.href : undefined,
  });
};

/**
 * API call logging
 */
export const logApiCall = (
  method: string,
  url: string,
  duration: number,
  status: number,
  context?: Record<string, any>
) => {
  const level = status >= 400 ? LogLevel.ERROR : duration > 2000 ? LogLevel.WARN : LogLevel.INFO;
  logger.log(level, `API ${method} ${url}`, {
    ...context,
    method,
    url,
    status,
    duration: `${duration.toFixed(2)}ms`,
    success: status < 400,
  });
};

/**
 * Page navigation logging
 */
export const logPageView = (path: string, context?: Record<string, any>) => {
  logger.info(`Page view: ${path}`, {
    ...context,
    path,
    referrer: ENV.isClient ? document.referrer : undefined,
    timestamp: new Date().toISOString(),
  });
};

export default logger;