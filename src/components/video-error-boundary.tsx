'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Play, SkipForward } from 'lucide-react';
import { VideoCacheError, VideoPreloadError } from '@/types/video-cache';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    onRetry?: () => void;
    showErrorDetails?: boolean;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    retryCount: number;
    errorType: 'video-cache' | 'video-preload' | 'unknown';
}

/**
 * Video Error Boundary - Handles errors in video caching and preloading
 *
 * Features:
 * - Graceful error handling for video loading failures
 * - Retry functionality with exponential backoff
 * - Fallback to direct video URLs when cache fails
 * - User-friendly error messages
 * - Error reporting and analytics
 */
export class VideoErrorBoundary extends Component<Props, State> {
    private retryTimeouts: NodeJS.Timeout[] = [];

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0,
            errorType: 'unknown'
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Determine error type
        let errorType: State['errorType'] = 'unknown';

        if (error instanceof VideoCacheError) {
            errorType = 'video-cache';
        } else if (error instanceof VideoPreloadError) {
            errorType = 'video-preload';
        }

        return {
            hasError: true,
            error,
            errorType
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Video Error Boundary caught an error:', error, errorInfo);

        this.setState({
            errorInfo
        });

        // Call external error handler
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Report to analytics/monitoring service
        this.reportError(error, errorInfo);
    }

    componentWillUnmount() {
        // Clear any pending retry timeouts
        this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    }

    private reportError = (error: Error, errorInfo: ErrorInfo) => {
        // Here you would typically send error data to your monitoring service
        // like Sentry, LogRocket, or custom analytics

        const errorData = {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            errorType: this.state.errorType,
            retryCount: this.state.retryCount,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };

        // Example: Send to monitoring service
        if (process.env.NODE_ENV === 'production') {
            // fetch('/api/errors', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(errorData)
            // }).catch(console.error);
        }

        console.log('Error reported:', errorData);
    };

    private handleRetry = () => {
        const { retryCount } = this.state;
        const maxRetries = 3;

        if (retryCount >= maxRetries) {
            console.warn('Maximum retry attempts reached');
            return;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, retryCount) * 1000;

        console.log(`Retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);

        const timeout = setTimeout(() => {
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
                retryCount: retryCount + 1
            });

            if (this.props.onRetry) {
                this.props.onRetry();
            }
        }, delay);

        this.retryTimeouts.push(timeout);
    };

    private handleSkip = () => {
        // Skip video loading and continue with fallback
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });

        // Trigger any skip callbacks
        console.log('Skipping video loading, using fallback');
    };

    private getErrorMessage = (): { title: string; description: string; suggestion: string } => {
        const { error, errorType } = this.state;

        switch (errorType) {
            case 'video-cache':
                return {
                    title: 'Video Cache Error',
                    description: 'There was a problem with the video caching system.',
                    suggestion: 'Videos will load directly from the server. This may affect performance.'
                };

            case 'video-preload':
                return {
                    title: 'Video Loading Error',
                    description: 'Failed to preload video content.',
                    suggestion: 'You can continue browsing. Videos will load as needed.'
                };

            default:
                return {
                    title: 'Video System Error',
                    description: error?.message || 'An unexpected error occurred with the video system.',
                    suggestion: 'Please try refreshing the page or contact support if the problem persists.'
                };
        }
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const { title, description, suggestion } = this.getErrorMessage();
            const { retryCount } = this.state;
            const maxRetries = 3;
            const canRetry = retryCount < maxRetries;

            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center relative overflow-hidden">

                    {/* Background Effects */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
                    </div>

                    <div className="text-center z-10 px-4 max-w-lg">

                        {/* Error Icon */}
                        <div className="mb-8">
                            <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-10 h-10 text-red-400" />
                            </div>
                        </div>

                        {/* Error Message */}
                        <div className="space-y-4 mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">
                                {title}
                            </h2>

                            <p className="text-white/80 text-lg">
                                {description}
                            </p>

                            <p className="text-white/60 text-base">
                                {suggestion}
                            </p>

                            {/* Show retry count if applicable */}
                            {retryCount > 0 && (
                                <p className="text-white/50 text-sm">
                                    Retry attempts: {retryCount}/{maxRetries}
                                </p>
                            )}
                        </div>

                        {/* Error Details (Development Only) */}
                        {this.props.showErrorDetails && process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-8 p-4 bg-black/50 rounded-lg text-left">
                                <details className="text-white/70 text-sm">
                                    <summary className="cursor-pointer text-white/90 font-medium mb-2">
                                        Error Details
                                    </summary>
                                    <pre className="whitespace-pre-wrap text-xs overflow-x-auto">
                    {this.state.error.message}
                                        {this.state.error.stack && (
                                            <>
                                                {'\n\nStack Trace:\n'}
                                                {this.state.error.stack}
                                            </>
                                        )}
                  </pre>
                                </details>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {canRetry && (
                                <button
                                    onClick={this.handleRetry}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    {retryCount > 0 ? 'Retry Again' : 'Retry'}
                                </button>
                            )}

                            <button
                                onClick={this.handleSkip}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <SkipForward className="w-4 h-4" />
                                Continue Without Videos
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh Page
                            </button>
                        </div>

                        {/* Additional Help */}
                        <div className="mt-8 text-center">
                            <p className="text-white/50 text-sm">
                                If problems persist, try clearing your browser cache or{' '}
                                <button
                                    onClick={() => {
                                        if ('caches' in window) {
                                            caches.keys().then(names => {
                                                names.forEach(name => caches.delete(name));
                                            });
                                        }
                                        localStorage.clear();
                                        sessionStorage.clear();
                                        window.location.reload();
                                    }}
                                    className="underline hover:text-white/70 transition-colors"
                                >
                                    reset all data
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50 pointer-events-none" />
                </div>
            );
        }

        return this.props.children;
    }
}

// HOC for wrapping components with video error boundary
export function withVideoErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<Props, 'children'>
) {
    const WrappedComponent = (props: P) => (
        <VideoErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </VideoErrorBoundary>
    );

    WrappedComponent.displayName = `withVideoErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
}

// Hook for handling video errors in functional components
export function useVideoErrorHandler() {
    const [error, setError] = React.useState<Error | null>(null);

    const handleError = React.useCallback((error: Error) => {
        console.error('Video error handled:', error);
        setError(error);

        // Auto-clear error after 5 seconds
        setTimeout(() => setError(null), 5000);
    }, []);

    const clearError = React.useCallback(() => {
        setError(null);
    }, []);

    return {
        error,
        handleError,
        clearError,
        hasError: error !== null
    };
}

export default VideoErrorBoundary;