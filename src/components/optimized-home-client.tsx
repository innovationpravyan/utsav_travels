'use client';

import { memo, useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { OptimizedPlaceCard } from "@/components/optimized-place-card";
import { OptimizedPackageCard } from "@/components/optimized-package-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Calendar, Globe, MapPin, Sparkles, Star, Users, Phone, Mail } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { OptimizedMotionDiv, StaggerContainer } from "@/components/optimized-motion-div";
import { GlassCard } from "@/components/ui/glass-card";
import { useThreeInView } from '@/utils/three-utils';
import { usePerformancePreference } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
    HOMEPAGE_STATS,
    TESTIMONIALS,
    COMPANY_INFO,
    createWhatsAppUrl
} from "@/lib/utils";

// Types for data safety
interface Place {
    id: string;
    name: string;
    city: string;
    category: string;
    thumbnail: string;
    tagline: string;
    tags: string[];
    images: string[];
    highlights: string[];
    description: string;
    history: string;
    location: { lat: number; lng: number };
}

interface Package {
    id: string;
    name: string;
    tagline: string;
    description: string;
    duration: string;
    cities: string[];
    price: string;
    thumbnail: string;
    images: string[];
    tags: string[];
    highlights: string[];
    inclusions: string[];
    itinerary: any[];
}

interface OptimizedHomeClientProps {
    featuredPlaces: Place[];
    popularPackages: Package[];
}

// Helper function to get icon component
const getIconComponent = (iconName: string) => {
    const icons = {
        MapPin,
        Users,
        Calendar,
        Award,
    };
    return icons[iconName as keyof typeof icons] || MapPin;
};

