import { getPackages } from '@/lib/data';
import { PageBanner, type BannerItem } from '@/components/page-banner';
import { PackagesClient } from './packages-client';
import { ParallaxSection } from '@/components/ui/parallax-section';
import { FloatingElements, ParticleSystem } from '@/components/ui/floating-elements';
import { MotionDiv, StaggerContainer } from '@/components/motion-div';
import { GlassCard, InteractiveGlassCard, FloatingGlassCard } from '@/components/ui/glass-card';
import { Calendar, Clock, MapPin, Star, Users, Award, Compass, Sparkles, Route, Gift } from 'lucide-react';
import { Suspense } from 'react';

export default async function PackagesPage() {
  try {
    const allPackages = await getPackages();
    
    const bannerItems: BannerItem[] = allPackages.slice(0, 5).map(p => ({
      id: p.id,
      image: p.images?.[0] || p.thumbnail || '/placeholder-image.jpg',
      name: p.name || 'Unknown Package',
      tagline: p.duration || 'Duration not specified'
    }));

    // Calculate package statistics
    const totalCities = [...new Set(allPackages.flatMap(p => p.cities))].length;
    const avgDuration = allPackages.reduce((acc, p) => {
      const days = parseInt(p.duration.match(/(\d+)/)?.[1] || '3');
      return acc + days;
    }, 0) / allPackages.length;

    const packageStats = [
      { icon: Gift, label: 'Travel Packages', value: allPackages.length.toString(), color: 'text-blue-400' },
      { icon: MapPin, label: 'Cities Covered', value: totalCities.toString(), color: 'text-green-400' },
      { icon: Calendar, label: 'Avg Duration', value: `${Math.round(avgDuration)} Days`, color: 'text-yellow-400' },
      { icon: Star, label: 'Customer Rating', value: '4.9/5', color: 'text-purple-400' },
    ];

    // Featured package types
    const packageTypes = [
      {
        title: 'Spiritual Journeys',
        description: 'Sacred temple visits and pilgrimage experiences',
        icon: Sparkles,
        color: 'from-blue-400 to-purple-600',
        packages: allPackages.filter(p => p.tags.includes('spiritual')).length
      },
      {
        title: 'Adventure Tours',
        description: 'Trekking, rafting, and Himalayan adventures',
        icon: Route,
        color: 'from-green-400 to-blue-600',
        packages: allPackages.filter(p => p.tags.includes('adventure')).length
      },
      {
        title: 'Cultural Heritage',
        description: 'Explore ancient heritage and cultural sites',
        icon: Award,
        color: 'from-yellow-400 to-orange-600',
        packages: allPackages.filter(p => p.tags.includes('heritage')).length
      },
    ];

    return (
      <div className="animate-fade-in overflow-hidden">
        {/* Enhanced Hero Banner */}
        <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse" />}>
          <PageBanner 
            title="Curated Travel Packages" 
            subtitle="Journeys Crafted for the Soul"
            description="Experience India's spiritual heritage through our carefully designed packages"
            items={bannerItems}
            variant="cinematic"
            height="90vh"
            showStats
            showFloatingElements
          />
        </Suspense>

        {/* Package Statistics Section */}
        <ParallaxSection
          height="auto"
          className="section-padding"
          layers={[
            {
              id: 'stats-bg',
              speed: -0.4,
              content: (
                <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900" />
              ),
            },
            {
              id: 'stats-particles',
              speed: -0.2,
              content: (
                <div className="absolute inset-0">
                  <ParticleSystem count={30} color="rgba(255,255,255,0.1)" />
                </div>
              ),
            },
          ]}
          floatingElements
        >
          <div className="container mx-auto px-4 relative z-10">
            <StaggerContainer className="text-center mb-16">
              <MotionDiv preset="slideUp" delay={0.2}>
                <div className="flex justify-center mb-6">
                  <FloatingGlassCard variant="gradient" size="sm" className="p-4">
                    <Compass className="w-8 h-8 text-white" />
                  </FloatingGlassCard>
                </div>
              </MotionDiv>

              <MotionDiv preset="typewriter" delay={0.4}>
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                  Travel
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                    Statistics
                  </span>
                </h2>
              </MotionDiv>

              <MotionDiv preset="fadeIn" delay={0.6}>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Numbers that showcase our commitment to creating unforgettable spiritual journeys
                </p>
              </MotionDiv>
            </StaggerContainer>

            {/* Animated Statistics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {packageStats.map((stat, index) => (
                <MotionDiv
                  key={stat.label}
                  preset="spiral"
                  delay={0.8 + index * 0.1}
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
                      <stat.icon className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                    </MotionDiv>
                    
                    <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                      {stat.value}
                    </div>
                    
                    <p className="text-white/70 font-medium">{stat.label}</p>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-white/5 to-transparent" />
                    </div>
                  </InteractiveGlassCard>
                </MotionDiv>
              ))}
            </div>

            {/* Package Types Grid */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packageTypes.map((type, index) => (
                <MotionDiv
                  key={type.title}
                  preset="scaleIn"
                  delay={1.2 + index * 0.2}
                  hover
                  magnetic
                >
                  <InteractiveGlassCard
                    variant="gradient"
                    size="lg"
                    className="p-8 text-center group overflow-hidden relative"
                  >
                    {/* Animated background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                    
                    <MotionDiv 
                      preset="pulse"
                      delay={index * 0.3}
                      className="relative z-10"
                    >
                      <div className={`mx-auto mb-6 p-4 rounded-full w-fit bg-gradient-to-br ${type.color} bg-opacity-20`}>
                        <type.icon className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4">{type.title}</h3>
                      <p className="text-white/70 mb-4">{type.description}</p>
                      
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <Gift className="h-4 w-4" />
                        <span className="text-sm font-medium">{type.packages} packages available</span>
                      </div>
                    </MotionDiv>

                    {/* Floating particles effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-ping" />
                      <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                      <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
                    </div>
                  </InteractiveGlassCard>
                </MotionDiv>
              ))}
            </StaggerContainer>
          </div>
        </ParallaxSection>

        {/* Main Packages Section */}
        <ParallaxSection
          height="auto"
          className="section-padding"
          layers={[
            {
              id: 'packages-bg',
              speed: -0.3,
              content: (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900" />
              ),
            },
            {
              id: 'packages-pattern',
              speed: -0.1,
              content: (
                <div className="absolute inset-0 pattern-grid opacity-5" />
              ),
            },
          ]}
        >
          <div className="container mx-auto px-4 relative z-10">
            <StaggerContainer className="text-center mb-16">
              <MotionDiv preset="slideUp" delay={0.2}>
                <div className="flex justify-center mb-6">
                  <FloatingGlassCard variant="colored" size="sm" className="p-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </FloatingGlassCard>
                </div>
              </MotionDiv>

              <MotionDiv preset="liquid" delay={0.4}>
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                  Our
                  <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    Packages
                  </span>
                </h2>
              </MotionDiv>

              <MotionDiv preset="wave" delay={0.6}>
                <p className="text-center max-w-2xl mx-auto text-lg text-white/70 mb-12">
                  Curated journeys designed to offer you an immersive spiritual and cultural experience across India's most sacred destinations.
                </p>
              </MotionDiv>
            </StaggerContainer>

            {/* Enhanced Packages Grid */}
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-gray-200/10 animate-pulse rounded-xl" />
                ))}
              </div>
            }>
              <MotionDiv preset="fadeIn" delay={0.8}>
                <PackagesClient packages={allPackages} />
              </MotionDiv>
            </Suspense>
          </div>
        </ParallaxSection>

        {/* Enhanced CTA Section */}
        <ParallaxSection
          height="70vh"
          className="flex items-center justify-center"
          layers={[
            {
              id: 'cta-bg',
              speed: -0.2,
              content: (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900" />
              ),
            },
            {
              id: 'cta-glow',
              speed: -0.4,
              content: (
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-red-500/20 rounded-full blur-3xl" />
                </div>
              ),
            },
          ]}
          floatingElements
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <StaggerContainer>
              <MotionDiv preset="scaleIn" delay={0.2}>
                <Route className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
              </MotionDiv>
              
              <MotionDiv preset="slideUp" delay={0.4}>
                <h2 className="text-4xl md:text-6xl font-headline font-bold text-white mb-6">
                  Ready for Your
                  <span className="block text-gradient">Adventure?</span>
                </h2>
              </MotionDiv>
              
              <MotionDiv preset="fadeIn" delay={0.6}>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Let us create the perfect spiritual journey tailored to your dreams and aspirations.
                </p>
              </MotionDiv>
              
              <MotionDiv preset="elastic" delay={0.8}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <InteractiveGlassCard
                    variant="gradient"
                    animation="hover"
                    glow
                    className="px-8 py-4 cursor-pointer group"
                  >
                    <span className="text-white font-bold text-lg flex items-center gap-3">
                      <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      Contact Our Experts
                    </span>
                  </InteractiveGlassCard>

                  <InteractiveGlassCard
                    variant="frosted"
                    animation="tilt"
                    className="px-8 py-4 cursor-pointer group"
                  >
                    <span className="text-white/90 font-medium text-lg flex items-center gap-3">
                      <Clock className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      Quick Consultation
                    </span>
                  </InteractiveGlassCard>
                </div>
              </MotionDiv>
            </StaggerContainer>
          </div>
        </ParallaxSection>
      </div>
    );
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
}