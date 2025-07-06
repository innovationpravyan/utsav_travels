import { MapPin, Search, Filter, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

/**
 * Places Loading Component
 * 
 * Provides loading state specifically for the places/destinations page.
 * Includes skeleton loaders that match the actual content structure.
 * 
 * Features:
 * - Skeleton loading for filters
 * - Skeleton loading for place cards
 * - Branded loading message
 * - Smooth animations
 * - Mobile responsive
 */

export default function PlacesLoading() {
  return (
    <div className="animate-fade-in overflow-hidden">
      {/* Hero Section Skeleton */}
      <div className="h-[85vh] w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative">
        <div className="text-center z-10 px-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-white">
              Loading
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Destinations
              </span>
            </h1>
            
            <p className="text-white/70 text-xl max-w-2xl mx-auto">
              Discovering sacred places just for you...
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>

        {/* Floating background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Statistics Section Skeleton */}
      <div className="section-padding bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="container mx-auto px-4">
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

          {/* Category Preview Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="glass-card p-0 overflow-hidden animate-pulse">
                <div className="h-48 bg-white/10" />
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Section Skeleton */}
      <div className="section-padding bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-white/10 rounded-lg mx-auto mb-6 animate-pulse" />
            <div className="h-12 bg-white/10 rounded w-96 mx-auto mb-6" />
            <div className="h-6 bg-white/5 rounded w-2/3 mx-auto" />
          </div>

          {/* Filter Controls Skeleton */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 p-4 bg-white/5 rounded-lg">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
              <div className="h-12 bg-white/10 rounded-lg pl-10 animate-pulse" />
            </div>
            <div className="w-full md:w-[200px] h-12 bg-white/10 rounded-lg animate-pulse" />
            <div className="w-full md:w-[200px] h-12 bg-white/10 rounded-lg animate-pulse" />
          </div>

          {/* Places Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
              <Card key={index} className="glass-card overflow-hidden animate-pulse">
                {/* Image skeleton */}
                <div className="h-48 bg-white/10 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-4 bg-white/20 rounded mb-2" />
                    <div className="h-3 bg-white/10 rounded w-2/3" />
                  </div>
                </div>
                
                {/* Content skeleton */}
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-white/10 rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded" />
                    <div className="h-4 bg-white/5 rounded w-5/6" />
                  </div>
                  
                  {/* Tags skeleton */}
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 bg-white/10 rounded-full w-16" />
                    <div className="h-6 bg-white/10 rounded-full w-20" />
                    <div className="h-6 bg-white/10 rounded-full w-14" />
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
              <span>Loading destinations...</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section Skeleton */}
      <div className="py-20 bg-gradient-to-br from-black via-slate-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-6 animate-pulse" />
          <div className="h-12 bg-white/10 rounded w-80 mx-auto mb-6" />
          <div className="h-6 bg-white/5 rounded w-96 mx-auto mb-8" />
          <div className="h-12 bg-primary/20 rounded w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}