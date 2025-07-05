'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { PlaceCard } from "@/components/place-card";
import { PackageCard } from "@/components/package-card";
import { type Place, type Package } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MapPin, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MotionDiv } from "@/components/motion-div";
import { HeroBanner } from "@/components/hero-banner";
import { Suspense } from 'react';

interface HomeClientProps {
  featuredPlaces: Place[];
  popularPackages: Package[];
}

export function HomeClient({ featuredPlaces, popularPackages }: HomeClientProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-red-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Suspense fallback={
          <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-white animate-spin" />
              <span className="text-white text-xl font-light">Loading magic...</span>
            </div>
          </div>
        }>
          <HeroBanner />
        </Suspense>

        {/* Featured Destinations Section */}
        <MotionDiv 
          className="py-12 md:py-16 relative"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/40 rounded-full animate-ping delay-1000"></div>
            <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 shadow-xl">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Featured
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Destinations
                </span>
              </h2>
              <p className="text-white/90 max-w-3xl mx-auto text-xl md:text-2xl font-light leading-relaxed">
                Embark on extraordinary journeys to handpicked destinations that promise to create memories for a lifetime.
              </p>
            </div>

            {featuredPlaces.length > 0 ? (
              <div className="relative">
                <Carousel 
                  opts={{ align: "start", loop: true }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {featuredPlaces.map((place, index) => (
                      <CarouselItem key={place.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                        <MotionDiv
                          className="h-full"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                            <PlaceCard place={place} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </MotionDiv>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden lg:flex bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30 shadow-xl -left-6" />
                  <CarouselNext className="hidden lg:flex bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30 shadow-xl -right-6" />
                </Carousel>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 inline-block">
                  <p className="text-white/80 text-lg">No featured places available at the moment.</p>
                </div>
              </div>
            )}

            <div className="text-center mt-12">
              <Button asChild className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 px-8 py-6 text-lg rounded-full">
                <Link href="/destinations">
                  <span className="flex items-center">
                    Explore All Destinations
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </MotionDiv>

        {/* Popular Packages Section */}
        <MotionDiv 
          className="py-12 md:py-16 relative"
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
            <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping delay-1000"></div>
            <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 shadow-xl">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Popular
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Packages
                </span>
              </h2>
              <p className="text-white/90 max-w-3xl mx-auto text-xl md:text-2xl font-light leading-relaxed">
                Carefully curated experiences that blend adventure, culture, and luxury into unforgettable journeys.
              </p>
            </div>

            {popularPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {popularPackages.map((pkg, index) => (
                  <MotionDiv
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                      <PackageCard pkg={pkg} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </MotionDiv>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 inline-block">
                  <p className="text-white/80 text-lg">No packages available at the moment.</p>
                </div>
              </div>
            )}

            <div className="text-center mt-12">
              <Button asChild className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 px-8 py-6 text-lg rounded-full">
                <Link href="/packages">
                  <span className="flex items-center">
                    View All Packages
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}