// src/app/packages/[packageId]/page.tsx

import {getPackageById, getPackages} from "@/lib/data";
import {notFound} from "next/navigation";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Calendar, CheckCircle, Clock, GalleryVertical, MapPin, Route, Star, Users, Crown, Gem, Sparkles, Heart, Gift} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {HeroImageBanner} from '@/components/hero-image-banner';
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel";
import {OptimizedPackageCard} from "@/components/optimized-package-card";
import {OptimizedMotionDiv} from "@/components/optimized-motion-div";
import {Suspense} from 'react';
import {Metadata} from 'next';
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {cn} from "@/utils/utils";

type PackageDetailPageProps = {
    params: {
        packageId: string;
    };
};

// Generate metadata for SEO
export async function generateMetadata({params}: PackageDetailPageProps): Promise<Metadata> {
    try {
        const pkg = await getPackageById(params.packageId);

        if (!pkg) {
            return {
                title: 'Package Not Found - Luxury Travel Experiences',
                description: 'The requested luxury package could not be found.',
            };
        }

        return {
            title: `${pkg.name || 'Luxury Package'} - ${pkg.duration || ''} | Premium Travel`,
            description: `${pkg.description || 'Discover amazing luxury travel experiences'}. Duration: ${pkg.duration || 'Contact for details'}. Cities: ${pkg.cities?.join(', ') || 'Multiple destinations'}.`,
            keywords: `${pkg.name || ''}, ${pkg.cities?.join(', ') || ''}, ${(pkg.tags || []).join(', ')}, luxury travel package, spiritual journey`,
            openGraph: {
                title: `${pkg.name || 'Luxury Package'} - ${pkg.duration || ''}`,
                description: pkg.description || 'Discover amazing luxury travel experiences with our curated packages',
                images: [{url: pkg.image || '/placeholder.jpg', width: 1200, height: 630, alt: pkg.name || 'Package'}],
            },
            twitter: {
                title: `${pkg.name || 'Luxury Package'} - ${pkg.duration || ''}`,
                description: pkg.description || 'Discover amazing luxury travel experiences with our curated packages',
                images: [pkg.image || '/placeholder.jpg'],
            },
        };
    } catch (error) {
        return {
            title: 'Package Details - Luxury Travel',
            description: 'Explore our curated luxury travel packages for spiritual journeys across India',
        };
    }
}

