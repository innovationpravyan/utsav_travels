'use client';

import { memo, useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { OptimizedPlaceCard } from "@/components/optimized-place-card";
import { OptimizedPackageCard } from "@/components/optimized-package-card";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Award,
    Calendar,
    Globe,
    MapPin,
    Sparkles,
    Star,
    Users,
    Phone,
    Mail,
    Compass,
    Camera,
    Heart,
    Crown,
    Gem,
    Plane,
    Sunset,
    Coffee,
    Palmtree
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { OptimizedMotionDiv, StaggerContainer } from "@/components/optimized-motion-div";
import { GlassCard } from "@/components/ui/glass-card";
import { useThreeInView } from '@/utils/three-utils';
import { usePerformancePreference } from '@/hooks/use-mobile';
import { cn } from '@/utils/utils';
import { Place, Package } from '@/lib/data';
import {
    HOMEPAGE_STATS,
    TESTIMONIALS,
    COMPANY_INFO,
    createWhatsAppUrl
} from "@/utils/utils";

interface OptimizedHomeClientProps {
    featuredPlaces: Place[];
    popularPackages: Package[];
}

// Enhanced icon mapping with luxury-themed icons
const getIconComponent = (iconName: string) => {
    const icons = {
        MapPin,
        Users,
        Calendar,
        Award,
        Compass,
        Camera,
        Heart,
        Crown,
        Gem,
        Plane,
        Sunset,
        Coffee,
        Palmtree,
        Star,
        Globe,
    };
    return icons[iconName as keyof typeof icons] || Crown;
};

// Enhanced hero section with luxury aesthetic
const LuxuryHeroSection = memo(() => {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('loadeddata', () => setIsVideoLoaded(true));
        }
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={cn(
                        "w-full h-full object-cover transition-opacity duration-1000",
                        isVideoLoaded ? "opacity-100" : "opacity-0"
                    )}
                >
                    <source src="/videos/luxury-travel-hero.mp4" type="video/mp4" />
                </video>

                {/* Fallback gradient background */}
                <div className={cn(
                    "absolute inset-0 hero-gradient transition-opacity duration-1000",
                    isVideoLoaded ? "opacity-0" : "opacity-100"
                )} />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 hero-overlay z-10" />

            {/* Floating elegant elements */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="absolute top-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float-elegant" />
                <div className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-r from-carnation-300/20 to-fairy-500/20 rounded-full blur-3xl animate-float-elegant delay-1000" />
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-thistle-400/20 rounded-full blur-xl animate-bounce-gentle delay-700" />
                <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-uranian-400/20 rounded-full blur-lg animate-float-elegant delay-1500" />
            </div>

            {/* Content */}
            <div className="relative z-30 container-luxury text-center text-white">
                <OptimizedMotionDiv preset="fadeIn" delay={500}>
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 rounded-full backdrop-blur-sm mb-8">
                        <Crown className="w-5 h-5 text-carnation-300" />
                        <span className="text-caption text-white tracking-wider">Luxury Awaits</span>
                    </div>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="slideUp" delay={700}>
                    <h1 className="text-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
                        Discover Extraordinary
                        <span className="block text-gradient-rainbow">Escapes</span>
                    </h1>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="fadeIn" delay={900}>
                    <p className="text-body text-xl md:text-2xl text-white/95 max-w-4xl mx-auto mb-10 leading-relaxed font-light">
                        Immerse yourself in curated luxury experiences that transcend ordinary travel.
                        Create unforgettable memories in the world's most breathtaking destinations.
                    </p>
                </OptimizedMotionDiv>

                <StaggerContainer staggerDelay={200}>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <OptimizedMotionDiv preset="slideUp" delay={1100}>
                            <Button className="btn-primary btn-large group shadow-luxury">
                                <Gem className="w-6 h-6" />
                                Begin Your Journey
                                <Sparkles className="w-6 h-6 group-hover:animate-spin" />
                            </Button>
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="slideUp" delay={1300}>
                            <Button variant="outline" className="btn-outline btn-large text-white hover:bg-white hover:text-thistle-900">
                                <Camera className="w-6 h-6" />
                                Explore Destinations
                            </Button>
                        </OptimizedMotionDiv>
                    </div>
                </StaggerContainer>

                {/* Scroll indicator */}
                <OptimizedMotionDiv preset="fadeIn" delay={1500} className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce-gentle">
                        <ArrowRight className="w-6 h-6 text-white/80 rotate-90" />
                    </div>
                </OptimizedMotionDiv>
            </div>
        </section>
    );
});

