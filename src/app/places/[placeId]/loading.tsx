import { MapPin, Loader2, Landmark, BookOpen, Star, GalleryVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Individual Place Detail Loading Component
 * 
 * Provides loading state for individual place detail pages.
 * Matches the structure of the actual place detail page for consistency.
 * 
 * Features:
 * - Hero section skeleton
 * - Content section skeletons
 * - Gallery and map skeletons
 * - Related places skeleton
 * - Smooth animations
 */

export default function PlaceDetailLoading() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section Skeleton */}
      <div className="h-[60vh] w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="text-center z-30 max-w-4xl mx-auto px-4">
          <div className="mb-4 animate-pulse">
            <div className="h-6 bg-white/20 rounded w-48 mx-auto mb-2" />
          </div>
          
          <div className="h-16 md:h-20 bg-white/20 rounded w-96 mx-auto mb-6 animate-pulse" />
          
          <div className="flex flex-wrap gap-2 justify-center">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-6 bg-white/10 rounded-full w-16 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex items-center gap-3 text-white/70">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading destination details...</span>
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>

      {/* Content Section Skeleton */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section Skeleton */}
              <Card className="glass-card animate-pulse">
                <CardHeader>
                  <CardTitle className="font-headline text-4xl flex items-center gap-3">
                    <Landmark className="h-8 w-8 text-primary/50"/>
                    <div className="h-8 bg-white/10 rounded w-48" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-5/6" />
                  <div className="h-4 bg-white/10 rounded w-4/5" />
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                </CardContent>
              </Card>

              {/* History Section Skeleton */}
              <Card className="glass-card animate-pulse">
                <CardHeader>
                  <CardTitle className="font-headline text-4xl flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-primary/50"/>
                    <div className="h-8 bg-white/10 rounded w-64" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-4/5" />
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                  <div className="h-4 bg-white/10 rounded w-5/6" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Skeleton */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="glass-card animate-pulse">
                  <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-3">
                      <Star className="h-7 w-7 text-accent/50"/>
                      <div className="h-8 bg-white/10 rounded w-32" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-white/20 rounded-full mt-2 flex-shrink-0" />
                        <div className="h-4 bg-white/10 rounded flex-1" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Gallery and Map Section Skeleton */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-white/10 rounded w-48 mx-auto mb-12 animate-pulse" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery Skeleton */}
            <div>
              <h3 className="font-headline text-3xl mb-4 flex items-center gap-3">
                <GalleryVertical className="h-7 w-7 text-primary/50"/>
                <div className="h-8 bg-white/10 rounded w-24 animate-pulse" />
              </h3>
              
              <div className="relative">
                <Card className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-white/10 rounded-lg" />
                  </CardContent>
                </Card>
                
                {/* Carousel navigation skeleton */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse" />
                </div>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Map Skeleton */}
            <div>
              <h3 className="font-headline text-3xl mb-4 flex items-center gap-3">
                <MapPin className="h-7 w-7 text-primary/50"/>
                <div className="h-8 bg-white/10 rounded w-24 animate-pulse" />
              </h3>
              
              <Card className="animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-video bg-white/10 rounded-lg relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <MapPin className="h-12 w-12 text-white/20 mb-2"/>
                      <div className="h-4 bg-white/20 rounded w-32 mb-1" />
                      <div className="h-3 bg-white/10 rounded w-40" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Places Section Skeleton */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-white/10 rounded w-64 mx-auto mb-12 animate-pulse" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="glass-card overflow-hidden animate-pulse">
                <div className="h-48 bg-white/10 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-4 bg-white/20 rounded mb-2" />
                    <div className="h-3 bg-white/10 rounded w-2/3" />
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-white/10 rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded" />
                    <div className="h-4 bg-white/5 rounded w-5/6" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 bg-white/10 rounded-full w-16" />
                    <div className="h-6 bg-white/10 rounded-full w-20" />
                  </div>
                  <div className="h-10 bg-primary/20 rounded w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}