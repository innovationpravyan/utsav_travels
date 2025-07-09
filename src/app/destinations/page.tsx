// src/app/destinations/page.tsx

import { getPlaces } from '@/lib/data';
import { DestinationsVideoHero } from '@/components/optimized-video-hero';
import { DestinationsClient } from './destinations-client';
import { OptimizedMotionDiv, StaggerContainer } from '@/components/optimized-motion-div';
import { GlassCard } from '@/components/ui/glass-card';
import { MapPin, Compass, Star, Globe, Mountain, Camera } from 'lucide-react';
import { Suspense } from 'react';

export default async function OptimizedDestinationsPage() {
  let allPlaces: any[] = [];
  let cities: string[] = [];
  let categories: string[] = [];

  try {
    allPlaces = await getPlaces();
    // Safe extraction of unique cities and categories
    cities = allPlaces?.length > 0 ? [...new Set(allPlaces.map(p => p?.city).filter(Boolean))] : [];
    categories = allPlaces?.length > 0 ? [...new Set(allPlaces.map(p => p?.category).filter(Boolean))] : [];
  } catch (error) {
    console.error('Error loading places:', error);
    allPlaces = [];
    cities = [];
    categories = [];
  }

  const stats = [
    { icon: MapPin, label: 'Sacred Cities', value: cities.length.toString(), color: 'text-blue-400' },
    { icon: Compass, label: 'Destinations', value: allPlaces.length.toString(), color: 'text-green-400' },
    { icon: Star, label: 'Categories', value: categories.length.toString(), color: 'text-yellow-400' },
    { icon: Globe, label: 'Experiences', value: '1000+', color: 'text-purple-400' },
  ];

  return (
      <div className="animate-fade-in overflow-hidden">
        {/* Video Hero Banner */}
        <Suspense fallback={
          <div className="h-[85vh] w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-white text-xl animate-pulse">Loading destinations...</div>
          </div>
        }>
          <DestinationsVideoHero
              videoSrc="/videos/destinations-hero.webm"
              fallbackImage="https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          />
        </Suspense>

        {/* Statistics Section */}
        <section className="section-padding bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <OptimizedMotionDiv preset="slideUp">
                <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
                  Discover
                  <span className="block text-gradient-alt">Sacred India</span>
                </h2>
              </OptimizedMotionDiv>
              <OptimizedMotionDiv preset="fadeIn">
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Embark on a journey through time and spirituality across India's most sacred destinations
                </p>
              </OptimizedMotionDiv>
            </div>

            {/* Animated Statistics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                  <OptimizedMotionDiv
                      key={stat.label}
                      preset="scaleIn"
                      hover
                  >
                    <GlassCard className="text-center p-8 group hover:scale-105 transition-all duration-200">
                      <div className={`mx-auto mb-4 p-4 rounded-full w-fit bg-white/10 group-hover:scale-110 transition-transform duration-200`}>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>

                      <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                        {stat.value}
                      </div>

                      <p className="text-white/70 font-medium">{stat.label}</p>
                    </GlassCard>
                  </OptimizedMotionDiv>
              ))}
            </div>

            {/* Featured Categories Preview */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.slice(0, 3).map((category, index) => {
                const categoryPlaces = allPlaces.filter(p => p?.category === category);
                const representativePlace = categoryPlaces[0];

                return (
                    <OptimizedMotionDiv
                        key={category}
                        preset="slideUp"
                        hover
                    >
                      <GlassCard className="p-0 overflow-hidden group">
                        <div className="relative h-48">
                          <img
                              src={representativePlace?.thumbnail || '/placeholder.jpg'}
                              alt={category}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-bold text-xl mb-2">{category}</h3>
                            <p className="text-white/80 text-sm">
                              {categoryPlaces.length} sacred {categoryPlaces.length === 1 ? 'site' : 'sites'}
                            </p>
                          </div>

                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <GlassCard className="p-2">
                              <Camera className="h-5 w-5 text-white" />
                            </GlassCard>
                          </div>
                        </div>
                      </GlassCard>
                    </OptimizedMotionDiv>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* Enhanced Destinations Grid Section */}
        <section className="section-padding bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <OptimizedMotionDiv preset="slideUp">
                <div className="flex justify-center mb-6">
                  <GlassCard className="p-4">
                    <Mountain className="w-8 h-8 text-white" />
                  </GlassCard>
                </div>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="slideUp">
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                  All
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Destinations
                </span>
                </h2>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="fadeIn">
                <p className="text-center max-w-2xl mx-auto text-lg text-white/70 mb-12">
                  Journey through sacred cities and timeless landmarks. Find your next spiritual adventure with our curated collection of India's most revered destinations.
                </p>
              </OptimizedMotionDiv>
            </div>

            {/* Enhanced Destinations Client */}
            <OptimizedMotionDiv preset="fadeIn">
              <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-96 bg-gray-200/10 animate-pulse rounded-xl" />
                  ))}
                </div>
              }>
                <DestinationsClient places={allPlaces || []} />
              </Suspense>
            </OptimizedMotionDiv>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="h-[60vh] flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black relative">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-600/5 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <StaggerContainer>
              <OptimizedMotionDiv preset="scaleIn">
                <Compass className="w-16 h-16 text-primary mx-auto mb-6" />
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="slideUp">
                <h2 className="text-4xl md:text-6xl font-headline font-bold text-white mb-6">
                  Ready to
                  <span className="block text-gradient">Explore?</span>
                </h2>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="fadeIn">
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Let us craft the perfect spiritual journey for you across India's most sacred destinations.
                </p>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="slideUp">
                <GlassCard className="inline-block px-12 py-6 cursor-pointer group hover:scale-105 transition-all duration-200">
                <span className="text-white font-bold text-xl flex items-center gap-3">
                  Plan Your Journey
                  <MapPin className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </span>
                </GlassCard>
              </OptimizedMotionDiv>
            </StaggerContainer>
          </div>
        </section>
      </div>
  );
}