// src/app/packages/page.tsx

import { getPackages } from '@/lib/data';
import { HeroImageBanner } from '@/components/hero-image-banner';
import { PackagesClient } from './packages-client';
import { OptimizedMotionDiv, StaggerContainer } from '@/components/optimized-motion-div';
import { GlassCard } from '@/components/ui/glass-card';
import { Calendar, Clock, MapPin, Star, Users, Award, Compass, Sparkles, Route, Gift } from 'lucide-react';
import { Suspense } from 'react';

// Packages page configuration (inline since removed from utils)
const PACKAGES_CONTENT = {
  statistics: [
    { icon: 'Gift', label: 'Travel Packages', color: 'text-blue-400' },
    { icon: 'MapPin', label: 'Cities Covered', color: 'text-green-400' },
    { icon: 'Calendar', label: 'Avg Duration', color: 'text-yellow-400' },
    { icon: 'Star', label: 'Customer Rating', value: '4.9/5', color: 'text-purple-400' }
  ],
  packageTypes: [
    {
      title: 'Spiritual Journeys',
      description: 'Sacred temple visits and pilgrimage experiences',
      icon: 'Sparkles',
      color: 'from-blue-400 to-purple-600',
      tag: 'spiritual'
    },
    {
      title: 'Adventure Tours',
      description: 'Trekking, rafting, and Himalayan adventures',
      icon: 'Route',
      color: 'from-green-400 to-blue-600',
      tag: 'adventure'
    },
    {
      title: 'Cultural Heritage',
      description: 'Explore ancient heritage and cultural sites',
      icon: 'Award',
      color: 'from-yellow-400 to-orange-600',
      tag: 'heritage'
    }
  ],
  ctaText: {
    title: "Ready for Your Adventure",
    description: "Let us create the perfect spiritual journey tailored to your dreams and aspirations.",
    buttons: [
      { text: "Contact Our Experts", icon: "Users" },
      { text: "Quick Consultation", icon: "Clock" }
    ]
  }
} as const;