LuxuryHeroSection.displayName = 'LuxuryHeroSection';

// Enhanced statistics section with luxury theme
const LuxuryStatsSection = memo(() => {
    const [countersStarted, setCountersStarted] = useState(false);
    const { ref: sectionRef, isInView } = useThreeInView(0.2);
    const { shouldReduceEffects } = usePerformancePreference();

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

            const duration = 2500;
            const steps = 80;
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
            <span className="text-display text-4xl md:text-6xl font-bold text-thistle-800">
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

    // Enhanced stats data with luxury themes
    const luxuryStats = [
        {
            icon: 'Crown',
            value: 15000,
            suffix: '+',
            label: 'Luxury Travelers',
            color: 'text-thistle-600',
            bgColor: 'bg-thistle-50'
        },
        {
            icon: 'Gem',
            value: 300,
            suffix: '+',
            label: 'Premium Destinations',
            color: 'text-fairy-600',
            bgColor: 'bg-fairy-50'
        },
        {
            icon: 'Star',
            value: 99,
            suffix: '%',
            label: 'Satisfaction Rate',
            color: 'text-carnation-600',
            bgColor: 'bg-carnation-50'
        },
        {
            icon: 'Award',
            value: 15,
            suffix: '+',
            label: 'Years Excellence',
            color: 'text-uranian-600',
            bgColor: 'bg-uranian-50'
        },
    ];

    return (
        <section ref={sectionRef} className="section-padding section-luxury">
            <div className="container-luxury">
                <div className="text-center mb-20">
                    <OptimizedMotionDiv preset="slideUp">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-thistle-100 to-fairy-100 rounded-full mb-8">
                            <Star className="w-5 h-5 text-thistle-600" />
                            <span className="text-caption text-thistle-700 tracking-wider">Excellence Recognized</span>
                        </div>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="slideUp" delay={200}>
                        <h2 className="text-heading text-5xl md:text-6xl font-bold text-thistle-900 mb-8">
                            Luxury Travel
                            <span className="block text-gradient-luxury">By The Numbers</span>
                        </h2>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn" delay={400}>
                        <p className="text-body text-lg md:text-xl text-thistle-700 max-w-3xl mx-auto leading-relaxed">
                            Join an exclusive community of discerning travelers who choose excellence in every journey
                        </p>
                    </OptimizedMotionDiv>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    {luxuryStats.map((stat, index) => {
                        const IconComponent = getIconComponent(stat.icon);
                        return (
                            <OptimizedMotionDiv
                                key={stat.label}
                                preset="scaleIn"
                                delay={index * 150}
                                hover={!shouldReduceEffects}
                                className="text-center"
                            >
                                <div className={cn(
                                    "card-luxury p-8 md:p-10 group hover-luxury",
                                    stat.bgColor
                                )}>
                                    <div className={cn(
                                        "mx-auto mb-6 p-4 md:p-5 rounded-3xl w-fit transition-transform duration-400",
                                        stat.color,
                                        "bg-white shadow-soft",
                                        !shouldReduceEffects && "group-hover:rotate-6 group-hover:scale-110"
                                    )}>
                                        <IconComponent className="h-8 w-8 md:h-10 md:w-10" />
                                    </div>

                                    <div className="mb-4">
                                        <OptimizedCounter
                                            value={stat.value}
                                            suffix={stat.suffix}
                                            isVisible={countersStarted}
                                            shouldAnimate={!shouldReduceEffects}
                                        />
                                    </div>

                                    <p className="text-body text-thistle-700 font-medium text-sm md:text-base leading-relaxed">
                                        {stat.label}
                                    </p>
                                </div>
                            </OptimizedMotionDiv>
                        );
                    })}
                </div>
            </div>
        </section>
    );
});

