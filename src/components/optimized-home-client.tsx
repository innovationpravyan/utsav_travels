'use client';

import { memo, useEffect, useRef, useState, useMemo } from 'react';
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
    Palmtree,
    Filter,
    ChevronDown,
    Check,
    Mountain,
    Waves,
    TreePine
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { OptimizedMotionDiv, StaggerContainer } from "@/components/optimized-motion-div";
import { GlassCard } from "@/components/ui/glass-card";
import { useThreeInView } from '@/utils/three-utils';
import { usePerformancePreference } from '@/hooks/use-mobile';
import { cn } from '@/utils/utils';
import { Place, Package } from '@/lib/data';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

// Enhanced icon mapping with travel-themed icons
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
        Sparkles,
        Mountain,
        Waves,
        TreePine,
    };
    return icons[iconName as keyof typeof icons] || Plane;
};

// Enhanced Place Filter Component
const PlaceFilterCombobox = memo(({
                                      places,
                                      selectedPlace,
                                      onPlaceChange
                                  }: {
    places: Place[];
    selectedPlace: string;
    onPlaceChange: (place: string) => void;
}) => {
    const uniqueCities = useMemo(() => {
        const cities = new Set<string>();
        places.forEach(place => {
            if (place.city) {
                cities.add(place.city);
            }
        });
        return Array.from(cities).sort();
    }, [places]);

    return (
        <div className="w-full max-w-sm mx-auto">
            <Select value={selectedPlace} onValueChange={onPlaceChange}>
                <SelectTrigger className="h-12 bg-white==/20 backdrop-blur-lg border-white/30 text-white text-sm focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 rounded-xl transition-all duration-300 hover:bg-white/25">
                    <div className="flex items-center gap-3">
                        <Filter className="h-4 w-4 text-white/80" />
                        <SelectValue placeholder="Filter by destination" />
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-lg border-white/30 rounded-xl shadow-2xl">
                    <SelectItem
                        value="all"
                        className="text-gray-800 hover:bg-blue-50 focus:bg-blue-50 text-sm py-3 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-blue-600" />
                            All Destinations
                        </div>
                    </SelectItem>
                    {uniqueCities.map(city => (
                        <SelectItem
                            key={city}
                            value={city}
                            className="text-gray-800 hover:bg-blue-50 focus:bg-blue-50 text-sm py-3 rounded-lg transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-blue-600" />
                                {city}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
});

PlaceFilterCombobox.displayName = 'PlaceFilterCombobox';

// Enhanced Hero Section with Travel Theme
const TravelHeroSection = memo(({
                                    places,
                                    selectedPlace,
                                    onPlaceChange
                                }: {
    places: Place[];
    selectedPlace: string;
    onPlaceChange: (place: string) => void;
}) => {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('loadeddata', () => setIsVideoLoaded(true));
        }
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
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
                    "absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 transition-opacity duration-1000",
                    isVideoLoaded ? "opacity-30" : "opacity-100"
                )} />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            {/* Floating travel elements */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-32 h-32 md:w-40 md:h-40 bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-40 h-40 md:w-56 md:h-56 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-cyan-400/20 rounded-full blur-xl animate-bounce delay-700" />
                <div className="absolute top-1/3 right-1/3 w-20 h-20 md:w-24 md:h-24 bg-pink-400/20 rounded-full blur-lg animate-pulse delay-1500" />
            </div>

            {/* Filter at top */}
            <div className="absolute top-6 md:top-8 lg:top-10 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
                <OptimizedMotionDiv preset="slideDown" delay={300}>
                    <PlaceFilterCombobox
                        places={places}
                        selectedPlace={selectedPlace}
                        onPlaceChange={onPlaceChange}
                    />
                </OptimizedMotionDiv>
            </div>

            {/* Content */}
            <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                <OptimizedMotionDiv preset="fadeIn" delay={500}>
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full mb-8 border border-white/30">
                        <Plane className="w-5 h-5 text-blue-300" />
                        <span className="text-sm font-medium tracking-wider">Adventure Awaits</span>
                    </div>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="slideUp" delay={700}>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight">
                        Discover Amazing
                        <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Destinations
                        </span>
                    </h1>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="fadeIn" delay={900}>
                    <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto mb-10 leading-relaxed font-light">
                        Embark on unforgettable journeys to breathtaking destinations around the world.
                        Create memories that will last a lifetime with our expertly curated travel experiences.
                    </p>
                </OptimizedMotionDiv>

                <StaggerContainer staggerDelay={200}>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
                        <OptimizedMotionDiv preset="slideUp" delay={1000}>
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto group">
                                <Compass className="w-6 h-6 mr-2" />
                                Start Your Journey
                                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="slideUp" delay={1200}>
                            <Button variant="outline" className="border-2 border-white/50 text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                                <Camera className="w-6 h-6 mr-2" />
                                Explore Gallery
                            </Button>
                        </OptimizedMotionDiv>
                    </div>
                </StaggerContainer>

                {/* Scroll indicator */}
                <OptimizedMotionDiv preset="fadeIn" delay={1400} className="absolute bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce">
                        <ArrowRight className="w-6 h-6 text-white/80 rotate-90" />
                    </div>
                </OptimizedMotionDiv>
            </div>
        </section>
    );
});

TravelHeroSection.displayName = 'TravelHeroSection';

// Enhanced Statistics Section
const StatsSection = memo(() => {
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
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600">
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

    const travelStats = [
        {
            icon: 'Users',
            value: 25000,
            suffix: '+',
            label: 'Happy Travelers',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            icon: 'Globe',
            value: 150,
            suffix: '+',
            label: 'Destinations',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            icon: 'Star',
            value: 98,
            suffix: '%',
            label: 'Satisfaction Rate',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            icon: 'Award',
            value: 10,
            suffix: '+',
            label: 'Years Experience',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
    ];

    return (
        <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <OptimizedMotionDiv preset="slideUp">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-100 rounded-full mb-8">
                            <Star className="w-5 h-5 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800 tracking-wider">Our Achievements</span>
                        </div>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="slideUp" delay={200}>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
                            Travel Excellence
                            <span className="block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                In Numbers
                            </span>
                        </h2>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn" delay={400}>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of satisfied travelers who have chosen us for their dream destinations
                        </p>
                    </OptimizedMotionDiv>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {travelStats.map((stat, index) => {
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
                                    "bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100",
                                    !shouldReduceEffects && "hover:-translate-y-2"
                                )}>
                                    <div className={cn(
                                        "mx-auto mb-6 p-4 rounded-2xl w-fit transition-transform duration-300",
                                        stat.color,
                                        stat.bgColor,
                                        !shouldReduceEffects && "group-hover:scale-110"
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

                                    <p className="text-gray-600 font-medium text-sm md:text-base">
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

StatsSection.displayName = 'StatsSection';

// Enhanced Destinations Section
const DestinationsSection = memo(({
                                      featuredPlaces,
                                      selectedPlace
                                  }: {
    featuredPlaces: Place[];
    selectedPlace: string;
}) => {
    const { shouldReduceEffects } = usePerformancePreference();

    const filteredPlaces = useMemo(() => {
        if (selectedPlace === 'all') return featuredPlaces;
        return featuredPlaces.filter(place => place.city === selectedPlace);
    }, [featuredPlaces, selectedPlace]);

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-teal-950 via-teal-200 to-teal-950 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-16 right-16 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-24 left-24 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <OptimizedMotionDiv preset="slideUp">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-100 rounded-full mb-8">
                            <Mountain className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800 tracking-wider">Popular Destinations</span>
                        </div>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="slideUp" delay={200}>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
                            Amazing
                            <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                Places to Visit
                            </span>
                            {selectedPlace !== 'all' && (
                                <span className="block text-2xl md:text-3xl text-gray-600 font-medium mt-4">
                                    in {selectedPlace}
                                </span>
                            )}
                        </h2>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn" delay={400}>
                        <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                            {selectedPlace === 'all'
                                ? "Explore breathtaking destinations carefully selected for their natural beauty, cultural significance, and unforgettable experiences."
                                : `Discover the incredible attractions and experiences waiting for you in ${selectedPlace}.`
                            }
                        </p>
                    </OptimizedMotionDiv>
                </div>

                {filteredPlaces?.length > 0 ? (
                    <div className="relative">
                        <OptimizedMotionDiv preset="fadeIn" delay={600}>
                            <Carousel
                                opts={{ align: "start", loop: true }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-4">
                                    {filteredPlaces.map((place, index) => (
                                        <CarouselItem key={place.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full border border-gray-100 hover:-translate-y-2">
                                                <OptimizedPlaceCard
                                                    place={place}
                                                    index={index}
                                                    showAnimation={!shouldReduceEffects}
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                <CarouselPrevious className="hidden lg:flex bg-white/80 backdrop-blur-lg text-gray-700 hover:bg-white shadow-lg -left-8 border border-gray-200" />
                                <CarouselNext className="hidden lg:flex bg-white/80 backdrop-blur-lg text-gray-700 hover:bg-white shadow-lg -right-8 border border-gray-200" />
                            </Carousel>
                        </OptimizedMotionDiv>
                    </div>
                ) : (
                    <OptimizedMotionDiv preset="fadeIn" className="text-center py-20">
                        <div className="bg-gray-50 rounded-2xl p-10 inline-block">
                            <Mountain className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                            <p className="text-gray-600 text-lg">
                                {selectedPlace === 'all'
                                    ? "Discovering amazing destinations..."
                                    : `No destinations found in ${selectedPlace}`
                                }
                            </p>
                        </div>
                    </OptimizedMotionDiv>
                )}

                <OptimizedMotionDiv preset="slideUp" delay={800} className="text-center mt-16">
                    <Button asChild className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 group">
                        <Link href="/destinations">
                            <span className="flex items-center gap-3">
                                Explore All Destinations
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                    </Button>
                </OptimizedMotionDiv>
            </div>
        </section>
    );
});

DestinationsSection.displayName = 'DestinationsSection';

// Enhanced Packages Section
const PackagesSection = memo(({
                                  popularPackages,
                                  selectedPlace
                              }: {
    popularPackages: Package[];
    selectedPlace: string;
}) => {
    const { shouldReduceEffects } = usePerformancePreference();

    const filteredPackages = useMemo(() => {
        if (selectedPlace === 'all') return popularPackages;
        return popularPackages.filter(pkg =>
            pkg.destinations?.some(dest => dest === selectedPlace) ||
            pkg.location?.includes(selectedPlace)
        );
    }, [popularPackages, selectedPlace]);

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-300 via-purple-500 to-pink-200 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-24 left-16 w-56 h-56 md:w-80 md:h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-24 right-24 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-blue-200/15 to-cyan-200/15 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <OptimizedMotionDiv preset="slideUp">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-100 rounded-full mb-8">
                            <Heart className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800 tracking-wider">Travel Packages</span>
                        </div>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="slideUp" delay={200}>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
                            Perfect
                            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Travel Packages
                            </span>
                            {selectedPlace !== 'All Destinations' && (
                                <span className="block text-2xl md:text-3xl text-gray-600 font-medium mt-4">
                                    for {selectedPlace}
                                </span>
                            )}
                        </h2>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn" delay={400}>
                        <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                            {selectedPlace === 'all'
                                ? "Carefully crafted travel packages that combine comfort, adventure, and value into unforgettable experiences."
                                : `Specially designed travel packages for ${selectedPlace} that offer the best value and experiences.`
                            }
                        </p>
                    </OptimizedMotionDiv>
                </div>

                {filteredPackages?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPackages.map((pkg, index) => (
                            <OptimizedMotionDiv
                                key={pkg.id}
                                preset="slideUp"
                                delay={index * 250}
                            >
                                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden border border-gray-100 hover:-translate-y-2">
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
                        <div className="bg-white rounded-2xl p-10 inline-block shadow-lg">
                            <Heart className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                            <p className="text-gray-600 text-lg">
                                {selectedPlace === 'all'
                                    ? "Creating amazing packages..."
                                    : `No packages found for ${selectedPlace}`
                                }
                            </p>
                        </div>
                    </OptimizedMotionDiv>
                )}

                <OptimizedMotionDiv preset="slideUp" delay={700} className="text-center mt-16">
                    <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 group">
                        <Link href="/packages">
                            <span className="flex items-center gap-3">
                                View All Packages
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                    </Button>
                </OptimizedMotionDiv>
            </div>
        </section>
    );
});

PackagesSection.displayName = 'PackagesSection';

// Enhanced Testimonials Section
const TestimonialsSection = memo(() => {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <OptimizedMotionDiv preset="slideUp">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-900/50 backdrop-blur-lg rounded-full mb-8 border border-white/20">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <span className="text-sm font-medium tracking-wider text-white">Testimonials</span>
                        </div>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="slideUp" delay={200}>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8">
                            What Our Travelers
                            <span className="block bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                                Say About Us
                            </span>
                        </h2>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn" delay={400}>
                        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                            Read stories from travelers who have experienced the magic of our carefully planned journeys
                        </p>
                    </OptimizedMotionDiv>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <OptimizedMotionDiv
                            key={testimonial.name}
                            preset="slideUp"
                            delay={index * 250}
                            hover
                        >
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center h-full border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-white/30">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="flex justify-center mb-6">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current mx-0.5" />
                                    ))}
                                </div>

                                <p className="text-white/90 mb-6 italic leading-relaxed">
                                    "{testimonial.text}"
                                </p>

                                <div>
                                    <p className="font-semibold text-lg mb-1">{testimonial.name}</p>
                                    <p className="text-white/70 text-sm">{testimonial.location}</p>
                                </div>
                            </div>
                        </OptimizedMotionDiv>
                    ))}
                </div>
            </div>
        </section>
    );
});

TestimonialsSection.displayName = 'TestimonialsSection';

// Enhanced CTA Section
const CTASection = memo(() => {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-16 right-16 w-40 h-40 bg-white/20 rounded-full blur-2xl animate-pulse delay-1000" />
                <div className="absolute bottom-16 left-16 w-56 h-56 bg-white/15 rounded-full blur-2xl animate-pulse delay-2000" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <OptimizedMotionDiv preset="scaleIn">
                    <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-lg rounded-full mb-8 border border-white/30">
                        <Plane className="w-10 h-10 md:w-12 md:h-12" />
                    </div>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="slideUp" delay={200}>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8">
                        Ready to Start Your
                        <span className="block text-yellow-300">
                            Adventure?
                        </span>
                    </h2>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="fadeIn" delay={400}>
                    <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
                        Let our travel experts help you plan the perfect getaway. Contact us today
                        and turn your travel dreams into unforgettable memories.
                    </p>
                </OptimizedMotionDiv>

                <StaggerContainer staggerDelay={200}>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <OptimizedMotionDiv preset="slideUp" delay={600}>
                            <Button
                                asChild
                                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto group"
                            >
                                <Link href="/contact">
                                    <Calendar className="w-6 h-6 mr-2" />
                                    Plan Your Trip
                                    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="slideUp" delay={800}>
                            <Button
                                asChild
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                            >
                                <Link href={createWhatsAppUrl("Hello! I'm interested in planning a trip. Could you help me with more information?")}>
                                    <Phone className="w-6 h-6 mr-2" />
                                    Contact Us
                                </Link>
                            </Button>
                        </OptimizedMotionDiv>
                    </div>
                </StaggerContainer>
            </div>
        </section>
    );
});

CTASection.displayName = 'CTASection';

// Main Component
export const OptimizedHomeClient = memo(({
                                             featuredPlaces = [],
                                             popularPackages = []
                                         }: OptimizedHomeClientProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState('all');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handlePlaceChange = (place: string) => {
        setSelectedPlace(place);
    };

    return (
        <div className="relative overflow-hidden">
            <div className={cn(
                "relative z-10 transition-all duration-500",
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
                <TravelHeroSection
                    places={featuredPlaces}
                    selectedPlace={selectedPlace}
                    onPlaceChange={handlePlaceChange}
                />
                <DestinationsSection
                    featuredPlaces={featuredPlaces}
                    selectedPlace={selectedPlace}
                />
                <PackagesSection
                    popularPackages={popularPackages}
                    selectedPlace={selectedPlace}
                />
                <StatsSection />
                <TestimonialsSection />
                <CTASection />
            </div>
        </div>
    );
});

OptimizedHomeClient.displayName = 'OptimizedHomeClient';