export default async function OptimizedPackagesPage() {
  let allPackages: any[] = [];
  let totalCities = 0;
  let avgDuration = 0;

  try {
    allPackages = await getPackages();

    if (allPackages?.length > 0) {
      // Safe calculation of package statistics
      const allCities = allPackages.flatMap(p => p?.cities || []).filter(Boolean);
      totalCities = [...new Set(allCities)].length;

      const durations = allPackages.map(p => {
        const duration = p?.duration || '3 Days';
        const days = parseInt(duration.match(/(\d+)/)?.[1] || '3');
        return isNaN(days) ? 3 : days;
      });

      avgDuration = durations.reduce((acc, days) => acc + days, 0) / durations.length;
    }
  } catch (error) {
    console.error('Error loading packages:', error);
    return (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-headline mb-8">Our Travel Packages</h1>
          <div className="text-center">
            <p className="text-muted-foreground">Unable to load packages. Please try again later.</p>
          </div>
        </div>
    );
  }

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const icons = {
      Gift,
      MapPin,
      Calendar,
      Star,
      Sparkles,
      Route,
      Award,
      Users,
      Clock,
    };
    return icons[iconName as keyof typeof icons] || Gift;
  };

  const packageStats = PACKAGES_CONTENT.statistics.map(stat => ({
    ...stat,
    value: stat.value || (
        stat.label === 'Travel Packages' ? allPackages.length.toString() :
            stat.label === 'Cities Covered' ? totalCities.toString() :
                stat.label === 'Avg Duration' ? `${Math.round(avgDuration)} Days` :
                    stat.value
    )
  }));

  // Safe featured package types with null checks
  const packageTypes = PACKAGES_CONTENT.packageTypes.map(type => ({
    ...type,
    packages: allPackages.filter(p => p?.tags?.includes(type.tag) || false).length
  }));

  return (
      <div className="animate-fade-in overflow-hidden">
        {/* Hero Image Banner */}
        <Suspense fallback={
          <div className="h-[90vh] w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-white text-xl animate-pulse">Loading packages...</div>
          </div>
        }>
          <HeroImageBanner
              page="packages"
              height="90vh"
              parallaxEffect={true}
              showScrollIndicator={true}
          />
        </Suspense>

        {/* Package Statistics Section */}
        <section className="section-padding bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 relative">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <OptimizedMotionDiv preset="slideUp">
                <div className="flex justify-center mb-6">
                  <GlassCard className="p-4">
                    <Compass className="w-8 h-8 text-white" />
                  </GlassCard>
                </div>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="slideUp">
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                  Travel
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Statistics
              </span>
                </h2>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="fadeIn">
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Numbers that showcase our commitment to creating unforgettable spiritual journeys
                </p>
              </OptimizedMotionDiv>
            </div>

            {/* Animated Statistics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {packageStats.map((stat, index) => {
                const IconComponent = getIconComponent(stat.icon);
                return (
                    <OptimizedMotionDiv
                        key={stat.label}
                        preset="scaleIn"
                        hover
                    >
                      <GlassCard className="text-center p-8 group hover:scale-105 transition-all duration-200">
                        <div className={`mx-auto mb-4 p-4 rounded-full w-fit bg-white/10 group-hover:scale-110 transition-transform duration-200`}>
                          <IconComponent className={`h-8 w-8 ${stat.color}`} />
                        </div>

                        <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                          {stat.value}
                        </div>

                        <p className="text-white/70 font-medium">{stat.label}</p>

                        <div className="absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-white/5 to-transparent" />
                        </div>
                      </GlassCard>
                    </OptimizedMotionDiv>
                );
              })}
            </div>

            {/* Package Types Grid */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packageTypes.map((type, index) => {
                const IconComponent = getIconComponent(type.icon);
                return (
                    <OptimizedMotionDiv
                        key={type.title}
                        preset="scaleIn"
                        hover
                    >
                      <GlassCard className="p-8 text-center group overflow-hidden relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

                        <div className="relative z-10">
                          <div className={`mx-auto mb-6 p-4 rounded-full w-fit bg-gradient-to-br ${type.color} bg-opacity-20`}>
                            <IconComponent className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-200" />
                          </div>

                          <h3 className="text-2xl font-bold text-white mb-4">{type.title}</h3>
                          <p className="text-white/70 mb-4">{type.description}</p>

                          <div className="flex items-center justify-center gap-2 text-primary">
                            <Gift className="h-4 w-4" />
                            <span className="text-sm font-medium">{type.packages} packages available</span>
                          </div>
                        </div>

                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-ping" />
                          <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/40 rounded-full animate-ping animation-delay-1000" />
                          <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping animation-delay-2000" />
                        </div>
                      </GlassCard>
                    </OptimizedMotionDiv>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* Main Packages Section */}
        <section className="section-padding bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative">
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <OptimizedMotionDiv preset="slideUp">
                <div className="flex justify-center mb-6">
                  <GlassCard className="p-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </GlassCard>
                </div>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="slideUp">
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                  Our
                  <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Packages
              </span>
                </h2>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="fadeIn">
                <p className="text-center max-w-2xl mx-auto text-lg text-white/70 mb-12">
                  Curated journeys designed to offer you an immersive spiritual and cultural experience across India's most sacred destinations.
                </p>
              </OptimizedMotionDiv>
            </div>

            {/* Enhanced Packages Grid */}
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-96 bg-gray-200/10 animate-pulse rounded-xl" />
                ))}
              </div>
            }>
              <OptimizedMotionDiv preset="fadeIn">
                <PackagesClient packages={allPackages || []} />
              </OptimizedMotionDiv>
            </Suspense>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="h-[70vh] flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 relative">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-red-500/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <StaggerContainer>
              <OptimizedMotionDiv preset="scaleIn">
                <Route className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="slideUp">
                <h2 className="text-4xl md:text-6xl font-headline font-bold text-white mb-6">
                  {PACKAGES_CONTENT.ctaText.title.split(' ')[0]} {PACKAGES_CONTENT.ctaText.title.split(' ')[1]} {PACKAGES_CONTENT.ctaText.title.split(' ')[2]}
                  <span className="block text-gradient">{PACKAGES_CONTENT.ctaText.title.split(' ')[3]}?</span>
                </h2>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="fadeIn">
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  {PACKAGES_CONTENT.ctaText.description}
                </p>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="slideUp">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {PACKAGES_CONTENT.ctaText.buttons.map((button, index) => {
                    const IconComponent = getIconComponent(button.icon);
                    return (
                        <GlassCard key={button.text} className="px-8 py-4 cursor-pointer group hover:scale-105 transition-all duration-200">
                        <span className={`font-${index === 0 ? 'bold' : 'medium'} text-lg flex items-center gap-3 ${index === 0 ? 'text-white' : 'text-white/90'}`}>
                          <IconComponent className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          {button.text}
                        </span>
                        </GlassCard>
                    );
                  })}
                </div>
              </OptimizedMotionDiv>
            </StaggerContainer>
          </div>
        </section>
      </div>
  );
}