LuxuryStatsSection.displayName = 'LuxuryStatsSection';

// Enhanced destinations section with elegant theme
const ElegantDestinationsSection = memo(({ featuredPlaces }: { featuredPlaces: Place[] }) => {
    const { shouldReduceEffects } = usePerformancePreference();

    return (
        <section className="section-padding section-thistle relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-16 right-16 w-72 h-72 bg-gradient-to-r from-fairy-200/30 to-thistle-200/30 rounded-full blur-3xl animate-float-elegant" />
                <div className="absolute bottom-24 left-24 w-96 h-96 bg-gradient-to-r from-carnation-200/20 to-uranian-200/20 rounded-full blur-3xl animate-float-elegant delay-1000" />
            </div>

            <div className="container-luxury relative z-10">
                <div className="text-center mb-20">
                    <OptimizedMotionDiv preset="slideUp">
                        <div className="inline-flex items-center gap-3 px-6 py-3 glass-dreamy rounded-full mb-8">
                            <Globe className="w-5 h-5 text-thistle-600" />
                            <span className="text-caption text-thistle-700 tracking-wider">Curated Destinations</span>
                        </div>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="slideUp" delay={200}>
                        <h2 className="text-heading text-5xl md:text-7xl font-bold text-thistle-900 mb-8 tracking-tight">
                            Breathtaking
                            <span className="block text-gradient-luxury">Destinations</span>
                        </h2>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn" delay={400}>
                        <p className="text-body text-thistle-700 max-w-4xl mx-auto text-lg md:text-xl font-light leading-relaxed">
                            Each destination is carefully selected for its unique beauty, cultural richness, and ability to create
                            magical moments that will stay with you forever.
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
                                <CarouselContent className="-ml-3 md:-ml-4">
                                    {featuredPlaces.map((place, index) => (
                                        <CarouselItem key={place.id} className="pl-3 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                            <div className="card-luxury hover-luxury overflow-hidden">
                                                <OptimizedPlaceCard
                                                    place={place}
                                                    index={index}
                                                    showAnimation={!shouldReduceEffects}
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                <CarouselPrevious className="hidden lg:flex glass-luxury text-thistle-600 hover:bg-thistle-50 shadow-luxury -left-8" />
                                <CarouselNext className="hidden lg:flex glass-luxury text-thistle-600 hover:bg-thistle-50 shadow-luxury -right-8" />
                            </Carousel>
                        </OptimizedMotionDiv>
                    </div>
                ) : (
                    <OptimizedMotionDiv preset="fadeIn" className="text-center py-20">
                        <div className="card-luxury inline-block p-10">
                            <Globe className="w-16 h-16 text-thistle-400 mx-auto mb-6" />
                            <p className="text-thistle-600 text-lg">Curating breathtaking destinations...</p>
                        </div>
                    </OptimizedMotionDiv>
                )}

                <OptimizedMotionDiv preset="slideUp" delay={800} className="text-center mt-20">
                    <Button asChild className="btn-primary btn-large group shadow-luxury">
                        <Link href="/destinations">
                            <span className="flex items-center">
                                Explore All Destinations
                                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                    </Button>
                </OptimizedMotionDiv>
            </div>
        </section>
    );
});

ElegantDestinationsSection.displayName = 'ElegantDestinationsSection';

// Enhanced packages section with luxury theme
const DreamyPackagesSection = memo(({ popularPackages }: { popularPackages: Package[] }) => {
    const { shouldReduceEffects } = usePerformancePreference();

    return (
        <section className="section-padding section-fairy relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-24 left-16 w-80 h-80 bg-gradient-to-r from-carnation-200/20 to-thistle-200/20 rounded-full blur-3xl animate-pulse-luxury" />
                <div className="absolute bottom-24 right-24 w-96 h-96 bg-gradient-to-r from-fairy-200/15 to-uranian-200/15 rounded-full blur-3xl animate-pulse-luxury delay-2000" />
            </div>

            <div className="container-luxury relative z-10">
                <div className="text-center mb-20">
                    <OptimizedMotionDiv preset="slideUp">
                        <div className="inline-flex items-center gap-3 px-6 py-3 glass-dreamy rounded-full mb-8">
                            <Heart className="w-5 h-5 text-fairy-600" />
                            <span className="text-caption text-fairy-700 tracking-wider">Luxury Experiences</span>
                        </div>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="slideUp" delay={200}>
                        <h2 className="text-heading text-5xl md:text-7xl font-bold text-fairy-900 mb-8 tracking-tight">
                            Dreamy
                            <span className="block text-gradient-dreamy">Experiences</span>
                        </h2>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn" delay={400}>
                        <p className="text-body text-fairy-700 max-w-4xl mx-auto text-lg md:text-xl font-light leading-relaxed">
                            Meticulously crafted luxury packages that blend comfort, adventure, and exclusive access
                            into extraordinary journeys tailored to your desires.
                        </p>
                    </OptimizedMotionDiv>
                </div>

                {popularPackages?.length > 0 ? (
                    <div className="grid-luxury">
                        {popularPackages.map((pkg, index) => (
                            <OptimizedMotionDiv
                                key={pkg.id}
                                preset="slideUp"
                                delay={index * 250}
                            >
                                <div className="card-luxury hover-luxury h-full">
                                    <OptimizedPackageCard
                                        pkg={pkg}
                                        index={index}
                                        showAnimation={!shouldReduceEffects}
                                    />
                                </div>
                            </OptimizedMotionDiv>
                        ))}
                    </div>
                ) : (
                    <OptimizedMotionDiv preset="fadeIn" className="text-center py-20">
                        <div className="card-luxury inline-block p-10">
                            <Heart className="w-16 h-16 text-fairy-400 mx-auto mb-6" />
                            <p className="text-fairy-600 text-lg">Crafting dreamy experiences...</p>
                        </div>
                    </OptimizedMotionDiv>
                )}

                <OptimizedMotionDiv preset="slideUp" delay={700} className="text-center mt-20">
                    <Button asChild className="btn-secondary btn-large group shadow-dreamy">
                        <Link href="/packages">
                            <span className="flex items-center">
                                View All Experiences
                                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                    </Button>
                </OptimizedMotionDiv>
            </div>
        </section>
    );
});

DreamyPackagesSection.displayName = 'DreamyPackagesSection';

// Enhanced testimonials section with elegant styling
const ElegantTestimonialsSection = memo(() => {
    return (
        <section className="section-padding section-carnation">
            <div className="container-luxury">
                <div className="text-center mb-20">
                    <OptimizedMotionDiv preset="slideUp">
                        <div className="inline-flex items-center gap-3 px-6 py-3 glass-luxury rounded-full mb-8">
                            <Star className="w-5 h-5 text-carnation-600" />
                            <span className="text-caption text-carnation-700 tracking-wider">Guest Stories</span>
                        </div>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="slideUp" delay={200}>
                        <h2 className="text-heading text-5xl md:text-6xl font-bold text-carnation-900 mb-8">
                            What Our Guests
                            <span className="block text-gradient-dreamy">Say About Us</span>
                        </h2>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn" delay={400}>
                        <p className="text-body text-lg md:text-xl text-carnation-700 max-w-3xl mx-auto leading-relaxed">
                            Hear from luxury travelers who have experienced the magic of our curated journeys
                        </p>
                    </OptimizedMotionDiv>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <OptimizedMotionDiv
                            key={testimonial.name}
                            preset="slideUp"
                            delay={index * 250}
                            hover
                        >
                            <div className="card-luxury p-10 text-center h-full hover-elegant">
                                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-8 rounded-full overflow-hidden ring-4 ring-carnation-200 shadow-elegant">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="flex justify-center mb-6">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="h-5 w-5 md:h-6 md:w-6 text-carnation-400 fill-current mx-0.5" />
                                    ))}
                                </div>

                                <p className="text-body text-carnation-800 mb-8 italic leading-relaxed text-lg">
                                    "{testimonial.text}"
                                </p>

                                <div className="text-carnation-900">
                                    <p className="text-subheading font-semibold text-xl mb-1">{testimonial.name}</p>
                                    <p className="text-body text-carnation-600">{testimonial.location}</p>
                                </div>
                            </div>
                        </OptimizedMotionDiv>
                    ))}
                </div>
            </div>
        </section>
    );
});

