'use client';

import { HeroVideoCarousel } from "@/components/hero-video-carousel";
import { OptimizedHomeClient } from "@/components/optimized-home-client";
import { Suspense } from 'react';

interface VideoClientWrapperProps {
    featuredPlaces: any[];
    popularPackages: any[];
}

// Hero loading fallback
function HeroLoadingFallback() {
    return (
        <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-center">
                <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <div className="text-white text-2xl font-bold mb-2 animate-pulse">Loading Video Experience</div>
                <div className="text-white/70 text-lg animate-pulse">Preparing your spiritual journey...</div>
            </div>
        </div>
    );
}

// Content loading fallback
function ContentLoadingFallback() {
    return (
        <div className="min-h-screen bg-black">
            <div className="container mx-auto px-4 py-16 space-y-8">
                {/* Hero section skeleton */}
                <div className="text-center space-y-4">
                    <div className="h-12 bg-white/10 rounded animate-pulse mx-auto max-w-md"></div>
                    <div className="h-6 bg-white/5 rounded animate-pulse mx-auto max-w-lg"></div>
                </div>

                {/* Cards skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white/5 rounded-lg p-6 animate-pulse">
                            <div className="h-32 bg-white/10 rounded mb-4"></div>
                            <div className="h-4 bg-white/10 rounded mb-2"></div>
                            <div className="h-3 bg-white/5 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Client-side wrapper for video components
 * This ensures proper separation between server and client components
 */
export function VideoClientWrapper({ featuredPlaces, popularPackages }: VideoClientWrapperProps) {
    return (
        <div className="relative">
            {/* Hero Video Carousel with caching support */}
            <Suspense fallback={<HeroLoadingFallback />}>
                <HeroVideoCarousel
                    height="100vh"
                    autoPlay={true}
                />
            </Suspense>

            {/* Main Content */}
            <Suspense fallback={<ContentLoadingFallback />}>
                <OptimizedHomeClient
                    featuredPlaces={featuredPlaces}
                    popularPackages={popularPackages}
                />
            </Suspense>
        </div>
    );
}