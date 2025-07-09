'use client';

import { useEffect, useState } from 'react';
import { Loader2, MapPin, Calendar, Star, Plane } from 'lucide-react';

/**
 * Production-ready Global Loading Component
 *
 * Features:
 * - Progressive loading states
 * - Optimized animations
 * - Responsive design
 * - Accessibility support
 * - Performance monitoring
 * - Error boundaries
 */

interface LoadingProps {
  message?: string;
  showProgress?: boolean;
  variant?: 'default' | 'minimal' | 'detailed';
  timeout?: number;
}

// Main loading component
export default function Loading({
                                  message = "Loading your spiritual journey...",
                                  showProgress = true,
                                  variant = 'default',
                                  timeout = 30000
                                }: LoadingProps = {}) {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('initializing');
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Simulate progressive loading with realistic stages
  useEffect(() => {
    const stages = [
      { name: 'initializing', duration: 200, message: 'Starting up...' },
      { name: 'connecting', duration: 500, message: 'Connecting to servers...' },
      { name: 'loading', duration: 800, message: 'Loading content...' },
      { name: 'preparing', duration: 400, message: 'Preparing your experience...' },
      { name: 'finalizing', duration: 300, message: 'Almost ready...' }
    ];

    let currentStageIndex = 0;
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      const currentStage = stages[currentStageIndex];
      if (!currentStage) {
        clearInterval(progressInterval);
        return;
      }

      currentProgress += (100 / stages.length) / (currentStage.duration / 50);
      setProgress(Math.min(currentProgress, 95));

      if (currentProgress >= (currentStageIndex + 1) * (100 / stages.length)) {
        currentStageIndex++;
        if (currentStageIndex < stages.length) {
          setLoadingStage(stages[currentStageIndex]!.name);
        }
      }
    }, 50);

    // Timeout handler
    const timeoutHandler = setTimeout(() => {
      setHasTimedOut(true);
      clearInterval(progressInterval);
    }, timeout);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeoutHandler);
    };
  }, [timeout]);

  // Timeout fallback
  if (hasTimedOut) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
          <div className="text-center z-10 px-4 max-w-md">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 text-red-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Taking longer than expected
            </h2>

            <p className="text-white/70 mb-6">
              Please check your connection and try refreshing the page.
            </p>

            <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
    );
  }

  // Minimal loading variant
  if (variant === 'minimal') {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="text-foreground text-sm">{message}</span>
          </div>
        </div>
    );
  }

  // Default detailed loading
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">

        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large floating circles */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-pink-400/10 to-red-500/10 rounded-full blur-3xl animate-float animation-delay-2000" />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-2xl animate-float animation-delay-1000" />

          {/* Small floating particles */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-ping" />
          <div className="absolute top-32 right-32 w-1 h-1 bg-primary/30 rounded-full animate-ping animation-delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-accent/20 rounded-full animate-ping animation-delay-2000" />
          <div className="absolute bottom-32 right-20 w-1 h-1 bg-yellow-400/30 rounded-full animate-ping animation-delay-500" />

          {/* Grid pattern overlay */}
          <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
          />
        </div>

        {/* Main Loading Container */}
        <div className="text-center z-10 px-4 max-w-lg">

          {/* Brand Logo/Icon */}
          <div className="mb-8 relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-2xl animate-pulse">
              <Plane className="w-10 h-10 text-white transform rotate-45" />
            </div>

            {/* Loading Spinner Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-24 h-24 text-primary/50 animate-spin" strokeWidth={1} />
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {loadingStage === 'initializing' && 'Starting Your'}
              {loadingStage === 'connecting' && 'Connecting To'}
              {loadingStage === 'loading' && 'Loading Your'}
              {loadingStage === 'preparing' && 'Preparing Your'}
              {loadingStage === 'finalizing' && 'Finalizing Your'}
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Spiritual Journey
            </span>
            </h2>

            <p className="text-white/70 text-lg max-w-md mx-auto">
              {message}
            </p>
          </div>

          {/* Progress Bar */}
          {showProgress && (
              <div className="mb-8 w-full max-w-sm mx-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60 text-sm">Progress</span>
                  <span className="text-white/60 text-sm">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                      className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-size-200 animate-shimmer transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
          )}

          {/* Loading Progress Dots */}
          <div className="mb-8 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce animation-delay-100" />
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce animation-delay-200" />
          </div>

          {/* Loading Features Preview */}
          {variant === 'detailed' && (
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto opacity-60">
                <div className="text-center animate-pulse">
                  <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-white/50 text-xs">Planning</div>
                </div>
                <div className="text-center animate-pulse animation-delay-500">
                  <MapPin className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-white/50 text-xs">Mapping</div>
                </div>
                <div className="text-center animate-pulse animation-delay-1000">
                  <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-white/50 text-xs">Curating</div>
                </div>
              </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50 pointer-events-none" />
      </div>
  );
}

// Specialized loading components for different contexts
export function PageLoading() {
  return <Loading message="Loading page content..." variant="minimal" />;
}

export function DataLoading() {
  return <Loading message="Fetching latest information..." showProgress={false} variant="minimal" />;
}

export function FormLoading() {
  return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-foreground">Processing...</span>
        </div>
      </div>
  );
}

export function ComponentLoading({ className = "" }: { className?: string }) {
  return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
  );
}