ElegantTestimonialsSection.displayName = 'ElegantTestimonialsSection';

// Enhanced final CTA section with luxury styling
const LuxuryCTASection = memo(() => {
    return (
        <section className="section-padding section-elegant text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-r from-thistle-400/10 to-fairy-400/10 rounded-full blur-3xl animate-pulse-luxury" />
                <div className="absolute top-16 right-16 w-40 h-40 bg-carnation-400/20 rounded-full blur-2xl animate-float-elegant" />
                <div className="absolute bottom-16 left-16 w-56 h-56 bg-uranian-400/15 rounded-full blur-2xl animate-float-elegant delay-1000" />
            </div>

            <div className="container-luxury text-center relative z-10">
                <OptimizedMotionDiv preset="scaleIn">
                    <div className="inline-flex items-center justify-center w-24 h-24 glass-luxury rounded-full mb-10">
                        <Crown className="w-12 h-12 text-white" />
                    </div>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="slideUp" delay={200}>
                    <h2 className="text-display text-4xl md:text-6xl font-bold mb-8">
                        Ready to Create Your
                        <span className="block text-gradient-rainbow">Perfect Escape?</span>
                    </h2>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="fadeIn" delay={400}>
                    <p className="text-body text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Let our luxury travel specialists design an extraordinary journey that exceeds your wildest dreams
                        and creates memories to treasure forever.
                    </p>
                </OptimizedMotionDiv>

                <StaggerContainer staggerDelay={200}>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <OptimizedMotionDiv preset="slideUp" delay={600}>
                            <Button
                                asChild
                                className="btn-accent btn-large group shadow-elegant"
                            >
                                <Link href="/contact">
                                    <Gem className="w-6 h-6" />
                                    Start Planning
                                    <Sparkles className="w-6 h-6 group-hover:animate-spin" />
                                </Link>
                            </Button>
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="slideUp" delay={800}>
                            <Button
                                asChild
                                variant="outline"
                                className="btn-outline btn-large text-white hover:bg-white hover:text-thistle-900"
                            >
                                <Link href={createWhatsAppUrl("Hello! I'm interested in creating a luxury travel experience. Please share more details.")}>
                                    <Phone className="w-6 h-6" />
                                    Connect with Us
                                </Link>
                            </Button>
                        </OptimizedMotionDiv>
                    </div>
                </StaggerContainer>
            </div>
        </section>
    );
});

LuxuryCTASection.displayName = 'LuxuryCTASection';

// Main enhanced component with luxury theme
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
                "relative z-10 transition-all duration-500",
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
                <LuxuryHeroSection />
                <LuxuryStatsSection />
                <ElegantDestinationsSection featuredPlaces={featuredPlaces} />
                <DreamyPackagesSection popularPackages={popularPackages} />
                <ElegantTestimonialsSection />
                <LuxuryCTASection />
            </div>
        </div>
    );
});

OptimizedHomeClient.displayName = 'OptimizedHomeClient';