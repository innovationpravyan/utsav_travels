'use client';

import {useEffect, useRef, useState} from 'react';
import Link from "next/link";
import {OptimizedPlaceCard} from "@/components/optimized-place-card";
import {OptimizedPackageCard} from "@/components/optimized-package-card";
import {type Package, type Place} from "@/lib/data";
import {Button} from "@/components/ui/button";
import {ArrowRight, Award, Calendar, Globe, MapPin, Sparkles, Star, Users} from "lucide-react";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {OptimizedMotionDiv} from "@/components/optimized-motion-div";
import {GlassCard} from "@/components/ui/glass-card";
import {useThreeInView} from './three-utils';
import {cn} from '@/lib/utils';

interface OptimizedHomeClientProps {
    featuredPlaces: Place[];
    popularPackages: Package[];
}

const OptimizedStatsSection = () => {
    const [countersStarted, setCountersStarted] = useState(false);
    const {ref: sectionRef, isInView} = useThreeInView(0.2);

    const stats = [
        {icon: MapPin, value: 50, suffix: '+', label: 'Sacred Destinations', color: 'text-blue-400'},
        {icon: Users, value: 10000, suffix: '+', label: 'Happy Travelers', color: 'text-green-400'},
        {icon: Calendar, value: 5, suffix: '', label: 'Years Experience', color: 'text-yellow-400'},
        {icon: Award, value: 98, suffix: '%', label: 'Customer Satisfaction', color: 'text-purple-400'},
    ];

    const SimpleCounter = ({value, suffix, isVisible}: { value: number; suffix: string; isVisible: boolean }) => {
        const [count, setCount] = useState(0);
        const hasAnimated = useRef(false);

        useEffect(() => {
            if (!isVisible || hasAnimated.current) return;

            hasAnimated.current = true;
            // Instant counter - no animation delays
            setCount(value);
        }, [isVisible, value]);

        return (
            <span className="text-4xl md:text-5xl font-bold">
                {count.toLocaleString()}{suffix}
            </span>
        );
    };

    useEffect(() => {
        if (isInView && !countersStarted) {
            setCountersStarted(true);
        }
    }, [isInView, countersStarted]);

    return (
        <section
            ref={sectionRef}
            className="relative section-padding bg-gradient-to-br from-slate-800 via-purple-900 to-slate-800"
        >
            <div className="absolute inset-0 opacity-10">
                <div
                    className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_1px)] bg-[length:24px_24px]"/>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <OptimizedMotionDiv preset="slideUp">
                        <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
                            Trusted by
                            <span className="block text-gradient-alt">Thousands</span>
                        </h2>
                    </OptimizedMotionDiv>
                    <OptimizedMotionDiv preset="fadeIn">
                        <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            Join our community of spiritual travelers exploring India's most sacred destinations
                        </p>
                    </OptimizedMotionDiv>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <OptimizedMotionDiv
                            key={stat.label}
                            preset="scaleIn"
                            hover
                            className="text-center"
                        >
                            <GlassCard className="p-8 group hover:scale-105 transition-all duration-200">
                                <div
                                    className={cn("mx-auto mb-4 p-4 rounded-full w-fit bg-white/10 transition-transform duration-200 group-hover:rotate-12")}>
                                    <stat.icon className={cn("h-8 w-8", stat.color)}/>
                                </div>

                                <div className={cn("mb-2", stat.color)}>
                                    <SimpleCounter value={stat.value} suffix={stat.suffix} isVisible={countersStarted}/>
                                </div>

                                <p className="text-white/70 font-medium">{stat.label}</p>
                            </GlassCard>
                        </OptimizedMotionDiv>
                    ))}
                </div>
            </div>
        </section>
    );
};

