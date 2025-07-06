import { Calendar, DollarSign, Pin, Info, Star, Map, GalleryVertical, Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Package Detail Loading Component
 * 
 * Provides loading state for individual package detail pages.
 * Matches the structure of the actual package detail page for consistency.
 * 
 * Features:
 * - Hero section skeleton matching video banner
 * - Detailed content structure skeletons
 * - Sidebar information skeletons
 * - Gallery carousel skeleton
 * - Related packages skeleton
 */

export default function PackageDetailLoading() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section Skeleton */}
      <div className="h-[60vh] w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="text-center z-30 max-w-4xl mx-auto px-4">
          {/* Cities breadcrumb skeleton */}
          <div className="mb-4 animate-pulse">
            <div className="h-5 bg-white/20 rounded w-32 mx-auto" />
          </div>
          
          {/* Package name skeleton */}
          <div className="h-16 md:h-20 bg-white/20 rounded w-96 mx-auto mb-4 animate-pulse" />
          
          {/* Tagline skeleton */}
          <div className="h-6 bg-white/15 rounded w-64 mx-auto mb-6 animate-pulse" />
          
          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-2 justify-center">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-6 bg-white/10 rounded-full w-20 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex items-center gap-3 text-white/70">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading package details...</span>
          </div>
        </div>

        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
      </div>

      {/* Details Section Skeleton */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Package Overview Skeleton */}
            <div className="animate-pulse">
              <h2 className="font-headline text-4xl mb-6 flex items-center gap-3">
                <Info className="h-8 w-8 text-primary/50"/>
                <div className="h-8 bg-white/10 rounded w-64" />
              </h2>
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-5/6" />
                <div className="h-4 bg-white/10 rounded w-4/5" />
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
              </div>
            </div>
          
            {/* Itinerary Skeleton */}
            <div className="animate-pulse">
              <h2 className="font-headline text-4xl mb-6 flex items-center gap-3">
                <Map className="h-8 w-8 text-primary/50" />
                <div className="h-8 bg-white/10 rounded w-80" />
              </h2>
              
              <Card className="bg-card/80 p-4 rounded-lg">
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="border-b border-white/10 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-6 bg-white/15 rounded w-48" />
                        <div className="w-6 h-6 bg-white/10 rounded" />
                      </div>
                      <div className="space-y-2 pl-2">
                        <div className="h-4 bg-white/5 rounded w-full" />
                        <div className="h-4 bg-white/5 rounded w-4/5" />
                        <div className="h-4 bg-white/5 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Gallery Skeleton */}
            <div className="animate-pulse">
              <h2 className="font-headline text-4xl mb-6 flex items-center gap-3">
                <GalleryVertical className="h-8 w-8 text-primary/50"/>
                <div className="h-8 bg-white/10 rounded w-24" />
              </h2>
              
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <Card key={index}>
                      <CardContent className="p-0">
                        <div className="aspect-video bg-white/10 rounded-lg" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Carousel navigation skeleton */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-8 bg-white/20 rounded-full" />
                </div>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-8 bg-white/20 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="glass-card shadow-lg animate-pulse">
                <CardContent className="p-6 space-y-6">
                  
                  {/* Duration */}
                  <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                    <Calendar className="h-8 w-8 text-primary/50"/>
                    <div>
                      <div className="h-4 bg-white/10 rounded w-16 mb-1" />
                      <div className="h-6 bg-white/15 rounded w-20" />
                    </div>
                  </div>
                  
                  {/* Cities */}
                  <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                    <Pin className="h-8 w-8 text-primary/50"/>
                    <div>
                      <div className="h-4 bg-white/10 rounded w-12 mb-1" />
                      <div className="h-6 bg-white/15 rounded w-32" />
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                    <DollarSign className="h-8 w-8 text-primary/50"/>
                    <div>
                      <div className="h-4 bg-white/10 rounded w-12 mb-1" />
                      <div className="h-6 bg-white/15 rounded w-24" />
                    </div>
                  </div>
                  
                  {/* Highlights */}
                  <div>
                    <h3 className="font-headline text-2xl mb-4 flex items-center gap-3">
                      <Star className="h-6 w-6 text-accent/50" />
                      <div className="h-6 bg-white/10 rounded w-24" />
                    </h3>
                    <div className="space-y-3">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-white/20 rounded-full mt-2 flex-shrink-0" />
                          <div className="h-4 bg-white/10 rounded flex-1" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div>
                    <div className="h-6 bg-white/10 rounded w-32 mb-4" />
                    <div className="space-y-3">
                      {[...Array(6)].map((_, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-accent/50 flex-shrink-0 mt-0.5" />
                          <div className="h-4 bg-white/10 rounded flex-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Packages Section Skeleton */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-white/10 rounded w-64 mx-auto mb-12 animate-pulse" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
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
                  </div>
                  
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-white/20" />
                      <div className="h-4 bg-white/10 rounded w-12" />
                    </div>
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