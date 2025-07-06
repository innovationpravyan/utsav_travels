import { Calendar, Gift, Loader2, Route, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

/**
 * Packages Loading Component
 * 
 * Provides loading state specifically for the packages page.
 * Includes skeleton loaders that match the actual content structure.
 * 
 * Features:
 * - Hero section skeleton with animation
 * - Statistics section skeleton
 * - Package types preview skeleton
 * - Packages grid skeleton
 * - Branded loading experience
 */

export default function PackagesLoading() {
  return (
    <div className="animate-fade-in overflow-hidden">
      {/* Hero Section Skeleton */}
      <div className="h-[90vh] w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative">
        <div className="text-center z-10 px-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
            <Gift className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-white">
              Loading
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Packages
              </span>
            </h1>
            
            <p className="text-white/70 text-xl max-w-2xl mx-auto">
              Crafting perfect spiritual journeys for you...
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>

        {/* Floating background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-rose-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Statistics Section Skeleton */}
      <div className="section-padding bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-white/10 rounded-lg mx-auto mb-6 animate-pulse" />
            <div className="h-12 bg-white/10 rounded w-80 mx-auto mb-6" />
            <div className="h-6 bg-white/5 rounded w-96 mx-auto" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="glass-card p-8 text-center animate-pulse">
                <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4" />
                <div className="h-8 bg-white/10 rounded mb-2" />
                <div className="h-4 bg-white/5 rounded w-3/4 mx-auto" />
              </Card>
            ))}
          </div>

          {/* Package Types Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="glass-card p-8 text-center animate-pulse">
                <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-6" />
                <div className="h-6 bg-white/10 rounded w-3/4 mx-auto mb-4" />
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-4 bg-white/5 rounded w-2/3 mx-auto" />
                </div>
                <div className="h-4 bg-primary/20 rounded w-32 mx-auto" />
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Packages Section Skeleton */}
      <div className="section-padding bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-white/10 rounded-lg mx-auto mb-6 animate-pulse" />
            <div className="h-12 bg-white/10 rounded w-64 mx-auto mb-6" />
            <div className="h-6 bg-white/5 rounded w-2/3 mx-auto" />
          </div>

          {/* Filter Controls Skeleton */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 p-4 bg-white/5 rounded-lg">
            <div className="relative flex-grow">
              <div className="h-12 bg-white/10 rounded-lg animate-pulse" />
            </div>
            <div className="w-full md:w-[200px] h-12 bg-white/10 rounded-lg animate-pulse" />
          </div>

          {/* Packages Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
              <Card key={index} className="glass-card overflow-hidden animate-pulse">
                {/* Image skeleton */}
                <div className="h-48 bg-white/10 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <div className="h-6 bg-white/20 rounded-full w-16" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-4 bg-white/20 rounded mb-2" />
                    <div className="h-3 bg-white/10 rounded w-2/3" />
                  </div>
                </div>
                
                {/* Content skeleton */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-white/10 rounded w-3/4" />
                    <div className="h-6 bg-primary/20 rounded w-16" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded" />
                    <div className="h-4 bg-white/5 rounded w-5/6" />
                    <div className="h-4 bg-white/5 rounded w-4/5" />
                  </div>
                  
                  {/* Meta info skeleton */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-white/20" />
                      <div className="h-4 bg-white/10 rounded w-12" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4 text-white/20" />
                      <div className="h-4 bg-white/10 rounded w-16" />
                    </div>
                  </div>
                  
                  {/* Tags skeleton */}
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 bg-white/10 rounded-full w-16" />
                    <div className="h-6 bg-white/10 rounded-full w-20" />
                    <div className="h-6 bg-white/10 rounded-full w-14" />
                  </div>
                  
                  {/* Highlights skeleton */}
                  <div className="space-y-2">
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-4/5" />
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                  </div>
                  
                  {/* Button skeleton */}
                  <div className="h-10 bg-primary/20 rounded w-full" />
                </div>
              </Card>
            ))}
          </div>

          {/* Loading indicator */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 text-white/70">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading travel packages...</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section Skeleton */}
      <div className="py-20 bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-6 animate-pulse" />
          <div className="h-12 bg-white/10 rounded w-96 mx-auto mb-6" />
          <div className="h-6 bg-white/5 rounded w-2/3 mx-auto mb-8" />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <div className="h-12 bg-primary/20 rounded w-48" />
            <div className="h-12 bg-white/10 rounded w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}