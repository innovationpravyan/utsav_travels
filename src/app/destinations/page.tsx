// src/app/destinations/page.tsx

import { getPlaces } from '@/lib/data';
import { DestinationsVideoHero } from '@/components/video-hero-banner';
import { DestinationsClient } from './destinations-client';
import { ParallaxSection } from '@/components/ui/parallax-section';
import { FloatingElements, ParticleSystem } from '@/components/ui/floating-elements';
import { MotionDiv, StaggerContainer } from '@/components/motion-div';
import { GlassCard, InteractiveGlassCard } from '@/components/ui/glass-card';
import { MapPin, Compass, Star, Globe, Mountain, Camera } from 'lucide-react';
import { Suspense } from 'react';

export default async function DestinationsPage() {
  const allPlaces = await getPlaces();

  // Get unique cities and categories for stats
  const cities = [...new Set(allPlaces.map(p => p.city))];
  const categories = [...new Set(allPlaces.map(p => p.category))];

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

      {/* Statistics Section with Advanced Animations */}
      <ParallaxSection
        height="auto"
        className="section-padding relative"
        layers={[
          {
            id: 'stats-bg',
            speed: -0.3,
            content: (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
            ),
          },
          {
            id: 'stats-pattern',
            speed: -0.1,
            content: (
              <div className="absolute inset-0 pattern-dots opacity-10" />
            ),
          },
        ]}
        floatingElements
      >
        <div className="container mx-auto px-4 relative z-10">
          <StaggerContainer className="text-center mb-16">
            <MotionDiv preset="slideUp" delay={0.2}>
              <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
                Discover
                <span className="block text-gradient-alt">Sacred India</span>
              </h2>
            </MotionDiv>
            <MotionDiv preset="fadeIn" delay={0.4}>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Embark on a journey through time and spirituality across India's most sacred destinations
              </p>
            </MotionDiv>
          </StaggerContainer>

          {/* Animated Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <MotionDiv
                key={stat.label}
                preset="scaleIn"
                delay={0.6 + index * 0.1}
                hover
                magnetic
              >
                <InteractiveGlassCard
                  variant="frosted"
                  size="lg"
                  className="text-center p-8 group"
                >
                  <MotionDiv 
                    preset="float"
                    delay={index * 0.2}
                    className={`mx-auto mb-4 p-4 rounded-full w-fit bg-gradient-to-br from-${stat.color.split('-')[1]}-400/20 to-${stat.color.split('-')[1]}-600/20`}
                  >
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </MotionDiv>
                  
                  <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                    {stat.value}
                  </div>
                  
                  <p className="text-white/70 font-medium">{stat.label}</p>
                </InteractiveGlassCard>
              </MotionDiv>
            ))}
          </div>

          {/* Featured Categories Preview */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((category, index) => {
              const categoryPlaces = allPlaces.filter(p => p.category === category);
              const representativePlace = categoryPlaces[0];
              
              return (
                <MotionDiv
                  key={category}
                  preset="slideUp"
                  delay={0.8 + index * 0.2}
                  hover
                  magnetic
                >
                  <InteractiveGlassCard
                    variant="gradient"
                    size="lg"
                    className="p-0 overflow-hidden group"
                  >
                    <div className="relative h-48">
                      <img
                        src={representativePlace?.thumbnail || '/placeholder.jpg'}
                        alt={category}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-xl mb-2">{category}</h3>
                        <p className="text-white/80 text-sm">
                          {categoryPlaces.length} sacred {categoryPlaces.length === 1 ? 'site' : 'sites'}
                        </p>
                      </div>

                      {/* Floating icon */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <GlassCard variant="subtle" size="sm" className="p-2">
                          <Camera className="h-5 w-5 text-white" />
                        </GlassCard>
                      </div>
                    </div>
                  </InteractiveGlassCard>
                </MotionDiv>
              );
            })}
          </StaggerContainer>
        </div>
      </ParallaxSection>

      {/* Enhanced Destinations Grid Section */}
      <ParallaxSection
        height="auto"
        className="section-padding"
        layers={[
          {
            id: 'destinations-bg',
            speed: -0.2,
            content: (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
            ),
          },
        ]}
      >
        <div className="container mx-auto px-4 relative z-10">
          <StaggerContainer className="text-center mb-16">
            <MotionDiv preset="slideUp" delay={0.2}>
              <div className="flex justify-center mb-6">
                <GlassCard variant="gradient" size="sm" className="p-4">
                  <Mountain className="w-8 h-8 text-white" />
                </GlassCard>
              </div>
            </MotionDiv>

            <MotionDiv preset="morphing" delay={0.4}>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                All
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Destinations
                </span>
              </h2>
            </MotionDiv>

            <MotionDiv preset="wave" delay={0.6}>
              <p className="text-center max-w-2xl mx-auto text-lg text-white/70 mb-12">
                Journey through sacred cities and timeless landmarks. Find your next spiritual adventure with our curated collection of India's most revered destinations.
              </p>
            </MotionDiv>
          </StaggerContainer>

          {/* Enhanced Destinations Client with Stagger Animation */}
          <MotionDiv preset="fadeIn" delay={0.8}>
            <DestinationsClient places={allPlaces} />
          </MotionDiv>
        </div>
      </ParallaxSection>

      {/* Call to Action Section */}
      <ParallaxSection
        height="60vh"
        className="flex items-center justify-center"
        layers={[
          {
            id: 'cta-bg',
            speed: -0.3,
            content: (
              <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
            ),
          },
        ]}
        floatingElements
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <StaggerContainer>
            <MotionDiv preset="scaleIn" delay={0.2}>
              <Compass className="w-16 h-16 text-primary mx-auto mb-6" />
            </MotionDiv>
            
            <MotionDiv preset="slideUp" delay={0.4}>
              <h2 className="text-4xl md:text-6xl font-headline font-bold text-white mb-6">
                Ready to
                <span className="block text-gradient">Explore?</span>
              </h2>
            </MotionDiv>
            
            <MotionDiv preset="fadeIn" delay={0.6}>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Let us craft the perfect spiritual journey for you across India's most sacred destinations.
              </p>
            </MotionDiv>
            
            <MotionDiv preset="bounce" delay={0.8}>
              <GlassCard
                variant="gradient"
                animation="hover"
                interactive
                glow
                className="inline-block px-12 py-6 cursor-pointer group"
              >
                <span className="text-white font-bold text-xl flex items-center gap-3">
                  Plan Your Journey
                  <MapPin className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </span>
              </GlassCard>
            </MotionDiv>
          </StaggerContainer>
        </div>
      </ParallaxSection>
    </div>
  );
}