const OptimizedDestinationsSection = ({featuredPlaces}: { featuredPlaces: Place[] }) => {
    return (
        <section className="section-padding bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
            <div className="absolute inset-0 opacity-10">
                <div
                    className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px]"/>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <OptimizedMotionDiv preset="slideUp">
                        <div className="flex justify-center mb-6">
                            <GlassCard className="p-4 rounded-full">
                                <MapPin className="w-8 h-8 text-white"/>
                            </GlassCard>
                        </div>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="slideUp">
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Sacred
                            <span
                                className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                                Destinations
                            </span>
                        </h2>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn">
                        <p className="text-white/90 max-w-3xl mx-auto text-xl md:text-2xl font-light leading-relaxed">
                            Embark on extraordinary spiritual journeys to handpicked destinations that promise to create
                            memories for a lifetime.
                        </p>
                    </OptimizedMotionDiv>
                </div>

                {featuredPlaces?.length > 0 ? (
                    <div className="relative">
                        <Carousel
                            opts={{align: "start", loop: true}}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-2 md:-ml-4">
                                {featuredPlaces.map((place, index) => (
                                    <CarouselItem key={place.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                        <OptimizedPlaceCard place={place} index={index} showAnimation={false}/>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <CarouselPrevious
                                className="hidden lg:flex bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 shadow-xl -left-6"/>
                            <CarouselNext
                                className="hidden lg:flex bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 shadow-xl -right-6"/>
                        </Carousel>
                    </div>
                ) : (
                    <OptimizedMotionDiv preset="fadeIn" className="text-center py-16">
                        <GlassCard className="inline-block p-8">
                            <p className="text-white/80 text-lg">No featured places available at the moment.</p>
                        </GlassCard>
                    </OptimizedMotionDiv>
                )}

                <OptimizedMotionDiv preset="slideUp" className="text-center mt-16">
                    <Button asChild
                            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm hover:from-white/20 hover:to-white/10 text-white border-white/20 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200 px-8 py-6 text-lg rounded-full group">
                        <Link href="/destinations">
                            <span className="flex items-center">
                                Explore All Destinations
                                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"/>
                            </span>
                        </Link>
                    </Button>
                </OptimizedMotionDiv>
            </div>
        </section>
    );
};

const OptimizedPackagesSection = ({popularPackages}: { popularPackages: Package[] }) => {
    return (
        <section className="section-padding bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 relative">
            <div className="absolute inset-0">
                <div
                    className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"/>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <OptimizedMotionDiv preset="slideUp">
                        <div className="flex justify-center mb-6">
                            <GlassCard className="p-4 rounded-full">
                                <Star className="w-8 h-8 text-white"/>
                            </GlassCard>
                        </div>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="slideUp">
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Popular
                            <span
                                className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                                Packages
                            </span>
                        </h2>
                    </OptimizedMotionDiv>

                    <OptimizedMotionDiv preset="fadeIn">
                        <p className="text-white/90 max-w-3xl mx-auto text-xl md:text-2xl font-light leading-relaxed">
                            Carefully curated spiritual experiences that blend adventure, culture, and luxury into
                            unforgettable journeys.
                        </p>
                    </OptimizedMotionDiv>
                </div>

                {popularPackages?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {popularPackages.map((pkg, index) => (
                            <OptimizedPackageCard
                                key={pkg.id}
                                pkg={pkg}
                                index={index}
                                showAnimation={false}
                            />
                        ))}
                    </div>
                ) : (
                    <OptimizedMotionDiv preset="fadeIn" className="text-center py-16">
                        <GlassCard className="inline-block p-8">
                            <p className="text-white/80 text-lg">No packages available at the moment.</p>
                        </GlassCard>
                    </OptimizedMotionDiv>
                )}

                <OptimizedMotionDiv preset="slideUp" className="text-center mt-16">
                    <Button asChild
                            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm hover:from-white/20 hover:to-white/10 text-white border-white/20 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200 px-8 py-6 text-lg rounded-full group">
                        <Link href="/packages">
                            <span className="flex items-center">
                                View All Packages
                                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"/>
                            </span>
                        </Link>
                    </Button>
                </OptimizedMotionDiv>
            </div>
        </section>
    );
};

const SimplifiedTestimonialsSection = () => {
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
        <section className="section-padding bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <OptimizedMotionDiv preset="slideUp">
                        <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
                            What Our
                            <span className="block text-gradient-alt">Travelers Say</span>
                        </h2>
                    </OptimizedMotionDiv>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <OptimizedMotionDiv
                            key={testimonial.name}
                            preset="slideUp"
                            hover
                        >
                            <GlassCard className="p-8 text-center h-full hover:scale-105 transition-all duration-200">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="flex justify-center mb-4">
                                    {Array.from({length: testimonial.rating}).map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current"/>
                                    ))}
                                </div>

                                <p className="text-white/80 mb-6 italic">"{testimonial.text}"</p>

                                <div className="text-white">
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-white/60 text-sm">{testimonial.location}</p>
                                </div>
                            </GlassCard>
                        </OptimizedMotionDiv>
                    ))}
                </div>
            </div>
        </section>
    );
};

export function OptimizedHomeClient({featuredPlaces = [], popularPackages = []}: OptimizedHomeClientProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Instant visibility
        setIsVisible(true);
    }, []);

    return (
        <div className="relative overflow-hidden">
            <div className={cn(
                "relative z-10 transition-all duration-300",
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            )}>

                <OptimizedStatsSection/>
                <OptimizedDestinationsSection featuredPlaces={featuredPlaces}/>
                <OptimizedPackagesSection popularPackages={popularPackages}/>
                <SimplifiedTestimonialsSection/>

                {/* Final CTA Section */}
                <section
                    className="section-padding bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center relative">
                    <div className="absolute inset-0">
                        <div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-600/5 rounded-full blur-3xl animate-pulse"/>
                    </div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <OptimizedMotionDiv preset="scaleIn">
                            <Globe className="w-16 h-16 text-primary mx-auto mb-6"/>
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="slideUp">
                            <h2 className="text-4xl md:text-6xl font-headline font-bold text-white mb-6">
                                Ready for Your
                                <span className="block text-gradient">Spiritual Journey?</span>
                            </h2>
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="fadeIn">
                            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                                Let us help you discover the sacred beauty of India's most spiritual destinations.
                            </p>
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="slideUp">
                            <Button asChild
                                    className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200">
                                <Link href="/contact">
                                    Start Your Journey
                                    <Sparkles className="ml-2 w-6 h-6"/>
                                </Link>
                            </Button>
                        </OptimizedMotionDiv>
                    </div>
                </section>
            </div>
        </div>
    );
}