'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { PlaceCard } from "@/components/place-card";
import { PackageCard } from "@/components/package-card";
import { type Place, type Package } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MapPin, Star, Users, Calendar, Award, Globe } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MotionDiv, StaggerContainer } from "@/components/motion-div";
import { HeroBanner } from "@/components/hero-banner";
import { ParallaxSection, ParallaxContent } from "@/components/ui/parallax-section";
import { GlassCard, InteractiveGlassCard, FloatingGlassCard } from "@/components/ui/glass-card";
import { FloatingElements, ParticleSystem } from "@/components/ui/floating-elements";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll";
import { cn } from '@/lib/utils';
import { Suspense } from 'react';

interface HomeClientProps {
  featuredPlaces: Place[];
  popularPackages: Package[];
}

/**
 * Statistics Section with Animated Counters
 */
const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { ref, isInView } = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (isInView) setIsVisible(true);
  }, [isInView]);

  const stats = [
    { icon: MapPin, value: 50, suffix: '+', label: 'Sacred Destinations', color: 'text-blue-400' },
    { icon: Users, value: 10000, suffix: '+', label: 'Happy Travelers', color: 'text-green-400' },
    { icon: Calendar, value: 5, suffix: '', label: 'Years Experience', color: 'text-yellow-400' },
    { icon: Award, value: 98, suffix: '%', label: 'Customer Satisfaction', color: 'text-purple-400' },
  ];

  const AnimatedCounter = ({ value, suffix, isVisible }: { value: number; suffix: string; isVisible: boolean }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const duration = 2000;
      const increment = value / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
      <span className="text-4xl md:text-5xl font-bold">
        {count.toLocaleString()}{suffix}
      </span>
    );
  };

  return (
    <ParallaxSection
      height="80vh"
      className="relative flex items-center justify-center"
      layers={[
        {
          id: 'stats-bg',
          speed: -0.3,
          content: (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-900 to-slate-800" />
          ),
        },
      ]}
      floatingElements
      overlay
      overlayColor="rgba(0,0,0,0.4)"
    >
      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <StaggerContainer className="text-center mb-16">
          <MotionDiv preset="slideUp" delay={0.2}>
            <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
              Trusted by
              <span className="block text-gradient-alt">Thousands</span>
            </h2>
          </MotionDiv>
          <MotionDiv preset="fadeIn" delay={0.4}>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Join our community of spiritual travelers exploring India's most sacred destinations
            </p>
          </MotionDiv>
        </StaggerContainer>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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
                <motion.div
                  className={cn("mx-auto mb-4 p-4 rounded-full w-fit", 
                    `bg-gradient-to-br from-${stat.color.split('-')[1]}-400/20 to-${stat.color.split('-')[1]}-600/20`
                  )}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className={cn("h-8 w-8", stat.color)} />
                </motion.div>
                
                <div className={cn("mb-2", stat.color)}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
                </div>
                
                <p className="text-white/70 font-medium">{stat.label}</p>
                
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, ${stat.color.replace('text-', 'rgba(').replace('-400', ', 0.1)')} 0%, transparent 70%)`,
                  }}
                />
              </InteractiveGlassCard>
            </MotionDiv>
          ))}
        </div>
      </div>
    </ParallaxSection>
  );
};

/**
 * Featured Destinations Section with Advanced Grid
 */
const FeaturedDestinationsSection = ({ featuredPlaces }: { featuredPlaces: Place[] }) => {
  return (
    <ParallaxSection
      height="auto"
      className="section-padding"
      layers={[
        {
          id: 'destinations-bg',
          speed: -0.5,
          content: (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
          ),
        },
        {
          id: 'destinations-pattern',
          speed: -0.3,
          content: (
            <div className="absolute inset-0 pattern-grid opacity-10" />
          ),
        },
      ]}
      floatingElements
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <StaggerContainer className="text-center mb-16">
          <MotionDiv preset="slideUp" delay={0.2}>
            <div className="flex justify-center mb-6">
              <FloatingGlassCard variant="gradient" size="sm" className="p-4">
                <MapPin className="w-8 h-8 text-white" />
              </FloatingGlassCard>
            </div>
          </MotionDiv>

          <MotionDiv preset="typewriter" delay={0.4}>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Sacred
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Destinations
              </span>
            </h2>
          </MotionDiv>

          <MotionDiv preset="fadeIn" delay={0.8}>
            <p className="text-white/90 max-w-3xl mx-auto text-xl md:text-2xl font-light leading-relaxed">
              Embark on extraordinary spiritual journeys to handpicked destinations that promise to create memories for a lifetime.
            </p>
          </MotionDiv>
        </StaggerContainer>

        {/* Places Grid */}
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
                      preset="scaleIn"
                      delay={index * 0.1}
                    >
                      <div className="group relative overflow-hidden rounded-3xl">
                        <PlaceCard place={place} index={index} />
                        
                        {/* Card overlay effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                          whileHover={{ scale: 1.02 }}
                        />
                      </div>
                    </MotionDiv>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <CarouselPrevious className="hidden lg:flex bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 shadow-xl -left-6" />
              <CarouselNext className="hidden lg:flex bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 shadow-xl -right-6" />
            </Carousel>
          </div>
        ) : (
          <MotionDiv preset="fadeIn" className="text-center py-16">
            <GlassCard variant="subtle" className="inline-block p-8">
              <p className="text-white/80 text-lg">No featured places available at the moment.</p>
            </GlassCard>
          </MotionDiv>
        )}

        {/* Call to Action */}
        <MotionDiv preset="bounce" delay={1.2} className="text-center mt-16">
          <Button asChild className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm hover:from-white/20 hover:to-white/10 text-white border-white/20 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 px-8 py-6 text-lg rounded-full group">
            <Link href="/destinations">
              <span className="flex items-center">
                Explore All Destinations
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </span>
            </Link>
          </Button>
        </MotionDiv>
      </div>
    </ParallaxSection>
  );
};

/**
 * Popular Packages Section with Enhanced Cards
 */
const PopularPackagesSection = ({ popularPackages }: { popularPackages: Package[] }) => {
  return (
    <ParallaxSection
      height="auto"
      className="section-padding"
      layers={[
        {
          id: 'packages-bg',
          speed: -0.4,
          content: (
            <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900" />
          ),
        },
        {
          id: 'packages-particles',
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
        {/* Section Header */}
        <StaggerContainer className="text-center mb-16">
          <MotionDiv preset="slideUp" delay={0.2}>
            <div className="flex justify-center mb-6">
              <FloatingGlassCard variant="colored" size="sm" className="p-4">
                <Star className="w-8 h-8 text-white" />
              </FloatingGlassCard>
            </div>
          </MotionDiv>

          <MotionDiv preset="morphing" delay={0.4}>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Popular
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Packages
              </span>
            </h2>
          </MotionDiv>

          <MotionDiv preset="wave" delay={0.8}>
            <p className="text-white/90 max-w-3xl mx-auto text-xl md:text-2xl font-light leading-relaxed">
              Carefully curated spiritual experiences that blend adventure, culture, and luxury into unforgettable journeys.
            </p>
          </MotionDiv>
        </StaggerContainer>

        {/* Packages Grid */}
        {popularPackages.length > 0 ? (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularPackages.map((pkg, index) => (
              <MotionDiv
                key={pkg.id}
                preset="spiral"
                delay={index * 0.2}
                hover
                magnetic
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl transform-3d">
                  <PackageCard pkg={pkg} index={index} />
                  
                  {/* Enhanced hover effects */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                  />
                </div>
              </MotionDiv>
            ))}
          </StaggerContainer>
        ) : (
          <MotionDiv preset="fadeIn" className="text-center py-16">
            <GlassCard variant="subtle" className="inline-block p-8">
              <p className="text-white/80 text-lg">No packages available at the moment.</p>
            </GlassCard>
          </MotionDiv>
        )}

        {/* Call to Action */}
        <MotionDiv preset="elastic" delay={1.5} className="text-center mt-16">
          <Button asChild className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm hover:from-white/20 hover:to-white/10 text-white border-white/20 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 px-8 py-6 text-lg rounded-full group">
            <Link href="/packages">
              <span className="flex items-center">
                View All Packages
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </span>
            </Link>
          </Button>
        </MotionDiv>
      </div>
    </ParallaxSection>
  );
};

/**
 * Testimonials Section with Advanced Animations
 */
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "The spiritual journey to Varanasi was life-changing. Every detail was perfectly organized.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      text: "Incredible experience in Rishikesh. The yoga sessions and temple visits were amazing.",
      image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Anita Patel",
      location: "Ahmedabad",
      rating: 5,
      text: "The Kedarnath trek was challenging but spiritually rewarding. Highly recommended!",
      image: "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?w=100&h=100&fit=crop&crop=face"
    },
  ];

  return (
    <ParallaxContent className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4">
        <StaggerContainer className="text-center mb-16">
          <MotionDiv preset="slideUp" delay={0.2}>
            <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
              What Our
              <span className="block text-gradient-alt">Travelers Say</span>
            </h2>
          </MotionDiv>
        </StaggerContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <MotionDiv
              key={testimonial.name}
              preset="float"
              delay={index * 0.2}
              hover
              magnetic
            >
              <InteractiveGlassCard
                variant="frosted"
                size="lg"
                className="p-8 text-center h-full"
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>

                <p className="text-white/80 mb-6 italic">"{testimonial.text}"</p>

                <div className="text-white">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-white/60 text-sm">{testimonial.location}</p>
                </div>
              </InteractiveGlassCard>
            </MotionDiv>
          ))}
        </div>
      </div>
    </ParallaxContent>
  );
};

/**
 * Main Home Client Component
 */
export function HomeClient({ featuredPlaces, popularPackages }: HomeClientProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-red-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10,
          }}
        />
      </div>

      {/* Main Content */}
      <div className={cn(
        "relative z-10 transition-all duration-1000",
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}>
        
        {/* Hero Section */}
        <Suspense fallback={
          <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <MotionDiv preset="pulse">
              <Sparkles className="w-16 h-16 text-white animate-spin" />
            </MotionDiv>
          </div>
        }>
          <HeroBanner />
        </Suspense>

        {/* Statistics Section */}
        <StatsSection />

        {/* Featured Destinations */}
        <FeaturedDestinationsSection featuredPlaces={featuredPlaces} />

        {/* Popular Packages */}
        <PopularPackagesSection popularPackages={popularPackages} />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Final CTA Section */}
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
                <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
              </MotionDiv>
              
              <MotionDiv preset="slideUp" delay={0.4}>
                <h2 className="text-4xl md:text-6xl font-headline font-bold text-white mb-6">
                  Ready for Your
                  <span className="block text-gradient">Spiritual Journey?</span>
                </h2>
              </MotionDiv>
              
              <MotionDiv preset="fadeIn" delay={0.6}>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Let us help you discover the sacred beauty of India's most spiritual destinations.
                </p>
              </MotionDiv>
              
              <MotionDiv preset="bounce" delay={0.8}>
                <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
                  <Link href="/contact">
                    Start Your Journey
                    <Sparkles className="ml-2 w-6 h-6" />
                  </Link>
                </Button>
              </MotionDiv>
            </StaggerContainer>
          </div>
        </ParallaxSection>
      </div>
    </div>
  );
}