// Generate static params for better performance
export async function generateStaticParams() {
    try {
        const packages = await getPackages();
        return (packages || []).slice(0, 15).map((pkg) => ({
            packageId: pkg?.id || 'unknown',
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Optimized data fetching with comprehensive error handling
async function getPackageData(packageId: string) {
    try {
        const [pkg, allPackages] = await Promise.all([
            getPackageById(packageId),
            getPackages().catch(() => [])
        ]);

        if (!pkg) {
            return null;
        }

        // Safe package object with defaults
        const safePackage = {
            id: pkg.id || 'unknown',
            name: pkg.name || 'Luxury Package',
            description: pkg.description || 'An amazing luxury travel experience awaits you.',
            duration: pkg.duration || '3 Days',
            cities: pkg.cities || [],
            image: pkg.image || 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?w=600&h=400',
            highlights: pkg.highlights || [],
            itinerary: pkg.itinerary || [],
            inclusions: pkg.inclusions || [],
            gallery: pkg.gallery || [],
            tags: pkg.tags || [],
            price: pkg.price || 'Contact for pricing',
            originalPrice: pkg.originalPrice,
            discount: pkg.discount
        };

        const safeAllPackages = Array.isArray(allPackages) ? allPackages : [];
        const relatedPackages = safeAllPackages
            .filter(p => p?.id !== safePackage.id && (
                p?.cities?.some(city => safePackage.cities.includes(city)) ||
                p?.tags?.some(tag => safePackage.tags.includes(tag))
            ))
            .slice(0, 3);

        return {package: safePackage, relatedPackages};
    } catch (error) {
        console.error('Error fetching package data:', error);
        return null;
    }
}

// Loading component with luxury theme
function PackageDetailLoading() {
    return (
        <div className="animate-fade-in-up">
            <div className="h-[60vh] section-fairy flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-fairy-300/30 rounded-full mx-auto mb-4">
                        <div className="w-16 h-16 border-4 border-t-fairy-500 border-r-carnation-500 border-b-uranian-500 border-l-thistle-500 rounded-full animate-spin" />
                    </div>
                    <div className="text-fairy-700 text-xl font-heading animate-pulse">Loading luxury package details...</div>
                </div>
            </div>
            <div className="section-padding section-luxury">
                <div className="container-luxury">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="lg:col-span-2 space-y-6 md:space-y-8">
                            {Array.from({length: 3}).map((_, i) => (
                                <div key={i} className="h-48 md:h-64 bg-thistle-100 animate-pulse rounded-2xl"/>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="h-64 md:h-80 bg-fairy-100 animate-pulse rounded-2xl"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default async function OptimizedPackageDetailPage({params}: PackageDetailPageProps) {
    const data = await getPackageData(params.packageId);

    if (!data) {
        notFound();
    }

    const {package: pkg, relatedPackages} = data;

    // Price formatting
    const priceString = pkg.price?.toString() || 'Contact for pricing';
    const priceMatch = priceString.match(/[\d,]+/);
    const priceNumber = priceMatch ? priceMatch[0] : priceString;
    const currency = priceString.includes('₹') ? '₹' : '$';

    return (
        <div className="animate-fade-in-up">
            {/* Hero Image Banner */}
            <Suspense fallback={<PackageDetailLoading/>}>
                <div className="relative">
                    <HeroImageBanner
                        page="packages"
                        title={pkg.name}
                        subtitle={`${pkg.duration} • ${pkg.cities.join(', ')}`}
                        description={pkg.description}
                        imageUrl={pkg.gallery?.[0] || pkg.image}
                        height="60vh"
                        overlayOpacity={0.5}
                        parallaxEffect={true}
                        showScrollIndicator={false}
                    />

                    {/* Custom overlay content for price and tags */}
                    <div className="absolute inset-0 z-30 flex items-end justify-between p-4 md:p-8 lg:p-12">
                        <div className="flex flex-wrap gap-2">
                            {pkg.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="glass-luxury border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <div className="glass-luxury text-white border border-white/20 rounded-2xl p-4 md:p-6">
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-gradient-luxury">
                                    {priceNumber !== priceString ? `${currency}${priceNumber}` : priceString}
                                </div>
                                <div className="text-sm md:text-base text-white/80 font-medium">per person</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Suspense>

            {/* Content Section */}
            <section className="section-padding section-luxury">
                <div className="container-luxury">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="lg:col-span-2 space-y-6 md:space-y-8">

                            {/* Package Overview */}
                            <OptimizedMotionDiv preset="slideUp">
                                <Card className="card-luxury">
                                    <CardHeader>
                                        <CardTitle className="text-heading text-3xl md:text-4xl flex items-center gap-3">
                                            <Route className="h-7 w-7 md:h-8 md:w-8 text-thistle-600"/>
                                            Package Overview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-lg text-thistle-700 space-y-4 md:space-y-6">
                                        <p className="text-body leading-relaxed">{pkg.description}</p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                            <div className="text-center p-4 md:p-5 bg-thistle-50 rounded-xl border border-thistle-100">
                                                <Clock className="h-6 w-6 text-thistle-600 mx-auto mb-2"/>
                                                <div className="font-semibold text-thistle-800">{pkg.duration}</div>
                                                <div className="text-sm text-thistle-600">Duration</div>
                                            </div>
                                            <div className="text-center p-4 md:p-5 bg-fairy-50 rounded-xl border border-fairy-100">
                                                <MapPin className="h-6 w-6 text-fairy-600 mx-auto mb-2"/>
                                                <div className="font-semibold text-fairy-800">{pkg.cities.length}</div>
                                                <div className="text-sm text-fairy-600">Cities</div>
                                            </div>
                                            <div className="text-center p-4 md:p-5 bg-carnation-50 rounded-xl border border-carnation-100">
                                                <Star className="h-6 w-6 text-carnation-600 mx-auto mb-2"/>
                                                <div className="font-semibold text-carnation-800">4.8</div>
                                                <div className="text-sm text-carnation-600">Rating</div>
                                            </div>
                                            <div className="text-center p-4 md:p-5 bg-uranian-50 rounded-xl border border-uranian-100">
                                                <Users className="h-6 w-6 text-uranian-600 mx-auto mb-2"/>
                                                <div className="font-semibold text-uranian-800">2-12</div>
                                                <div className="text-sm text-uranian-600">Group Size</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </OptimizedMotionDiv>

                            {/* Itinerary */}
                            {pkg.itinerary.length > 0 && (
                                <OptimizedMotionDiv preset="slideUp" delay={200}>
                                    <Card className="card-luxury">
                                        <CardHeader>
                                            <CardTitle className="text-heading text-3xl md:text-4xl flex items-center gap-3">
                                                <Calendar className="h-7 w-7 md:h-8 md:w-8 text-fairy-600"/>
                                                Day-wise Itinerary
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {pkg.itinerary.map((day, index) => (
                                                <div key={index} className="border-l-4 border-thistle-400 pl-6 py-4 bg-thistle-50/50 rounded-r-xl">
                                                    <h4 className="font-bold text-thistle-800 text-lg md:text-xl mb-3">
                                                        Day {day.day}: {day.title}
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {day.activities.map((activity, actIndex) => (
                                                            <li key={actIndex}
                                                                className="text-thistle-700 flex items-start gap-3">
                                                                <CheckCircle
                                                                    className="h-4 w-4 md:h-5 md:w-5 text-carnation-500 mt-0.5 flex-shrink-0"/>
                                                                <span className="text-body">{activity}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </OptimizedMotionDiv>
                            )}

                            {/* Inclusions */}
                            {pkg.inclusions.length > 0 && (
                                <OptimizedMotionDiv preset="slideUp" delay={300}>
                                    <Card className="card-luxury">
                                        <CardHeader>
                                            <CardTitle className="text-heading text-3xl md:text-4xl flex items-center gap-3">
                                                <CheckCircle className="h-7 w-7 md:h-8 md:w-8 text-carnation-600"/>
                                                What's Included
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                                {pkg.inclusions.map((inclusion, index) => (
                                                    <div key={index}
                                                         className="flex items-center gap-3 text-thistle-700 p-3 bg-carnation-50/50 rounded-xl">
                                                        <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-carnation-500 flex-shrink-0"/>
                                                        <span className="text-body">{inclusion}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </OptimizedMotionDiv>
                            )}
                        </div>

                        <aside className="lg:col-span-1 space-y-6">
                            {/* Highlights */}
                            <OptimizedMotionDiv preset="scaleIn" className="sticky top-24">
                                <Card className="card-luxury">
                                    <CardHeader>
                                        <CardTitle className="text-heading text-2xl md:text-3xl flex items-center gap-3">
                                            <Star className="h-6 w-6 md:h-7 md:w-7 text-carnation-600"/>
                                            Highlights
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {pkg.highlights.map((highlight, index) => (
                                                <li key={index}
                                                    className="flex items-start gap-3 text-thistle-700 p-3 bg-fairy-50/50 rounded-xl">
                                                    <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-fairy-500 mt-0.5 flex-shrink-0"/>
                                                    <span className="text-body">{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </OptimizedMotionDiv>

                            {/* Cities Covered */}
                            <OptimizedMotionDiv preset="scaleIn" delay={200}>
                                <Card className="card-luxury">
                                    <CardHeader>
                                        <CardTitle className="text-heading text-2xl md:text-3xl flex items-center gap-3">
                                            <MapPin className="h-6 w-6 md:h-7 md:w-7 text-uranian-600"/>
                                            Cities Covered
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {pkg.cities.map((city) => (
                                                <Badge
                                                    key={city}
                                                    variant="secondary"
                                                    className="bg-uranian-100 text-uranian-700 border-uranian-200 px-3 py-1.5 text-sm"
                                                >
                                                    {city}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </OptimizedMotionDiv>

                            {/* Booking CTA */}
                            <OptimizedMotionDiv preset="scaleIn" delay={300}>
                                <Card className="card-luxury bg-gradient-to-br from-thistle-50 to-fairy-50 border-thistle-200">
                                    <CardContent className="p-6 text-center">
                                        <div className="mb-4">
                                            <Crown className="w-12 h-12 text-thistle-600 mx-auto mb-3" />
                                            <h3 className="text-heading text-xl md:text-2xl font-bold text-thistle-800 mb-2">Ready to Book?</h3>
                                        </div>

                                        <div className="mb-6">
                                            <div className="text-3xl md:text-4xl font-bold text-gradient-luxury mb-2">
                                                {priceNumber !== priceString ? `${currency}${priceNumber}` : priceString}
                                            </div>
                                            <div className="text-sm md:text-base text-thistle-600 font-medium">per person</div>
                                        </div>

                                        <div className="space-y-3">
                                            <Button asChild className="btn-primary w-full">
                                                <Link href="/contact">
                                                    <Crown className="w-4 h-4 mr-2" />
                                                    Book Now
                                                </Link>
                                            </Button>

                                            <Button variant="outline" asChild className="w-full border-thistle-300 text-thistle-700 hover:bg-thistle-50">
                                                <Link href="/contact">
                                                    <Heart className="w-4 h-4 mr-2" />
                                                    Get Custom Quote
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </OptimizedMotionDiv>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="section-padding section-fairy">
                <div className="container-luxury">
                    <div className="text-center mb-12 md:mb-16">
                        <OptimizedMotionDiv preset="slideUp">
                            <h2 className="text-heading text-3xl md:text-4xl lg:text-5xl font-bold text-fairy-800 mb-4">Package Gallery</h2>
                            <p className="text-body text-fairy-600 max-w-2xl mx-auto">Immerse yourself in the beauty and luxury that awaits</p>
                        </OptimizedMotionDiv>
                    </div>

                    <OptimizedMotionDiv preset="slideUp" delay={200}>
                        <div className="mb-8">
                            <h3 className="text-heading text-2xl md:text-3xl mb-6 flex items-center gap-3 text-fairy-800">
                                <GalleryVertical className="h-6 w-6 md:h-7 md:w-7 text-fairy-600"/>
                                Images
                            </h3>
                            {pkg.gallery.length > 0 ? (
                                <Carousel className="w-full">
                                    <CarouselContent className="-ml-2 md:-ml-4">
                                        {pkg.gallery.map((img, index) => (
                                            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                                <Card className="card-luxury overflow-hidden hover-luxury">
                                                    <CardContent className="relative flex aspect-video items-center justify-center p-0">
                                                        <Image
                                                            src={img}
                                                            alt={`${pkg.name} gallery image ${index + 1}`}
                                                            fill
                                                            className="object-cover transition-transform duration-500 hover:scale-110"
                                                            loading="lazy"
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="glass-luxury hover:bg-fairy-50" />
                                    <CarouselNext className="glass-luxury hover:bg-fairy-50" />
                                </Carousel>
                            ) : (
                                <Card className="card-luxury overflow-hidden">
                                    <CardContent className="relative flex aspect-video items-center justify-center p-0">
                                        <Image
                                            src={pkg.image}
                                            alt={pkg.name}
                                            fill
                                            className="object-cover"
                                            loading="lazy"
                                        />
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </OptimizedMotionDiv>
                </div>
            </section>

            {/* Related Packages */}
            {relatedPackages.length > 0 && (
                <section className="section-padding section-carnation">
                    <div className="container-luxury">
                        <div className="text-center mb-12 md:mb-16">
                            <OptimizedMotionDiv preset="slideUp">
                                <h2 className="text-heading text-3xl md:text-4xl lg:text-5xl font-bold text-carnation-800 mb-4">Similar Packages</h2>
                                <p className="text-body text-carnation-600 max-w-2xl mx-auto">Discover more luxury experiences tailored for you</p>
                            </OptimizedMotionDiv>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {relatedPackages.map((p, index) => (
                                <OptimizedMotionDiv key={p?.id || index} preset="slideUp" delay={index * 200}>
                                    <div className="card-luxury hover-luxury overflow-hidden h-full">
                                        <OptimizedPackageCard pkg={p} index={index} showAnimation={false}/>
                                    </div>
                                </OptimizedMotionDiv>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Schema markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TouristTrip",
                        "name": pkg.name,
                        "description": pkg.description,
                        "image": pkg.image,
                        "offers": {
                            "@type": "Offer",
                            "price": priceString,
                            "priceCurrency": currency === '₹' ? 'INR' : 'USD',
                            "availability": "https://schema.org/InStock"
                        },
                        "duration": pkg.duration,
                        "touristType": pkg.tags.join(", "),
                        "itinerary": pkg.itinerary.map(day => ({
                            "@type": "Action",
                            "name": day.title,
                            "description": day.activities.join(", ")
                        })),
                        "provider": {
                            "@type": "TravelAgency",
                            "name": "Luxury Travel Experiences"
                        }
                    })
                }}
            />
        </div>
    );
}