// Memoized statistics section
const OptimizedStatsSection = memo(() => {
    const [countersStarted, setCountersStarted] = useState(false);
    const { ref: sectionRef, isInView } = useThreeInView(0.2);
    const { shouldReduceEffects } = usePerformancePreference();

    // Optimized counter with reduced motion support
    const OptimizedCounter = memo(({
                                       value,
                                       suffix,
                                       isVisible,
                                       shouldAnimate
                                   }: {
        value: number;
        suffix: string;
        isVisible: boolean;
        shouldAnimate: boolean;
    }) => {
        const [count, setCount] = useState(0);
        const hasAnimated = useRef(false);

        useEffect(() => {
            if (!isVisible || hasAnimated.current) return;

            hasAnimated.current = true;

            if (!shouldAnimate) {
                setCount(value);
                return;
            }

            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            let currentCount = 0;

            const timer = setInterval(() => {
                currentCount += increment;
                if (currentCount >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(currentCount));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }, [isVisible, value, shouldAnimate]);

        return (
            <span className="text-4xl md:text-5xl font-bold">
                {count.toLocaleString()}{suffix}
            </span>
        );
    });

    OptimizedCounter.displayName = 'OptimizedCounter';

    useEffect(() => {
        if (isInView && !countersStarted) {
            setCountersStarted(true);
        }
    }, [isInView, countersStarted]);

    return (
        <section
            ref={sectionRef}
            className="relative section-padding bg-gradient-to-br from-slate-800 via-purple-900 to-slate-800 contain-layout"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <OptimizedMotionDiv preset="slideUp">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Trusted by
                            <span className="block text-gradient-alt">Thousands</span>
                        </h2>
                    </OptimizedMotionDiv>
                    <OptimizedMotionDiv preset="fadeIn" delay={200}>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            Join our community of spiritual travelers exploring India's most sacred destinations
                        </p>
                    </OptimizedMotionDiv>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {HOMEPAGE_STATS.map((stat, index) => {
                        const IconComponent = getIconComponent(stat.icon);
                        return (
                            <OptimizedMotionDiv
                                key={stat.label}
                                preset="scaleIn"
                                delay={index * 100}
                                hover={!shouldReduceEffects}
                                className="text-center"
                            >
                                <GlassCard className="p-6 md:p-8 group hover:scale-105 transition-all duration-200">
                                    <div className={cn(
                                        "mx-auto mb-4 p-3 md:p-4 rounded-full w-fit bg-white/10 transition-transform duration-200",
                                        !shouldReduceEffects && "group-hover:rotate-12"
                                    )}>
                                        <IconComponent className={cn("h-6 w-6 md:h-8 md:w-8", stat.color)} />
                                    </div>

                                    <div className={cn("mb-2", stat.color)}>
                                        <OptimizedCounter
                                            value={stat.value}
                                            suffix={stat.suffix}
                                            isVisible={countersStarted}
                                            shouldAnimate={!shouldReduceEffects}
                                        />
                                    </div>

                                    <p className="text-white/70 font-medium text-sm md:text-base">{stat.label}</p>
                                </GlassCard>
                            </OptimizedMotionDiv>
                        );
                    })}
                </div>
            </div>
        </section>
    );
});

OptimizedStatsSection.displayName = 'OptimizedStatsSection';

// Memoized destinations section
const OptimizedDestinationsSection = memo(({ featuredPlaces }: { featuredPlaces: Place[] }) => {
    const { shouldReduceEffects } = usePerformancePreference();

    return (
        <section className="section-padding bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative contain-layout">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <OptimizedMotionDiv preset="slideUp">
                        <div className="flex justify-center mb-6">
                            <GlassCard className="p-4 rounded-full">
                                <MapPin className="w-8 h-8 text-white" />
                            </GlassCard>
                        </div>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="slideUp" delay={200}>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Sacred
                            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                                Destinations
                            </span>
                        </h2>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn" delay={400}>
                        <p className="text-white/90 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed">
                            Embark on extraordinary spiritual journeys to handpicked destinations that promise to create
                            memories for a lifetime.
                        </p>
                    </OptimizedMotionDiv>
                </div>

                {featuredPlaces?.length > 0 ? (
                    <div className="relative">
                        <OptimizedMotionDiv preset="fadeIn" delay={600}>
                            <Carousel
                                opts={{ align: "start", loop: true }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-2 md:-ml-4">
                                    {featuredPlaces.map((place, index) => (
                                        <CarouselItem key={place.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                            <OptimizedPlaceCard
                                                place={place}
                                                index={index}
                                                showAnimation={!shouldReduceEffects}
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                <CarouselPrevious className="hidden lg:flex bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 shadow-xl -left-6" />
                                <CarouselNext className="hidden lg:flex bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 shadow-xl -right-6" />
                            </Carousel>
                        </OptimizedMotionDiv>
                    </div>
                ) : (
                    <OptimizedMotionDiv preset="fadeIn" className="text-center py-16">
                        <GlassCard className="inline-block p-8">
                            <MapPin className="w-12 h-12 text-white/50 mx-auto mb-4" />
                            <p className="text-white/80 text-lg">Loading sacred destinations...</p>
                        </GlassCard>
                    </OptimizedMotionDiv>
                )}

                <OptimizedMotionDiv preset="slideUp" delay={800} className="text-center mt-16">
                    <Button asChild className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm hover:from-white/20 hover:to-white/10 text-white border-white/20 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200 px-8 py-6 text-lg rounded-full group">
                        <Link href="/destinations">
                            <span className="flex items-center">
                                Explore All Destinations
                                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                    </Button>
                </OptimizedMotionDiv>
            </div>
        </section>
    );
});

OptimizedDestinationsSection.displayName = 'OptimizedDestinationsSection';

// Memoized packages section
const OptimizedPackagesSection = memo(({ popularPackages }: { popularPackages: Package[] }) => {
    const { shouldReduceEffects } = usePerformancePreference();

    return (
        <section className="section-padding bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 relative contain-layout">
            {/* Floating background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-orange-400/5 to-red-500/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <OptimizedMotionDiv preset="slideUp">
                        <div className="flex justify-center mb-6">
                            <GlassCard className="p-4 rounded-full">
                                <Star className="w-8 h-8 text-white" />
                            </GlassCard>
                        </div>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="slideUp" delay={200}>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Popular
                            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                                Packages
                            </span>
                        </h2>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn" delay={400}>
                        <p className="text-white/90 max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed">
                            Carefully curated spiritual experiences that blend adventure, culture, and luxury into
                            unforgettable journeys.
                        </p>
                    </OptimizedMotionDiv>
                </div>

                {popularPackages?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {popularPackages.map((pkg, index) => (
                            <OptimizedMotionDiv
                                key={pkg.id}
                                preset="slideUp"
                                delay={index * 200}
                            >
                                <OptimizedPackageCard
                                    pkg={pkg}
                                    index={index}
                                    showAnimation={!shouldReduceEffects}
                                />
                            </OptimizedMotionDiv>
                        ))}
                    </div>
                ) : (
                    <OptimizedMotionDiv preset="fadeIn" className="text-center py-16">
                        <GlassCard className="inline-block p-8">
                            <Star className="w-12 h-12 text-white/50 mx-auto mb-4" />
                            <p className="text-white/80 text-lg">Loading tour packages...</p>
                        </GlassCard>
                    </OptimizedMotionDiv>
                )}

                <OptimizedMotionDiv preset="slideUp" delay={600} className="text-center mt-16">
                    <Button asChild className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm hover:from-white/20 hover:to-white/10 text-white border-white/20 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200 px-8 py-6 text-lg rounded-full group">
                        <Link href="/packages">
                            <span className="flex items-center">
                                View All Packages
                                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                    </Button>
                </OptimizedMotionDiv>
            </div>
        </section>
    );
});

OptimizedPackagesSection.displayName = 'OptimizedPackagesSection';

// Memoized testimonials section using constants
const OptimizedTestimonialsSection = memo(() => {
    return (
        <section className="section-padding bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 contain-layout">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <OptimizedMotionDiv preset="slideUp">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            What Our
                            <span className="block text-gradient-alt">Travelers Say</span>
                        </h2>
                    </OptimizedMotionDiv>
                    <OptimizedMotionDiv preset="fadeIn" delay={200}>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            Real experiences from real travelers who have discovered the magic of spiritual India
                        </p>
                    </OptimizedMotionDiv>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <OptimizedMotionDiv
                            key={testimonial.name}
                            preset="slideUp"
                            delay={index * 200}
                            hover
                        >
                            <GlassCard className="p-8 text-center h-full hover:scale-105 transition-all duration-200">
                                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-full overflow-hidden ring-2 ring-white/20">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="flex justify-center mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>

                                <p className="text-white/80 mb-6 italic leading-relaxed">"{testimonial.text}"</p>

                                <div className="text-white">
                                    <p className="font-semibold text-lg">{testimonial.name}</p>
                                    <p className="text-white/60 text-sm">{testimonial.location}</p>
                                </div>
                            </GlassCard>
                        </OptimizedMotionDiv>
                    ))}
                </div>
            </div>
        </section>
    );
});

OptimizedTestimonialsSection.displayName = 'OptimizedTestimonialsSection';

// Final CTA section using constants
const FinalCTASection = memo(() => {
    return (
        <section className="section-padding bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center relative contain-layout">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-600/5 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <OptimizedMotionDiv preset="scaleIn">
                    <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="slideUp" delay={200}>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Ready for Your
                        <span className="block text-gradient">Spiritual Journey?</span>
                    </h2>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="fadeIn" delay={400}>
                    <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Let us help you discover the sacred beauty of India's most spiritual destinations.
                    </p>
                </OptimizedMotionDiv>

                <StaggerContainer staggerDelay={200}>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <OptimizedMotionDiv preset="slideUp" delay={600}>
                            <Button
                                asChild
                                className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200 group"
                            >
                                <Link href="/contact">
                                    <Phone className="mr-2 w-5 h-5" />
                                    Start Your Journey
                                    <Sparkles className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="slideUp" delay={800}>
                            <Button
                                asChild
                                variant="outline"
                                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full transition-all duration-200 group"
                            >
                                <Link href={createWhatsAppUrl("Hi! I'm interested in planning a spiritual journey. Please share more details.")}>
                                    <Mail className="mr-2 w-5 h-5" />
                                    WhatsApp Us
                                </Link>
                            </Button>
                        </OptimizedMotionDiv>
                    </div>
                </StaggerContainer>
            </div>
        </section>
    );
});

FinalCTASection.displayName = 'FinalCTASection';

// Main component
export const OptimizedHomeClient = memo(({
                                             featuredPlaces = [],
                                             popularPackages = []
                                         }: OptimizedHomeClientProps) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="relative overflow-hidden">
            <div className={cn(
                "relative z-10 transition-all duration-300",
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
                <OptimizedStatsSection />
                <OptimizedDestinationsSection featuredPlaces={featuredPlaces} />
                <OptimizedPackagesSection popularPackages={popularPackages} />
                <OptimizedTestimonialsSection />
                <FinalCTASection />
            </div>
        </div>
    );
});

OptimizedHomeClient.displayName = 'OptimizedHomeClient';