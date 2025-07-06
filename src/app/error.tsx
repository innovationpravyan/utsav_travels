'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Global Error Boundary Component
 * 
 * This component catches and handles runtime errors across the entire application.
 * It provides a user-friendly error interface with recovery options.
 * 
 * Features:
 * - Error logging for debugging
 * - Graceful error display
 * - Recovery actions (retry, navigate home)
 * - Professional error messaging
 * - Responsive design
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application Error:', error);
    }
    
    // Here you could also log to external error tracking service
    // Example: Sentry, LogRocket, etc.
    // logErrorToService(error);
  }, [error]);

  /**
   * Handle retry action
   * Attempts to recover from the error by resetting the error boundary
   */
  const handleRetry = () => {
    try {
      reset();
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      // Fallback: reload the page
      window.location.reload();
    }
  };

  /**
   * Navigate to home page
   * Fallback navigation when retry doesn't work
   */
  const handleGoHome = () => {
    window.location.href = '/';
  };

  /**
   * Open WhatsApp for support
   * Provides direct contact option for users experiencing issues
   */
  const handleContactSupport = () => {
    const message = `Hi! I encountered an error on Utsav Travels website. Error: ${error.message}`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="glass-card border-red-500/20 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 p-4 bg-red-500/10 rounded-full w-fit">
              <AlertTriangle className="h-16 w-16 text-red-400" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-headline text-white mb-2">
              Oops! Something went wrong
            </CardTitle>
            <p className="text-white/70 text-lg">
              We encountered an unexpected error while loading this page.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-red-950/30 border border-red-500/20 rounded-lg">
                <p className="text-red-300 text-sm font-mono break-words">
                  <strong>Error:</strong> {error.message}
                </p>
                {error.digest && (
                  <p className="text-red-400 text-xs mt-2">
                    <strong>Digest:</strong> {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* User-Friendly Error Message */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-3">
                Don't worry, we're on it!
              </h3>
              <p className="text-white/80 leading-relaxed">
                Our team has been notified and is working to fix this issue. 
                In the meantime, you can try refreshing the page or return to our homepage.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleRetry}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12"
                size="lg"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Try Again
              </Button>

              <Button
                onClick={handleGoHome}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10 h-12"
                size="lg"
              >
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Button>

              <Button
                onClick={handleContactSupport}
                variant="outline"
                className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10 h-12"
                size="lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
            </div>

            {/* Additional Help */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-white/60 text-sm">
                If this problem persists, please contact our support team at{' '}
                <a 
                  href="mailto:info@utsavtravels.com" 
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  info@utsavtravels.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-400/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>
    </div>
  );
}